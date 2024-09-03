import pytest
from sqlmodel import Session, SQLModel, create_engine
from fastapi.testclient import TestClient
from app.main import app
from app.database import get_session
from app import settings

@pytest.fixture(name="engine")
def engine():
    """
    Creates a test database engine.

    Yields:
        engine: A SQLAlchemy engine object.
    """
    connection_string = str(settings.TEST_DATABASE_URL).replace(
        "postgresql", "postgresql+psycopg"
    )
    engine = create_engine(
        connection_string, connect_args={"sslmode": "require"}, pool_recycle=300
    )
    SQLModel.metadata.create_all(engine)
    yield engine
    SQLModel.metadata.drop_all(engine)

@pytest.fixture(name="session")
def session(engine: pytest.fixture):
    """
    Creates a test database session.

    Args:
        engine: A SQLAlchemy engine object (provided by the `engine_fixture`).

    Yields:
        session: A SQLAlchemy session object.
    """
    with Session(engine) as session:
        yield session

@pytest.fixture(name="client")
def client(session):
    """
    Creates a test client for the FastAPI app.

    Args:
        session: A SQLAlchemy session object (provided by the `session_fixture`).

    Yields:
        client: A FastAPI test client object.
    """
    def get_session_override():
        return session

    app.dependency_overrides[get_session] = get_session_override
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()    