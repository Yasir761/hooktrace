
export const dynamic = "force-dynamic"
export const runtime = "nodejs"

import { promRangeQuery } from "@/lib/prometheus"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Fetch all metrics in parallel - exactly matching your page.tsx queries
    const [latency, retries, rejected, incoming, delivered, failed] = 
      await Promise.all([
        promRangeQuery(
          "histogram_quantile(0.95, rate(hooktrace_delivery_latency_seconds_bucket[5m])) or vector(0)"
        ),
        promRangeQuery(
          "rate(hooktrace_events_retried_total[5m]) or vector(0)"
        ),
        promRangeQuery(
          "rate(hooktrace_events_failed_total[5m]) or vector(0)"
        ),
        promRangeQuery(
          "rate(hooktrace_webhooks_received_total[5m]) or vector(0)"
        ),
        promRangeQuery(
          "increase(hooktrace_events_delivered_total[5m]) or vector(0)"
        ),
        promRangeQuery(
          "increase(hooktrace_events_failed_total[5m]) or vector(0)"
        ),
      ])

    return Response.json({
      latency,
      retries,
      rejected,
      incoming,
      delivered,
      failed,
      timestamp: Date.now(),
    })
  } catch (error) {
    console.error("Failed to fetch metrics:", error)
    return Response.json(
      { error: "Failed to fetch metrics" },
      { status: 500 }
    )
  }
}