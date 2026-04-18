"use client"

import { Navigation } from "@/components/navigation"
import { TerminalText } from "@/components/terminal-text"
import { Button } from "@/components/ui/button"
import { Shield, Zap, Database, Lock, ArrowRight, Server, Cpu, HardDrive } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function HomePage() {
  const [systemTime, setSystemTime] = useState("")
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const updateTime = () => {
      setSystemTime(new Date().toISOString().replace("T", " ").slice(0, 19))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-background noise-overlay">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          {/* System Status Bar */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-12 font-mono text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="text-primary/70">STATUS:</span>
              <span className="text-primary">OPERATIONAL</span>
              <div className="w-2 h-2 rounded-full bg-primary pulse-glow" />
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-primary/70">SECURITY:</span>
              <span>MAXIMUM</span>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <span className="text-primary/70">SYS_TIME:</span>
              <span className="tabular-nums">{isClient ? systemTime : "----"}</span>
            </div>
          </div>

          {/* Main Hero Content */}
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/50 bg-secondary/30 backdrop-blur-sm">
              <Shield className="h-4 w-4 text-primary" />
              <span className="font-mono text-xs tracking-wider">SOVEREIGN-GRADE SANITIZATION</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-balance">
              <span className="block text-foreground">Data is</span>
              <span className="block text-primary text-glow-subtle">Radioactive Matter</span>
            </h1>

            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground leading-relaxed">
              {isClient ? (
                <TerminalText
                  text="Making data recovery physically and digitally impossible. Solving the Digital Autopsy problem."
                  speed={30}
                  showCursor={false}
                />
              ) : (
                "Making data recovery physically and digitally impossible. Solving the Digital Autopsy problem."
              )}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/incinerator">
                <Button size="lg" className="font-mono text-sm tracking-wider bg-primary hover:bg-primary/90 text-primary-foreground px-8 group">
                  INITIATE GHOSTING
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/protocol">
                <Button variant="outline" size="lg" className="font-mono text-sm tracking-wider border-border hover:bg-secondary px-8">
                  VIEW PROTOCOL
                </Button>
              </Link>
            </div>
          </div>

          {/* Tech Specs Grid */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
            <TechSpecCard
              icon={Server}
              title="VOLATILE SANDBOX"
              description="RAM-Disk environment. Zero SSD contact. Power-cycle flush."
              spec="INGRESS → RAM → GHOST → FLUSH"
            />
            <TechSpecCard
              icon={Cpu}
              title="TRIPLE-PASS ALGORITHM"
              description="0x00 Zeroing → 0xFF Complementing → ISAAC PRNG Noise"
              spec="NIST 800-88 COMPLIANT"
            />
            <TechSpecCard
              icon={HardDrive}
              title="METADATA SCRUBBING"
              description="Inode structures, journals, slack space. Complete erasure."
              spec="FORENSIC-RESISTANT"
            />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border/30">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="font-mono text-xs text-primary tracking-widest mb-4">SYSTEM MODULES</h2>
            <p className="text-3xl sm:text-4xl font-bold">Complete Sanitization Ecosystem</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <ModuleCard
              href="/incinerator"
              title="DIGITAL INCINERATOR"
              tag="MODULE A"
              description="Drag-and-drop file destruction with real-time entropy visualization and terminal logging."
              features={["RAM-Only Processing", "Entropy Visualization", "Sector Logging"]}
              icon={Zap}
            />
            <ModuleCard
              href="/urban-mining"
              title="URBAN MINING HUB"
              tag="MODULE B"
              description="Physical hardware logistics with forensic sanitization and precious metal recovery."
              features={["Asset Tracking", "Material Recovery", "Environmental Offset"]}
              icon={Database}
            />
            <ModuleCard
              href="/ledger"
              title="FORENSIC ZERO LEDGER"
              tag="MODULE C"
              description="Blockchain-backed certificates of destruction with NIST-compliance timestamps."
              features={["Unique Hash", "NIST Timestamp", "Immutable Record"]}
              icon={Lock}
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border/30 bg-secondary/20">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <StatCard value="100%" label="UNRECOVERABLE" />
            <StatCard value="<1ms" label="RAM FLUSH TIME" />
            <StatCard value="3-PASS" label="OVERWRITE CYCLES" />
            <StatCard value="NIST" label="COMPLIANCE STANDARD" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border/30">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to <span className="text-primary">Ghost</span> Your Data?
          </h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Join organizations that trust Ghost Protocol for sovereign-grade data destruction.
          </p>
          <Link href="/incinerator">
            <Button size="lg" className="font-mono text-sm tracking-wider bg-primary hover:bg-primary/90 text-primary-foreground px-10 group">
              ACCESS INCINERATOR
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border/30">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-mono text-sm font-bold tracking-wider">GHOST PROTOCOL</span>
            </div>
            <div className="font-mono text-xs text-muted-foreground text-center md:text-right">
              <p>SANITIZATION-AS-A-SERVICE</p>
              <p className="mt-1">DATA IS RADIOACTIVE MATTER</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function TechSpecCard({
  icon: Icon,
  title,
  description,
  spec,
}: {
  icon: typeof Server
  title: string
  description: string
  spec: string
}) {
  return (
    <div className="group relative p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 rounded-xl transition-opacity" />
      <div className="relative space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-mono text-sm font-bold tracking-wider">{title}</h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        <div className="pt-2 border-t border-border/30">
          <span className="font-mono text-xs text-primary/80">{spec}</span>
        </div>
      </div>
    </div>
  )
}

function ModuleCard({
  href,
  title,
  tag,
  description,
  features,
  icon: Icon,
}: {
  href: string
  title: string
  tag: string
  description: string
  features: string[]
  icon: typeof Zap
}) {
  return (
    <Link href={href} className="group">
      <div className="relative h-full p-8 rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm hover:border-primary/50 transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 rounded-xl transition-opacity" />
        <div className="relative space-y-6">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-primary/70 tracking-widest">{tag}</span>
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
              <Icon className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
          </div>
          <ul className="space-y-2">
            {features.map((feature, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                {feature}
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2 text-primary font-mono text-sm group-hover:gap-3 transition-all">
            ACCESS MODULE
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </Link>
  )
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center p-6">
      <div className="text-3xl sm:text-4xl font-bold text-primary text-glow-subtle mb-2">{value}</div>
      <div className="font-mono text-xs text-muted-foreground tracking-wider">{label}</div>
    </div>
  )
}
