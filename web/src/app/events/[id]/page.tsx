import { apiFetch } from "@/lib/api";
import { EventHeader } from "@/components/events/event-header";
import { JsonViewer } from "@/components/events/json-viewer";
import { Button } from "@/components/ui/button";

/* ---------- Types ---------- */
type Event = {
  id: number;
  route: string;
  provider: string | null;
  status: "pending" | "delivered" | "failed";
  attempt_count: number;
  created_at: string;
  headers: unknown;
  payload: unknown;
  delivery_target: string | null;
  last_error: string | null;
};

/* ---------- Server Action ---------- */
async function replayAction(formData: FormData) {
  "use server";

  const id = formData.get("id");
  if (!id) return;

  await apiFetch(`/events/${id}/replay`, {
    method: "POST",
  });
}

/* ---------- Page ---------- */
export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await apiFetch<Event>(`/events/${id}`);

  return (
    <div className="p-6 space-y-6">
      <EventHeader event={event} />

      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">
          Attempts: {event.attempt_count}
        </span>

        <form action={replayAction}>
          <input type="hidden" name="id" value={event.id} />

          <Button
            variant="outline"
            size="sm"
            disabled={event.status === "pending"}
          >
            Replay
          </Button>
        </form>

        {event.delivery_target && (
          <span className="text-sm text-muted-foreground">
            Target: {event.delivery_target}
          </span>
        )}
      </div>

      {event.last_error && (
        <div className="rounded-md border border-destructive bg-destructive/5 p-4">
          <p className="text-sm font-medium text-destructive">Last Error</p>
          <p className="mt-1 text-sm">{event.last_error}</p>
        </div>
      )}

      <JsonViewer title="Headers" data={event.headers} />
      <JsonViewer title="Payload" data={event.payload} />
    </div>
  );
}
