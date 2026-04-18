from fastapi import APIRouter, HTTPException, status
from sqlalchemy import text
from .database import SessionLocal
from .redis_client import redis_client
import json

router = APIRouter(prefix="/events", tags=["replay"])
QUEUE_MAIN = "webhook:queue"


@router.post("/{event_id}/replay", status_code=status.HTTP_202_ACCEPTED)
def replay_event(event_id: int):
    db = SessionLocal()
    try:
        event = db.execute(
            text("""
                SELECT
                    e.id,
                    e.route_id,
                    r.mode,
                    r.dev_target,
                    r.prod_target
                FROM webhook_events e
                JOIN webhook_routes r
                  ON e.route_id = r.id
                  WHERE e.id = :id
            """),
            {"id": event_id},
        ).mappings().first()

        if not event:
            raise HTTPException(status_code=404, detail="Event not found")

        delivery_target = (
            event["dev_target"]
            if event["mode"] == "dev"
            else event["prod_target"]
        )

        if not delivery_target:
            raise HTTPException(
                status_code=400,
                detail="No delivery target configured for this route",
            )

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
            {
                "id": event_id,
                "target": delivery_target,
            },
        )
        db.commit()

        redis_client.lpush(QUEUE_MAIN, str(event_id))

        return {"replayed": True, "event_id": event_id}

    finally:
        db.close()
