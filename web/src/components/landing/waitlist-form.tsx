"use client"

import { useState } from "react"
import { useWaitlist } from "@/hooks/use-waitlist"
import { motion } from "framer-motion"

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export function WaitlistForm() {
  const { count, join } = useWaitlist()

  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit() {
    if (!email.trim()) return
  
    setLoading(true)
    setError("")
  
    try {
      await join(email.trim())
      setSuccess(true)
      setEmail("")
  
      // Fire GA event only after success
      if (typeof window !== "undefined" && typeof window.gtag === "function") {
        window.gtag("event", "waitlist_join", {
          method: "hero_form",
        })
      }
    } catch {
      setError("Already joined or invalid email.")
    } finally {
      setLoading(false)
    }
  }


  
  return (
    <div className="mt-10 w-full max-w-lg space-y-5">

      {/* Premium Input Container */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="
          flex items-center
          rounded-full
          border border-border
          bg-card/70
          backdrop-blur-xl
          shadow-[0_0_30px_hsl(var(--primary)/0.15)]
          focus-within:ring-2 focus-within:ring-primary
          transition-all
        "
      >
        <input
          id="waitlist-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          type="email"
          placeholder="Enter your email to secure early access"
          className="
            flex-1
            bg-transparent
            px-6 py-4
            text-sm
            outline-none
            placeholder:text-muted-foreground
          "
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="
            mr-2
            rounded-full
            bg-primary
            px-6 py-2.5
            text-sm font-medium
            text-primary-foreground
            transition
            hover:scale-[1.02]
            active:scale-[0.97]
            disabled:opacity-70
          "
        >
          {loading ? "Joining…" : "Join Early Access"}
        </button>
      </motion.div>

      {/* Status Messages */}
      {success && (
        <p className="text-sm text-green-500">
          You’re on the list 🚀 We’ll notify you before launch.
        </p>
      )}

      {error && (
        <p className="text-sm text-destructive">
          {error}
        </p>
      )}

      {/* Live Counter */}
      <p className="text-sm text-muted-foreground">
        <span className="text-primary font-semibold">
          {count}
        </span>{" "}
        users already joined
      </p>
    </div>
  )
}
