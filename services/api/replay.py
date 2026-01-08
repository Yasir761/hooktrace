from fastapi import APIRouter, HTTPException, status
from sqlalchemy import text
from database import SessionLocal
from redis_client import redis_client

router = APIRouter(prefix="/events", tags=["replay"])

QUEUE_MAIN = "webhook:queue"


@router.post("/{event_id}/replay", status_code=status.HTTP_202_ACCEPTED)
def replay_event(event_id: int):
    db = SessionLocal()
    try:
        event = db.execute(
            text("SELECT id FROM webhook_events WHERE id = :id"),
            {"id": event_id},
        ).first()

        if not event:
            raise HTTPException(status_code=404, detail="Event not found")

        db.execute(
            text("""
                UPDATE webhook_events
                SET
                    status = 'pending',
                    attempt_count = 0,
                    last_error = NULL,
                    next_retry_at = NULL
                WHERE id = :id
            """),
            {"id": event_id},
        )
        db.commit()

        redis_client.lpush(QUEUE_MAIN, str(event_id))

        return {"replayed": True, "event_id": event_id}

    finally:
        db.close()
