from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
import uuid
import redis
import json

from app.database import get_db
from app.models.hostel import Room, Occupant, RoomHistory, RoomStatus
from app.config import settings
from app.security import get_current_user_from_token
from app.models.user import User

router = APIRouter()

# Redis client for real-time updates
try:
    redis_client = redis.from_url(settings.REDIS_URL)
except:
    redis_client = None


# Pydantic models
class AddOccupantRequest(BaseModel):
    student_id: str
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None


class OccupantResponse(BaseModel):
    id: str
    student_id: str
    name: str
    email: str | None
    phone: str | None
    checkin_at: datetime


class RoomDetailResponse(BaseModel):
    id: str
    label: str
    capacity: int
    status: str
    hostel_id: str
    floor_number: int
    occupants: list[OccupantResponse]


def publish_occupancy_update(room: Room, occupants: list):
    """Publish room occupancy change to Redis for real-time updates"""
    if redis_client:
        try:
            event = {
                "type": "occupancy_changed",
                "roomId": str(room.id),
                "status": room.status.value,
                "occupants": [{"id": str(o.id), "name": o.name} for o in occupants]
            }
            redis_client.publish("occupancy-updates", json.dumps(event))
        except Exception as e:
            print(f"Redis publish error: {e}")


def update_room_status(room: Room, db: Session):
    """Update room status based on occupancy"""
    active_occupants = [o for o in room.occupants if o.checkout_at is None]
    
    if len(active_occupants) == 0:
        room.status = RoomStatus.VACANT
    elif len(active_occupants) >= room.capacity:
        room.status = RoomStatus.OCCUPIED
    else:
        room.status = RoomStatus.OCCUPIED  # Partially occupied
    
    db.commit()
    return active_occupants


# Routes
@router.get("/{room_id}", response_model=RoomDetailResponse)
async def get_room(room_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user_from_token)):
    """Get detailed room information"""
    room = db.query(Room).filter(Room.id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    
    active_occupants = [o for o in room.occupants if o.checkout_at is None]
    
    return RoomDetailResponse(
        id=str(room.id),
        label=room.label,
        capacity=room.capacity,
        status=room.status.value,
        hostel_id=str(room.hostel_id),
        floor_number=room.floor.floor_number,
        occupants=[
            OccupantResponse(
                id=str(o.id),
                student_id=o.student_id,
                name=o.name,
                email=o.email,
                phone=o.phone,
                checkin_at=o.checkin_at
            )
            for o in active_occupants
        ]
    )


@router.post("/{room_id}/occupants", response_model=OccupantResponse)
async def add_occupant(room_id: str, request: AddOccupantRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user_from_token)):
    """Add an occupant to a room (protected endpoint)"""
    room = db.query(Room).filter(Room.id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    
    # Check capacity
    active_occupants = [o for o in room.occupants if o.checkout_at is None]
    if len(active_occupants) >= room.capacity:
        raise HTTPException(status_code=400, detail="Room is at full capacity")
    
    # Create occupant
    occupant = Occupant(
        id=uuid.uuid4(),
        room_id=room.id,
        student_id=request.student_id,
        name=request.name,
        email=request.email,
        phone=request.phone
    )
    db.add(occupant)
    
    # Log history
    history = RoomHistory(
        id=uuid.uuid4(),
        room_id=room.id,
        change_type="checkin",
        payload={"student_id": request.student_id, "name": request.name}
    )
    db.add(history)
    db.commit()
    
    # Update status and publish
    active_occupants = update_room_status(room, db)
    publish_occupancy_update(room, active_occupants)
    
    return OccupantResponse(
        id=str(occupant.id),
        student_id=occupant.student_id,
        name=occupant.name,
        email=occupant.email,
        phone=occupant.phone,
        checkin_at=occupant.checkin_at
    )


@router.delete("/{room_id}/occupants/{occupant_id}")
async def remove_occupant(room_id: str, occupant_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user_from_token)):
    """Remove an occupant from a room (checkout)"""
    occupant = db.query(Occupant).filter(
        Occupant.id == occupant_id,
        Occupant.room_id == room_id
    ).first()
    
    if not occupant:
        raise HTTPException(status_code=404, detail="Occupant not found")
    
    if occupant.checkout_at:
        raise HTTPException(status_code=400, detail="Occupant already checked out")
    
    # Set checkout time
    occupant.checkout_at = datetime.utcnow()
    
    # Log history
    room = db.query(Room).filter(Room.id == room_id).first()
    history = RoomHistory(
        id=uuid.uuid4(),
        room_id=room.id,
        change_type="checkout",
        payload={"student_id": occupant.student_id, "name": occupant.name}
    )
    db.add(history)
    db.commit()
    
    # Update status and publish
    active_occupants = update_room_status(room, db)
    publish_occupancy_update(room, active_occupants)
    
    return {"message": "Occupant checked out successfully"}
