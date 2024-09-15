#main.py
from fastapi import APIRouter, FastAPI
from app.router.user import user_router
# from app.router import students
# from app.router.oauth_router import oauth_router
from app.router.auth_router import auth_router
from app.db_engine import create_db_and_tables
# from app.router.teacher import teacher_router

app = FastAPI(
    title="Panaversity User Management and Authentication")

@app.on_event("startup")
def on_startup():   
    try:
        create_db_and_tables()
    except Exception as e:
        print(f"Error during startup: {e}")


@app.get("/")
def root():
    return{"message": "This is just an authentication service.. Please visit http://localhost:8000/docs to see the API documentation."}

app.include_router(user_router, prefix="/api/v1/user")
# app.include_router(oauth_router, prefix="/api/v1/oauth")
app.include_router(auth_router, prefix="/api/v1/auth")
