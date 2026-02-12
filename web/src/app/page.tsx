import { Navbar } from "@/components/landing/navbar"
import { Hero } from "@/components/landing/hero"

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      <Navbar />
      <Hero />
    </div>
  )
}
