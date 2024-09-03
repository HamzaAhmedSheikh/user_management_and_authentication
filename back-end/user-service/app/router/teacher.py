# router/teacher.py
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.models.user import User, UserType
from app.models.teacher import Teacher
from app.utils.auth import get_current_user
from app.database import get_session

teacher_router = APIRouter()


@teacher_router.get("/profile", response_model=Teacher)
async def get_teacher_profile(current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    if current_user.user_type != UserType.TEACHER:
        raise HTTPException(
            status_code=403, detail="Not authorized to access teacher profile")

    teacher = session.exec(select(Teacher).where(
        Teacher.user_id == current_user.id)).first()
    if not teacher:
        raise HTTPException(
            status_code=404, detail="Teacher profile not found")
    return teacher
