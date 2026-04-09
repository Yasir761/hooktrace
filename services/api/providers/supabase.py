from fastapi import Request


def verify(request: Request, secret: str) -> bool:
    """
    Basic verification using shared secret header.
    """
    signature = request.headers.get("x-supabase-signature")

    if not signature:
        return False

    return signature == secret


def extract_event_type(payload: dict) -> str:
    return payload.get("type", "unknown")



async def handle_supabase_webhook(payload: dict, headers: dict):
    event_type = payload.get("type")

    print(f"[supabase] event received: {event_type}")

    return {
        "provider": "supabase",
        "event_type": event_type
    }