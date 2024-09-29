# router/oauth_router.py
from urllib import response
from fastapi import Header
from fastapi import APIRouter, HTTPException, Depends
from jose import jwt
from app.utils.auth import oauth2_scheme
import requests
from app.settings import (
  GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI
)

oauth_router = APIRouter()

@oauth_router.get("/login/google")
async def login_google():
    return {
        "url": f"https://accounts.google.com/o/oauth2/auth?response_type=code&client_id={GOOGLE_CLIENT_ID}&redirect_uri={GOOGLE_REDIRECT_URI}&scope=openid%20profile%20email&access_type=offline"
    }


@oauth_router.get("/auth/google")
async def auth_google(code: str):
    token_url = "https://accounts.google.com/o/oauth2/token"
    data = {
        "code": code,
        "client_id": GOOGLE_CLIENT_ID,
        "client_secret": GOOGLE_CLIENT_SECRET,
        "redirect_uri": GOOGLE_REDIRECT_URI,
        "grant_type": "authorization_code"
        
    }
    response = requests.post(token_url, data=data)

    # Check for error in response
    if response.status_code != 200:
        print(response.text)  # Log the error response for debugging
        raise HTTPException(status_code=response.status_code,
                            detail=response.json())

    access_token = response.json().get("access_token")
    user_info = requests.get("https://www.googleapis.com/oauth2/v1/userinfo",
                             headers={"Authorization": f"Bearer {access_token}"})

    return user_info.json()


@oauth_router.get("/token")
async def get_token(authorization: str = Depends(oauth2_scheme)):
    if authorization is None:
        raise HTTPException(
            status_code=403, detail="Authorization header missing")

    token = authorization.split(" ")[1]  

    try:
        payload = jwt.decode(token, GOOGLE_CLIENT_SECRET, algorithms=["HS256"])
        return payload
    except jwt.JWTError:
        raise HTTPException(
            status_code=403, detail="Could not validate credentials")
