import hmac
import hashlib
from fastapi import Request


def verify(request: Request, secret: str) -> bool:
    """
    Verify Razorpay webhook signature.
    """
    signature = request.headers.get("x-razorpay-signature")

    if not signature:
        return False

    payload = request.state.raw_body

    expected = hmac.new(
        secret.encode(),
        payload,
        hashlib.sha256
    ).hexdigest()

    return hmac.compare_digest(expected, signature)


def extract_event_type(payload: dict) -> str:
    return payload.get("event", "unknown")



async def handle_razorpay_webhook(payload: dict, headers: dict):
    event_type = payload.get("event")

    print(f"[razorpay] event received: {event_type}")

    return {
        "provider": "razorpay",
        "event_type": event_type
    }