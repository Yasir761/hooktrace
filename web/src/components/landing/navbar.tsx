"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { useRouter, usePathname } from "next/navigation"

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  function goHome() {
    if (pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      router.push("/")
    }
  }

  function goWhy() {
    if (pathname === "/why-hooktrace") return
    router.push("/why-hooktrace")
  }

  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className={`
          w-full max-w-5xl
          flex items-center justify-between
          rounded-full
          px-4 sm:px-6
          py-2.5 sm:py-3
          transition-all duration-300
          ${
            scrolled
              ? "bg-background/80 backdrop-blur-xl border border-border shadow-lg"
              : "bg-primary/5 backdrop-blur-xl border border-primary/20 shadow-[0_0_30px_hsl(var(--primary)/0.12)]"
          }
        `}
      >
        {/* Logo */}
        <button
          onClick={goHome}
          className="flex items-center gap-2 sm:gap-3"
        >
          <Image
            src="/logo.png"
            alt="HookTrace Logo"
            width={32}
            height={32}
            priority
            className="sm:w-9 sm:h-9"
          />

          <span className="hidden sm:block font-semibold tracking-wide">
            HookTrace
          </span>
        </button>

        {/* Right Nav */}
        <button
          onClick={goWhy}
          className="
            rounded-full
            bg-primary
            px-4 sm:px-6
            py-1.5 sm:py-2
            text-xs sm:text-sm
            font-medium
            text-primary-foreground
            transition
            hover:scale-[1.04]
            active:scale-[0.98]
          "
        >
          Why HookTrace
        </button>
      </motion.nav>
    </div>
  )
}
