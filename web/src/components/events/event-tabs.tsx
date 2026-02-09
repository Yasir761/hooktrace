// "use client";

// import Link from "next/link";
// import { useSearchParams } from "next/navigation";

// export function EventsTabs() {
//   const searchParams = useSearchParams();
//   const status = searchParams.get("status");

//   const tabClass = (value?: string) =>
//     `px-3 py-1 rounded text-sm ${
//       status === value || (!status && !value)
//         ? "bg-primary text-white"
//         : "bg-muted"
//     }`;

//   return (
//     <div className="flex gap-2">
//       <Link href="/events" className={tabClass(undefined)}>
//         All
//       </Link>
//       <Link href="/events?status=pending" className={tabClass("pending")}>
//         Pending
//       </Link>
//       <Link href="/events?status=delivered" className={tabClass("delivered")}>
//         Delivered
//       </Link>
//       <Link href="/events?status=failed" className={tabClass("failed")}>
//         DLQ
//       </Link>
//     </div>
//   );
// }



"use client"

import * as Tabs from "@radix-ui/react-tabs"
import { useSearchParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import clsx from "clsx"

const TABS = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Delivered", value: "delivered" },
  { label: "DLQ", value: "failed" },
]

export function EventsTabs() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const status = searchParams.get("status") ?? "all"

  function onValueChange(value: string) {
    if (value === "all") {
      router.push("/events")
    } else {
      router.push(`/events?status=${value}`)
    }
  }

  return (
    <Tabs.Root
      value={status}
      onValueChange={onValueChange}
      className="w-fit"
    >
      <Tabs.List className="relative inline-flex items-center rounded-lg border border-border bg-muted/40 p-1">
        {TABS.map((tab) => {
          const isActive = status === tab.value

          return (
            <Tabs.Trigger
              key={tab.value}
              value={tab.value}
              className={clsx(
                "relative z-10 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                isActive
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="events-tabs-indicator"
                  className="absolute inset-0 -z-10 rounded-md bg-primary"
                  transition={{
                    type: "spring",
                    stiffness: 420,
                    damping: 30,
                  }}
                />
              )}

              {tab.label}
            </Tabs.Trigger>
          )
        })}
      </Tabs.List>
    </Tabs.Root>
  )
}
