import requests
import time


def deliver_http(config, payload):
    url = config["url"]

    start = time.time()

    resp = requests.post(
        url,
        json=payload,
        timeout=10,
    )

    duration_ms = int((time.time() - start) * 1000)

    return {
        "status_code": resp.status_code,
        "body": resp.text[:2000],
        "duration_ms": duration_ms,
    }