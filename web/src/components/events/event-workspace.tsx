"use client"

import { useMemo, useState } from "react"

import { EventToolbar } from "./event-toolbar"
import { EventStream } from "./event-stream"
import { EventInspector } from "./event-inspector"
import { EventTimeline } from "./event-timeline"

import type { Event } from "@/types/event"

type Props = {
  events: Event[]
}

export function EventWorkspace({
  events,
}: Props) {
  const [selectedEvent, setSelectedEvent] =
    useState<Event | null>(
      events[0] || null
    )

  const [query, setQuery] =
    useState("")

  const filteredEvents = useMemo(() => {
    if (!query) return events

    return events.filter((event) => {
      const search =
        `${event.route} ${event.provider} ${event.event_type}`
          .toLowerCase()

      return search.includes(
        query.toLowerCase()
      )
    })
  }, [events, query])

  return (
    <div className="flex h-[calc(100vh-92px)] flex-col gap-4 overflow-hidden">

      {/* Toolbar */}
      <EventToolbar
        query={query}
        setQuery={setQuery}
        total={filteredEvents.length}
      />

      {/* Main */}
      <div className="grid min-h-0 flex-1 grid-cols-[1.2fr_420px] gap-4">

        {/* Stream + Timeline */}
        <div className="flex min-h-0 flex-col gap-4">

          {/* Event Stream */}
          <div className="panel flex min-h-0 flex-1 flex-col overflow-hidden">
            <EventStream
              events={filteredEvents}
              selectedEvent={selectedEvent}
              onSelect={setSelectedEvent}
            />
          </div>

          {/* Timeline */}
          <div className="panel h-[220px] overflow-hidden">
            <EventTimeline
              event={selectedEvent}
            />
          </div>
        </div>

        {/* Inspector */}
        <div className="panel min-h-0 overflow-hidden">
          <EventInspector
            event={selectedEvent}
          />
        </div>
      </div>
    </div>
  )
}