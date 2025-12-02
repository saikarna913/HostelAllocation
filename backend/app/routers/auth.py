from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from jose import jwt, JWTError
from fastapi.security import OAuth2PasswordRequestForm
from authlib.integrations.starlette_client import OAuth
from typing import Optional
import uuid

from app.database import get_db
from app.models.user import User, UserRole
from app.config import settings
from app.security import create_access_token, create_refresh_token, oauth2_scheme, get_current_user_from_token

router = APIRouter()

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth setup
oauth = OAuth()
oauth.register(
    name='google',
    client_id=settings.GOOGLE_CLIENT_ID,
    client_secret=settings.GOOGLE_CLIENT_SECRET,
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid email profile'}
)


# Pydantic models
class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    avatar: Optional[str]
    role: str


# Helper functions
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def hash_password(password: str) -> str:
    return pwd_context.hash(password)





# Seed default admin user
def seed_default_user(db: Session):
    """Create default admin user if not exists"""
    existing = db.query(User).filter(User.email == "warden@university.edu").first()
    if not existing:
        default_user = User(
            id=uuid.uuid4(),
            email="warden@university.edu",
            name="Admin Warden",
            hashed_password=hash_password("admin123"),
            role=UserRole.ADMIN
        )
        db.add(default_user)
        db.commit()


# Routes
@router.post("/login", response_model=TokenResponse)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # Seed default user on first login attempt
    seed_default_user(db)
    
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not user.hashed_password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    return TokenResponse(
        access_token=create_access_token(str(user.id)),
        refresh_token=create_refresh_token(str(user.id))
    )


@router.get("/google")
async def google_login():
    """Initiate Google OAuth flow"""
    redirect_uri = f"{settings.FRONTEND_URL}/api/auth/google/callback"
    return await oauth.google.authorize_redirect(redirect_uri)


@router.get("/google/callback")
async def google_callback(db: Session = Depends(get_db)):
    """Handle Google OAuth callback"""
    try:
        token = await oauth.google.authorize_access_token()
        user_info = token.get('userinfo')
        
        if not user_info:
            raise HTTPException(status_code=400, detail="Failed to get user info")
        
        # Find or create user
        user = db.query(User).filter(User.google_id == user_info['sub']).first()
        
        if not user:
            user = db.query(User).filter(User.email == user_info['email']).first()
            if user:
                user.google_id = user_info['sub']
            else:
                user = User(
                    id=uuid.uuid4(),
                    email=user_info['email'],
                    name=user_info.get('name', 'User'),
                    avatar=user_info.get('picture'),
                    google_id=user_info['sub'],
                    role=UserRole.STAFF
                )
                db.add(user)
            db.commit()
        
        # Create tokens and redirect
        access_token = create_access_token(str(user.id))
        refresh_token = create_refresh_token(str(user.id))
        
        redirect_url = f"{settings.FRONTEND_URL}?access_token={access_token}&refresh_token={refresh_token}"
        return RedirectResponse(url=redirect_url)
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(refresh_token: str, db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(refresh_token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
        
        user_id = payload.get("sub")
        user = db.query(User).filter(User.id == user_id).first()
        
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        
        return TokenResponse(
            access_token=create_access_token(str(user.id)),
            refresh_token=create_refresh_token(str(user.id))
        )
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")


@router.get("/me", response_model=UserResponse)
async def get_me(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    user = get_current_user_from_token(token, db)
    return UserResponse(
        id=str(user.id),
        email=user.email,
        name=user.name,
        avatar=user.avatar,
        role=user.role.value
    )


@router.post("/logout")
async def logout():
    """Client-side should clear tokens"""
    return {"message": "Logged out successfully"}
