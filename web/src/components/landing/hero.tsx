"use client"

import Image from "next/image"
import { motion } from "framer-motion"

import { LaunchCountdown } from "@/components/landing/launch-countdown"
import { WaitlistForm } from "@/components/landing/waitlist-form"

export function Hero() {
  return (
    <section
      id="waitlist"
      className="
        relative
        min-h-screen
        flex flex-col items-center justify-center
        text-center
        px-5 sm:px-6
        pt-32 sm:pt-36 md:pt-40
        pb-20
        bg-background
        overflow-hidden
      "
    >
      {/* Glow */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_hsl(var(--primary)/0.22),_transparent_70%)]" />

      {/* Subtle grid */}
      <div className="absolute inset-0 -z-20 opacity-[0.025] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:42px_42px]" />

      {/* Content Wrapper */}
      <div className="w-full max-w-4xl flex flex-col items-center">

        {/* Logo */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="mb-8 sm:mb-10"
        >
          <Image
            src="/logo.png"
            alt="HookTrace Logo"
            width={160}
            height={160}
            priority
            className="
              w-20 sm:w-28 md:w-36
              drop-shadow-[0_0_60px_hsl(var(--primary)/0.55)]
            "
          />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ y: 25, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="
            text-2xl sm:text-4xl md:text-6xl
            font-semibold
            tracking-tight
            leading-[1.2]
            max-w-3xl
          "
        >
          Webhooks fail.{" "}
          <span className="text-primary">
            You shouldn&apos;t.
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ y: 25, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="
            mt-5 sm:mt-6
            text-muted-foreground
            max-w-xl
            text-sm sm:text-base md:text-lg
            leading-relaxed
          "
        >
          Stop losing webhook events in silence.
          HookTrace gives you visibility, retries, and control
          over every delivery.
        </motion.p>

        {/* Waitlist */}
        <motion.div
          initial={{ y: 25, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 sm:mt-10 w-full flex justify-center"
        >
          <WaitlistForm />
        </motion.div>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-10"
        >
          <LaunchCountdown />
        </motion.div>

        {/* Trust Line */}
        <p className="mt-8 text-xs text-muted-foreground">
          No spam. No noise. Just webhook reliability.
        </p>

      </div>
    </section>
  )
}
