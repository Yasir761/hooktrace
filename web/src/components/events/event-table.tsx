// "use client";

// import Link from "next/link";
// import { StatusBadge } from "@/components/events/status-badge";

// type Event = {
//   id: number;
//   route: string;
//   provider?: string;
//   status: string;
//   attempt_count: number;
//   created_at: string;
//   last_error?: string;
// };

// export function EventsTable({ events }: { events: Event[] }) {
//   if (!events.length) {
//     return (
//       <div className="text-sm text-muted-foreground">
//         No events yet.
//       </div>
//     );
//   }

//   return (
//     <div className="rounded-md border">
//       <table className="w-full text-sm">
//         <thead className="bg-muted">
//           <tr>
//             <th className="p-2 text-left">ID</th>
//             <th className="p-2 text-left">Route</th>
//             <th className="p-2 text-left">Provider</th>
//             <th className="p-2 text-left">Status</th>
//             <th className="p-2 text-left">Attempts</th>
//             <th className="p-2 text-left">Created</th>
//             <th className="p-2 text-right">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {events.map((event) => (
//             <tr key={event.id} className="border-t">
//               <td className="p-2">{event.id}</td>
//               <td className="p-2">{event.route}</td>
//               <td className="p-2">{event.provider ?? "-"}</td>
//               <td className="p-2">
//                 <StatusBadge status={event.status as "pending" | "delivered" | "failed"} />
//                 {event.last_error ? (
//                   <div className="text-xs text-red-500 mt-1 line-clamp-1">
//                     {event.last_error}
//                   </div>
//                 ) : null}
//               </td>
//               <td className="p-2">{event.attempt_count}</td>
//               <td className="p-2">
//                 {new Date(event.created_at).toLocaleString()}
//               </td>
//               <td className="p-2 text-right">
//                 <Link
//                   href={`/events/${event.id}`}
//                   className="text-blue-600 hover:underline"
//                 >
//                   View
//                 </Link>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }




"use client"

import Link from "next/link"
import { motion, type Variants } from "framer-motion"
import { Eye, MoreHorizontal, RotateCcw } from "lucide-react"
import { format, formatDistanceToNow } from "date-fns"

import * as DropdownMenu from "@radix-ui/react-dropdown-menu"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { StatusBadge } from "@/components/events/status-badge"

/* ---------------- Types ---------------- */

type Event = {
  id: number
  route: string
  provider?: string
  status: "pending" | "delivered" | "failed"
  attempt_count: number
  created_at: string
  last_error?: string
}

/* ---------------- Motion ---------------- */

const rowFade: Variants = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
}

/* ---------------- Component ---------------- */

export function EventsTable({ events }: { events: Event[] }) {
  if (!events.length) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
        No webhook events yet.
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40">
            <TableHead>ID</TableHead>
            <TableHead>Route</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Attempts</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {events.map((event) => {
            const createdAt = new Date(event.created_at)

            return (
              <motion.tr
                key={event.id}
                variants={rowFade}
                initial="hidden"
                animate="show"
                className="group cursor-pointer border-t transition-colors hover:bg-muted/30"
                onClick={() => {
                  window.location.href = `/events/${event.id}`
                }}
              >
                {/* ID */}
                <TableCell className="font-medium">
                  #{event.id}
                </TableCell>

                {/* Route + provider */}
                <TableCell>
                  <div className="space-y-0.5">
                    <p className="font-mono text-xs">
                      {event.route}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {event.provider ?? "generic"}
                    </p>
                  </div>
                </TableCell>

                {/* Status */}
                <TableCell>
                  <div className="space-y-1">
                    <StatusBadge status={event.status} />
                    {event.last_error && (
                      <p className="max-w-[260px] truncate text-xs text-destructive">
                        {event.last_error}
                      </p>
                    )}
                  </div>
                </TableCell>

                {/* Attempts */}
                <TableCell>
                  {event.attempt_count}
                </TableCell>

                {/* Created */}
                <TableCell>
                  <time
                    className="text-sm text-muted-foreground"
                    title={format(createdAt, "yyyy-MM-dd HH:mm:ss")}
                  >
                    {formatDistanceToNow(createdAt, { addSuffix: true })}
                  </time>
                </TableCell>

                {/* Actions */}
                <TableCell
                  className="text-right"
                  onClick={(e) => e.stopPropagation()}
                >
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                      <button
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md
                                   text-muted-foreground opacity-0 transition
                                   hover:bg-muted group-hover:opacity-100"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </DropdownMenu.Trigger>

                    <DropdownMenu.Content
                      align="end"
                      className="z-50 min-w-[140px] rounded-md border border-border
                                 bg-popover p-1 shadow-md"
                    >
                      <DropdownMenu.Item asChild>
                        <Link
                          href={`/events/${event.id}`}
                          className="flex cursor-pointer items-center gap-2 rounded-sm
                                     px-2 py-1.5 text-sm hover:bg-muted"
                        >
                          <Eye className="h-4 w-4" />
                          View event
                        </Link>
                      </DropdownMenu.Item>

                      {event.status === "failed" && (
                        <DropdownMenu.Item
                          className="flex cursor-pointer items-center gap-2 rounded-sm
                                     px-2 py-1.5 text-sm hover:bg-muted"
                        >
                          <RotateCcw className="h-4 w-4" />
                          Retry
                        </DropdownMenu.Item>
                      )}
                    </DropdownMenu.Content>
                  </DropdownMenu.Root>
                </TableCell>
              </motion.tr>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
