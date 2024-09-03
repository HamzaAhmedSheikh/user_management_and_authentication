from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from uuid import uuid4
from datetime import datetime
from enum import Enum


class VerificationTokenType(str, Enum):
    EMAIL_VERIFICATION = "email_verification"
    PASSWORD_RESET = "password_reset"

class VerificationToken(SQLModel, table=True):
    __tablename__ = "verification_token"
    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    user_id: str = Field(foreign_key="user.id")
    hash_id: str = Field(default_factory=lambda: uuid4().hex)
    token_value: str
    token_type: VerificationTokenType = Field(default=VerificationTokenType.EMAIL_VERIFICATION)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    expires_at: Optional[datetime] = None
    used_at: Optional[datetime] = None
