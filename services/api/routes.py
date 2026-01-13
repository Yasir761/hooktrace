from fastapi import APIRouter, Request, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from sqlalchemy import text

from database import SessionLocal
from models import WebhookEvent
from redis_client import redis_client

from security import verify_signature
from providers import stripe as stripe_provider

from metrics import (
    webhooks_received,
    webhooks_deduplicated,
    webhooks_invalid_signature,
)

router = APIRouter()


@router.post("/r/{token}/{route}", status_code=status.HTTP_202_ACCEPTED)
async def relay(token: str, route: str, request: Request):
    #  Read raw body ONCE (required for Stripe)
    raw_body = await request.body()
    request.state.raw_body = raw_body

    #  Parse payload safely
    try:
        payload = await request.json()
    except Exception:
        payload = raw_body.decode(errors="ignore") if raw_body else None

    headers = dict(request.headers)
    idempotency_key = request.headers.get("idempotency-key")
    signature = request.headers.get("x-signature")

    #  Detect provider
    provider = None
    if "stripe-signature" in request.headers:
        provider = "stripe"

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

        #  Signature validation (ONLY if secret exists)
        if route_secret:
            if provider == "stripe":
                if not stripe_provider.verify(request, route_secret):
                    webhooks_invalid_signature.inc()
                    return JSONResponse(
                        status_code=401,
                        content={"detail": "Invalid Stripe signature"},
                    )
            else:
                if not signature:
                    return JSONResponse(
                        status_code=401,
                        content={"detail": "Missing signature"},
                    )

                if not verify_signature(route_secret, raw_body, signature):
                    webhooks_invalid_signature.inc()
                    return JSONResponse(
                        status_code=401,
                        content={"detail": "Invalid signature"},
                    )

        #  Create event
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

        webhooks_received.labels(token=token, route=route).inc()

        #  Enqueue
        redis_client.lpush("webhook:queue", str(event.id))

        return {"accepted": True}

    except IntegrityError:
        db.rollback()
        webhooks_deduplicated.inc()
        return {"accepted": True, "deduplicated": True}

    finally:
        db.close()
