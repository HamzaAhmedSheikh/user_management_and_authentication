from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.models.user import User
from app.database import get_session

student_router = APIRouter()


@student_router.post("/profile")
async def create_student_profile(profile_data: dict, session: Session = Depends(get_session)):
    student_profile = User(**profile_data)
    session.add(student_profile)
    session.commit()
    return {"status": "success", "message": "Student profile created successfully."}


@student_router.get("/profile")
async def get_student_profile(student_id: str, session: Session = Depends(get_session)):
    student_profile = session.exec(
        select(User).where(User.id == student_id)).first()
    if not student_profile:
        raise HTTPException(
            status_code=404, detail="Student profile not found")
    return student_profile
