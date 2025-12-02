from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
import hmac
import hashlib

from app.database import get_db
from app.models.hostel import Room, Hostel
from app.config import settings

router = APIRouter()

# Shared secret for webhook validation (set in .env)
WEBHOOK_SECRET = "your-webhook-secret"


class SheetRowPayload(BaseModel):
    """Expected payload from Google Apps Script"""
    timestamp: str
    student_id: str
    student_name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    hostel_code: str  # e.g., "H"
    floor_number: int
    room_label: str  # e.g., "201"
    action: str  # "checkin" or "checkout"


def validate_webhook_signature(payload: str, signature: str) -> bool:
    """Validate webhook signature from Google Apps Script"""
    expected = hmac.new(
        WEBHOOK_SECRET.encode(),
        payload.encode(),
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(expected, signature)


@router.post("")
async def receive_sheet_webhook(
    payload: SheetRowPayload,
    x_webhook_signature: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    """
    Receive webhook from Google Apps Script when a form is submitted.
    
    Expected flow:
    1. Student fills Google Form
    2. Form submission triggers Apps Script
    3. Apps Script sends POST to this endpoint
    4. We update room occupancy accordingly
    """
    
    # In production, validate signature
    # if x_webhook_signature:
    #     if not validate_webhook_signature(payload.json(), x_webhook_signature):
    #         raise HTTPException(status_code=401, detail="Invalid signature")
    
    # Find the hostel
    hostel = db.query(Hostel).filter(Hostel.code == payload.hostel_code).first()
    if not hostel:
        raise HTTPException(status_code=404, detail=f"Hostel {payload.hostel_code} not found")
    
    # Find the room
    room = db.query(Room).join(Room.floor).filter(
        Room.hostel_id == hostel.id,
        Room.label == payload.room_label,
        Room.floor.has(floor_number=payload.floor_number)
    ).first()
    
    if not room:
        raise HTTPException(
            status_code=404,
            detail=f"Room {payload.room_label} on floor {payload.floor_number} not found"
        )
    
    # Process based on action
    if payload.action == "checkin":
        # Import here to avoid circular dependency
        from app.routers.rooms import add_occupant, AddOccupantRequest
        
        request = AddOccupantRequest(
            student_id=payload.student_id,
            name=payload.student_name,
            email=payload.email,
            phone=payload.phone
        )
        
        # This will also update status and publish to Redis
        result = await add_occupant(str(room.id), request, db)
        return {"status": "success", "action": "checkin", "occupant_id": result.id}
    
    elif payload.action == "checkout":
        # Find the occupant by student_id
        from app.models.hostel import Occupant
        
        occupant = db.query(Occupant).filter(
            Occupant.room_id == room.id,
            Occupant.student_id == payload.student_id,
            Occupant.checkout_at.is_(None)
        ).first()
        
        if not occupant:
            raise HTTPException(status_code=404, detail="Active occupant not found")
        
        from app.routers.rooms import remove_occupant
        await remove_occupant(str(room.id), str(occupant.id), db)
        
        return {"status": "success", "action": "checkout"}
    
    else:
        raise HTTPException(status_code=400, detail=f"Unknown action: {payload.action}")


@router.get("/health")
async def webhook_health():
    """Health check for the webhook endpoint"""
    return {"status": "ready", "message": "Sheets webhook is operational"}
