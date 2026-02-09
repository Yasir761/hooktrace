import { notFound } from "next/navigation"
import { format } from "date-fns"

import { apiFetch } from "@/lib/api"
import { ReplayButton } from "@/components/ReplayButton"
import { EventLiveView } from "@/components/EventLiveView"
import { EventHeader } from "@/components/events/event-header"
import { JsonViewer } from "@/components/events/json-viewer"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type Event = {
  id: number
  token: string
  route: string
  provider: string | null
  status: "pending" | "delivered" | "failed" | "retrying"
  attempt_count: number
  headers: Record<string, unknown>
  payload: Record<string, unknown>
  created_at: string
  delivery_target?: string | null
  idempotency_key?: string | null
  last_error?: string | null
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id

  if (!id || Number.isNaN(Number(id))) notFound()

  let event: Event | null = null

  try {
    event = await apiFetch<Event>(`/events/${id}`)
  } catch {
    notFound()
  }

  if (!event) notFound()

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 space-y-8">
      {/* Header + Actions */}
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <EventHeader
          event={{
            id: event.id,
            route: event.route,
            provider: event.provider,
            status:
              event.status === "retrying" ? "pending" : event.status,
            attempt_count: event.attempt_count,
            created_at: event.created_at,
          }}
        />

        <div className="flex items-center gap-3">
          <EventLiveView event={event} />
          <ReplayButton eventId={event.id} />
        </div>
      </div>

      {/* Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
        </CardHeader>

        <CardContent>
          <dl className="grid gap-6 md:grid-cols-3">
            <Meta label="Route" value={event.route} />
            <Meta label="Token" value={event.token} />
            <Meta label="Provider" value={event.provider ?? "generic"} />
            <Meta
              label="Created"
              value={format(
                new Date(event.created_at),
                "yyyy-MM-dd HH:mm:ss"
              )}
            />
            <Meta label="Attempts" value={event.attempt_count} />
            <Meta
              label="Delivery Target"
              value={event.delivery_target ?? "Not set"}
            />
            <Meta
              label="Idempotency Key"
              value={event.idempotency_key ?? "None"}
            />
          </dl>
        </CardContent>
      </Card>

      {/* Error */}
      {event.last_error && (
        <Card className="border-destructive/40">
          <CardHeader>
            <CardTitle className="text-destructive">
              Last Delivery Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap text-sm text-destructive">
              {event.last_error}
            </pre>
          </CardContent>
        </Card>
      )}

      {/* Payload / Headers */}
      <section className="grid gap-6 lg:grid-cols-2">
        <JsonViewer
          title="Payload"
          data={event.payload}
        />
        <JsonViewer
          title="Headers"
          data={event.headers}
        />
      </section>
    </div>
  )
}

/* ---------------- Helpers ---------------- */

function Meta({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 font-medium text-sm break-all">
        {value}
      </dd>
    </div>
  )
}
