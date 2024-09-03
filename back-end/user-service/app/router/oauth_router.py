# router/oauth_router.py
from fastapi import APIRouter, HTTPException, Depends
import requests
from app.settings import (
    OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET,
    OAUTH_REDIRECT_URI, OAUTH_SCOPE,
    OAUTH_AUTH_URL, OAUTH_TOKEN_URL
)

oauth_router = APIRouter()


@oauth_router.get("/authorize")
async def initiate_oauth_login():
    auth_url = (
        f"{OAUTH_AUTH_URL}"
        f"?client_id={OAUTH_CLIENT_ID}"
        f"&redirect_uri={OAUTH_REDIRECT_URI}"
        f"&response_type=code"
        f"&scope={OAUTH_SCOPE}"
    )
    return {"auth_url": auth_url}


@oauth_router.post("/token")
async def exchange_code_for_token(code: str):
    token_data = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": OAUTH_REDIRECT_URI,
        "client_id": OAUTH_CLIENT_ID,
        "client_secret": OAUTH_CLIENT_SECRET,
    }

    try:
        response = requests.post(OAUTH_TOKEN_URL, data=token_data)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        raise HTTPException(
            status_code=400, detail=f"Failed to exchange token: {e}")
