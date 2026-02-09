"use client"

import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import {
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react"
import clsx from "clsx"

type Status = "pending" | "delivered" | "failed"

const STATUS_CONFIG: Record<
  Status,
  {
    label: string
    icon: React.ElementType
    className: string
  }
> = {
  delivered: {
    label: "Delivered",
    icon: CheckCircle2,
    className:
      "bg-green-500/10 text-green-600 border-green-500/20",
  },
  failed: {
    label: "Failed",
    icon: XCircle,
    className:
      "bg-red-500/10 text-red-600 border-red-500/20",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    className:
      "bg-orange-500/10 text-orange-600 border-orange-500/20",
  },
}

export function StatusBadge({ status }: { status: Status }) {
  const { label, icon: Icon, className } = STATUS_CONFIG[status]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="inline-flex"
    >
      <Badge
        variant="outline"
        className={clsx(
          "flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium",
          className
        )}
      >
        <Icon className="h-3.5 w-3.5" />
        {label}
      </Badge>
    </motion.div>
  )
}
