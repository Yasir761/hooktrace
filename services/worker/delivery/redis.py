import json
import redis
from services.shared.redis_client import redis_client


def _get_redis_client(config):
    redis_url = config.get("redisUrl") or config.get("redis_url")

    if redis_url:
        return redis.from_url(redis_url)

    return redis_client  # fallback to shared client


def deliver_redis(config, payload):
    channel = config.get("channel") or config.get("queue")

    if not channel:
        raise ValueError("Missing Redis channel")

    client = _get_redis_client(config)

    client.lpush(channel, json.dumps(payload))

    return {
        "status_code": 200,
        "body": "redis publish",
        "duration_ms": 0,
    }