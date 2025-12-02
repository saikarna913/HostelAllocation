# Hostel Management System - Python Backend

This is the backend reference for the Hostel Management System. **This code does not run in Lovable** - you need to run it separately on your own server.

## Tech Stack
- **Framework**: FastAPI (Python 3.10+)
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Auth**: JWT tokens + Google OAuth 2.0
- **Cache/Realtime**: Redis for pub/sub

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Environment Variables
Create a `.env` file:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/hostel_db
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FRONTEND_URL=http://localhost:5173
```

### 3. Run Database Migrations
```bash
alembic upgrade head
```

### 4. Start the Server
```bash
uvicorn app.main:app --reload --port 8000
```

## API Endpoints

### Auth Service
- `POST /api/auth/login` - Email/password login
- `POST /api/auth/google` - Google OAuth initiate
- `GET /api/auth/google/callback` - Google OAuth callback
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Student Service
- `GET /api/students` - List/Search students (protected)
- `POST /api/students` - Create a new student (protected)
- `GET /api/students/{student_id}` - Get student details (protected)


### Hostel Service
- `GET /api/hostels` - List all hostels
- `GET /api/hostels/{id}` - Get hostel details
- `GET /api/hostels/{id}/floors` - Get floors for hostel
- `GET /api/hostels/{id}/floors/{floor}/rooms` - Get rooms on floor
- `GET /api/rooms/{id}` - Get room details
- `POST /api/rooms/{id}/occupants` - Add occupant (protected)
- `DELETE /api/rooms/{id}/occupants/{occupantId}` - Remove occupant (protected)

### Sheets Sync Service
- `POST /api/sheets-webhook` - Receive Google Sheets updates

## Default User
- Email: `warden@university.edu`
- Password: `admin123`
- Role: `admin`

## Seeding
- Run `python -m scripts.seed_data` to seed hostels, programs and sample students.
