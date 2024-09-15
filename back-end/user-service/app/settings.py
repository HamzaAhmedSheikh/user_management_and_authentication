# settings.py
from starlette.config import Config

try:
    config = Config(".env")
except FileNotFoundError:
    config = Config()

DATABASE_URL = config("DATABASE_URL", cast=str)
SECRET_KEY = config("SECRET_KEY", cast=str)
ALGORITHM = config("ALGORITHM", cast=str, default="HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = config(
    "ACCESS_TOKEN_EXPIRE_MINUTES", cast=int, default=30)
WHATSAPP_API_KEY = config("WHATSAPP_API_KEY", cast=str)

# OAuth Configuration
OAUTH_CLIENT_ID = config("OAUTH_CLIENT_ID", cast=str)
OAUTH_CLIENT_SECRET = config("OAUTH_CLIENT_SECRET", cast=str)
OAUTH_REDIRECT_URI = config("OAUTH_REDIRECT_URI", cast=str)
OAUTH_SCOPE = config("OAUTH_SCOPE", cast=str)
OAUTH_AUTH_URL = config("OAUTH_AUTH_URL", cast=str)
OAUTH_TOKEN_URL = config("OAUTH_TOKEN_URL", cast=str)
