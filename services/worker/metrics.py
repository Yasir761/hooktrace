from prometheus_client import Counter, Histogram

events_delivered = Counter(
    "webhook_events_delivered_total",
    "Successfully delivered webhook events"
)

events_failed = Counter(
    "webhook_events_failed_total",
    "Webhook events permanently failed"
)

events_retried = Counter(
    "webhook_events_retried_total",
    "Webhook delivery retries"
)

delivery_latency = Histogram(
    "webhook_delivery_latency_seconds",
    "Time taken to deliver webhook"
)
