"use client"

import {
  Activity,
  Search,
  Wifi,
} from "lucide-react"

type Props = {
  query: string
  setQuery: (value: string) => void
  total: number
}

export function EventToolbar({
  query,
  setQuery,
  total,
}: Props) {
  return (
    <div className="panel flex h-14 items-center justify-between px-4">

      {/* Left */}
      <div className="flex items-center gap-3">

        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />

          <h1 className="text-sm font-semibold">
            Event Workspace
          </h1>
        </div>

        <div className="h-4 w-px bg-border" />

        <span className="text-xs text-muted-foreground">
          {total} events
        </span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">

        {/* Search */}
        <div className="flex h-9 w-[280px] items-center gap-2 rounded-lg border border-border bg-surface-1 px-3">

          <Search className="h-4 w-4 text-muted-foreground" />

          <input
            value={query}
            onChange={(e) =>
              setQuery(e.target.value)
            }
            placeholder="Search events..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>

        {/* Realtime */}
        <div className="flex items-center gap-2 rounded-lg border border-border bg-surface-1 px-3 py-2">

          <Wifi className="h-3.5 w-3.5 text-live" />

          <span className="text-xs text-muted-foreground">
            Live
          </span>
        </div>
      </div>
    </div>
  )
}