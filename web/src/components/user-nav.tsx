"use client"
 
import { useState } from "react"
import Link from "next/link"
import { LogOut, User, Settings, CreditCard, BarChart3 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
 
type UserData = {
  email: string
  avatar_url?: string
  name?: string
}
 
export function UserNav({ user }: { user: UserData }) {
  const [isOpen, setIsOpen] = useState(false)
 
  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3001/auth/logout", {
        method: "POST",
        credentials: "include",
      })
      window.location.href = "/login"
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }
 
  // Get initials from email
  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase()
  }
 
  return (
    <div className="relative">
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 rounded-lg hover:bg-accent transition-colors"
      >
        {user.avatar_url ? (
          <img
            src={user.avatar_url}
            alt={user.email}
            className="w-8 h-8 rounded-full ring-2 ring-border"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-border">
            <span className="text-sm font-semibold text-primary">
              {getInitials(user.email)}
            </span>
          </div>
        )}
      </button>
 
      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
 
            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-72 bg-card border border-border rounded-lg shadow-xl z-50 overflow-hidden"
            >
              {/* User Info */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center gap-3">
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.email}
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-bold text-primary">
                        {getInitials(user.email)}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    {user.name && (
                      <p className="font-semibold truncate">{user.name}</p>
                    )}
                    <p className="text-sm text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>
 
              {/* Menu Items */}
              <div className="p-2">
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent transition-colors"
                >
                  <BarChart3 className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Dashboard</span>
                </Link>
 
                <Link
                  href="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent transition-colors"
                >
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Profile</span>
                </Link>
 
                <Link
                  href="/settings"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent transition-colors"
                >
                  <Settings className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Settings</span>
                </Link>
 
                <Link
                  href="/billing"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent transition-colors"
                >
                  <CreditCard className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Billing</span>
                </Link>
              </div>
 
              {/* Logout */}
              <div className="p-2 border-t border-border">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">Log out</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}