

import { notFound } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { ReplayButton } from "@/components/ReplayButton";
import { EventLiveView } from "@/components/EventLiveView";
import { EventHeader } from "@/components/events/event-header";
import { JsonViewer } from "@/components/events/json-viewer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Event = {
  id: number;
  token: string;
  route: string;
  provider: string | null;
  status: string;
  attempt_count: number;
  headers: Record<string, unknown>;
  payload: Record<string, unknown>;
  created_at: string;
  delivery_target?: string | null;
  idempotency_key?: string | null;
  last_error?: string | null;
};

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  if (!id || Number.isNaN(Number(id))) {
    notFound();
  }

  

  let event: Event | null = null;

  try {
    event = await apiFetch<Event>(`/events/${id}`);
  } catch (err) {
    console.error("Failed to fetch event", err);
  }

  if (!event) {
    return (
      <div className="p-6">
        <h1 className="text-lg font-semibold">Event not found</h1>
      </div>
    );
  }

  
  return (
    <div className="p-6 space-y-6">
     <div className="flex items-start justify-between gap-4">
        <EventHeader
          event={{
            id: event.id,
            route: event.route,
            provider: event.provider,
            status: event.status as "pending" | "delivered" | "failed",
            attempt_count: event.attempt_count,
            created_at: event.created_at,
          }}
        />
        <div className="flex items-center gap-3">
          <EventLiveView event={event} />
          <ReplayButton eventId={event.id} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="text-sm text-muted-foreground">Route</div>
              <div className="font-medium">{event.route}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Token</div>
              <div className="font-medium">{event.token}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Provider</div>
              <div className="font-medium">{event.provider ?? "generic"}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Created</div>
              <div className="font-medium">
                {new Date(event.created_at).toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Attempts</div>
              <div className="font-medium">{event.attempt_count}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Delivery Target</div>
              <div className="font-medium">
                {event.delivery_target ?? "Not set"}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Idempotency Key</div>
              <div className="font-medium">
                {event.idempotency_key ?? "None"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {event.last_error ? (
        <Card>
          <CardHeader>
            <CardTitle>Last Error</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm text-red-500 whitespace-pre-wrap">
              {event.last_error}
            </pre>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <JsonViewer
          title="Payload"
          data={event.payload as Record<string, unknown>}
        />
        <JsonViewer
          title="Headers"
          data={event.headers as Record<string, unknown>}
        />
      </div>
    </div>
  );
}

