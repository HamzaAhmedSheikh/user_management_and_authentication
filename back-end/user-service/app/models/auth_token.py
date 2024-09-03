from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from uuid import uuid4
from datetime import datetime
from enum import Enum

class AuthTokenType(str, Enum):
    ACCESS_TOKEN = "access"
    REFRESH_TOKEN = "refresh"

class AuthToken(SQLModel, table=True):
    __tablename__ = "auth_token"
    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    user_id: str = Field(foreign_key="user.id")
    token_value: str
    token_type: AuthTokenType
    created_at: datetime = Field(default_factory=datetime.utcnow)
    expires_at: Optional[datetime] = None
    used_at: Optional[datetime] = None
