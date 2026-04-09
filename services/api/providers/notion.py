from fastapi import Request


def verify(request: Request, secret: str) -> bool:
    """
    Verify Notion webhook using Authorization header.
    """
    auth = request.headers.get("authorization")

    if not auth:
        return False

    return auth == f"Bearer {secret}"


def extract_event_type(payload: dict) -> str:
    return payload.get("type", "unknown")



async def handle_notion_webhook(payload: dict, headers: dict):
    """
    Notion webhook handler
    """
    event_type = payload.get("type")

    print(f"[notion] event received: {event_type}")

    return {
        "provider": "notion",
        "event_type": event_type
    }