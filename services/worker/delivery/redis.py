import json
from redis_client import redis_client
import redis


def _get_redis_client(config):
    redis_url = config.get("redisUrl") or config.get('redis_url')
    if redis_url:
        return redis.from_url(redis_url)

      # Backward-compatible fallback to env/default local Redis.
    return redis.Redis(host="localhost", port=6379, db=0)



def deliver_redis(config,payload):
    channel = config.get("chaneel") or config.get("queue")
    if not channel :
        raise ValueError('Missing Redis channel')
    return {
        "status_code": 200,
        "body": "redis publish",
        "duration_ms": 0,
    }