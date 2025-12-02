"""
Seed script to populate the database with initial hostels, floors, and rooms.
Run this after setting up the database.

Usage:
    python -m scripts.seed_data
"""

import sys
sys.path.append('.')

from sqlalchemy.orm import Session
from app.database import engine, SessionLocal
from app.models.user import User, UserRole
from app.models.hostel import Hostel, Floor, Room, RoomStatus, Program, Student
from passlib.context import CryptContext
import uuid

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def seed_users(db: Session):
    """Create default admin user"""
    existing = db.query(User).filter(User.email == "warden@university.edu").first()
    if not existing:
        admin = User(
            id=uuid.uuid4(),
            email="warden@university.edu",
            name="Admin Warden",
            hashed_password=pwd_context.hash("admin123"),
            role=UserRole.ADMIN
        )
        db.add(admin)
        print("Created admin user: warden@university.edu / admin123")
    else:
        print("Admin user already exists")


def seed_hostels(db: Session):
    """Create hostels A through L with floors and rooms"""
    hostel_codes = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']
    
    for code in hostel_codes:
        existing = db.query(Hostel).filter(Hostel.code == code).first()
        if existing:
            print(f"Hostel {code} already exists, skipping")
            continue
        
        # Create hostel
        hostel = Hostel(
            id=uuid.uuid4(),
            name=f"Hostel {code}",
            code=code
        )
        db.add(hostel)
        db.flush()  # Get hostel ID
        
        # Create 4 floors per hostel
        for floor_num in range(1, 5):
            floor = Floor(
                id=uuid.uuid4(),
                hostel_id=hostel.id,
                floor_number=floor_num
            )
            db.add(floor)
            db.flush()
            
            # Create 20 rooms per floor (E-shape layout)
            for room_num in range(1, 21):
                room_label = f"{floor_num}{room_num:02d}"
                room = Room(
                    id=uuid.uuid4(),
                    hostel_id=hostel.id,
                    floor_id=floor.id,
                    label=room_label,
                    capacity=2,
                    status=RoomStatus.VACANT
                )
                db.add(room)
        
        print(f"Created Hostel {code} with 4 floors and 80 rooms")
    
    db.commit()


def main():
    db = SessionLocal()
    try:
        print("Seeding database...")
        seed_users(db)
        seed_hostels(db)
        # Seed standard programs
        programs = ["BTech", "MTech", "MSc", "MA", "Cognitive"]
        for pname in programs:
            existing = db.query(Program).filter(Program.name == pname).first()
            if not existing:
                db.add(Program(id=uuid.uuid4(), name=pname, code=pname.lower()))

        db.commit()

        # Seed some sample students
        sample_students = [
            {"student_id": "S1001", "name": "Rohan Kumar", "email": "rohan@uni.edu", "program": "BTech"},
            {"student_id": "S1002", "name": "Anjali Gupta", "email": "anjali@uni.edu", "program": "MTech"},
            {"student_id": "S1003", "name": "Maya Singh", "email": "maya@uni.edu", "program": "MSc"},
        ]
        for s in sample_students:
            existing = db.query(Student).filter(Student.student_id == s["student_id"]).first()
            if existing:
                continue
            prog = db.query(Program).filter(Program.name == s["program"]).first()
            st = Student(
                id=uuid.uuid4(),
                student_id=s["student_id"],
                name=s["name"],
                email=s.get("email"),
                program_id=prog.id if prog else None,
            )
            db.add(st)
        db.commit()
        print("Database seeding complete!")
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    main()
