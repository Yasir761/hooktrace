# from fastapi import APIRouter, Query, HTTPException
# from sqlalchemy import text
# from database import SessionLocal

# router = APIRouter(prefix="/events", tags=["events"])


# #  LIST EVENTS 
# @router.get("/")
# def list_events(
#     status: str | None = None,
#     limit: int = Query(50, le=200),
#     offset: int = 0,
# ):
#     db = SessionLocal()
#     try:
#         base_query = """
#             SELECT
#                 id,
#                 token,
#                 route,
#                 provider,
#                 status,
#                 attempt_count,
#                 last_error,
#                 created_at
#             FROM webhook_events
#         """

#         params = {
#             "limit": limit,
#             "offset": offset,
#         }

#         if status:
#             base_query += " WHERE status = :status"
#             params["status"] = status

#         base_query += """
#             ORDER BY created_at DESC
#             LIMIT :limit OFFSET :offset
#         """

#         rows = db.execute(text(base_query), params).mappings().all()

#         return {
#             "items": [dict(r) for r in rows],
#             "limit": limit,
#             "offset": offset,
#         }
#     finally:
#         db.close()


# @router.get("/{event_id}")
# def get_event(event_id: int):
#     db = SessionLocal()
#     try:
#         event = db.execute(
#             text("""
#                 SELECT
#                     id,
#                     token,
#                     route,
#                     provider,
#                     status,
#                     attempt_count,
#                     last_error,
#                     headers,
#                     payload,
#                     delivery_target,
#                     idempotency_key,
#                     created_at
#                 FROM webhook_events
#                 WHERE id = :id
#             """),
#             {"id": event_id},
#         ).mappings().first()

#         if not event:
#             raise HTTPException(status_code=404, detail="Event not found")

#         return dict(event)
#     finally:
#         db.close()




from fastapi import APIRouter, Query, HTTPException, Header
from sqlalchemy import text
from database import SessionLocal

router = APIRouter(prefix="/events", tags=["events"])


def get_user_by_api_key(db, api_key: str):
    user = db.execute(
        text("SELECT id FROM users WHERE api_key = :key"),
        {"key": api_key},
    ).mappings().first()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid API key")

    return user["id"]


# LIST EVENTS (USER ISOLATED)
@router.get("/")
def list_events(
    status: str | None = None,
    limit: int = Query(50, le=200),
    offset: int = 0,
    x_api_key: str = Header(...),
):
    db = SessionLocal()
    try:
        user_id = get_user_by_api_key(db, x_api_key)

        base_query = """
            SELECT
                e.id,
                e.token,
                e.route,
                e.provider,
                e.status,
                e.attempt_count,
                e.last_error,
                e.created_at
            FROM webhook_events e
            JOIN webhook_routes r
              ON e.token = r.token
             AND e.route = r.route
            WHERE r.user_id = :user_id
        """

        params = {
            "user_id": user_id,
            "limit": limit,
            "offset": offset,
        }

        # Status filtering
        if status:
            if status == "dlq":
                base_query += " AND e.status = 'failed' AND e.attempt_count >= 5"
            elif status in ("pending", "delivered", "failed"):
                base_query += " AND e.status = :status"
                params["status"] = status

                if status == "failed":
                    base_query += " AND e.attempt_count < 5"
            else:
                return {"items": [], "limit": limit, "offset": offset}

        base_query += """
            ORDER BY e.created_at DESC
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


# GET SINGLE EVENT (USER ISOLATED)
@router.get("/{event_id}")
def get_event(
    event_id: int,
    x_api_key: str = Header(...),
):
    db = SessionLocal()
    try:
        user_id = get_user_by_api_key(db, x_api_key)

        event = db.execute(
            text("""
                SELECT
                    e.id,
                    e.token,
                    e.route,
                    e.provider,
                    e.status,
                    e.attempt_count,
                    e.last_error,
                    e.headers,
                    e.payload,
                    e.delivery_target,
                    e.idempotency_key,
                    e.created_at
                FROM webhook_events e
                JOIN webhook_routes r
                  ON e.token = r.token
                 AND e.route = r.route
                WHERE e.id = :id
                  AND r.user_id = :user_id
            """),
            {"id": event_id, "user_id": user_id},
        ).mappings().first()

        if not event:
            raise HTTPException(status_code=404, detail="Event not found")

        return dict(event)

    finally:
        db.close()


# DLQ COUNT (USER ISOLATED)
@router.get("/stats/dlq-count")
def get_dlq_count(x_api_key: str = Header(...)):
    db = SessionLocal()
    try:
        user_id = get_user_by_api_key(db, x_api_key)

        result = db.execute(
            text("""
                SELECT COUNT(*) as count
                FROM webhook_events e
                JOIN webhook_routes r
                  ON e.token = r.token
                 AND e.route = r.route
                WHERE r.user_id = :user_id
                  AND e.status = 'failed'
                  AND e.attempt_count >= 5
            """),
            {"user_id": user_id},
        ).fetchone()

        return {"dlq_count": result[0] if result else 0}

    finally:
        db.close()
