from fastapi import Request
from nacl.signing import VerifyKey
from nacl.exceptions import BadSignatureError


def verify(request: Request, public_key: str) -> bool:
    signature = request.headers.get("x-signature-ed25519")
    timestamp = request.headers.get("x-signature-timestamp")

    if not signature or not timestamp:
        return False

    body = request.state.raw_body

    try:
        verify_key = VerifyKey(bytes.fromhex(public_key))
        verify_key.verify(
            timestamp.encode() + body,
            bytes.fromhex(signature)
        )
        return True
    except BadSignatureError:
        return False


def extract_event_type(payload: dict) -> str:
    return payload.get("type", "unknown")