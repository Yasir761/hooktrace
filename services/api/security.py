import hmac
import hashlib
import time
import json
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





def generate_signature(secret: str, payload: bytes):
    timestamp = str(int(time.time()))
    message = f"{timestamp}.".encode() + payload

    signature = hmac.new(
        secret.encode(),
        message,
        hashlib.sha256
    ).hexdigest()

    return signature, timestamp


def safe_json(data):
    try:
        return json.dumps(data)
    except:
        return str(data)