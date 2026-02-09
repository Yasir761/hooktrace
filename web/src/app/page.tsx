import Link from "next/link"
import { Activity, Bug, Repeat, Zap } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-6 pt-24 pb-20 text-center space-y-6">
        <p className="text-sm uppercase tracking-widest text-muted-foreground">
          HookTrace
        </p>

        <h1 className="text-5xl font-semibold leading-tight">
          See Why Your Webhooks Fail.
        </h1>

        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Capture, inspect, and replay webhook events. HookTrace gives developers
          instant visibility into failures so integrations stop breaking in the dark.
        </p>

        <div className="flex justify-center gap-4 pt-4">
          <Link
            href="/waitlist"
            className="rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
          >
            Join Waitlist
          </Link>

          <Link
            href="/dashboard"
            className="rounded-md border border-border px-6 py-3 text-sm font-medium"
          >
            View Dashboard Preview
          </Link>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="mx-auto max-w-6xl px-6 py-20 grid gap-10 md:grid-cols-3 text-center">
        <div className="space-y-3">
          <Bug className="mx-auto h-8 w-8 text-primary" />
          <h3 className="text-lg font-semibold">Silent Failures</h3>
          <p className="text-muted-foreground text-sm">
            “Webhook failed” with no explanation. Logs don’t tell the real story.
          </p>
        </div>

        <div className="space-y-3">
          <Activity className="mx-auto h-8 w-8 text-primary" />
          <h3 className="text-lg font-semibold">Hours Lost Debugging</h3>
          <p className="text-muted-foreground text-sm">
            Searching logs, replaying requests manually, guessing root causes.
          </p>
        </div>

        <div className="space-y-3">
          <Zap className="mx-auto h-8 w-8 text-primary" />
          <h3 className="text-lg font-semibold">Production Breakages</h3>
          <p className="text-muted-foreground text-sm">
            Payments fail. Accounts don’t sync. Users lose trust.
          </p>
        </div>
      </section>

      {/* SOLUTION */}
      <section className="mx-auto max-w-6xl px-6 py-20 space-y-12 text-center">
  <h2 className="text-3xl font-semibold">Webhook Debugging, Simplified</h2>

  <div className="grid gap-8 md:grid-cols-3 text-left">
    <div className="rounded-xl border border-border bg-card p-6 space-y-3">
      <Activity className="h-5 w-5 text-primary" />
      <h3 className="font-semibold">Event Logging</h3>
      <p className="text-sm text-muted-foreground">
        Every webhook delivery tracked with status, headers, and payloads.
      </p>
    </div>

    <div className="rounded-xl border border-border bg-card p-6 space-y-3">
      <Bug className="h-5 w-5 text-primary" />
      <h3 className="font-semibold">Failure Insights</h3>
      <p className="text-sm text-muted-foreground">
        See exact error responses, timeouts, and delivery issues instantly.
      </p>
    </div>

    <div className="rounded-xl border border-border bg-card p-6 space-y-3">
      <Repeat className="h-5 w-5 text-primary" />
      <h3 className="font-semibold">One-Click Replay</h3>
      <p className="text-sm text-muted-foreground">
        Fix your endpoint → resend the event. No curl commands needed.
      </p>
    </div>
  </div>
</section>

      {/* FINAL CTA */}
      <section className="border-t border-border py-20 text-center space-y-6">
        <h2 className="text-3xl font-semibold">
          Stop Debugging Blind.
        </h2>
        <p className="text-muted-foreground">
          Be the first to access HookTrace when we launch.
        </p>

        <Link
          href="/waitlist"
          className="inline-flex rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
        >
          Join the Waitlist
        </Link>
      </section>
    </div>
  )
}
