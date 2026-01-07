import requests
from database import SessionLocal
from redis_client import redis_client
from sqlalchemy import text

QUEUE_NAME = "webhook:queue"

def deliver_event(event_id: int):
    db = SessionLocal()
    try:
        event = db.execute(
            text("SELECT * FROM webhook_events WHERE id = :id"),
            {"id": event_id},
        ).mappings().first()

        if not event:
            print(f"[worker] Event {event_id} not found")
            return

        # 🔧 TEMP destination (Phase 1.2)
        destination_url = "https://httpbin.org/post"

        try:
            resp = requests.post(
                destination_url,
                json=event["payload"],
                headers=event["headers"],
                timeout=10,
            )

            status = "delivered" if resp.status_code < 300 else "failed"

        except Exception as e:
            print(f"[worker] Delivery error: {e}")
            status = "failed"

        db.execute(
            text(
                "UPDATE webhook_events SET status = :status WHERE id = :id"
            ),
            {"status": status, "id": event_id},
        )
        db.commit()

        print(f"[worker] Event {event_id} → {status}")

    finally:
        db.close()


def main():
    print("[worker] started, waiting for events...")

    while True:
        _, event_id = redis_client.brpop(QUEUE_NAME)
        deliver_event(int(event_id))


if __name__ == "__main__":
    main()
