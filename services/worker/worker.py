import requests
import time
from datetime import datetime, timedelta
from threading import Thread

from sqlalchemy import text
from database import SessionLocal
from redis_client import redis_client

QUEUE_MAIN = "webhook:queue"
QUEUE_RETRY = "webhook:retry"
QUEUE_DLQ = "webhook:dlq"

BASE_DELAY_SECONDS = 5


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

        destination_url = "https://httpbin.org/post"

        try:
            resp = requests.post(
                destination_url,
                json=event["payload"],
                headers=event["headers"],
                timeout=10,
            )

            if resp.status_code < 300:
                db.execute(
                    text("""
                        UPDATE webhook_events
                        SET status = 'delivered'
                        WHERE id = :id
                    """),
                    {"id": event_id},
                )
                db.commit()
                print(f"[worker] Event {event_id} → delivered")
                return

            raise Exception(f"HTTP {resp.status_code}")

        except Exception as e:
            attempt = event["attempt_count"] + 1
            max_retries = event["max_retries"]

            if attempt < max_retries:
                print(f"[worker] Event {event_id} retry {attempt}/{max_retries}")
                db.execute(
                    text("""
                        UPDATE webhook_events
                        SET last_error = :error
                        WHERE id = :id
                    """),
                    {"error": str(e), "id": event_id},
                )
                schedule_retry(db, event_id, attempt)
                redis_client.lpush(QUEUE_RETRY, str(event_id))
            else:
                print(f"[worker] Event {event_id} → DLQ")
                db.execute(
                    text("""
                        UPDATE webhook_events
                        SET status = 'failed', last_error = :error
                        WHERE id = :id
                    """),
                    {"error": str(e), "id": event_id},
                )
                db.commit()
                redis_client.lpush(QUEUE_DLQ, str(event_id))

    finally:
        db.close()

def schedule_retry(db, event_id: int, attempt: int):
    delay = BASE_DELAY_SECONDS * (2 ** (attempt - 1))
    next_retry_at = datetime.utcnow() + timedelta(seconds=delay)

    db.execute(
        text("""
            UPDATE webhook_events
            SET
                attempt_count = :attempt,
                next_retry_at = :next_retry_at,
                status = 'pending'
            WHERE id = :id
        """),
        {
            "attempt": attempt,
            "next_retry_at": next_retry_at,
            "id": event_id,
        },
    )
    db.commit()

def retry_scheduler():
    print("[worker] retry scheduler started")

    while True:
        db = SessionLocal()
        try:
            rows = db.execute(
                text("""
                    SELECT id FROM webhook_events
                    WHERE status = 'pending'
                    AND next_retry_at IS NOT NULL
                    AND next_retry_at <= NOW()
                """)
            ).fetchall()

            for row in rows:
                redis_client.lpush(QUEUE_MAIN, str(row.id))
                db.execute(
                    text("""
                        UPDATE webhook_events
                        SET next_retry_at = NULL
                        WHERE id = :id
                    """),
                    {"id": row.id},
                )

            db.commit()
        finally:
            db.close()

        time.sleep(5)


def main():
    print("[worker] started, waiting for events...")

    Thread(target=retry_scheduler, daemon=True).start()

    while True:
        _, event_id = redis_client.brpop(QUEUE_MAIN)
        deliver_event(int(event_id))

    

if __name__ == "__main__":
    main()
