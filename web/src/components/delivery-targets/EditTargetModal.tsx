"use client"

import { useState } from "react"
import TargetForm from "./TargetForm"
import type {
  DeliveryTarget,
  DeliveryTargetPayload,
} from "@/types/delivery-target"
import { motion, AnimatePresence } from "framer-motion"

type Props = {
  target: DeliveryTarget
  onUpdated: (target: DeliveryTarget) => void
}

export default function EditTargetModal({ target, onUpdated }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleUpdate(data: DeliveryTargetPayload) {
    setLoading(true)

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/delivery-targets/${target.id}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      )

      const updated: DeliveryTarget = await res.json()

      onUpdated(updated)
      setOpen(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Trigger */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        className="text-xs hover:underline transition"
      >
        Edit
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          >

            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-card rounded-2xl p-6 w-full max-w-md shadow-xl"
            >

              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold">Edit Target</h2>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setOpen(false)}
                  className="text-sm text-muted-foreground hover:text-foreground transition"
                >
                  ✕
                </motion.button>
              </div>

              {/* Form */}
              <div className="space-y-4">
                <TargetForm
                  initial={target}
                  onSubmit={handleUpdate}
                  loading={loading}
                />
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}