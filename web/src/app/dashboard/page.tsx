// import { promQuery, getScalar, promRangeQuery } from "@/lib/prometheus"
// import DashboardClient from "@/app/dashboard/dashboard-client"

// export default async function Dashboard() {
//   const [totalEvents, delivered, failed, retries] = await Promise.all([
//     promQuery("sum(hooktrace_webhooks_received_total)"),
//     promQuery("sum(hooktrace_events_delivered_total)"),
//     promQuery("sum(hooktrace_events_failed_total)"),
//     promQuery("sum(hooktrace_events_retried_total)"),
//   ])


  
//   const stats = [
//     { label: "Total Events", value: getScalar(totalEvents as unknown[]) },
//     { label: "Delivered", value: getScalar(delivered as unknown[]) },
//     { label: "Failed", value: getScalar(failed as unknown[]) },
//     { label: "Retries", value: getScalar(retries as unknown[]) },
//   ]



//   const successSeries = await promRangeQuery(
//     "rate(hooktrace_events_delivered_total[5m])"
//   )

//   const failureSeries = await promRangeQuery(
//     "rate(hooktrace_events_failed_total[5m])"
//   )

//   return <DashboardClient 
//   successSeries={successSeries}
//       failureSeries={failureSeries} 
//       stats={stats} />
// }




import { promQuery, getScalar, promRangeQuery } from "@/lib/prometheus"
import DashboardClient from "@/app/dashboard/dashboard-client"

export default async function Dashboard() {
  const [totalEvents, delivered, failed, retries] = await Promise.all([
    promQuery("sum(hooktrace_webhooks_received_total)"),
    promQuery("sum(hooktrace_events_delivered_total)"),
    promQuery("sum(hooktrace_events_failed_total)"),
    promQuery("sum(hooktrace_events_retried_total)"),
  ])

  const stats = [
    { label: "Total Events", value: getScalar(totalEvents as unknown[]) },
    { label: "Delivered", value: getScalar(delivered as unknown[]) },
    { label: "Failed", value: getScalar(failed as unknown[]) },
    { label: "Retries", value: getScalar(retries as unknown[]) },
  ]

  // 🔑 CRITICAL: force non-empty series
  const successSeries = await promRangeQuery(
    "rate(hooktrace_events_delivered_total[5m]) or vector(0)"
  )

  const failureSeries = await promRangeQuery(
    "rate(hooktrace_events_failed_total[5m]) or vector(0)"
  )

  return (
    <DashboardClient
      stats={stats}
      successSeries={successSeries}
      failureSeries={failureSeries}
    />
  )
}
