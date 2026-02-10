"use client"

import Link from "next/link"
import { Activity, CheckCircle2, XCircle, RotateCcw } from "lucide-react"
import { motion, type Variants } from "framer-motion"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"

/* ------------------ Motion presets ------------------ */

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 14,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1], // smooth ease-out
    },
  },
}

/* ------------------ Icons ------------------ */

const icons = [Activity, CheckCircle2, XCircle, RotateCcw]

/* ------------------ Component ------------------ */

export default function DashboardClient({
  stats,
  successSeries,
  failureSeries,
}: {
  stats: { label: string; value: number }[]
  successSeries: [number, string][]
  failureSeries: [number, string][]
}) {
  const formatTime = (ts?: number) =>
    ts
      ? new Date(ts * 1000).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : ""

  const maxLen = Math.max(successSeries.length, failureSeries.length)

  const chartData = Array.from({ length: maxLen })
    .map((_, i) => {
      const s = successSeries[i]
      const f = failureSeries[i]

      const ts = s?.[0] ?? f?.[0]
      if (!ts) return null

      const success = Number(s?.[1] ?? 0)
      const failed = Number(f?.[1] ?? 0)

      return {
        time: formatTime(ts),
        success: Number.isFinite(success) ? success : 0,
        failed: Number.isFinite(failed) ? failed : 0,
      }
    })
    .filter(Boolean)

  return (
    <motion.div
      className="min-h-screen bg-background text-foreground"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <div className="mx-auto max-w-7xl px-6 py-10 space-y-12">

        {/* Header */}
        <motion.section variants={fadeUp} className="space-y-2">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            HookTrace Dashboard
          </p>
          <h1 className="text-3xl font-semibold">
            Webhook Operations Overview
          </h1>

          <div className="flex gap-3 pt-4">
            <Link
              href="/events"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              View Events
            </Link>
            <Link
              href="/events?status=failed"
              className="rounded-md border border-border px-4 py-2 text-sm font-medium"
            >
              Failed Events
            </Link>
          </div>
        </motion.section>

        {/* Stats */}
        <motion.section
          variants={container}
          className="grid gap-6 sm:grid-cols-2 md:grid-cols-4"
        >
          {stats.map((stat, i) => {
            const Icon = icons[i]
            return (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className="rounded-xl border border-border bg-card p-5 transition-all hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-semibold">
                      {Number.isFinite(stat.value) ? stat.value : 0}
                    </p>
                  </div>

                  {/*  Brand-colored icon */}
                  <Icon className="h-5 w-5 text-primary drop-shadow-sm" />
                </div>
              </motion.div>
            )
          })}
        </motion.section>

        {/* Chart */}
        <motion.section variants={fadeUp} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              Event Delivery Trends
            </h2>
            <span className="text-xs text-muted-foreground">
              Recent activity
            </span>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 12 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis
                  domain={[0, "auto"]}
                  tick={{ fontSize: 12 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <Tooltip
                  formatter={(v) =>
                    typeof v === "number" && Number.isFinite(v)
                      ? v.toFixed(3)
                      : "0"
                  }
                />
                <Line
                  type="monotone"
                  dataKey="success"
                  stroke="hsl(var(--secondary))"
                  strokeWidth={3}
                  dot={false}
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="failed"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.section>
      </div>
    </motion.div>
  )
}
