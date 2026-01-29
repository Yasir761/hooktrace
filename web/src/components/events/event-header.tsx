import { StatusBadge } from "./status-badge";

type Event = {
  id: number;
  route: string;
  provider: string | null;
  status: "pending" | "delivered" | "failed";
  attempt_count: number;
  created_at: string;
};

export function EventHeader({ event }: { event: Event }) {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold">
          Event #{event.id}
        </h1>
        <p className="text-sm text-muted-foreground">
          Route: {event.route} · Provider: {event.provider ?? "generic"}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <StatusBadge status={event.status} />
        <span className="text-sm text-muted-foreground">
          Attempts: {event.attempt_count}
        </span>
      </div>
    </div>
  );
}
