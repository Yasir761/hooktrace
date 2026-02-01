// import { notFound } from "next/navigation";
// import { apiFetch } from "@/lib/api";
// import { ReplayButton } from "../../../src/components/ReplayButton";
// import { EventLiveView } from "@/components/EventLiveView";

// type Event = {
//   id: number;
//   token: string;
//   route: string;
//   status: string;
//   headers: Record<string, unknown>;
//   payload: Record<string, unknown>;
//   created_at: string;
//   last_error?: string | null;
// };

// export default async function EventDetailPage({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }) {
//   const { id } = await params; 

//   if (!id || id === "undefined") {
//     notFound();
//   }

//   let event: Event;

//   try {
//     event = await apiFetch<Event>(`/events/${id}`);
//   } catch {
//     notFound();
//   }

//   return (
//     <div className="p-6 space-y-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-2xl font-bold">Event #{event.id}</h1>
//         {/* <StatusBadge status={event.status} /> */}
//         {/* <EventLiveView event={event} /> */}
//         <div className="border p-2">LIVE VIEW HERE</div>
// <EventLiveView event={event} />

//       </div>

//       <Section title="Route">
//         <code>{event.route}</code>
//       </Section>

//       <Section title="Payload">
//         <JsonBlock value={event.payload} />
//       </Section>

//       <Section title="Headers">
//         <JsonBlock value={event.headers} />
//       </Section>

//       {event.last_error && (
//         <Section title="Last Error">
//           <pre className="text-red-500 text-sm">
//             {event.last_error}
//           </pre>
//         </Section>
//       )}

//       <ReplayButton eventId={event.id} />
//     </div>
//   );
// }

// /* ---------- UI helpers ---------- */

// function Section({
//   title,
//   children,
// }: {
//   title: string;
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="space-y-2">
//       <h2 className="font-semibold text-sm text-muted-foreground">
//         {title}
//       </h2>
//       <div className="rounded-lg border p-3 bg-background">
//         {children}
//       </div>
//     </div>
//   );
// }

// function JsonBlock({ value }: { value: unknown }) {
//   return (
//     <pre className="text-xs overflow-auto">
//       {JSON.stringify(value, null, 2)}
//     </pre>
//   );
// }

// function StatusBadge({ status }: { status: string }) {
//   const color =
//     status === "delivered"
//       ? "bg-green-500"
//       : status === "failed"
//       ? "bg-red-500"
//       : "bg-yellow-500";

//   return (
//     <span className={`px-2 py-1 text-xs rounded text-white ${color}`}>
//       {status}
//     </span>
//   );
// }



import { notFound } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { ReplayButton } from "@/components/ReplayButton";
import { EventLiveView } from "@/components/EventLiveView";

type Event = {
  id: number;
  token: string;
  route: string;
  status: string;
  headers: Record<string, unknown>;
  payload: Record<string, unknown>;
  created_at: string;
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Event #{event.id}</h1>
        <EventLiveView event={event} />
      </div>

      <Section title="Route">
        <code>{event.route}</code>
      </Section>

      <Section title="Payload">
        <JsonBlock value={event.payload} />
      </Section>

      <Section title="Headers">
        <JsonBlock value={event.headers} />
      </Section>

      {event.last_error && (
        <Section title="Last Error">
          <pre className="text-red-500 text-sm">{event.last_error}</pre>
        </Section>
      )}

      <ReplayButton eventId={event.id} />
    </div>
  );
}

/* ---------- UI helpers ---------- */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <h2 className="font-semibold text-sm text-muted-foreground">
        {title}
      </h2>
      <div className="rounded-lg border p-3 bg-background">
        {children}
      </div>
    </div>
  );
}

function JsonBlock({ value }: { value: unknown }) {
  return (
    <pre className="text-xs overflow-auto">
      {JSON.stringify(value, null, 2)}
    </pre>
  );
}
