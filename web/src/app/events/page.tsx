import { apiFetch } from "@/lib/api";
import { EventsTable } from "@/components/events/event-table";

type Event = {
  id: number;
  route: string;
  provider: string | null;
  status: "pending" | "delivered" | "failed";
  attempt_count: number;
  created_at: string;
};

export default async function EventsPage() {
  const res = await apiFetch<{ items: Event[] }>("/events");

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Events</h1>
      <EventsTable
        events={
          res?.items?.map((item) => ({
            ...item,
            // Ensure provider is always a string or undefined, not null
            provider: item.provider === null ? undefined : item.provider,
          })) ?? []
        }
      />
       
    </div>
  );
}
