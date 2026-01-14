import hmac
import hashlib
from fastapi import Request


def _compute_signature(secret: str, payload: bytes) -> str:
    digest = hmac.new(
        secret.encode(),
        payload,
        hashlib.sha256
    ).hexdigest()
    return f"sha256={digest}"


def verify(request: Request, secret: str) -> bool:
    """
    Verify GitHub webhook signature using X-Hub-Signature-256.
    """
    sig_header = request.headers.get("x-hub-signature-256")
    if not sig_header:
        return False

    payload = request.state.raw_body
    expected = _compute_signature(secret, payload)

    # constant-time compare
    return hmac.compare_digest(expected, sig_header)


def extract_event_type(payload: dict) -> str:
    """
    GitHub event type is provided via header X-GitHub-Event,
    but payload 'action' is also useful (e.g. opened/closed).
    """
    # Fallback to payload action if needed
    return payload.get("action", "unknown")
