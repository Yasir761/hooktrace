from fastapi import APIRouter, HTTPException, Header
from sqlalchemy import text
from database import SessionLocal
import secrets

router = APIRouter(prefix="/routes", tags=["routes"])

# 🔐 Very basic API key auth (replace later with JWT)
def require_auth(authorization: str | None):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")

    token = authorization.split(" ")[1]
    # TODO: validate against users table
    return token


@router.get("/")
def list_routes(Authorization: str | None = Header(None)):
    require_auth(Authorization)

    db = SessionLocal()
    try:
        rows = db.execute(
            text("""
                SELECT id, token, route, mode, dev_target, prod_target, created_at
                FROM webhook_routes
                ORDER BY created_at DESC
            """)
        ).mappings().all()

        return {"items": [dict(r) for r in rows]}
    finally:
        db.close()


@router.post("/")
def create_route(
    payload: dict,
    Authorization: str | None = Header(None)
):
    require_auth(Authorization)

    route_name = payload.get("route")
    if not route_name:
        raise HTTPException(status_code=400, detail="Route required")

    token = secrets.token_hex(8)
    secret = secrets.token_hex(16)

    db = SessionLocal()
    try:
        db.execute(
            text("""
                INSERT INTO webhook_routes (token, route, secret, mode)
                VALUES (:token, :route, :secret, 'dev')
            """),
            {
                "token": token,
                "route": route_name,
                "secret": secret,
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