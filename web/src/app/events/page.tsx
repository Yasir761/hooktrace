export const dynamic = "force-dynamic"

import { apiFetch } from "@/lib/api"
import { EventsTable } from "@/components/events/event-table"
import { EventsTabs } from "@/components/events/event-tabs"

type Event = {
  id: number
  route: string
  provider?: string
  status: "pending" | "delivered" | "failed"
  attempt_count: number
  created_at: string
  last_error?: string
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams: { status?: string }
}) {
  const status = searchParams.status
  const query = status ? `/events?status=${status}` : "/events"

  const res = await apiFetch<{ items: Event[] }>(query)
  const events = res?.items ?? []

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Webhook Events</h1>
          <p className="text-sm text-muted-foreground">
            Inspect deliveries, failures, retries, and live status updates.
          </p>
        </div>

        <EventsTabs />
      </div>

      {/* Content */}
      {events.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No events found{status ? ` for status "${status}"` : ""}.
          </p>
        </div>
      ) : (
        <EventsTable events={events} />
      )}
    </div>
  )
}
