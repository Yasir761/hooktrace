import { apiFetch } from "@/lib/api";
import { EventsTable } from "@/components/events/event-table";

type Event = {
  id: number;
  token: string;
  route: string;
  provider: string | null;
  status: "pending" | "delivered" | "failed";
  attempt_count: number;
  created_at: string;
};

export default async function EventsPage() {
  const events = await apiFetch<Event[]>("/events");

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Events</h1>

      <div className="rounded-md border">
        <EventsTable events={events} />
      </div>
    </div>
  );
}
