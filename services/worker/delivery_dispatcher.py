# import json
# from services.shared.redis_client import redis_client
# AGG_QUEUE = "webhook:aggregate"



# async def dispatch_webhook(webhook_event):
#     """
#     Main webhook dispatcher
#     Pushes event into aggregation queue
#     """

#     event_id = webhook_event.get("id")

#     if not event_id:
#         print("[dispatcher]  Missing event_id in webhook_event")
#         return {"error": "missing_event_id"}

#     try:
#         print(f"[dispatcher] pushing event {event_id}")
#         # send to aggregation
#         redis_client.lpush("webhook:aggregate", str(event_id))

#          # ALSO send to main queue (IMPORTANT)
#         redis_client.lpush("webhook:queue", str(event_id))

#         print(f"[dispatcher]  Event {event_id} queued for aggregation")

#         return {"queued": True}

#     except Exception as e:
#         print(f"[dispatcher]  Failed to queue event: {str(e)}")
#         return {"error": str(e)}