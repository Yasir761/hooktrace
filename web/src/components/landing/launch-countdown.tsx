


"use client"

export function LaunchSection() {
  return (
    <div className="relative mt-10 w-full max-w-md">

      {/* Glow Background (same vibe as hero) */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_hsl(var(--primary)/0.18),_transparent_70%)]" />

      <div
        className="
          rounded-2xl
          border border-border/60
          bg-background/60
          backdrop-blur-md
          px-6 py-6
          text-center
          shadow-[0_0_40px_hsl(var(--primary)/0.08)]
        "
      >
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          Private Beta
        </p>

        <p className="mt-3 text-lg font-medium">
          <span className="text-primary">HookTrace</span> is launching soon.
        </p>

        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          Join early access above and be among the first to debug webhooks
          without the pain.
        </p>
      </div>
    </div>
  )
}