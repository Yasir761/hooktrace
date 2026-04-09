import stripe
from fastapi import Request


def verify(request: Request, secret: str) -> bool:
    """
    Verify Stripe webhook signature.
    Uses raw body + Stripe-Signature header.
    """
    payload = request.state.raw_body
    sig_header = request.headers.get("stripe-signature")

    if not sig_header:
        return False

    try:
        stripe.Webhook.construct_event(
            payload=payload,
            sig_header=sig_header,
            secret=secret,
        )
        return True
    except stripe.error.SignatureVerificationError:
        return False
    except Exception:
        return False


def extract_event_type(payload: dict) -> str:
    """
    Stripe event type, e.g. payment_intent.succeeded
    """
    return payload.get("type", "unknown")




async def handle_stripe_webhook(payload: dict, headers: dict):
    """
    Stripe webhook handler
    """
    event_type = payload.get("type")

    print(f"[stripe] received event: {event_type}")

    # Example processing logic
    if event_type == "payment_intent.succeeded":
        print("Payment succeeded")

    return {
        "provider": "stripe",
        "event_type": event_type
    }
