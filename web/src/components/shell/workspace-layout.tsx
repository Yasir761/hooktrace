"use client"

import { ReactNode } from "react"

export function WorkspaceLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <main className="flex-1 overflow-hidden bg-background">
      <div className="h-full overflow-y-auto">
        <div className="mx-auto flex min-h-full w-full max-w-[1800px] flex-col px-6 py-6">
          {children}
        </div>
      </div>
    </main>
  )
}