import json


def deliver_email(config, payload):
    recipients = config.get("recipients")
    if not recipients:
        raise ValueError("Missing email recipients")

    # Placeholder implementation: hook into your mail provider here.
    subject = config.get("subject") or "HookTrace webhook event"
    include_payload = bool(config.get("includePayload"))

    body = {
        "subject": subject,
        "recipients": recipients,
        "payload": payload if include_payload else {"event": payload.get("event")},
    }

    return {
        "status_code": 200,
        "body": json.dumps({"queued": True, **body})[:2000],
        "duration_ms": 0,
    }
