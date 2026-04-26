import json
import requests


def deliver_slack(config, payload):
    webhook_url = config.get("webhookUrl") or config.get("webhook_url")
    if not webhook_url:
        raise ValueError("Missing Slack webhook URL")

    summary = payload.get("event", "webhook.event")
    provider = payload.get("provider", "unknown")

    text = f"HookTrace event: {summary} (provider: {provider})"

    channel = config.get("channel")
    mention = config.get("mentionOnError") or config.get("mention_on_error")
    message = {
        "text": f"{mention + ' ' if mention else ''}{text}",
    }
    if channel:
        message["channel"] = channel

    resp = requests.post(webhook_url, json=message, timeout=10)

    return {
        "status_code": resp.status_code,
        "body": resp.text[:2000] if resp.text else json.dumps(message),
        "duration_ms": 0,
    }
