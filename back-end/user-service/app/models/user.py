from sqlmodel import SQLModel, Field, Relationship, Column
from sqlalchemy import Enum as SQLAEnum
from typing import Optional, List
from uuid import uuid4
from enum import Enum
from .auth_token import AuthToken
from .verification_token import VerificationToken
from pydantic import validator
import re

class UserType(str, Enum):
    ADMIN = "admin"
    STUDENT = "student"
    VISITOR = "visitor"
    TEACHER = "teacher"

class UserLogin(SQLModel):
    email: str
    password: str

class UserBase(SQLModel):
    full_name: str
    email: str = Field(index=True, unique=True)
    phone: str = Field(index=True, unique=True)
    affiliation: Optional[str] = None
    user_type: UserType = Field(sa_column=Column(SQLAEnum(UserType)))


class User(UserBase, table=True):
    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    password: str
    otp: Optional[str] = None
    is_verified: bool = Field(default=False)
    consumer_id: Optional[str] = None  # For Kong Auth
    issuer: Optional[str] = None  # For Kong Auth (respective plugin secret key for the specific consumer)
    teacher: Optional["Teacher"] = Relationship(back_populates="user")
    
# User Create
def format_phone_number(value: str) -> str:
    value = re.sub(r'\D', '', value)
    if value.startswith("92") and len(value) == 12:
        return value 
    elif value.startswith("0") and len(value) == 11:
        return f"92{value[1:]}" 
    elif len(value) == 10:
        return f"92{value}"
    elif value.startswith("923") and len(value) == 12:
        return value[1:]
    elif value.startswith("+92") and len(value) == 13:
        return value[1:]
    else:
        raise ValueError("Invalid phone number format. Please use a valid format.")

class UserCreate(UserBase):
    password: str
    @validator('phone', pre=True, always=True)
    def validate_and_format_phone_number(cls, value):
        if value:
            return format_phone_number(value)
        return value
    

class UserRead(UserBase):
    id: str
    is_verified: bool
    

class UserUpdate(SQLModel):  # Making all fields optional for partial updates
    full_name: Optional[str] = None
    # phone: Optional[str] = None
    affiliation: Optional[str] = None
    # is_verified: Optional[bool] = None
    # otp: Optional[str] = None
    # consumer_id: Optional[str] = None
    # issuer: Optional[str] = None