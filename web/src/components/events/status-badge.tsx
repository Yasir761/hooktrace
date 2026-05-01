"use client"

import { cn } from "@/lib/utils"

export function StatusBadge({
  status,
}: {
  status: "pending" | "delivered" | "failed"
}) {
  const styles = {
    pending:
      "bg-muted text-muted-foreground border-border",
    delivered:
      "bg-secondary/20 text-secondary border-secondary/30",
    failed:
      "bg-destructive/15 text-destructive border-destructive/30",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-1 text-sm font-medium capitalize",
        styles[status]
      )}
    >
      {status}
    </span>
  )
}