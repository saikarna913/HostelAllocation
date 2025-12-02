from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, hostels, rooms, sheets, students
from app.database import engine, Base
from app.config import settings

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Hostel Management API",
    description="Backend API for Hostel Management System",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(hostels.router, prefix="/api/hostels", tags=["Hostels"])
app.include_router(rooms.router, prefix="/api/rooms", tags=["Rooms"])
app.include_router(sheets.router, prefix="/api/sheets-webhook", tags=["Sheets Sync"])
app.include_router(students.router, prefix="/api/students", tags=["Students"])


@app.get("/")
async def root():
    return {"message": "Hostel Management API", "version": "1.0.0"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
