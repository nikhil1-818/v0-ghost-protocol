"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Shield, Menu, X } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "/", label: "HOME" },
  { href: "/incinerator", label: "INCINERATOR" },
  { href: "/urban-mining", label: "URBAN MINING" },
  { href: "/ledger", label: "LEDGER" },
  { href: "/protocol", label: "PROTOCOL" },
]

export function Navigation() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Shield className="h-8 w-8 text-primary transition-all group-hover:text-primary/80" />
              <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-sm font-bold tracking-wider text-foreground">
                GHOST PROTOCOL
              </span>
              <span className="font-mono text-[10px] text-muted-foreground tracking-widest">
                SANITIZATION-AS-A-SERVICE
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-4 py-2 font-mono text-xs tracking-wider transition-all relative",
                  pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.label}
                {pathname === item.href && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Status Indicators */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary pulse-glow" />
              <span className="font-mono text-xs text-muted-foreground">SYSTEM ONLINE</span>
            </div>
            <Button variant="outline" size="sm" className="font-mono text-xs border-primary/50 hover:bg-primary/10 hover:border-primary">
              ACCESS PORTAL
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl">
          <nav className="flex flex-col p-4 gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "px-4 py-3 font-mono text-sm tracking-wider transition-all rounded-lg",
                  pathname === item.href
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-4 pt-4 border-t border-border/50">
              <div className="flex items-center gap-2 px-4 mb-4">
                <div className="w-2 h-2 rounded-full bg-primary pulse-glow" />
                <span className="font-mono text-xs text-muted-foreground">SYSTEM ONLINE</span>
              </div>
              <Button variant="outline" className="w-full font-mono text-xs border-primary/50">
                ACCESS PORTAL
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
