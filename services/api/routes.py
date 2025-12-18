from fastapi import APIRouter, Request, status
from sqlalchemy.orm import Session
from database import SessionLocal
from models import WebhookEvent

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
    finally:
        db.close()

    return {"accepted": True}
