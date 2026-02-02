from fastapi import APIRouter, Query, HTTPException
from sqlalchemy import text
from database import SessionLocal

router = APIRouter(prefix="/events", tags=["events"])


#  LIST EVENTS 
@router.get("/")
def list_events(
    status: str | None = None,
    limit: int = Query(50, le=200),
    offset: int = 0,
):
    db = SessionLocal()
    try:
        base_query = """
            SELECT
                id,
                token,
                route,
                status,
                attempt_count,
                last_error,
                created_at
            FROM webhook_events
        """

        params = {
            "limit": limit,
            "offset": offset,
        }

        if status:
            base_query += " WHERE status = :status"
            params["status"] = status

        base_query += """
            ORDER BY created_at DESC
            LIMIT :limit OFFSET :offset
        """

        rows = db.execute(text(base_query), params).mappings().all()

        return {
            "items": [dict(r) for r in rows],
            "limit": limit,
            "offset": offset,
        }
    finally:
        db.close()