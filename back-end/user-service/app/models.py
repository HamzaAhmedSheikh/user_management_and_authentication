#models.py
from pydantic import BaseModel, EmailStr, validator
from sqlmodel import SQLModel, Field, Relationship, Column
from sqlalchemy import Enum as SQLAEnum, JSON
from typing import Optional, List
from enum import Enum
import re
from pydantic import BaseModel, validator, ValidationError

class UserType(str, Enum):
    ADMIN = "admin"
    STUDENT = "student"
    VISITOR = "visitor"
    TEACHER = "teacher"


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    full_name: str
    email: str
    phone: Optional[str] = None
    affiliation: Optional[str] = None
    is_verified: Optional[bool] = False
    password: str
    otp: Optional[str] = None 
    user_type: UserType = Field(sa_column=Column(SQLAEnum(UserType)))

    teacher: Optional["Teacher"] = Relationship(back_populates="user")


class Teacher(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    department: str
    courses: Optional[List[str]] = Field(
        sa_column=Column(JSON))  # Use JSON column for list[str]

    user: Optional[User] = Relationship(back_populates="teacher")

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

try:
    print(format_phone_number("03172532350"))  
    print(format_phone_number("3172532350"))   
    print(format_phone_number("923172532350")) 
    print(format_phone_number("+923172532350"))
except ValueError as e:
    print(e)



class Register_User(BaseModel):
    full_name: str
    email: str
    password: str
    phone: Optional[str] = None
    affiliation: Optional[str] = None
    is_verified: Optional[bool] = False
    user_type: UserType

    @validator('phone')
    def validate_and_format_phone_number(cls, value):
        if value:
            formatted_value = format_phone_number(value)
            return formatted_value
        return value


class Token(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    access_token: str
    token_type: str
