import json
from redis_client import redis_client


def deliver(config, payload, headers=None):
    queue = config["queue"]

    redis_client.lpush(
        queue,
        json.dumps(payload)
    )

    return {
        "status_code": 200,
        "body": "redis enqueue",
        "duration_ms": 0,
    }