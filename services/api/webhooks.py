
# """
# Webhook Receiver & Router
# Connects frontend integrations to backend provider handlers
# """


# from fastapi import APIRouter, Request, Header, HTTPException
# from sqlalchemy import text
# from typing import Optional
# import json
# import secrets

# from .database import SessionLocal
# from ..tunnels.tunnel_manager import forward_to_tunnels
# from ..worker.delivery_targets_router import route_webhook_to_targets

# router = APIRouter(prefix="/webhook", tags=["webhooks"])


# token = "wh_" + secrets.token_urlsafe(16)

# # -----------------------------
# # Webhook Receiver Endpoint
# # -----------------------------
# @router.post("/{token}")
# async def receive_webhook(
#     request: Request,
#     token: str,
#    x_stripe_signature: Optional[str] = Header(None),
#     x_hub_signature_256: Optional[str] = Header(None),
#     x_shopify_hmac_sha256: Optional[str] = Header(None),
# ):

#     db = SessionLocal()

#     try:

#         # Read raw body (important for signature verification later)
#         body = await request.body()
#         payload = json.loads(body)
#         headers = dict(request.headers)

#         # -----------------------------
#         # Lookup webhook route by token
#         # -----------------------------
#         route = db.execute(
#             text("""
#                 SELECT id, user_id, provider
#                 FROM webhook_routes
#                 WHERE token = :token
#             """),
#             {"token": token}
#         ).fetchone()

#         if not route:
#             raise HTTPException(status_code=404, detail="Invalid webhook token")

#         route_id = route[0]
#         user_id = route[1]
#         provider = route[2]

#         # -----------------------------
#         # Determine event type
#         # -----------------------------
#         event_type = None

#         if provider == "stripe":
#             event_type = payload.get("type")

#         elif provider == "github":
#             event_type = headers.get("x-github-event")

#         elif provider == "shopify":
#             event_type = headers.get("x-shopify-topic")

#         elif provider == "slack":
#             event_type = payload.get("type")

#         elif provider == "discord":
#             event_type = payload.get("t")

#         # -----------------------------
#         # Store webhook event
#         # -----------------------------
#         result = db.execute(
#             text("""
#                 INSERT INTO webhook_events
#                 (route_id, provider, event_type, payload, headers, status)
#                 VALUES (:route_id, :provider, :event_type, :payload, :headers, 'received')
#                 RETURNING id
#             """),
#             {
#                 "route_id": route_id,
#                 "provider": provider,
#                 "event_type": event_type,
#                 "payload": json.dumps(payload),
#                 "headers": json.dumps(headers),
#             }
#         )

#         event_id = result.fetchone()[0]
#         db.commit()

#         # -----------------------------
#         # Forward to Dev Mode tunnels
#         # -----------------------------
#         tunnel_result = None

#         try:

#             tunnel_result = await forward_to_tunnels(
#                 user_id=user_id,
#                 provider=provider,
#                 payload=payload,
#                 headers=headers
#             )

#         except Exception as e:

#             print("Tunnel forwarding failed:", e)

#         # -----------------------------
#         # Process webhook
#         # -----------------------------
#         try:

#             handler = get_provider_handler(provider)

#             if handler:

#                 await handler(payload, headers)

#                 db.execute(
#                     text("""
#                         UPDATE webhook_events
#                         SET status = 'processed',
#                             processed_at = CURRENT_TIMESTAMP
#                         WHERE id = :id
#                     """),
#                     {"id": event_id}
#                 )

#                 db.commit()

#                 # Deliver to targets
#                 delivery_result = route_webhook_to_targets(
#                     user_id=user_id,
#                     webhook_data=payload,
#                     provider=provider
#                 )

#                 return {
#                     "success": True,
#                     "event_id": event_id,
#                     "provider": provider,
#                     "event_type": event_type,
#                     "delivery": delivery_result,
#                     "tunnels": tunnel_result
#                 }

#             else:

#                 return {
#                     "success": True,
#                     "event_id": event_id,
#                     "provider": provider,
#                     "event_type": event_type,
#                     "tunnels": tunnel_result,
#                     "message": "Webhook received but no handler configured"
#                 }

#         except Exception as e:

#             db.execute(
#                 text("""
#                     UPDATE webhook_events
#                     SET status = 'error',
#                         last_error = :error,
#                         attempt_count = attempt_count + 1
#                     WHERE id = :id
#                 """),
#                 {"id": event_id, "error": str(e)}
#             )

#             db.commit()

#             return {
#                 "success": True,
#                 "event_id": event_id,
#                 "error": str(e),
#                 "tunnels": tunnel_result
#             }

#     except Exception as e:

#         db.rollback()
#         raise HTTPException(status_code=500, detail=str(e))

#     finally:

#         db.close()


# # -----------------------------
# # Provider Handler Loader
# # -----------------------------
# def get_provider_handler(provider: str):
#     try:
#         module = __import__(f"services.api.providers.{provider}", fromlist=[f"handle_{provider}_webhook"])
#         return getattr(module, f"handle_{provider}_webhook")
#     except Exception:
#         return None





"""
Webhook Receiver & Router
Connects frontend integrations to backend provider handlers
"""

from fastapi import APIRouter, Request, Header, HTTPException
from sqlalchemy import text
from typing import Optional
import json

from .database import SessionLocal
from ..tunnels.tunnel_manager import forward_to_tunnels
from ..worker.delivery_targets_router import route_webhook_to_targets

router = APIRouter(prefix="/webhook", tags=["webhooks"])


@router.post("/{token}")
async def receive_webhook(
    request: Request,
    token: str,
    x_stripe_signature: Optional[str] = Header(None),
    x_hub_signature_256: Optional[str] = Header(None),
    x_shopify_hmac_sha256: Optional[str] = Header(None),
):
    db = SessionLocal()

    try:
        # -----------------------------
        # Parse request safely
        # -----------------------------
        body = await request.body()
        payload = json.loads(body) if body else {}
        headers = dict(request.headers)

        # -----------------------------
        # Lookup route
        # -----------------------------
        route = db.execute(
            text("""
                SELECT id, user_id, provider
                FROM webhook_routes
                WHERE token = :token
            """),
            {"token": token}
        ).fetchone()

        if not route:
            raise HTTPException(status_code=404, detail="Invalid webhook token")

        route_id = route[0]
        user_id = route[1]
        provider = route[2]

        # -----------------------------
        # Fallback provider detection
        # -----------------------------
        if not provider:
            if "type" in payload:
                provider = "stripe"
            elif "event" in payload:
                provider = "supabase"
            elif "hook" in payload:
                provider = "shopify"
            else:
                provider = "unknown"

        # -----------------------------
        # Detect event type
        # -----------------------------
        event_type = None

        if provider == "stripe":
            event_type = payload.get("type")

        elif provider == "github":
            event_type = headers.get("x-github-event")

        elif provider == "shopify":
            event_type = headers.get("x-shopify-topic")

        elif provider == "slack":
            event_type = payload.get("type")

        elif provider == "discord":
            event_type = payload.get("t")

        else:
            event_type = payload.get("type") or payload.get("event")

        # -----------------------------
        # Store event
        # -----------------------------
        result = db.execute(
            text("""
                INSERT INTO webhook_events
                (route_id, provider, event_type, payload, headers, status)
                VALUES (:route_id, :provider, :event_type, :payload, :headers, 'received')
                RETURNING id
            """),
            {
                "route_id": route_id,
                "provider": provider,
                "event_type": event_type,
                "payload": json.dumps(payload),
                "headers": json.dumps(headers),
            }
        )

        event_id = result.fetchone()[0]
        db.commit()

        # -----------------------------
        # Forward to tunnels (dev mode)
        # -----------------------------
        tunnel_result = None

        try:
            tunnel_result = await forward_to_tunnels(
                user_id=user_id,
                provider=provider,
                payload=payload,
                headers=headers
            )
        except Exception as e:
            print("Tunnel forwarding failed:", e)

        # -----------------------------
        # ALWAYS deliver (core feature)
        # -----------------------------
        delivery_result = route_webhook_to_targets(
            user_id=user_id,
            webhook_data=payload,
            provider=provider
        )

        # -----------------------------
        # OPTIONAL handler
        # -----------------------------
        handler = get_provider_handler(provider)

        if handler:
            try:
                await handler(payload, headers)

                db.execute(
                    text("""
                        UPDATE webhook_events
                        SET status = 'processed',
                            processed_at = CURRENT_TIMESTAMP
                        WHERE id = :id
                    """),
                    {"id": event_id}
                )
                db.commit()

            except Exception as e:
                print("Handler error:", e)

        # -----------------------------
        # FINAL RESPONSE
        # -----------------------------
        return {
            "success": True,
            "event_id": event_id,
            "provider": provider,
            "event_type": event_type,
            "delivery": delivery_result,
            "tunnels": tunnel_result,
            "handler": "executed" if handler else "not_configured"
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        db.close()


# -----------------------------
# Provider Handler Loader
# -----------------------------
def get_provider_handler(provider: str):
    try:
        module = __import__(
            f"services.api.providers.{provider}",
            fromlist=[f"handle_{provider}_webhook"]
        )
        return getattr(module, f"handle_{provider}_webhook")
    except Exception:
        return None