"use client"

import { useState } from "react"
import { useWaitlist } from "@/hooks/use-waitlist"
import { motion } from "framer-motion"
import { event } from "@/lib/gtag"

export function WaitlistForm() {
  const { count, join } = useWaitlist()

  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [formStarted, setFormStarted] = useState(false)

  async function handleSubmit() {
    if (!email.trim()) return

    setLoading(true)
    setError("")

    try {
      await join(email.trim())
      setSuccess(true)
      setEmail("")

      // Track successful join
      event({
        action: "waitlist_join",
        category: "conversion",
        label: "hero_section",
      })

    } catch {
      setError("Already joined or invalid email.")

      // Track form error
      event({
        action: "waitlist_form_error",
        category: "conversion",
        label: "hero_section",
      })

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-10 w-full max-w-lg space-y-5">

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
          onFocus={() => {
            if (!formStarted) {
              setFormStarted(true)

              event({
                action: "waitlist_form_start",
                category: "engagement",
                label: "hero_section",
              })
            }
          }}
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
          onClick={() => {
            // Track CTA click
            event({
              action: "cta_hero_click",
              category: "engagement",
              label: "join_early_access",
            })

            handleSubmit()
          }}
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

      <p className="text-sm text-muted-foreground">
        <span className="text-primary font-semibold">
          {count}
        </span>{" "}
        users already joined
      </p>
    </div>
  )
}
