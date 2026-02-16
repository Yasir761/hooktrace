import hmac
import hashlib
import time

def verify_signature(secret: str, payload: bytes, signature: str, timestamp: str | None = None) -> bool:
    # Optional replay protection
    if timestamp:
        try:
            if abs(time.time() - int(timestamp)) > 300:
                return False
        except:
            return False

    message = payload
    if timestamp:
        message = f"{timestamp}.".encode() + payload

    expected = hmac.new(
        secret.encode(),
        message,
        hashlib.sha256
    ).hexdigest()

    return hmac.compare_digest(expected, signature)