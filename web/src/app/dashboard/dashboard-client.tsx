// "use client"

// import Link from "next/link"
// import { Activity, CheckCircle2, XCircle, RotateCcw } from "lucide-react"
// import { motion, type Variants } from "framer-motion"
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   CartesianGrid,
// } from "recharts"

// /* ------------------ Motion presets ------------------ */

// const container: Variants = {
//   hidden: {},
//   show: {
//     transition: {
//       staggerChildren: 0.08,
//     },
//   },
// }

// const fadeUp: Variants = {
//   hidden: {
//     opacity: 0,
//     y: 14,
//   },
//   show: {
//     opacity: 1,
//     y: 0,
//     transition: {
//       duration: 0.4,
//       ease: [0.16, 1, 0.3, 1], // smooth ease-out
//     },
//   },
// }

// /* ------------------ Icons ------------------ */

// const icons = [Activity, CheckCircle2, XCircle, RotateCcw]

// /* ------------------ Component ------------------ */

// export default function DashboardClient({
//   stats,
//   successSeries,
//   failureSeries,
// }: {
//   stats: { label: string; value: number }[]
//   successSeries: [number, string][]
//   failureSeries: [number, string][]
// }) {
//   const formatTime = (ts?: number) =>
//     ts
//       ? new Date(ts * 1000).toLocaleTimeString([], {
//           hour: "2-digit",
//           minute: "2-digit",
//         })
//       : ""

//   const maxLen = Math.max(successSeries.length, failureSeries.length)

//   const chartData = Array.from({ length: maxLen })
//     .map((_, i) => {
//       const s = successSeries[i]
//       const f = failureSeries[i]

//       const ts = s?.[0] ?? f?.[0]
//       if (!ts) return null

//       const success = Number(s?.[1] ?? 0)
//       const failed = Number(f?.[1] ?? 0)

//       return {
//         time: formatTime(ts),
//         success: Number.isFinite(success) ? success : 0,
//         failed: Number.isFinite(failed) ? failed : 0,
//       }
//     })
//     .filter(Boolean)

//   return (
//     <motion.div
//       className="min-h-screen bg-background text-foreground"
//       variants={container}
//       initial="hidden"
//       animate="show"
//     >
//       <div className="mx-auto max-w-7xl px-6 py-10 space-y-12">

//         {/* Header */}
//         <motion.section variants={fadeUp} className="space-y-2">
//           <p className="text-xs uppercase tracking-widest text-muted-foreground">
//             HookTrace Dashboard
//           </p>
//           <h1 className="text-3xl font-semibold">
//             Webhook Operations Overview
//           </h1>

//           <div className="flex gap-3 pt-4">
//             <Link
//               href="/events"
//               className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
//             >
//               View Events
//             </Link>
//             <Link
//               href="/events?status=failed"
//               className="rounded-md border border-border px-4 py-2 text-sm font-medium"
//             >
//               Failed Events
//             </Link>
//           </div>
//         </motion.section>

//         {/* Stats */}
//         <motion.section
//           variants={container}
//           className="grid gap-6 sm:grid-cols-2 md:grid-cols-4"
//         >
//           {stats.map((stat, i) => {
//             const Icon = icons[i]
//             return (
//               <motion.div
//                 key={stat.label}
//                 variants={fadeUp}
//                 whileHover={{ y: -4 }}
//                 className="rounded-xl border border-border bg-card p-5 transition-all hover:shadow-lg"
//               >
//                 <div className="flex items-center justify-between">
//                   <div className="space-y-1">
//                     <p className="text-sm text-muted-foreground">
//                       {stat.label}
//                     </p>
//                     <p className="text-2xl font-semibold">
//                       {Number.isFinite(stat.value) ? stat.value : 0}
//                     </p>
//                   </div>

//                   {/*  Brand-colored icon */}
//                   <Icon className="h-5 w-5 text-primary drop-shadow-sm" />
//                 </div>
//               </motion.div>
//             )
//           })}
//         </motion.section>

//         {/* Chart */}
//         <motion.section variants={fadeUp} className="space-y-4">
//           <div className="flex items-center justify-between">
//             <h2 className="text-lg font-semibold">
//               Event Delivery Trends
//             </h2>
//             <span className="text-xs text-muted-foreground">
//               Recent activity
//             </span>
//           </div>

//           <div className="rounded-xl border border-border bg-card p-5">
//             <ResponsiveContainer width="100%" height={280}>
//               <LineChart data={chartData}>
//                 <CartesianGrid
//                   strokeDasharray="3 3"
//                   stroke="hsl(var(--border))"
//                 />
//                 <XAxis
//                   dataKey="time"
//                   tick={{ fontSize: 12 }}
//                   stroke="hsl(var(--muted-foreground))"
//                 />
//                 <YAxis
//                   domain={[0, "auto"]}
//                   tick={{ fontSize: 12 }}
//                   stroke="hsl(var(--muted-foreground))"
//                 />
//                 <Tooltip
//                   formatter={(v) =>
//                     typeof v === "number" && Number.isFinite(v)
//                       ? v.toFixed(3)
//                       : "0"
//                   }
//                 />
//                 <Line
//                   type="monotone"
//                   dataKey="success"
//                   stroke="hsl(var(--secondary))"
//                   strokeWidth={3}
//                   dot={false}
//                   isAnimationActive={false}
//                 />
//                 <Line
//                   type="monotone"
//                   dataKey="failed"
//                   stroke="hsl(var(--primary))"
//                   strokeWidth={3}
//                   dot={false}
//                   isAnimationActive={false}
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </motion.section>
//       </div>
//     </motion.div>
//   )
// }



// "use client"

// import { useEffect, useState } from "react"
// import Link from "next/link"
// import { 
//   Activity, 
//   CheckCircle2, 
//   XCircle, 
//   RotateCcw,
//   Clock,
//   Zap,
//   RefreshCw,
//   TrendingUp,
//   AlertCircle,
//   ArrowUpRight,
//   ArrowDownRight,
// } from "lucide-react"
// import { motion, type Variants } from "framer-motion"
// import {
//   LineChart,
//   Line,
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   CartesianGrid,
// } from "recharts"
// import { ThemeToggle } from "@/components/theme-toggle"

// /* ------------------ Motion Variants ------------------ */

// const container: Variants = {
//   hidden: { opacity: 0 },
//   show: {
//     opacity: 1,
//     transition: { staggerChildren: 0.06, delayChildren: 0.05 },
//   },
// }

// const fadeUp: Variants = {
//   hidden: { opacity: 0, y: 20 },
//   show: {
//     opacity: 1,
//     y: 0,
//     transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
//   },
// }

// /* ------------------ Types ------------------ */

// type MetricsData = {
//   latency: [number, string][]
//   retries: [number, string][]
//   rejected: [number, string][]
//   incoming: [number, string][]
//   delivered: [number, string][]
//   failed: [number, string][]
//   timestamp: number
// }

// /* ------------------ Component ------------------ */

// export default function DashboardClient({
//   stats,
//   successSeries,
//   failureSeries,
// }: {
//   stats: { label: string; value: number }[]
//   successSeries: [number, string][]
//   failureSeries: [number, string][]
// }) {
//   const [metrics, setMetrics] = useState<MetricsData | null>(null)
//   const [isLive, setIsLive] = useState(true)
//   const [isRefreshing, setIsRefreshing] = useState(false)
//   const [lastUpdate, setLastUpdate] = useState<string>("")

//   // Fetch real-time metrics
//   useEffect(() => {
//     if (!isLive) return

//     const fetchMetrics = async () => {
//       setIsRefreshing(true)
//       try {
//         const response = await fetch("/api/metrics")
//         if (!response.ok) throw new Error("Failed to fetch metrics")

//         const data: MetricsData = await response.json()
//         setMetrics(data)
//         setLastUpdate(new Date().toLocaleTimeString())
//       } catch (error) {
//         console.error("Error fetching metrics:", error)
//       } finally {
//         setTimeout(() => setIsRefreshing(false), 300)
//       }
//     }

//     fetchMetrics()
//     const interval = setInterval(fetchMetrics, 5000)
//     return () => clearInterval(interval)
//   }, [isLive])

//   const formatTime = (ts?: number) =>
//     ts
//       ? new Date(ts * 1000).toLocaleTimeString([], {
//           hour: "2-digit",
//           minute: "2-digit",
//         })
//       : ""

//   // Transform metrics data
//   const transform = (series?: [number, string][]) =>
//     (series || []).map(([ts, val]) => ({
//       time: formatTime(ts),
//       value: Number.isFinite(Number(val)) ? Number(val) : 0,
//     }))

//   // Delivery chart data
//   const maxLen = Math.max(successSeries.length, failureSeries.length)
//   const chartData = Array.from({ length: maxLen })
//     .map((_, i) => {
//       const s = successSeries[i]
//       const f = failureSeries[i]
//       const ts = s?.[0] ?? f?.[0]
//       if (!ts) return null

//       return {
//         time: formatTime(ts),
//         success: Number(s?.[1] ?? 0),
//         failed: Number(f?.[1] ?? 0),
//       }
//     })
//     .filter(Boolean)

//   // Calculate real-time stats
//   const latestIncoming = metrics ? transform(metrics.incoming).slice(-1)[0]?.value || 0 : 0
//   const latestLatency = metrics ? transform(metrics.latency).slice(-1)[0]?.value || 0 : 0
//   const latestRejected = metrics ? transform(metrics.rejected).slice(-1)[0]?.value || 0 : 0

//   const deliveryResults = metrics
//     ? metrics.delivered.map((point, i) => ({
//         time: formatTime(point[0]),
//         success: Number(point[1]) || 0,
//         failed: Number(metrics.failed[i]?.[1]) || 0,
//       }))
//     : []

//   const latestDelivered = deliveryResults.slice(-1)[0]?.success || 0
//   const latestFailed = deliveryResults.slice(-1)[0]?.failed || 0
//   const total = latestDelivered + latestFailed
//   const successRate = total > 0 ? ((latestDelivered / total) * 100) : 100

//   return (
//     <div className="min-h-screen bg-background text-foreground">
//       {/* Subtle background pattern */}
//       <div className="fixed inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.03] pointer-events-none dark:opacity-[0.07]" />

//       <motion.div
//         variants={container}
//         initial="hidden"
//         animate="show"
//         className="relative mx-auto max-w-[1600px] px-6 py-8 space-y-8"
//       >
//         {/* Header */}
//         <motion.header variants={fadeUp}>
//           <div className="flex items-start justify-between mb-6">
//             <div className="space-y-3">
//               <div className="flex items-center gap-3">
//                 <div className="p-2.5 bg-primary/10 dark:bg-primary/20 rounded-xl">
//                   <Activity className="w-7 h-7 text-primary" />
//                 </div>
//                 <div>
//                   <p className="text-xs uppercase tracking-widest text-muted-foreground">
//                     HookTrace Dashboard
//                   </p>
//                   <h1 className="text-4xl font-bold">
//                     Webhook Operations Overview
//                   </h1>
//                 </div>
//               </div>

//               <div className="flex gap-3">
//                 <Link
//                   href="/events"
//                   className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
//                 >
//                   View Events
//                 </Link>
//                 <Link
//                   href="/events?status=failed"
//                   className="rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium hover:bg-accent transition-colors"
//                 >
//                   Failed Events
//                 </Link>
//                 <Link
//                   href="/metrics"
//                   className="rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium hover:bg-accent transition-colors"
//                 >
//                   Advanced Metrics
//                 </Link>
//               </div>
//             </div>

//             {/* Controls */}
//             <div className="flex items-center gap-3">
//               <ThemeToggle />
              
//               {lastUpdate && (
//                 <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card text-sm">
//                   <Clock className="w-4 h-4 text-muted-foreground" />
//                   <span className="text-muted-foreground">{lastUpdate}</span>
//                   {isRefreshing && (
//                     <RefreshCw className="w-3.5 h-3.5 text-primary animate-spin" />
//                   )}
//                 </div>
//               )}

//               <button
//                 onClick={() => setIsLive(!isLive)}
//                 className={`
//                   flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm
//                   transition-all shadow-sm
//                   ${isLive
//                     ? "bg-emerald-500 dark:bg-emerald-600 hover:bg-emerald-600 dark:hover:bg-emerald-700 text-white"
//                     : "bg-muted hover:bg-muted/80 text-muted-foreground"
//                   }
//                 `}
//               >
//                 <div className={`w-2 h-2 rounded-full ${isLive ? "bg-white animate-pulse" : "bg-muted-foreground/50"}`} />
//                 {isLive ? "Live" : "Paused"}
//               </button>
//             </div>
//           </div>
//         </motion.header>

//         {/* Overview Stats */}
//         <motion.section
//           variants={container}
//           className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
//         >
//           <StatCard
//             icon={<Activity className="w-5 h-5" />}
//             label={stats[0].label}
//             value={stats[0].value}
//             color="blue"
//           />
//           <StatCard
//             icon={<CheckCircle2 className="w-5 h-5" />}
//             label={stats[1].label}
//             value={stats[1].value}
//             color="emerald"
//           />
//           <StatCard
//             icon={<XCircle className="w-5 h-5" />}
//             label={stats[2].label}
//             value={stats[2].value}
//             color="rose"
//           />
//           <StatCard
//             icon={<RotateCcw className="w-5 h-5" />}
//             label={stats[3].label}
//             value={stats[3].value}
//             color="amber"
//           />
//         </motion.section>

//         {/* Real-time Metrics */}
//         {metrics && (
//           <motion.section variants={container} className="grid gap-4 grid-cols-4">
//             <MetricCard
//               icon={<Zap className="w-5 h-5" />}
//               label="Throughput"
//               value={latestIncoming.toFixed(1)}
//               unit="req/s"
//               trend={latestIncoming > 5 ? "up" : undefined}
//             />
//             <MetricCard
//               icon={<CheckCircle2 className="w-5 h-5" />}
//               label="Success Rate"
//               value={successRate.toFixed(1)}
//               unit="%"
//               trend={successRate > 95 ? "up" : "down"}
//             />
//             <MetricCard
//               icon={<Clock className="w-5 h-5" />}
//               label="Latency (p95)"
//               value={(latestLatency * 1000).toFixed(0)}
//               unit="ms"
//               trend={latestLatency < 1 ? "up" : undefined}
//             />
//             <MetricCard
//               icon={<AlertCircle className="w-5 h-5" />}
//               label="Rejected"
//               value={latestRejected.toFixed(1)}
//               unit="ops/s"
//               trend={latestRejected < 1 ? "up" : "down"}
//             />
//           </motion.section>
//         )}

//         {/* Charts */}
//         <motion.section variants={container} className="grid gap-6 lg:grid-cols-2">
//           {/* Delivery Trends */}
//           <motion.div
//             variants={fadeUp}
//             className="rounded-xl border border-border bg-card p-6 shadow-sm"
//           >
//             <div className="flex items-center justify-between mb-6">
//               <div>
//                 <div className="flex items-center gap-2 mb-1">
//                   <TrendingUp className="w-5 h-5 text-primary" />
//                   <h2 className="text-lg font-semibold">Event Delivery Trends</h2>
//                 </div>
//                 <p className="text-sm text-muted-foreground">Recent delivery activity</p>
//               </div>
//               <div className="flex items-center gap-4 text-sm">
//                 <div className="flex items-center gap-2">
//                   <div className="w-3 h-3 rounded-full bg-emerald-500" />
//                   <span className="text-muted-foreground">Success</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <div className="w-3 h-3 rounded-full bg-rose-500" />
//                   <span className="text-muted-foreground">Failed</span>
//                 </div>
//               </div>
//             </div>

//             <ResponsiveContainer width="100%" height={280}>
//               <AreaChart data={chartData}>
//                 <defs>
//                   <linearGradient id="successGradient" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="0%" stopColor="hsl(142.1 76.2% 36.3%)" stopOpacity={0.3} />
//                     <stop offset="100%" stopColor="hsl(142.1 76.2% 36.3%)" stopOpacity={0} />
//                   </linearGradient>
//                   <linearGradient id="failedGradient" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="0%" stopColor="hsl(0 84.2% 60.2%)" stopOpacity={0.3} />
//                     <stop offset="100%" stopColor="hsl(0 84.2% 60.2%)" stopOpacity={0} />
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
//                 <XAxis
//                   dataKey="time"
//                   tick={{ fontSize: 12 }}
//                   stroke="hsl(var(--muted-foreground))"
//                 />
//                 <YAxis
//                   domain={[0, "auto"]}
//                   tick={{ fontSize: 12 }}
//                   stroke="hsl(var(--muted-foreground))"
//                 />
//                 <Tooltip
//                   contentStyle={{
//                     backgroundColor: "hsl(var(--card))",
//                     border: "1px solid hsl(var(--border))",
//                     borderRadius: "8px",
//                   }}
//                 />
//                 <Area
//                   type="monotone"
//                   dataKey="success"
//                   stroke="hsl(142.1 76.2% 36.3%)"
//                   strokeWidth={2.5}
//                   fill="url(#successGradient)"
//                 />
//                 <Area
//                   type="monotone"
//                   dataKey="failed"
//                   stroke="hsl(0 84.2% 60.2%)"
//                   strokeWidth={2.5}
//                   fill="url(#failedGradient)"
//                 />
//               </AreaChart>
//             </ResponsiveContainer>
//           </motion.div>

//           {/* Incoming Traffic */}
//           {metrics && (
//             <motion.div
//               variants={fadeUp}
//               className="rounded-xl border border-border bg-card p-6 shadow-sm"
//             >
//               <div className="mb-6">
//                 <div className="flex items-center gap-2 mb-1">
//                   <Activity className="w-5 h-5 text-primary" />
//                   <h2 className="text-lg font-semibold">Incoming Traffic</h2>
//                 </div>
//                 <p className="text-sm text-muted-foreground">Webhook requests per second</p>
//               </div>

//               <ResponsiveContainer width="100%" height={280}>
//                 <AreaChart data={transform(metrics.incoming)}>
//                   <defs>
//                     <linearGradient id="incomingGradient" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
//                       <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
//                     </linearGradient>
//                   </defs>
//                   <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
//                   <XAxis dataKey="time" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
//                   <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
//                   <Tooltip
//                     contentStyle={{
//                       backgroundColor: "hsl(var(--card))",
//                       border: "1px solid hsl(var(--border))",
//                       borderRadius: "8px",
//                     }}
//                   />
//                   <Area
//                     type="monotone"
//                     dataKey="value"
//                     stroke="hsl(var(--primary))"
//                     strokeWidth={3}
//                     fill="url(#incomingGradient)"
//                   />
//                 </AreaChart>
//               </ResponsiveContainer>
//             </motion.div>
//           )}
//         </motion.section>
//       </motion.div>
//     </div>
//   )
// }

// /* ------------------ Components ------------------ */

// function StatCard({
//   icon,
//   label,
//   value,
//   color,
// }: {
//   icon: React.ReactNode
//   label: string
//   value: number
//   color: "blue" | "emerald" | "rose" | "amber"
// }) {
//   const colorMap = {
//     blue: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950",
//     emerald: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950",
//     rose: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950",
//     amber: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950",
//   }

//   return (
//     <motion.div
//       variants={fadeUp}
//       whileHover={{ y: -4, scale: 1.02 }}
//       className="rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md"
//     >
//       <div className="flex items-center justify-between">
//         <div className="space-y-2">
//           <p className="text-sm text-muted-foreground font-medium">{label}</p>
//           <p className="text-3xl font-bold tabular-nums">
//             {Number.isFinite(value) ? value.toLocaleString() : 0}
//           </p>
//         </div>
//         <div className={`p-3 rounded-xl ${colorMap[color]}`}>
//           {icon}
//         </div>
//       </div>
//     </motion.div>
//   )
// }

// function MetricCard({
//   icon,
//   label,
//   value,
//   unit,
//   trend,
// }: {
//   icon: React.ReactNode
//   label: string
//   value: string
//   unit: string
//   trend?: "up" | "down"
// }) {
//   return (
//     <motion.div
//       variants={fadeUp}
//       whileHover={{ y: -2 }}
//       className="rounded-lg border border-border bg-card p-4 shadow-sm transition-all"
//     >
//       <div className="flex items-start justify-between mb-3">
//         <div className="p-2 rounded-lg bg-primary/10 text-primary">
//           {icon}
//         </div>
//         {trend && (
//           <div className={`flex items-center gap-1 text-xs font-semibold ${
//             trend === "up" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
//           }`}>
//             {trend === "up" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
//           </div>
//         )}
//       </div>
//       <p className="text-xs text-muted-foreground mb-1">{label}</p>
//       <div className="flex items-baseline gap-1.5">
//         <span className="text-2xl font-bold tabular-nums">{value}</span>
//         <span className="text-sm text-muted-foreground">{unit}</span>
//       </div>
//     </motion.div>
//   )
// }








"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  type LucideIcon,
  Activity,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Clock,
  Zap,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  Circle,
} from "lucide-react"
import { motion, type Variants } from "framer-motion"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"
import { ThemeToggle } from "@/components/theme-toggle"

/* ------------------ Motion ------------------ */

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
}

/* ------------------ Types ------------------ */

type MetricsData = {
  incoming: [number, string][]
  delivered: [number, string][]
  failed: [number, string][]
  latency: [number, string][]
  timestamp: number
}

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
  const [metrics, setMetrics] = useState<MetricsData | null>(null)
  const [isLive, setIsLive] = useState(true)

  useEffect(() => {
    if (!isLive) return

    const fetchMetrics = async () => {
      try {
        const response = await fetch("/api/metrics")
        if (response.ok) {
          const data = await response.json()
          setMetrics(data)
        }
      } catch (error) {
        console.error("Metrics fetch error:", error)
      }
    }

    fetchMetrics()
    const interval = setInterval(fetchMetrics, 5000)
    return () => clearInterval(interval)
  }, [isLive])

  const formatTime = (ts?: number) =>
    ts ? new Date(ts * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""

  const transform = (series?: [number, string][]) =>
    (series || []).map(([ts, val]) => ({
      time: formatTime(ts),
      value: Number(val) || 0,
    }))

  // Chart data
  const maxLen = Math.max(successSeries.length, failureSeries.length)
  const chartData = Array.from({ length: maxLen })
    .map((_, i) => {
      const s = successSeries[i]
      const f = failureSeries[i]
      const ts = s?.[0] ?? f?.[0]
      if (!ts) return null
      return {
        time: formatTime(ts),
        success: Number(s?.[1] ?? 0),
        failed: Number(f?.[1] ?? 0),
      }
    })
    .filter(Boolean)

  // Calculate real-time metrics
  const latestIncoming = metrics ? transform(metrics.incoming).slice(-1)[0]?.value || 0 : 0
  const latestLatency = metrics ? transform(metrics.latency).slice(-1)[0]?.value || 0 : 0
  
  const deliveryResults = metrics
    ? metrics.delivered.map((point, i) => ({
        success: Number(point[1]) || 0,
        failed: Number(metrics.failed[i]?.[1]) || 0,
      }))
    : []

  const latestDelivered = deliveryResults.slice(-1)[0]?.success || 0
  const latestFailed = deliveryResults.slice(-1)[0]?.failed || 0
  const total = latestDelivered + latestFailed
  const successRate = total > 0 ? ((latestDelivered / total) * 100) : 100
  const isHealthy = successRate >= 95 && latestLatency < 2

  return (
    <div className="min-h-screen bg-background">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto max-w-7xl px-6 py-8 space-y-8"
      >
        {/* Header */}
        <motion.header variants={fadeUp}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
              <p className="text-muted-foreground">Monitor your webhook performance</p>
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              
              <button
                onClick={() => setIsLive(!isLive)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                  transition-colors
                  ${isLive
                    ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                    : "bg-muted hover:bg-muted/80"
                  }
                `}
              >
                <Circle className={`w-2 h-2 fill-current ${isLive ? "animate-pulse" : ""}`} />
                {isLive ? "Live" : "Paused"}
              </button>
            </div>
          </div>

          {/* Status Banner */}
          <div className={`
            flex items-center justify-between p-4 rounded-lg border mb-8
            ${isHealthy 
              ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900" 
              : "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900"
            }
          `}>
            <div className="flex items-center gap-3">
              {isHealthy ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              )}
              <div>
                <p className={`font-semibold text-sm ${
                  isHealthy ? "text-emerald-900 dark:text-emerald-100" : "text-amber-900 dark:text-amber-100"
                }`}>
                  {isHealthy ? "All systems operational" : "Performance degraded"}
                </p>
                <p className={`text-xs ${
                  isHealthy ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"
                }`}>
                  Success rate: {successRate.toFixed(1)}% • Latency: {(latestLatency * 1000).toFixed(0)}ms
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Link
                href="/events"
                className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-background/80 hover:bg-background text-sm font-medium transition-colors"
              >
                View Events
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </motion.header>

        {/* Stats Grid */}
        <motion.section
          variants={container}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <StatCard
            icon={Activity}
            label="Total Events"
            value={stats[0].value}
            iconColor="text-blue-600 dark:text-blue-400"
          />
          <StatCard
            icon={CheckCircle2}
            label="Delivered"
            value={stats[1].value}
            iconColor="text-emerald-600 dark:text-emerald-400"
          />
          <StatCard
            icon={XCircle}
            label="Failed"
            value={stats[2].value}
            iconColor="text-rose-600 dark:text-rose-400"
          />
          <StatCard
            icon={RotateCcw}
            label="Retries"
            value={stats[3].value}
            iconColor="text-amber-600 dark:text-amber-400"
          />
        </motion.section>

        {/* Live Metrics */}
        {metrics && (
          <motion.section
            variants={container}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            <LiveMetric
              icon={Zap}
              label="Throughput"
              value={latestIncoming.toFixed(1)}
              unit="req/s"
              iconColor="text-violet-600 dark:text-violet-400"
            />
            <LiveMetric
              icon={TrendingUp}
              label="Success Rate"
              value={successRate.toFixed(1)}
              unit="%"
              iconColor="text-emerald-600 dark:text-emerald-400"
            />
            <LiveMetric
              icon={Clock}
              label="Latency"
              value={(latestLatency * 1000).toFixed(0)}
              unit="ms"
              iconColor="text-blue-600 dark:text-blue-400"
            />
            <LiveMetric
              icon={AlertCircle}
              label="Failed Events"
              value={latestFailed.toFixed(0)}
              unit="events"
              iconColor="text-rose-600 dark:text-rose-400"
            />
          </motion.section>
        )}

        {/* Main Chart */}
        <motion.section variants={fadeUp}>
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold mb-1">Delivery Performance</h2>
                <p className="text-sm text-muted-foreground">Success vs failure over time</p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-muted-foreground">Success</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <span className="text-muted-foreground">Failed</span>
                </div>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="successGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="rgb(34, 197, 94)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="rgb(34, 197, 94)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="failedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="rgb(239, 68, 68)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="rgb(239, 68, 68)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={{ stroke: "hsl(var(--border))" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="success"
                  stroke="rgb(34, 197, 94)"
                  strokeWidth={2}
                  fill="url(#successGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="failed"
                  stroke="rgb(239, 68, 68)"
                  strokeWidth={2}
                  fill="url(#failedGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.section>

        {/* Quick Actions */}
        <motion.section variants={fadeUp}>
          <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-card">
            <div>
              <p className="font-medium mb-1">Need more details?</p>
              <p className="text-sm text-muted-foreground">
                View individual events, check failures, or see advanced metrics
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                href="/events"
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium transition-colors"
              >
                All Events
              </Link>
              <Link
                href="/events?status=failed"
                className="px-4 py-2 rounded-lg border border-border hover:bg-accent text-sm font-medium transition-colors"
              >
                Failed Events
              </Link>
              <Link
                href="/metrics"
                className="px-4 py-2 rounded-lg border border-border hover:bg-accent text-sm font-medium transition-colors"
              >
                Advanced Metrics
              </Link>
            </div>
          </div>
        </motion.section>
      </motion.div>
    </div>
  )
}

/* ------------------ Components ------------------ */

function StatCard({
  icon: Icon,
  label,
  value,
  iconColor,
}: {
  icon: LucideIcon
  label: string
  value: number
  iconColor: string
}) {
  return (
    <motion.div
      variants={fadeUp}
      className="rounded-lg border border-border bg-card p-5 hover:shadow-sm transition-shadow"
    >
      <div className="flex items-center justify-between mb-3">
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <p className="text-2xl font-bold mb-1 tabular-nums">
        {Number.isFinite(value) ? value.toLocaleString() : 0}
      </p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </motion.div>
  )
}

function LiveMetric({
  icon: Icon,
  label,
  value,
  unit,
  iconColor,
}: {
  icon: LucideIcon
  label: string
  value: string
  unit: string
  iconColor: string
}) {
  return (
    <motion.div
      variants={fadeUp}
      className="rounded-lg border border-border bg-card/50 p-4"
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${iconColor}`} />
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {label}
        </p>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-xl font-bold tabular-nums">{value}</span>
        <span className="text-sm text-muted-foreground">{unit}</span>
      </div>
    </motion.div>
  )
}