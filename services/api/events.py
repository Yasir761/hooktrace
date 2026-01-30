from fastapi import APIRouter, Query, HTTPException
from sqlalchemy import text
from database import SessionLocal

router = APIRouter(prefix="/events", tags=["events"])


#  LIST EVENTS 
@router.get("/")
def list_events(
    limit: int = Query(50, le=200),
    offset: int = 0,
):
    db = SessionLocal()
    try:
        rows = db.execute(
            text("""
                SELECT
                    id,
                    token,
                    route,
                    status,
                    created_at
                FROM webhook_events
                ORDER BY created_at DESC
                LIMIT :limit OFFSET :offset
            """),
            {"limit": limit, "offset": offset},
        ).mappings().all()

        return {
            "items": [dict(r) for r in rows],  #  THIS LINE
            "limit": limit,
            "offset": offset,
        }
    finally:
        db.close()


#  EVENT DETAIL
@router.get("/{event_id}")
def get_event(event_id: int):
    db = SessionLocal()
    try:
        row = db.execute(
            text("""
                SELECT
                    id,
                    token,
                    route,
                    status,
                    headers,
                    payload,
                    created_at,
                    last_error
                FROM webhook_events
                WHERE id = :id
            """),
            {"id": event_id},
        ).mappings().first()

        if not row:
            raise HTTPException(status_code=404, detail="Event not found")

        return dict(row)  
    finally:
        db.close()
