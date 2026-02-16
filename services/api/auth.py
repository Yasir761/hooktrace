from jose import jwt, JWTError
from fastapi import Depends, HTTPException, Header
from sqlalchemy import text
from database import SessionLocal
import os

SECRET_KEY = os.getenv("JWT_SECRET", "supersecret")
ALGORITHM = "HS256"


def create_access_token(user_id: str):
    return jwt.encode({"sub": user_id}, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing token")

    token = authorization.split(" ")[1]

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    db = SessionLocal()
    try:
        user = db.execute(
            text("SELECT id FROM users WHERE id = :id"),
            {"id": user_id}
        ).fetchone()

        if not user:
            raise HTTPException(status_code=401, detail="User not found")

        return user_id
    finally:
        db.close()