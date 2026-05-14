"use client"

import { ReactNode } from "react"

import { AppSidebar } from "@/components/shell/app-sidebar"
import { AppTopbar } from "@/components/shell/app-topbar"
import { WorkspaceLayout } from "@/components/shell/workspace-layout"

export function AppShell({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      {/* Sidebar */}
      <AppSidebar />

      {/* Main Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopbar />

        <WorkspaceLayout>
          {children}
        </WorkspaceLayout>
      </div>
    </div>
  )
}