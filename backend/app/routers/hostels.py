from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from uuid import UUID

from app.database import get_db
from app.models.hostel import Hostel, Floor, Room, RoomStatus
from app.security import get_current_user_from_token
from app.models.user import User

router = APIRouter()


# Pydantic models
class HostelResponse(BaseModel):
    id: str
    name: str
    code: str
    floor_count: int


class FloorResponse(BaseModel):
    id: str
    floor_number: int
    room_count: int


class OccupantResponse(BaseModel):
    id: str
    student_id: str
    name: str
    email: str | None
    phone: str | None


class RoomResponse(BaseModel):
    id: str
    label: str
    capacity: int
    status: str
    occupants: List[OccupantResponse]


# Routes
@router.get("", response_model=List[HostelResponse])
async def list_hostels(db: Session = Depends(get_db), current_user: User = Depends(get_current_user_from_token)):
    """List all hostels"""
    hostels = db.query(Hostel).all()
    return [
        HostelResponse(
            id=str(h.id),
            name=h.name,
            code=h.code,
            floor_count=len(h.floors)
        )
        for h in hostels
    ]


@router.get("/{hostel_id}", response_model=HostelResponse)
async def get_hostel(hostel_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user_from_token)):
    """Get a specific hostel"""
    hostel = db.query(Hostel).filter(Hostel.id == hostel_id).first()
    if not hostel:
        raise HTTPException(status_code=404, detail="Hostel not found")
    
    return HostelResponse(
        id=str(hostel.id),
        name=hostel.name,
        code=hostel.code,
        floor_count=len(hostel.floors)
    )


@router.get("/{hostel_id}/floors", response_model=List[FloorResponse])
async def list_floors(hostel_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user_from_token)):
    """List floors for a hostel"""
    hostel = db.query(Hostel).filter(Hostel.id == hostel_id).first()
    if not hostel:
        raise HTTPException(status_code=404, detail="Hostel not found")
    
    floors = db.query(Floor).filter(Floor.hostel_id == hostel_id).order_by(Floor.floor_number).all()
    
    return [
        FloorResponse(
            id=str(f.id),
            floor_number=f.floor_number,
            room_count=len(f.rooms)
        )
        for f in floors
    ]


@router.get("/{hostel_id}/floors/{floor_number}/rooms", response_model=List[RoomResponse])
async def list_rooms(hostel_id: str, floor_number: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user_from_token)):
    """List rooms on a specific floor"""
    floor = db.query(Floor).filter(
        Floor.hostel_id == hostel_id,
        Floor.floor_number == floor_number
    ).first()
    
    if not floor:
        raise HTTPException(status_code=404, detail="Floor not found")
    
    rooms = db.query(Room).filter(Room.floor_id == floor.id).all()
    
    return [
        RoomResponse(
            id=str(r.id),
            label=r.label,
            capacity=r.capacity,
            status=r.status.value,
            occupants=[
                OccupantResponse(
                    id=str(o.id),
                    student_id=o.student_id,
                    name=o.name,
                    email=o.email,
                    phone=o.phone
                )
                for o in r.occupants if o.checkout_at is None
            ]
        )
        for r in rooms
    ]
