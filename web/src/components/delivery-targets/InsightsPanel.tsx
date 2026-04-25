"use client"

import { motion } from "framer-motion"

type Log = {
  event_id?: number
  status: "success" | "failed"
  status_code?: number
  response?: string
  attempt: number
}

function parseResponse(response?: string) {
  try {
    return response ? JSON.parse(response) : null
  } catch {
    return null
  }
}

/* FAILURE CLASSIFICATION */
function classifyFailure(log: Log) {
  if (log.status_code) {
    if (log.status_code >= 500) return "Server Error"
    if (log.status_code >= 400) return "Client Error"
    return `HTTP ${log.status_code}`
  }

  if (!log.response) return "Network Error"

  return "Unknown Error"
}

export default function InsightsPanel({ logs }: { logs: Log[] }) {
  if (!logs.length) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-2xl border bg-card p-6"
      >
        <p className="text-sm text-muted-foreground">
          Not enough data to generate insights yet.
        </p>
      </motion.div>
    )
  }

  /* ---------------- METRICS ---------------- */

  const total = logs.length
  const success = logs.filter(l => l.status === "success").length
  const failed = total - success
  const successRate = Math.round((success / total) * 100)

  /* ---------------- FAILURE REASONS ---------------- */

  const failureMap: Record<string, number> = {}

  logs.forEach(l => {
    if (l.status === "failed") {
      const key = classifyFailure(l)
      failureMap[key] = (failureMap[key] || 0) + 1
    }
  })

  const topFailure = Object.entries(failureMap)
    .sort((a, b) => b[1] - a[1])[0]

  /* ---------------- LATENCY ---------------- */

  const latencies = logs
    .map(l => parseResponse(l.response)?.duration_ms)
    .filter((v): v is number => typeof v === "number")

  const avgLatency = latencies.length
    ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length)
    : null

  /* ---------------- RETRY SUCCESS (FIXED) ---------------- */

  const retryMap: Record<number, Log[]> = {}

  logs.forEach(log => {
    if (!log.event_id) return
    if (!retryMap[log.event_id]) retryMap[log.event_id] = []
    retryMap[log.event_id].push(log)
  })

  let retryTotal = 0
  let retrySuccess = 0

  Object.values(retryMap).forEach(group => {
    if (group.length > 1) {
      retryTotal++
      if (group.some(l => l.status === "success")) {
        retrySuccess++
      }
    }
  })

  const retryRate =
    retryTotal > 0
      ? Math.round((retrySuccess / retryTotal) * 100)
      : null

  /* ---------------- RECOMMENDATION (FIXED) ---------------- */

  let recommendation = "System is stable."

  if (successRate < 90) {
    recommendation = "Failure rate is elevated. Investigate endpoint reliability."
  }

  if (topFailure?.[0] === "Server Error") {
    recommendation = "Server errors detected. Your endpoint may be unstable."
  }

  if (avgLatency && avgLatency > 800) {
    recommendation = "High latency detected. Consider optimizing your endpoint."
  }

  /* ---------------- UI ---------------- */

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border bg-card p-6 space-y-5"
    >

      <h2 className="font-semibold">Insights</h2>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">

        <Stat label="Success Rate" value={`${successRate}%`} />
        <Stat label="Failures" value={failed} />
        <Stat label="Avg Latency" value={avgLatency ? `${avgLatency}ms` : "-"} />
        <Stat label="Retry Success" value={retryRate ? `${retryRate}%` : "-"} />

      </div>

      {/* Failure summary */}
      {topFailure && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-muted-foreground"
        >
          Top failure: {topFailure[0]} ({topFailure[1]} times)
        </motion.p>
      )}

      {/* Failure alert */}
      {failed > 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-red-500"
        >
          {failed} failure(s) detected
        </motion.p>
      )}

      {/* Recommendation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-sm bg-muted p-3 rounded-md"
      >
        💡 {recommendation}
      </motion.div>
    </motion.div>
  )
}

/* ---------------- UI ---------------- */

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="space-y-1"
    >
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-semibold">{value}</p>
    </motion.div>
  )
}