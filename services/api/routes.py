from fastapi import APIRouter, Request, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from database import SessionLocal
from models import WebhookEvent
from redis_client import redis_client

router = APIRouter()


@router.post("/r/{token}/{route}", status_code=status.HTTP_202_ACCEPTED)
async def relay(token: str, route: str, request: Request):
    body = await request.body()

    if body:
        try:
            payload = await request.json()
        except Exception:
            payload = body.decode(errors="ignore")
    else:
        payload = None

    headers = dict(request.headers)
    idempotency_key = request.headers.get("idempotency-key")

    db: Session = SessionLocal()
    try:
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
        # Duplicate webhook with same idempotency key
        return {"accepted": True, "deduplicated": True}

    finally:
        db.close()
