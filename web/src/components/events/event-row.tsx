"use client"

import { formatDistanceToNow } from "date-fns"

import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
} from "lucide-react"

import { cn } from "@/lib/utils"

import type { Event } from "@/types/event"

type Props = {
  event: Event
  selected?: boolean
  onClick?: () => void
}

function StatusIcon({
  status,
}: {
  status: string
}) {
  if (status === "delivered") {
    return (
      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
    )
  }

  if (status === "failed") {
    return (
      <AlertTriangle className="h-4 w-4 text-rose-500" />
    )
  }

  return (
    <Clock3 className="h-4 w-4 text-amber-500" />
  )
}

export function EventRow({
  event,
  selected,
  onClick,
}: Props) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "grid h-[58px] w-full grid-cols-[120px_1fr_120px_120px_140px] items-center border-b border-border px-4 text-left transition-all",
        selected
          ? "bg-accent"
          : "hover:bg-accent/40"
      )}
    >
      {/* Status */}
      <div className="flex items-center gap-2">
        <StatusIcon
          status={event.status}
        />

        <span className="text-xs capitalize text-muted-foreground">
          {event.status}
        </span>
      </div>

      {/* Route */}
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">
          {event.route}
        </p>

        <p className="truncate text-xs text-muted-foreground">
          {event.event_type ||
            "unknown.event"}
        </p>
      </div>

      {/* Provider */}
      <div className="text-xs text-muted-foreground">
        {event.provider ||
          "generic"}
      </div>

      {/* Attempts */}
      <div className="text-xs text-muted-foreground">
        {event.attempt_count ?? 0}
      </div>

      {/* Time */}
      <div className="text-xs text-muted-foreground">
        {event.created_at
          ? formatDistanceToNow(
              new Date(
                event.created_at
              ),
              {
                addSuffix: true,
              }
            )
          : "-"}
      </div>
    </button>
  )
}