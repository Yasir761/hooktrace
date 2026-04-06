
"""
Webhook Receiver & Router
Connects frontend integrations to backend provider handlers
"""

# from datetime import datetime
# from typing import Dict, Any, Optional
# import uuid
# import hmac
# import hashlib

# from fastapi import APIRouter, Request, Header, HTTPException, Depends
# from sqlalchemy import text

# from database import SessionLocal
# from auth import get_current_user
# from services.tunnels.tunnel_manager import forward_to_tunnels
# from delivery_targets_router import route_webhook_to_targets





from fastapi import APIRouter, Request, Header, HTTPException, Depends
from sqlalchemy import text
from typing import Optional
import uuid

from .database import SessionLocal
from .auth import get_current_user

from ..tunnels.tunnel_manager import forward_to_tunnels
from ..worker.delivery_targets_router import route_webhook_to_targets

router = APIRouter(prefix="/webhook", tags=["webhooks"])


# -----------------------------
# Webhook Receiver Endpoint
# -----------------------------

@router.post("/{user_identifier}/{provider}")
async def receive_webhook(
    request: Request,
    user_identifier: str,
    provider: str,
    x_stripe_signature: Optional[str] = Header(None),
    x_hub_signature_256: Optional[str] = Header(None),
    x_shopify_hmac_sha256: Optional[str] = Header(None),
):

    db = SessionLocal()

    try:

        body = await request.body()
        payload = await request.json()
        headers = dict(request.headers)

        # Find user
        user = db.execute(
            text("""
                SELECT id FROM users
                WHERE email = :identifier OR id = :identifier
            """),
            {"identifier": user_identifier}
        ).fetchone()

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        user_id = str(user[0])

        # Determine event type
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

        # -----------------------------
        # Store webhook event
        # -----------------------------

        event_id = str(uuid.uuid4())

        db.execute(
            text("""
                INSERT INTO webhook_events
                (id, user_id, provider, event_type, payload, headers, status)
                VALUES (:id, :user_id, :provider, :event_type, :payload, :headers, 'received')
            """),
            {
                "id": event_id,
                "user_id": user_id,
                "provider": provider,
                "event_type": event_type,
                "payload": payload,
                "headers": headers,
            }
        )

        db.commit()

        # -----------------------------
        # Forward to Dev Mode tunnels
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
        # Process webhook asynchronously
        # -----------------------------

        try:

            handler = get_provider_handler(provider)

            if handler:

                result = await handler(payload, headers)

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

                # Forward to delivery targets

                from services.workers.delivery_targets_router import route_webhook_to_targets

                delivery_result = route_webhook_to_targets(
                    user_id=user_id,
                    webhook_data=payload,
                    provider=provider
                )

                return {
                    "success": True,
                    "event_id": event_id,
                    "provider": provider,
                    "event_type": event_type,
                    "delivery": delivery_result,
                    "tunnels": tunnel_result
                }

            else:

                return {
                    "success": True,
                    "event_id": event_id,
                    "provider": provider,
                    "event_type": event_type,
                    "tunnels": tunnel_result,
                    "message": "Webhook received but no handler configured"
                }

        except Exception as e:

            db.execute(
                text("""
                    UPDATE webhook_events
                    SET status = 'error',
                        last_error = :error,
                        attempt_count = attempt_count + 1
                    WHERE id = :id
                """),
                {"id": event_id, "error": str(e)}
            )

            db.commit()

            return {
                "success": True,
                "event_id": event_id,
                "error": str(e),
                "tunnels": tunnel_result
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

        if provider == "stripe":
            from services.providers.stripe import handle_stripe_webhook
            return handle_stripe_webhook

        elif provider == "github":
            from services.providers.github import handle_github_webhook
            return handle_github_webhook

        elif provider == "shopify":
            from services.providers.shopify import handle_shopify_webhook
            return handle_shopify_webhook

        elif provider == "slack":
            from services.providers.slack import handle_slack_webhook
            return handle_slack_webhook

        elif provider == "discord":
            from services.providers.discord import handle_discord_webhook
            return handle_discord_webhook

        elif provider == "notion":
            from services.providers.notion import handle_notion_webhook
            return handle_notion_webhook

        elif provider == "razorpay":
            from services.providers.razorpay import handle_razorpay_webhook
            return handle_razorpay_webhook

        elif provider == "supabase":
            from services.providers.supabase import handle_supabase_webhook
            return handle_supabase_webhook

        else:
            return None

    except ImportError:
        return None