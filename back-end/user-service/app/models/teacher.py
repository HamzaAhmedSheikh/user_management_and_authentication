from sqlmodel import SQLModel, Field, Relationship, Column
from typing import Optional, List
from sqlalchemy import JSON


class TeacherBase(SQLModel):
    department: str
    courses: Optional[List[str]] = Field(
        sa_column=Column(JSON)
    )


class Teacher(TeacherBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="user.id")

    user: Optional["User"] = Relationship(back_populates="teacher")


class TeacherCreate(TeacherBase):
    user_id: str


class TeacherRead(TeacherBase):
    id: int
    user_id: str


class TeacherUpdate(SQLModel):
    department: Optional[str] = None
    courses: Optional[List[str]] = None
