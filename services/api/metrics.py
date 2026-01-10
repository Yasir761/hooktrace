from prometheus_client import Counter, Histogram

webhooks_received = Counter(
    "webhooks_received_total",
    "Total number of webhooks received",
    ["token", "route"]
)

webhooks_deduplicated = Counter(
    "webhooks_deduplicated_total",
    "Duplicate webhooks ignored"
)

webhooks_invalid_signature = Counter(
    "webhooks_invalid_signature_total",
    "Webhooks rejected due to invalid signature"
)
