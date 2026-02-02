// import { apiFetch } from "@/lib/api";
// import { EventsTable } from "@/components/events/event-table";

// type Event = {
//   id: number;
//   route: string;
//   provider: string | null;
//   status: "pending" | "delivered" | "failed";
//   attempt_count: number;
//   created_at: string;
// };

// export default async function EventsPage() {
//   const res = await apiFetch<{ items: Event[] }>("/events");

//   return (
//     <div className="p-6 space-y-4">
//       <h1 className="text-2xl font-semibold">Events</h1>
//       <EventsTable
//         events={
//           res?.items?.map((item) => ({
//             ...item,
//             // Ensure provider is always a string or undefined, not null
//             provider: item.provider === null ? undefined : item.provider,
//           })) ?? []
//         }
//       />
       
//     </div>
//   );
// }



import { apiFetch } from "@/lib/api";
import { EventsTable } from "@/components/events/event-table";
import Link from "next/link";

type Event = {
  id: number;
  route: string;
  provider?: string;
  status: "pending" | "delivered" | "failed";
  attempt_count: number;
  created_at: string;
  last_error?: string;
};

export default async function EventsPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const status = searchParams.status;
  const query = status ? `/events?status=${status}` : "/events";

  const res = await apiFetch<{ items: Event[] }>(query);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Events</h1>

        {/* Tabs */}
        <div className="flex gap-2">
          <Link
            href="/events"
            className={`px-3 py-1 rounded text-sm ${
              !status ? "bg-primary text-white" : "bg-muted"
            }`}
          >
            All
          </Link>

          <Link
            href="/events?status=failed"
            className={`px-3 py-1 rounded text-sm ${
              status === "failed" ? "bg-destructive text-white" : "bg-muted"
            }`}
          >
            DLQ
          </Link>
        </div>
      </div>

      {/* Table */}
      <EventsTable events={res?.items ?? []} />
    </div>
  );
}
