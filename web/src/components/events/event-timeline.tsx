"use client"

import {
  CheckCircle2,
  Clock3,
  Database,
  Radio,
  RotateCcw,
} from "lucide-react"

import type { Event } from "@/types/event"

type Props = {
  event: Event | null
}

const timeline = [
  {
    label: "Received",
    icon: Radio,
  },
  {
    label: "Validated",
    icon: CheckCircle2,
  },
  {
    label: "Queued",
    icon: Database,
  },
  {
    label: "Delivered",
    icon: RotateCcw,
  },
]

export function EventTimeline({
  event,
}: Props) {
  if (!event) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        No event selected
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">

      {/* Header */}
      <div className="border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold">
          Event Timeline
        </h2>
      </div>

      {/* Timeline */}
      <div className="flex flex-1 items-center justify-between px-6">

        {timeline.map((item, index) => {
          const Icon = item.icon

          return (
            <div
              key={item.label}
              className="flex flex-1 items-center"
            >
              <div className="flex flex-col items-center gap-2">

                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface-1">
                  <Icon className="h-4 w-4 text-primary" />
                </div>

                <div className="text-center">
                  <p className="text-xs font-medium">
                    {item.label}
                  </p>

                  <p className="mt-1 text-[11px] text-muted-foreground">
                    completed
                  </p>
                </div>
              </div>

              {index !==
                timeline.length - 1 && (
                <div className="mx-4 h-px flex-1 bg-border" />
              )}
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="border-t border-border px-4 py-2 text-xs text-muted-foreground">
        Event lifecycle visualization
      </div>
    </div>
  )
}