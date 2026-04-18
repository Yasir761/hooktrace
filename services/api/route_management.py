# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy import text
# from .database import SessionLocal
# from .auth import get_current_user
# import secrets

# router = APIRouter(prefix="/routes", tags=["routes"])


# @router.get("/")
# def list_routes(user_id: str = Depends(get_current_user)):
#     db = SessionLocal()
#     try:
#         rows = db.execute(
#             text("""
#                 SELECT id, token, route, mode, dev_target, prod_target, created_at
#                 FROM webhook_routes
#                 WHERE user_id = :user_id
#                 ORDER BY created_at DESC
#             """),
#             {"user_id": user_id}
#         ).mappings().all()

#         return {"items": [dict(r) for r in rows]}
#     finally:
#         db.close()


# @router.post("/")
# def create_route(
#     payload: dict,
#     user_id: str = Depends(get_current_user)
# ):
#     route_name = payload.get("route")
#     mode = payload.get("mode", "dev")
#     dev_target = payload.get("dev_target")
#     prod_target = payload.get("prod_target")

#     if not route_name:
#         raise HTTPException(status_code=400, detail="Route required")

#     token = secrets.token_hex(8)
#     secret = secrets.token_hex(16)

#     db = SessionLocal()
#     try:
#         # check user exists
#     user = db.execute(
#      text("SELECT id FROM users WHERE id = :id"),
#      {"id": user_id}
#       ).fetchone()

#     if not user:
#     raise HTTPException(status_code=400, detail="User not found")
#         db.execute(
#             text("""
#                 INSERT INTO webhook_routes
#                 (token, route, secret, mode, dev_target, prod_target, user_id)
#                 VALUES (:token, :route, :secret, :mode, :dev_target, :prod_target, :user_id)
#             """),
#             {
#                 "token": token,
#                 "route": route_name,
#                 "secret": secret,
#                 "mode": mode,
#                 "dev_target": dev_target,
#                 "prod_target": prod_target,
#                 "user_id": user_id,
#             }
#         )

#         db.commit()

#         return {
#             "token": token,
#             "route": route_name,
#             "secret": secret,
#         }

#     finally:
#         db.close()








# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy import text
# from .database import SessionLocal
# from .auth import get_current_user
# import secrets

# router = APIRouter(prefix="/routes", tags=["routes"])


# @router.get("/")
# def list_routes(user_id: str = Depends(get_current_user)):
#     db = SessionLocal()
#     try:
#         rows = db.execute(
#             text("""
#                 SELECT id, token, route, mode, dev_target, prod_target, created_at
#                 FROM webhook_routes
#                 WHERE user_id = :user_id
#                 ORDER BY created_at DESC
#             """),
#             {"user_id": user_id}
#         ).mappings().all()

#         return {"items": [dict(r) for r in rows]}
#     finally:
#         db.close()


# @router.post("/")
# def create_route(
#     payload: dict,
#     user_id: str = Depends(get_current_user)
# ):
#     route_name = payload.get("route")
#     mode = payload.get("mode", "dev")
#     dev_target = payload.get("dev_target")
#     prod_target = payload.get("prod_target")

#     if not route_name:
#         raise HTTPException(status_code=400, detail="Route required")

#     token = secrets.token_hex(8)
#     secret = secrets.token_hex(16)

#     db = SessionLocal()
#     try:
#         # check user exists
#         user = db.execute(
#             text("SELECT id FROM users WHERE id = :id"),
#             {"id": user_id}
#         ).fetchone()

#         if not user:
#             raise HTTPException(status_code=400, detail="User not found")

#         db.execute(
#             text("""
#                 INSERT INTO webhook_routes
#                 (token, route, secret, mode, dev_target, prod_target, user_id)
#                 VALUES (:token, :route, :secret, :mode, :dev_target, :prod_target, :user_id)
#             """),
#             {
#                 "token": token,
#                 "route": route_name,
#                 "secret": secret,
#                 "mode": mode,
#                 "dev_target": dev_target,
#                 "prod_target": prod_target,
#                 "user_id": user_id,
#             }
#         )

#         db.commit()

#         return {
#             "token": token,
#             "route": route_name,
#             "secret": secret,
#         }

#     finally:
#         db.close()







from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from .database import SessionLocal
from .auth import get_current_user
import secrets

router = APIRouter(prefix="/routes", tags=["routes"])


@router.get("/")
def list_routes(user_id: str = Depends(get_current_user)):
    db = SessionLocal()
    try:
        rows = db.execute(
            text("""
                SELECT id, token, route, mode, dev_target, prod_target, created_at
                FROM webhook_routes
                WHERE user_id = :user_id
                ORDER BY created_at DESC
            """),
            {"user_id": user_id}
        ).mappings().all()

        return {"items": [dict(r) for r in rows]}
    finally:
        db.close()


@router.post("/")
def create_route(
    payload: dict,
    user_id: str = Depends(get_current_user)
):
    route_name = payload.get("route")
    mode = payload.get("mode", "dev")
    dev_target = payload.get("dev_target")
    prod_target = payload.get("prod_target")

    if not route_name:
        raise HTTPException(status_code=400, detail="Route required")

    token = secrets.token_hex(8)
    secret = secrets.token_hex(16)

    db = SessionLocal()
    try:
        # check user exists
        user = db.execute(
            text("SELECT id FROM users WHERE id = :id"),
            {"id": user_id}
        ).fetchone()

        if not user:
            raise HTTPException(status_code=400, detail="User not found")

        #  FETCH ACTIVE TUNNEL (NEW)
        tunnel = db.execute(
            text("""
                SELECT id FROM dev_tunnels
                WHERE user_id = :user_id
                AND status = 'active'
                ORDER BY created_at DESC
                LIMIT 1
            """),
            {"user_id": user_id}
        ).fetchone()

        tunnel_id = tunnel[0] if tunnel else None

        #  Optional safety check (recommended)
        if not tunnel_id:
            raise HTTPException(
                status_code=400,
                detail="No active tunnel found. Please create a tunnel first."
            )

        # INSERT ROUTE WITH TUNNEL LINK
        db.execute(
            text("""
                INSERT INTO webhook_routes
                (token, route, secret, mode, dev_target, prod_target, user_id, tunnel_id)
                VALUES (:token, :route, :secret, :mode, :dev_target, :prod_target, :user_id, :tunnel_id)
            """),
            {
                "token": token,
                "route": route_name,
                "secret": secret,
                "mode": mode,
                "dev_target": dev_target,
                "prod_target": prod_target,
                "user_id": user_id,
                "tunnel_id": tunnel_id,
            }
        )

        db.commit()

        return {
            "token": token,
            "route": route_name,
            "secret": secret,
        }

    finally:
        db.close()

