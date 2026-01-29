import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { StatusBadge } from "./status-badge";
  import { ReplayButton } from "./replay-button";
  
  type Event = {
    id: number;
    route: string;
    provider: string | null;
    status: "pending" | "delivered" | "failed";
    attempt_count: number;
    created_at: string;
  };
  
  export function EventsTable({ events }: { events: Event[] }) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Route</TableHead>
            <TableHead>Provider</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Attempts</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
  
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell className="font-mono">{event.id}</TableCell>
              <TableCell>{event.route}</TableCell>
              <TableCell>{event.provider ?? "generic"}</TableCell>
              <TableCell>
                <StatusBadge status={event.status} />
              </TableCell>
              <TableCell>{event.attempt_count}</TableCell>
              <TableCell>
                {new Date(event.created_at).toLocaleString()}
              </TableCell>
              <TableCell className="text-right">
                <ReplayButton eventId={event.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
  