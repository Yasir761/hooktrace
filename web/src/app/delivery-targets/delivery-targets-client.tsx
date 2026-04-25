
// "use client"

// import { useState } from "react"
// import Link from "next/link"
// import CreateTargetModal from "@/components/delivery-targets/CreateTargetModal"
// import {
//   Search,
//   CheckCircle2,
//   AlertTriangle,
// } from "lucide-react"
// import { motion } from "framer-motion"

// import { ThemeToggle } from "@/components/theme-toggle"
// import { UserNav } from "@/components/user-nav"

// import { DeliveryTarget } from "@/types/delivery-target"

// type User = {
//   email: string
//   avatar_url?: string
// }

// export default function DeliveryTargetsClient({
//   user,
//   deliveryTargets: initialTargets,
// }: {
//   user: User
//   deliveryTargets: DeliveryTarget[]
// }) {
//   const [targets, setTargets] = useState(initialTargets)
//   const [searchQuery, setSearchQuery] = useState("")

//   const handleToggle = async (id: string) => {
//     const target = targets.find(t => t.id === id)
//     if (!target) return

//     await fetch(`${process.env.NEXT_PUBLIC_API_URL}/delivery-targets/${id}`, {
//       method: "PATCH",
//       credentials: "include",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ enabled: !target.enabled }),
//     })

//     setTargets(prev =>
//       prev.map(t => t.id === id ? { ...t, enabled: !t.enabled } : t)
//     )
//   }

//   const handleDelete = async (id: string) => {
//     if (!confirm("Delete this target?")) return

//     await fetch(`${process.env.NEXT_PUBLIC_API_URL}/delivery-targets/${id}`, {
//       method: "DELETE",
//       credentials: "include",
//     })

//     setTargets(prev => prev.filter(t => t.id !== id))
//   }

//   const filteredTargets = targets.filter(t =>
//     t.name.toLowerCase().includes(searchQuery.toLowerCase())
//   )

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="mx-auto max-w-7xl px-6 py-8 space-y-6">

//         {/* Header */}
//         <div className="flex justify-between items-center">
//           <div>
//             <h1 className="text-3xl font-bold">Delivery Targets</h1>
//             <p className="text-sm text-muted-foreground">
//               Manage where your events are delivered
//             </p>
//           </div>

//           <div className="flex items-center gap-3">
//             <CreateTargetModal
//               onCreated={(t) => setTargets((prev) => [t, ...prev])}
//             />
//             <ThemeToggle />
//             <UserNav user={user} />
//           </div>
//         </div>

//         {/* Search */}
//         <div className="relative max-w-md">
//           <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
//           <input
//             className="w-full pl-10 p-2 border rounded-xl bg-card"
//             placeholder="Search targets..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>

//         {/* Empty */}
//         {filteredTargets.length === 0 && (
//           <div className="text-center py-16 border rounded-2xl">
//             <p className="text-lg font-medium">No delivery targets yet</p>
//             <p className="text-sm text-muted-foreground mt-1">
//               Create your first target to start receiving events
//             </p>
//           </div>
//         )}

//         {/* Grid */}
//         <div className="grid gap-4 md:grid-cols-2">

//           {filteredTargets.map((target) => {
//             const total = target.successCount + target.errorCount
//             const successRate =
//               total > 0 ? (target.successCount / total) * 100 : 100

//             const isHealthy = successRate >= 95

//             return (
//               <motion.div
//                 key={target.id}
//                 layout
//                 className="rounded-2xl border bg-card p-5 space-y-4 hover:shadow-md transition-all"
//               >

//                 {/* Header */}
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <h3 className="font-semibold text-base">{target.name}</h3>

//                     <div className="flex gap-2 mt-1 flex-wrap">
//                       <span className="text-xs text-muted-foreground">
//                         {target.type}
//                       </span>

//                       {target.providers?.map(p => (
//                         <span key={p} className="text-[10px] px-2 py-0.5 rounded bg-muted">
//                           {p}
//                         </span>
//                       ))}
//                     </div>
//                   </div>

//                   <div className={`text-xs px-2 py-1 rounded ${
//                     target.enabled
//                       ? "bg-emerald-100 text-emerald-700"
//                       : "bg-muted"
//                   }`}>
//                     {target.enabled ? "Active" : "Disabled"}
//                   </div>
//                 </div>

//                 {/* Progress */}
//                 <div>
//                   <div className="h-2 rounded bg-muted overflow-hidden">
//                     <div
//                       className="h-full bg-emerald-500"
//                       style={{ width: `${successRate}%` }}
//                     />
//                   </div>

//                   <div className="flex justify-between text-xs mt-1 text-muted-foreground">
//   <span>{target.successCount} success</span>
//   <span>{target.errorCount} errors</span>
// </div>

// <div className="text-xs text-muted-foreground mt-2 space-y-1">
//   <p>
//     Total: {target.successCount + target.errorCount}
//   </p>

//   <p>
//     Last used:{" "}
//     {target.lastUsed
//       ? new Date(target.lastUsed).toLocaleString()
//       : "Never"}
//   </p>

//   <p>
//     Created: {new Date(target.createdAt).toLocaleDateString()}
//   </p>
// </div>
//                 </div>

//                 {/* Health */}
//                 <div className="flex items-center gap-2 text-sm">
//                   {isHealthy ? (
//                     <CheckCircle2 className="w-4 h-4 text-emerald-500" />
//                   ) : (
//                     <AlertTriangle className="w-4 h-4 text-amber-500" />
//                   )}

//                   <span>
//                     {isHealthy ? "Healthy" : "Issues detected"} ({successRate.toFixed(0)}%)
//                   </span>
//                 </div>

//                 {/* Actions */}
//                 <div className="flex justify-between items-center pt-2 border-t">
//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => handleToggle(target.id)}
//                       className="text-xs px-2 py-1 rounded border hover:bg-muted"
//                     >
//                       {target.enabled ? "Disable" : "Enable"}
//                     </button>

//                     <button
//                       onClick={() => handleDelete(target.id)}
//                       className="text-xs px-2 py-1 rounded border hover:bg-muted"
//                     >
//                       Delete
//                     </button>
//                   </div>

//                   <Link
//                     href={`/delivery-targets/${target.id}`}
//                     className="text-xs font-medium text-primary"
//                   >
//                     View →
//                   </Link>
//                 </div>

//               </motion.div>
//             )
//           })}

//         </div>
//       </div>
//     </div>
//   )
// }





"use client"

import { useState } from "react"
import Link from "next/link"
import CreateTargetModal from "@/components/delivery-targets/CreateTargetModal"
import {
  Search,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"

import { ThemeToggle } from "@/components/theme-toggle"
import { UserNav } from "@/components/user-nav"

import { DeliveryTarget } from "@/types/delivery-target"

type User = {
  email: string
  avatar_url?: string
}

export default function DeliveryTargetsClient({
  user,
  deliveryTargets: initialTargets,
}: {
  user: User
  deliveryTargets: DeliveryTarget[]
}) {
  const [targets, setTargets] = useState(initialTargets)
  const [searchQuery, setSearchQuery] = useState("")
  const [providerFilter, setProviderFilter] = useState("all") // ✅ NEW

  /* ---------------- ACTIONS ---------------- */

  const handleToggle = async (id: string) => {
    const target = targets.find(t => t.id === id)
    if (!target) return

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/delivery-targets/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !target.enabled }),
      })

      setTargets(prev =>
        prev.map(t =>
          t.id === id ? { ...t, enabled: !t.enabled } : t
        )
      )

      toast.success(`Target ${target.enabled ? "disabled" : "enabled"}`)
    } catch {
      toast.error("Failed to update target")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this target?")) return

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/delivery-targets/${id}`, {
        method: "DELETE",
        credentials: "include",
      })

      setTargets(prev => prev.filter(t => t.id !== id))
      toast.success("Target deleted")
    } catch {
      toast.error("Delete failed")
    }
  }

  /* ---------------- FILTER ---------------- */

  const filteredTargets = targets
    .filter(t =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(t =>
      providerFilter === "all"
        ? true
        : t.providers?.includes(providerFilter)
    )

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-8 space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Delivery Targets</h1>
            <p className="text-sm text-muted-foreground">
              Manage where your events are delivered
            </p>
          </div>

          <div className="flex items-center gap-3">
            <CreateTargetModal
              onCreated={(t) => setTargets((prev) => [t, ...prev])}
            />
            <ThemeToggle />
            <UserNav user={user} />
          </div>
        </div>

        {/* Search + Filter */}
        <div className="space-y-2 max-w-md">

          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <input
              className="w-full pl-10 p-2 border rounded-xl bg-card"
              placeholder="Search targets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* ✅ Provider Filter */}
          <select
            value={providerFilter}
            onChange={(e) => setProviderFilter(e.target.value)}
            className="input"
          >
            <option value="all">All Providers</option>
            <option value="stripe">Stripe</option>
            <option value="shopify">Shopify</option>
            <option value="github">GitHub</option>
            <option value="slack">Slack</option>
          </select>
        </div>

        {/* Empty */}
        {filteredTargets.length === 0 && (
          <div className="text-center py-16 border rounded-2xl">
            <p className="text-lg font-medium">No delivery targets</p>
            <p className="text-sm text-muted-foreground mt-1">
              Try changing filters or create a new one
            </p>
          </div>
        )}

        {/* Grid */}
        <div className="grid gap-4 md:grid-cols-2">

          {filteredTargets.map((target) => {
            const total = target.successCount + target.errorCount
            const successRate =
              total > 0 ? (target.successCount / total) * 100 : 100

            const isHealthy = successRate >= 95

            return (
              <motion.div
                key={target.id}
                layout
                className="rounded-2xl border bg-card p-5 space-y-4 hover:shadow-md transition-all"
              >
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-base">{target.name}</h3>

                    <div className="flex gap-2 mt-1 flex-wrap">
                      <span className="text-xs text-muted-foreground">
                        {target.type}
                      </span>

                      {target.providers?.map(p => (
                        <span key={p} className="text-[10px] px-2 py-0.5 rounded bg-muted">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className={`text-xs px-2 py-1 rounded ${
                    target.enabled
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-muted"
                  }`}>
                    {target.enabled ? "Active" : "Disabled"}
                  </div>
                </div>

                {/* Stats */}
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Total: {total}</p>
                  <p>
                    Last used: {target.lastUsed
                      ? new Date(target.lastUsed).toLocaleString()
                      : "Never"}
                  </p>
                  <p>
                    Created: {new Date(target.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Health */}
                <div className="flex items-center gap-2 text-sm">
                  {isHealthy ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                  )}

                  <span>
                    {isHealthy ? "Healthy" : "Issues detected"} ({successRate.toFixed(0)}%)
                  </span>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center pt-2 border-t">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggle(target.id)}
                      className="text-xs px-2 py-1 rounded border hover:bg-muted"
                    >
                      {target.enabled ? "Disable" : "Enable"}
                    </button>

                    <button
                      onClick={() => handleDelete(target.id)}
                      className="text-xs px-2 py-1 rounded border hover:bg-muted"
                    >
                      Delete
                    </button>
                  </div>

                  <Link
                    href={`/delivery-targets/${target.id}`}
                    className="text-xs font-medium text-primary"
                  >
                    View →
                  </Link>
                </div>
              </motion.div>
            )
          })}

        </div>
      </div>
    </div>
  )
}