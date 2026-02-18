from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from database import SessionLocal
from auth import get_current_user
import secrets

router = APIRouter(prefix="/routes", tags=["routes"])


@router.get("/")
def list_routes(user_id: str = Depends(get_current_user)):
    db = SessionLocal()
    try:
        rows = db.execute(
            text("""
                SELECT id, token, route, mode, dev_target, prod_target, created_at
                FROM webhook_routes
                WHERE user_id = :user_id
                ORDER BY created_at DESC
            """),
            {"user_id": user_id}
        ).mappings().all()

        return {"items": [dict(r) for r in rows]}
    finally:
        db.close()


@router.post("/")
def create_route(
    payload: dict,
    user_id: str = Depends(get_current_user)
):
    route_name = payload.get("route")
    if not route_name:
        raise HTTPException(status_code=400, detail="Route required")

    token = secrets.token_hex(8)
    secret = secrets.token_hex(16)

    db = SessionLocal()
    try:
        db.execute(
            text("""
                INSERT INTO webhook_routes
                (token, route, secret, mode, user_id)
                VALUES (:token, :route, :secret, 'dev', :user_id)
            """),
            {
                "token": token,
                "route": route_name,
                "secret": secret,
                "user_id": user_id,
            }
        )

        db.commit()

        return {
            "token": token,
            "route": route_name,
            "secret": secret,
        }

    finally:
        db.close()