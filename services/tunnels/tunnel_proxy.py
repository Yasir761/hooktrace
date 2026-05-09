import uuid
import json
import asyncio

from fastapi import APIRouter
from fastapi import Request
from fastapi import HTTPException
from fastapi.responses import Response

from .tunnel_registry import registry


router = APIRouter(tags=["tunnel-proxy"])


PENDING_RESPONSES = {}


@router.api_route(
    "/proxy/{token}/{path:path}",
    methods=[
        "GET",
        "POST",
        "PUT",
        "PATCH",
        "DELETE",
        "OPTIONS",
    ],
)
async def proxy_request(
    request: Request,
    token: str,
    path: str,
):

    if not registry.exists(token):

        raise HTTPException(
            status_code=404,
            detail="Tunnel offline",
        )

    if not registry.is_alive(token):

        raise HTTPException(
            status_code=503,
            detail="Tunnel heartbeat timeout",
        )

    websocket = registry.get_socket(token)

    if not websocket:

        raise HTTPException(
            status_code=404,
            detail="Tunnel socket missing",
        )

    body = await request.body()

    request_id = str(uuid.uuid4())

    future = asyncio.Future()

    PENDING_RESPONSES[request_id] = future

    payload = {
        "type": "request",
        "request_id": request_id,
        "method": request.method,
        "path": "/" + path,
        "query": str(request.url.query),
        "headers": dict(request.headers),
        "body": body.decode(errors="ignore"),
    }

    await websocket.send_text(
        json.dumps(payload)
    )

    try:

        result = await asyncio.wait_for(
            future,
            timeout=30,
        )

    except asyncio.TimeoutError:

        PENDING_RESPONSES.pop(
            request_id,
            None,
        )

        raise HTTPException(
            status_code=504,
            detail="Tunnel response timeout",
        )

    return Response(
        content=result.get("body", ""),
        status_code=result.get(
            "status_code",
            200,
        ),
        headers=result.get("headers") or {},
    )