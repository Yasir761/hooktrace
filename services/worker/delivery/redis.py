import json
import redis.asyncio as redis

from services.shared.redis_client import (
    redis_client,
)


async def _get_redis_client(config):

    redis_url = (
        config.get("redisUrl")
        or config.get("redis_url")
    )

    if redis_url:

        return redis.from_url(
            redis_url,
            decode_responses=True,
        )

    return redis_client


async def deliver_redis(
    config,
    payload,
):

    channel = (
        config.get("channel")
        or config.get("queue")
    )

    if not channel:
        raise ValueError(
            "Missing Redis channel"
        )

    client = await _get_redis_client(
        config
    )

    await client.lpush(
        channel,
        json.dumps(payload)
    )

    return {
        "status_code": 200,
        "body": "redis publish",
        "duration_ms": 0,
    }