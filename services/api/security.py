import hmac
import hashlib


def verify_signature(secret: str, payload: bytes, signature: str) -> bool:
    expected = hmac.new(
        secret.encode(),
        payload,
        hashlib.sha256
    ).hexdigest()

    return hmac.compare_digest(expected, signature)
