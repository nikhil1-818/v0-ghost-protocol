"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Recycle, LayoutDashboard, Package, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Urban Mining",
    href: "/urban-mining",
    icon: Recycle,
  },
  {
    label: "Assets",
    href: "/assets",
    icon: Package,
  },
  {
    label: "Compliance",
    href: "/compliance",
    icon: ShieldCheck,
  },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
              <Recycle className="h-5 w-5 text-primary" />
            </div>
            <div className="leading-tight">
              <p className="font-mono text-xs tracking-[0.25em] text-primary">ECORECLAIM</p>
              <p className="text-sm font-semibold text-foreground">Asset Recovery Platform</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-mono transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="md:hidden">
            <Link
              href="/urban-mining"
              className="inline-flex items-center rounded-lg border border-border/50 bg-card/50 px-3 py-2 text-sm text-foreground"
            >
              <Recycle className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
