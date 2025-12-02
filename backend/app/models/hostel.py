from sqlalchemy import Column, String, Integer, ForeignKey, DateTime, JSON, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
import enum

from app.database import Base


class RoomStatus(str, enum.Enum):
    VACANT = "vacant"
    OCCUPIED = "occupied"
    RESERVED = "reserved"


class Hostel(Base):
    __tablename__ = "hostels"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    code = Column(String(10), unique=True, nullable=False)  # e.g., "A", "B", "H"
    meta = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    floors = relationship("Floor", back_populates="hostel", cascade="all, delete-orphan")
    rooms = relationship("Room", back_populates="hostel", cascade="all, delete-orphan")


class Floor(Base):
    __tablename__ = "floors"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    hostel_id = Column(UUID(as_uuid=True), ForeignKey("hostels.id"), nullable=False)
    floor_number = Column(Integer, nullable=False)
    meta = Column(JSON, nullable=True)

    hostel = relationship("Hostel", back_populates="floors")
    rooms = relationship("Room", back_populates="floor", cascade="all, delete-orphan")


class Room(Base):
    __tablename__ = "rooms"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    hostel_id = Column(UUID(as_uuid=True), ForeignKey("hostels.id"), nullable=False)
    floor_id = Column(UUID(as_uuid=True), ForeignKey("floors.id"), nullable=False)
    label = Column(String(20), nullable=False)  # e.g., "101", "202"
    capacity = Column(Integer, default=2)
    status = Column(Enum(RoomStatus), default=RoomStatus.VACANT)
    meta = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    hostel = relationship("Hostel", back_populates="rooms")
    floor = relationship("Floor", back_populates="rooms")
    occupants = relationship("Occupant", back_populates="room", cascade="all, delete-orphan")
    history = relationship("RoomHistory", back_populates="room", cascade="all, delete-orphan")


class Occupant(Base):
    __tablename__ = "occupants"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    room_id = Column(UUID(as_uuid=True), ForeignKey("rooms.id"), nullable=False)
    student_id = Column(String(50), nullable=False)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=True)
    phone = Column(String(20), nullable=True)
    checkin_at = Column(DateTime, default=datetime.utcnow)
    checkout_at = Column(DateTime, nullable=True)
    meta = Column(JSON, nullable=True)

    room = relationship("Room", back_populates="occupants")


class RoomHistory(Base):
    __tablename__ = "room_history"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    room_id = Column(UUID(as_uuid=True), ForeignKey("rooms.id"), nullable=False)
    change_type = Column(String(50), nullable=False)  # e.g., "checkin", "checkout", "status_change"
    payload = Column(JSON, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

    room = relationship("Room", back_populates="history")


class Program(Base):
    __tablename__ = "programs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False, unique=True)
    code = Column(String(50), nullable=True)
    meta = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class Student(Base):
    __tablename__ = "students"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=True)
    phone = Column(String(20), nullable=True)
    roll_number = Column(String(50), nullable=True)
    program_id = Column(UUID(as_uuid=True), ForeignKey("programs.id"), nullable=True)
    year = Column(Integer, nullable=True)
    hostel_id = Column(UUID(as_uuid=True), ForeignKey("hostels.id"), nullable=True)
    room_id = Column(UUID(as_uuid=True), ForeignKey("rooms.id"), nullable=True)
    meta = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    program = relationship("Program")
    hostel = relationship("Hostel")
    room = relationship("Room")
