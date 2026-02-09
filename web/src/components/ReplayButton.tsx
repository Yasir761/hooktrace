"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { RotateCcw } from "lucide-react"
import { toast } from "sonner"

import { apiFetch } from "@/lib/api"
import { Button } from "@/components/ui/button"

export function ReplayButton({ eventId }: { eventId: number }) {
  const [loading, setLoading] = useState(false)

  async function handleReplay() {
    if (loading) return

    setLoading(true)

    try {
      await apiFetch(`/events/${eventId}/replay`, {
        method: "POST",
      })

      toast.success("Event replay queued")
    } catch (err) {
      toast.error("Failed to replay event")
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      className="inline-flex"
    >
      <Button
        size="sm"
        variant="outline"
        onClick={handleReplay}
        disabled={loading}
        className="flex items-center gap-2"
      >
        <RotateCcw
          className={`h-4 w-4 ${
            loading ? "animate-spin text-muted-foreground" : ""
          }`}
        />
        {loading ? "Replaying…" : "Replay"}
      </Button>
    </motion.div>
  )
}
