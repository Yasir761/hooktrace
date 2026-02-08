import Link from "next/link";
import { promQuery, getScalar } from "@/lib/prometheus";

export default async function Dashboard() {
  const [
    totalEvents,
    delivered,
    failed,
    retries,
  ] = await Promise.all([
    promQuery("sum(hooktrace_webhooks_received_total)"),
    promQuery("sum(hooktrace_events_delivered_total)"),
    promQuery("sum(hooktrace_events_failed_total)"),
    promQuery("sum(hooktrace_events_retried_total)"),
  ]);

  const stats = [
    { label: "Total Events", value: getScalar(totalEvents as unknown[]) },
    { label: "Delivered", value: getScalar(delivered as unknown[]) },
    { label: "Failed", value: getScalar(failed as unknown[]) },
    { label: "Retries", value: getScalar(retries as unknown[]) },
  ];


  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-6 py-16 space-y-14">

        {/* Header */}
        <section className="space-y-4">
          <p className="text-sm uppercase tracking-widest text-muted-foreground">
            Hooktrace Dashboard
          </p>
          <h1 className="text-4xl font-semibold">
            Monitor and debug webhooks in real time
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            Inspect payloads, track delivery, and replay failures without logs.
          </p>
        </section>

        {/* Stats */}
        <section className="grid gap-4 md:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-card p-5"
            >
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="mt-2 text-2xl font-semibold">
                {stat.value.toLocaleString()}
              </p>
            </div>
          ))}
        </section>

        {/* Actions */}
        <section className="flex gap-3">
          <Link
            href="/events"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            View All Events
          </Link>
          <Link
            href="/events?status=failed"
            className="rounded-md border border-border px-4 py-2 text-sm font-medium"
          >
            Failed Events
          </Link>
        </section>

        {/* Embedded Grafana */}
        <section className="rounded-xl overflow-hidden border border-border">
          <iframe
            src="http://localhost:3005/d/ad5vkvk/hooktrace-dashboard?orgId=1&kiosk=tv&refresh=5s"
            className="w-full h-[900px]"
          />
        </section>

      </div>
    </div>
  );
}