"use client"

import type { Event } from "@/types/event"

import { EventRow } from "./event-row"

type Props = {
  events: Event[]
  selectedEvent: Event | null
  onSelect: (event: Event) => void
}

export function EventStream({
  events,
  selectedEvent,
  onSelect,
}: Props) {
  return (
    <div className="flex h-full flex-col overflow-hidden">

      {/* Header */}
      <div className="grid h-11 grid-cols-[120px_1fr_120px_120px_140px] items-center border-b border-border px-4 text-[11px] uppercase tracking-wide text-muted-foreground">

        <div>Status</div>
        <div>Route</div>
        <div>Provider</div>
        <div>Attempts</div>
        <div>Created</div>
      </div>

      {/* Rows */}
      <div className="flex-1 overflow-y-auto">

        {events.map((event) => (
          <EventRow
            key={event.id}
            event={event}
            selected={
              selectedEvent?.id === event.id
            }
            onClick={() =>
              onSelect(event)
            }
          />
        ))}
      </div>
    </div>
  )
}