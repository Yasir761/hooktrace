import time
import httpx


async def deliver_http(config, payload):

    url = config.get("url")

    if not url:
        raise ValueError(
            "Missing HTTP target URL"
        )

    method = (
        config.get("method")
        or "POST"
    ).upper()

    headers = config.get("headers") or {}

    timeout = int(
        config.get("timeout") or 10
    )

    headers["Content-Type"] = (
        "application/json"
    )

    start = time.time()

    async with httpx.AsyncClient(
        timeout=timeout
    ) as client:

        resp = await client.request(
            method,
            url,
            json=payload,
            headers=headers,
        )

    duration_ms = int(
        (time.time() - start) * 1000
    )

    return {
        "status_code": resp.status_code,
        "body": resp.text[:2000],
        "duration_ms": duration_ms,
    }