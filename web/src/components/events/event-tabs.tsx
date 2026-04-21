"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useTransition } from "react"

export function EventsTabs() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const current = searchParams.get("status")

  const tabs = [
    { label: "All", value: null },
    { label: "Pending", value: "pending" },
    { label: "Delivered", value: "delivered" },
    { label: "Failed", value: "failed" },
    { label: "DLQ", value: "dlq" },
  ]

  function handleTabClick(value: string | null) {
    const params = new URLSearchParams(searchParams.toString())

    if (value) {
      params.set("status", value)
    } else {
      params.delete("status")
    }

    startTransition(() => {
      router.push(`/events?${params.toString()}`, { scroll: false })
    })
  }

  return (
    <div className="flex items-center gap-2">
      {tabs.map((tab) => {
        const isActive =
          (tab.value === null && !current) || current === tab.value

        return (
          <button
            key={tab.label}
            onClick={() => handleTabClick(tab.value)}
            className={`px-3 py-1.5 rounded-lg text-sm transition ${
              isActive
                ? "bg-primary text-white"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            {tab.label}
          </button>
        )
      })}

      {/*  loading indicator */}
      {isPending && (
        <span className="text-xs text-muted-foreground ml-2">
          Loading...
        </span>
      )}
    </div>
  )
}