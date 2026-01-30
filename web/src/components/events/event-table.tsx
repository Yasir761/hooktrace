"use client";

import Link from "next/link";

type Event = {
  id: number;
  route: string;
  provider?: string;
  status: string;
  attempt_count: number;
  created_at: string;
};

export function EventsTable({ events }: { events: Event[] }) {
  if (!events.length) {
    return (
      <div className="text-sm text-muted-foreground">
        No events yet.
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <table className="w-full text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">Route</th>
            <th className="p-2 text-left">Provider</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Attempts</th>
            <th className="p-2 text-left">Created</th>
            <th className="p-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id} className="border-t">
              <td className="p-2">{event.id}</td>
              <td className="p-2">{event.route}</td>
              <td className="p-2">{event.provider ?? "-"}</td>
              <td className="p-2">{event.status}</td>
              <td className="p-2">{event.attempt_count}</td>
              <td className="p-2">
                {new Date(event.created_at).toLocaleString()}
              </td>
              <td className="p-2 text-right">
                <Link
                  href={`/events/${event.id}`}
                  className="text-blue-600 hover:underline"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
