"use client"

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

/* ---------------- Motion ---------------- */

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
}

/* ---------------- Component ---------------- */

export default function MetricsClient({
  latency,
  retries,
  rejected,
  incoming,
  delivered,
  failed,
}: {
  latency: [number, string][]
  retries: [number, string][]
  rejected: [number, string][]
  incoming: [number, string][]
  delivered: [number, string][]
  failed: [number, string][]
}) {
  const formatTime = (ts: number) =>
    new Date(ts * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })

  const transform = (series?: [number, string][]) =>
    (series || []).map(([ts, val]) => ({
      time: formatTime(ts),
      value: Number.isFinite(Number(val)) ? Number(val) : 0,
    }))

  const deliveryResults = delivered.map((point, i) => ({
    time: formatTime(point[0]),
    success: Number.isFinite(Number(point[1])) ? Number(point[1]) : 0,
    failed: Number.isFinite(Number(failed[i]?.[1])) ? Number(failed[i][1]) : 0,
  }))

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
            Observability
          </p>
          <h1 className="text-3xl font-semibold">
            System Metrics Overview
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            High-level monitoring for webhook throughput, failures, retries,
            and delivery latency. Designed for quick diagnosis.
          </p>
        </motion.section>

        {/* Top row */}
        <motion.section
          variants={container}
          className="grid gap-6 md:grid-cols-3"
        >
          <MetricPanel
            title="Delivery Latency (p95)"
            description="End-to-end webhook delivery latency"
            data={transform(latency)}
          />
          <MetricPanel
            title="Retry Rate"
            description="Events retried by workers"
            data={transform(retries)}
          />
          <MetricPanel
            title="Rejected Webhooks"
            description="Failed deliveries per second"
            data={transform(rejected)}
          />
        </motion.section>

        {/* Bottom row */}
        <motion.section
          variants={container}
          className="grid gap-6 md:grid-cols-2"
        >
          <DeliveryPanel
            title="Delivery Results"
            description="Successful vs failed deliveries"
            data={deliveryResults}
          />
          <MetricPanel
            title="Incoming Webhooks / sec"
            description="Traffic hitting your API"
            data={transform(incoming)}
          />
        </motion.section>
      </div>
    </motion.div>
  )
}

/* ---------------- Panels ---------------- */

function MetricPanel({
  title,
  description,
  data,
}: {
  title: string
  description?: string
  data: { time: string; value: number }[]
}) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -3 }}
      className="rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-lg"
    >
      <div className="mb-4 space-y-1">
        <h3 className="text-sm font-medium">{title}</h3>
        {description && (
          <p className="text-xs text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={data}>
          <CartesianGrid
            stroke="hsl(var(--border))"
            strokeDasharray="3 3"
          />
          <XAxis dataKey="time" hide />
          <YAxis hide />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke="hsl(var(--primary))"
            strokeWidth={2.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  )
}

function DeliveryPanel({
  title,
  description,
  data,
}: {
  title: string
  description?: string
  data: { time: string; success: number; failed: number }[]
}) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -3 }}
      className="rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-lg"
    >
      <div className="mb-4 space-y-1">
        <h3 className="text-sm font-medium">{title}</h3>
        {description && (
          <p className="text-xs text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={data}>
          <CartesianGrid
            stroke="hsl(var(--border))"
            strokeDasharray="3 3"
          />
          <XAxis dataKey="time" hide />
          <YAxis hide />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="success"
            stroke="hsl(var(--secondary))"
            strokeWidth={2.5}
            dot={false}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="failed"
            stroke="hsl(var(--primary))"
            strokeWidth={2.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
