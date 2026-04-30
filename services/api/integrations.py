from fastapi import APIRouter, Depends
from sqlalchemy import text
from .database import SessionLocal
from .auth import get_current_user
import uuid
import os

router = APIRouter(prefix="/integrations", tags=["integrations"])

BASE_URL = os.getenv("BASE_URL", "http://localhost:3001")


@router.post("/{provider}")
def connect_integration(provider: str, user_id: str = Depends(get_current_user)):
    db = SessionLocal()

    token = str(uuid.uuid4())

    try:
        #  1. create webhook route (THIS connects everything)
        route_id = db.execute(
            text("""
                INSERT INTO webhook_routes (user_id, token, provider)
                VALUES (:user_id, :token, :provider)
                RETURNING id
            """),
            {
                "user_id": user_id,
                "token": token,
                "provider": provider,
            }
        ).scalar()

        #  2. create integration (linked to route)
        db.execute(
            text("""
                INSERT INTO integrations (user_id, provider, webhook_token, route_id)
                VALUES (:user_id, :provider, :token, :route_id)
            """),
            {
                "user_id": user_id,
                "provider": provider,
                "token": token,
                "route_id": route_id,
            }
        )

        db.commit()

        return {
            "provider": provider,
            "webhook_url": f"{BASE_URL}/webhook/{token}"
        }

    finally:
        db.close()


@router.get("")
def get_integrations(user_id: str = Depends(get_current_user)):
    db = SessionLocal()

    try:
        rows = db.execute(
            text("""
                SELECT provider, webhook_token
                FROM integrations
                WHERE user_id = :user_id
            """),
            {"user_id": user_id}
        ).mappings().all()

        return {"items": rows}

    finally:
        db.close()


@router.delete("/{provider}")
def delete_integration(provider: str, user_id: str = Depends(get_current_user)):
    db = SessionLocal()

    try:
        #  delete route ALSO (important cleanup)
        db.execute(
            text("""
                DELETE FROM webhook_routes
                WHERE user_id = :user_id AND provider = :provider
            """),
            {"user_id": user_id, "provider": provider}
        )

        db.execute(
            text("""
                DELETE FROM integrations
                WHERE user_id = :user_id AND provider = :provider
            """),
            {"user_id": user_id, "provider": provider}
        )

        db.commit()

        return {"success": True}

    finally:
        db.close()