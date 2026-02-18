"use client"

import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 space-y-6 border rounded-xl bg-card">
        <h1 className="text-2xl font-semibold text-center">Login to HookTrace</h1>

        <form className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border rounded-md px-3 py-2"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border rounded-md px-3 py-2"
          />
          <button className="w-full bg-primary text-white py-2 rounded-md">
            Login
          </button>
        </form>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="flex-1 h-px bg-border" />
          OR
          <div className="flex-1 h-px bg-border" />
        </div>

        <div className="space-y-3">
          <a
            href="http://localhost:3001/auth/login/google"
            className="block w-full border rounded-md px-3 py-2 text-center hover:bg-muted"
          >
            Continue with Google
          </a>

          <a
            href="http://localhost:3001/auth/login/github"
            className="block w-full border rounded-md px-3 py-2 text-center hover:bg-muted"
          >
            Continue with GitHub
          </a>
        </div>

        <p className="text-sm text-center">
          Don’t have an account?{" "}
          <Link href="/register" className="underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}