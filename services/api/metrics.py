from prometheus_client import (
    Counter,
    Histogram,
)


webhooks_received = Counter(
    "hooktrace_webhooks_received_total",
    "Total number of webhooks received",
    ["provider", "route"]
)

webhooks_deduplicated = Counter(
    "hooktrace_webhooks_deduplicated_total",
    "Duplicate webhooks ignored"
)

webhooks_invalid_signature = Counter(
    "hooktrace_webhooks_invalid_signature_total",
    "Webhooks rejected due to invalid signature"
)


events_delivered = Counter(
    "hooktrace_events_delivered_total",
    "Total successfully delivered events",
)

events_failed = Counter(
    "hooktrace_events_failed_total",
    "Total failed events",
)

events_retried = Counter(
    "hooktrace_events_retried_total",
    "Total retried events",
)

delivery_latency = Histogram(
    "hooktrace_delivery_latency_seconds",
    "Webhook delivery latency",
)