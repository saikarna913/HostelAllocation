from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from uuid import UUID

from app.database import get_db
from app.models.hostel import Student, Program
from app.security import get_current_user_from_token
from app.models.user import User

router = APIRouter()


# Pydantic models
class StudentCreateRequest(BaseModel):
    student_id: str
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    roll_number: Optional[str] = None
    program_id: Optional[str] = None
    year: Optional[int] = None
    hostel_id: Optional[str] = None
    room_id: Optional[str] = None


class StudentResponse(BaseModel):
    id: str
    student_id: str
    name: str
    email: Optional[str]
    phone: Optional[str]
    roll_number: Optional[str]
    program_id: Optional[str]
    year: Optional[int]
    hostel_id: Optional[str]
    room_id: Optional[str]


@router.post("", response_model=StudentResponse)
async def create_student(request: StudentCreateRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user_from_token)):
    # Check unique student_id
    existing = db.query(Student).filter(Student.student_id == request.student_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Student with this ID already exists")

    student = Student(
        student_id=request.student_id,
        name=request.name,
        email=request.email,
        phone=request.phone,
        roll_number=request.roll_number,
        program_id=request.program_id,
        year=request.year,
        hostel_id=request.hostel_id,
        room_id=request.room_id,
    )
    db.add(student)
    db.commit()
    db.refresh(student)

    return StudentResponse(
        id=str(student.id),
        student_id=student.student_id,
        name=student.name,
        email=student.email,
        phone=student.phone,
        roll_number=student.roll_number,
        program_id=str(student.program_id) if student.program_id else None,
        year=student.year,
        hostel_id=str(student.hostel_id) if student.hostel_id else None,
        room_id=str(student.room_id) if student.room_id else None,
    )


@router.get("", response_model=List[StudentResponse])
async def list_students(q: Optional[str] = Query(None, description="Search query for name, email, or student id"), limit: int = 50, offset: int = 0, db: Session = Depends(get_db), current_user: User = Depends(get_current_user_from_token)):
    query = db.query(Student)
    if q:
        qlower = f"%{q.lower()}%"
        query = query.filter(
            (Student.name.ilike(qlower)) |
            (Student.email.ilike(qlower)) |
            (Student.student_id.ilike(qlower))
        )

    students = query.order_by(Student.name).limit(limit).offset(offset).all()

    return [
        StudentResponse(
            id=str(s.id),
            student_id=s.student_id,
            name=s.name,
            email=s.email,
            phone=s.phone,
            roll_number=s.roll_number,
            program_id=str(s.program_id) if s.program_id else None,
            year=s.year,
            hostel_id=str(s.hostel_id) if s.hostel_id else None,
            room_id=str(s.room_id) if s.room_id else None,
        )
        for s in students
    ]


@router.get("/{student_id}", response_model=StudentResponse)
async def get_student(student_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user_from_token)):
    student = db.query(Student).filter(Student.student_id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    return StudentResponse(
        id=str(student.id),
        student_id=student.student_id,
        name=student.name,
        email=student.email,
        phone=student.phone,
        roll_number=student.roll_number,
        program_id=str(student.program_id) if student.program_id else None,
        year=student.year,
        hostel_id=str(student.hostel_id) if student.hostel_id else None,
        room_id=str(student.room_id) if student.room_id else None,
    )
