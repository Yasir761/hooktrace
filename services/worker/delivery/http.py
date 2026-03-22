import requests
import time


def deliver(config, payload, headers):
    url = config["url"]

    start = time.time()

    resp = requests.post(
        url,
        json=payload,
        headers=headers,
        timeout=10,
    )

    duration_ms = int((time.time() - start) * 1000)

    return {
        "status_code": resp.status_code,
        "body": resp.text[:2000],
        "duration_ms": duration_ms,
    }