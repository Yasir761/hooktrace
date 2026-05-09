import json
from fastapi import APIRouter
from fastapi import WebSocket
from fastapi import WebSocketDisconnect

from .tunnel_registry import registry


router = APIRouter(tags=["tunnel-gateway"])


@router.websocket("/ws/tunnel/{token}")
async def tunnel_gateway(
    websocket: WebSocket,
    token: str,
):
    await websocket.accept()

    await registry.register(
        token,
        websocket,
    )

    print(f"[gateway] tunnel connected: {token}")

    try:
        while True:
            raw = await websocket.receive_text()

            data = json.loads(raw)

            message_type = data.get("type")

            if message_type == "heartbeat":
                registry.heartbeat(token)
                continue

            if message_type == "response":
                # handled by proxy correlation layer later
                continue

    except WebSocketDisconnect:
        print(f"[gateway] disconnected: {token}")

    finally:
        registry.unregister(token)