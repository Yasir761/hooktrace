from prometheus_client import Counter

webhooks_received = Counter(
    "hooktrace_webhooks_received_total",
    "Total number of webhooks received",
    ["token", "route"]
)

webhooks_deduplicated = Counter(
    "hooktrace_webhooks_deduplicated_total",
    "Duplicate webhooks ignored"
)

webhooks_invalid_signature = Counter(
    "hooktrace_webhooks_invalid_signature_total",
    "Webhooks rejected due to invalid signature"
)