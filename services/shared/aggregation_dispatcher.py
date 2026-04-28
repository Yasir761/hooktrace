from services.shared.redis_client import redis_client

AGG_QUEUE = "webhook:aggregate"

async def dispatch_webhook(webhook_event):
    event_id = webhook_event.get("id")

    if not event_id:
        print("[dispatcher] Missing event_id")
        return

    redis_client.lpush(AGG_QUEUE, str(event_id))

    print(f"[dispatcher] queued {event_id}")