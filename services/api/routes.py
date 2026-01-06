from fastapi import APIRouter, Request, status
from sqlalchemy.orm import Session
from database import SessionLocal
from models import WebhookEvent
from redis_client import redis_client


router = APIRouter()

@router.post("/r/{token}/{route}", status_code=status.HTTP_202_ACCEPTED)
async def relay(token: str, route: str, request: Request):
    payload = await request.json()
    headers = dict(request.headers)

    db: Session = SessionLocal()
    try:
        event = WebhookEvent(
            token=token,
            route=route,
            headers=headers,
            payload=payload,
            status="pending",
        )
        db.add(event)
        db.commit()
        db.refresh(event)
        redis_client.lpush("webhook:queue", str(event.id))
    finally:
        db.close()

    return {"accepted": True}
