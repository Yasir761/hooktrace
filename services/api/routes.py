from fastapi import APIRouter, Request, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from sqlalchemy import text

from database import SessionLocal
from models import WebhookEvent
from redis_client import redis_client
from security import verify_signature

router = APIRouter()


@router.post("/r/{token}/{route}", status_code=status.HTTP_202_ACCEPTED)
async def relay(token: str, route: str, request: Request):
    # 1️⃣ Read raw body ONCE
    raw_body = await request.body()

    try:
        payload = await request.json()
    except Exception:
        payload = raw_body.decode(errors="ignore") if raw_body else None

    headers = dict(request.headers)
    idempotency_key = request.headers.get("idempotency-key")
    signature = request.headers.get("x-signature")

    db: Session = SessionLocal()

    try:
        #  Fetch route secret
        route_secret = db.execute(
            text("""
                SELECT secret FROM webhook_routes
                WHERE token = :token AND route = :route
            """),
            {"token": token, "route": route},
        ).scalar()

        #  Validate signature (ONLY if secret exists)
        if route_secret:
            if not signature:
                return JSONResponse(
                    status_code=401,
                    content={"detail": "Missing signature"},
                )

            if not verify_signature(route_secret, raw_body, signature):
                return JSONResponse(
                    status_code=401,
                    content={"detail": "Invalid signature"},
                )

        #  Create event (after validation)
        event = WebhookEvent(
            token=token,
            route=route,
            headers=headers,
            payload=payload,
            status="pending",
            idempotency_key=idempotency_key,
        )

        db.add(event)
        db.commit()
        db.refresh(event)

        redis_client.lpush("webhook:queue", str(event.id))

        return {"accepted": True}

    except IntegrityError:
        db.rollback()
        return {"accepted": True, "deduplicated": True}

    finally:
        db.close()
