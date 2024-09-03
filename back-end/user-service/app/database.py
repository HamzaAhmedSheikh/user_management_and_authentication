from app import settings
from sqlmodel import create_engine, Session, SQLModel
from .models.user import User
from .models.teacher import Teacher
from .models.auth_token import AuthToken
from .models.verification_token import VerificationToken

# only needed for psycopg 3 - replace postgresql
# with postgresql+psycopg in settings.DATABASE_URL
connection_string = str(settings.DATABASE_URL).replace(
    "postgresql", "postgresql+psycopg"
)

# recycle connections after 5 minutes
# to correspond with the compute scale down
engine = create_engine(
    connection_string, connect_args={}, pool_recycle=300
)

def get_session():
    with Session(engine) as session:
        yield session
        
def create_db_and_tables()->None:
    SQLModel.metadata.create_all(engine)