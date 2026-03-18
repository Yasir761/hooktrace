import hmac
import hashlib
from fastapi import Request


def verify(request: Request, secret: str) -> bool:

    timestamp = request.headers.get("x-slack-request-timestamp")
    signature = request.headers.get("x-slack-signature")

    if not timestamp or not signature:
        return False

    body = request.state.raw_body.decode()

    base_string = f"v0:{timestamp}:{body}"

    digest = hmac.new(
        secret.encode(),
        base_string.encode(),
        hashlib.sha256
    ).hexdigest()

    expected = f"v0={digest}"

    return hmac.compare_digest(expected, signature)


def extract_event_type(payload: dict) -> str:
    return payload.get("type", "unknown")