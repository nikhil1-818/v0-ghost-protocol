"use client"

import { Navigation } from "@/components/navigation"
import { TerminalText } from "@/components/terminal-text"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Shield,
  Lock,
  UserCheck,
  FileWarning,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Eye,
  Fingerprint,
  Scale,
  Server,
  Cpu,
  HardDrive,
  Zap,
} from "lucide-react"
import { useState } from "react"
import Link from "next/link"

export default function ProtocolPage() {
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [verificationStep, setVerificationStep] = useState(0)
  const [isVerifying, setIsVerifying] = useState(false)

  const handleVerification = async () => {
    setIsVerifying(true)
    // Simulate verification steps
    for (let i = 1; i <= 4; i++) {
      await new Promise((resolve) => setTimeout(resolve, 800))
      setVerificationStep(i)
    }
    setIsVerifying(false)
  }

  return (
    <div className="min-h-screen bg-background noise-overlay">
      <Navigation />

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/50 bg-secondary/30 backdrop-blur-sm mb-6">
              <Shield className="h-4 w-4 text-primary" />
              <span className="font-mono text-xs tracking-wider">GATEKEEPER PROTOCOL</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">Access Authorization</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Ghost Protocol implements friction-based onboarding to prevent misuse. All users must complete
              identity verification and acknowledge legal obligations.
            </p>
          </div>

          {/* Anti-Misuse Warning */}
          <div className="mb-12 p-6 border border-destructive/30 rounded-xl bg-destructive/5">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-destructive shrink-0 mt-0.5" />
              <div>
                <h3 className="font-mono text-sm font-bold text-destructive mb-2">ANTI-MISUSE NOTICE</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Ghost Protocol is designed for legitimate data destruction purposes only. Attempting to use
                  this service to destroy evidence, obstruct justice, or violate data retention laws is a
                  criminal offense. All destruction requests are logged and may be subject to legal hold
                  requirements.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Technical Protocol */}
            <div className="space-y-6">
              <div className="border border-border/50 rounded-xl bg-card/30 backdrop-blur-sm overflow-hidden">
                <div className="p-4 border-b border-border/50">
                  <h3 className="font-mono text-sm font-bold tracking-wider">TECHNICAL PROTOCOL</h3>
                </div>
                <div className="p-6 space-y-6">
                  {/* Volatile Sandbox */}
                  <ProtocolSection
                    icon={Server}
                    title="Volatile Sandbox Architecture"
                    description="Data never touches persistent storage. All processing occurs in RAM-disk environment with automatic power-cycle flush."
                    specs={[
                      "Data Ingress → RAM Processing",
                      "Zero SSD Contact",
                      "Instant Power-Cycle Flush",
                      "Volatile Memory Only",
                    ]}
                  />

                  {/* Triple-Pass Algorithm */}
                  <ProtocolSection
                    icon={Cpu}
                    title="Triple-Pass Algorithm"
                    description="Industry-standard NIST 800-88 compliant destruction ensuring physical and digital unrecoverability."
                    specs={[
                      "Pass 1: 0x00 (Zeroing sectors)",
                      "Pass 2: 0xFF (One-filling)",
                      "Pass 3: ISAAC PRNG noise",
                      "Cryptographic randomness",
                    ]}
                  />

                  {/* Metadata Scrubbing */}
                  <ProtocolSection
                    icon={HardDrive}
                    title="Metadata Scrubbing"
                    description="Complete elimination of file system artifacts. Even the memory of the file is destroyed."
                    specs={[
                      "Inode structure wiping",
                      "Journal elimination",
                      "Slack space scrubbing",
                      "MFT record destruction",
                    ]}
                  />
                </div>
              </div>

              {/* Compliance Badges */}
              <div className="grid grid-cols-2 gap-4">
                <ComplianceBadge
                  title="NIST 800-88"
                  subtitle="Media Sanitization"
                />
                <ComplianceBadge
                  title="ISO 27001"
                  subtitle="Information Security"
                />
                <ComplianceBadge
                  title="GDPR"
                  subtitle="Data Protection"
                />
                <ComplianceBadge
                  title="SOC 2"
                  subtitle="Type II Certified"
                />
              </div>
            </div>

            {/* Right: Verification Portal */}
            <div className="space-y-6">
              <div className="border border-border/50 rounded-xl bg-card/30 backdrop-blur-sm overflow-hidden">
                <div className="p-4 border-b border-border/50">
                  <h3 className="font-mono text-sm font-bold tracking-wider">VERIFICATION PORTAL</h3>
                </div>
                <div className="p-6 space-y-6">
                  {/* Verification Steps */}
                  <div className="space-y-4">
                    <VerificationStep
                      number={1}
                      title="Identity Verification"
                      description="Government-issued ID and organizational affiliation"
                      icon={Fingerprint}
                      status={verificationStep >= 1 ? "complete" : verificationStep === 0 && isVerifying ? "active" : "pending"}
                    />
                    <VerificationStep
                      number={2}
                      title="Legal Acknowledgment"
                      description="Confirmation of data ownership and destruction rights"
                      icon={Scale}
                      status={verificationStep >= 2 ? "complete" : verificationStep === 1 ? "active" : "pending"}
                    />
                    <VerificationStep
                      number={3}
                      title="Compliance Check"
                      description="Verification against legal hold requirements"
                      icon={FileWarning}
                      status={verificationStep >= 3 ? "complete" : verificationStep === 2 ? "active" : "pending"}
                    />
                    <VerificationStep
                      number={4}
                      title="Access Granted"
                      description="Full system access enabled"
                      icon={UserCheck}
                      status={verificationStep >= 4 ? "complete" : verificationStep === 3 ? "active" : "pending"}
                    />
                  </div>

                  {/* Terms */}
                  <div className="p-4 border border-border/30 rounded-lg bg-black/20">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        className="mt-1 w-4 h-4 rounded border-border bg-background text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-muted-foreground leading-relaxed">
                        I confirm that I have legal authority to destroy the data in question, that no legal
                        hold applies to this data, and that I understand the irreversible nature of Ghost
                        Protocol sanitization.
                      </span>
                    </label>
                  </div>

                  {/* Action Button */}
                  {verificationStep < 4 ? (
                    <Button
                      onClick={handleVerification}
                      disabled={!agreedToTerms || isVerifying}
                      className="w-full font-mono text-sm tracking-wider bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      {isVerifying ? (
                        <>
                          <Zap className="h-4 w-4 mr-2 animate-pulse" />
                          VERIFYING...
                        </>
                      ) : (
                        <>
                          <Lock className="h-4 w-4 mr-2" />
                          INITIATE VERIFICATION
                        </>
                      )}
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-4 border border-primary/30 rounded-lg bg-primary/5 text-center">
                        <CheckCircle className="h-8 w-8 text-primary mx-auto mb-2" />
                        <p className="font-mono text-sm text-primary font-bold">VERIFICATION COMPLETE</p>
                        <p className="text-xs text-muted-foreground mt-1">Full system access granted</p>
                      </div>
                      <Link href="/incinerator">
                        <Button className="w-full font-mono text-sm tracking-wider bg-primary hover:bg-primary/90 text-primary-foreground">
                          ACCESS INCINERATOR
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Audit Trail Notice */}
              <div className="p-4 border border-border/50 rounded-xl bg-card/30">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <h4 className="font-mono text-xs tracking-wider">AUDIT TRAIL</h4>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  All verification attempts and destruction requests are logged with immutable timestamps
                  for compliance and legal purposes.
                </p>
              </div>

              {/* Legal Hold Info */}
              <div className="p-4 border border-ghost-warning/30 rounded-xl bg-ghost-warning/5">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-ghost-warning shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-mono text-xs tracking-wider text-ghost-warning mb-1">LEGAL HOLD CHECK</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Our system automatically checks for active legal holds before processing destruction
                      requests. Data subject to litigation holds cannot be destroyed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function ProtocolSection({
  icon: Icon,
  title,
  description,
  specs,
}: {
  icon: typeof Server
  title: string
  description: string
  specs: string[]
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <h4 className="font-mono text-sm font-bold">{title}</h4>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      <ul className="space-y-1.5 pl-4">
        {specs.map((spec, i) => (
          <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-1 h-1 rounded-full bg-primary" />
            <span className="font-mono">{spec}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function VerificationStep({
  number,
  title,
  description,
  icon: Icon,
  status,
}: {
  number: number
  title: string
  description: string
  icon: typeof Lock
  status: "pending" | "active" | "complete"
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-4 p-4 rounded-lg border transition-all",
        status === "complete"
          ? "border-primary/30 bg-primary/5"
          : status === "active"
          ? "border-ghost-warning/30 bg-ghost-warning/5"
          : "border-border/30 bg-secondary/20"
      )}
    >
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
          status === "complete"
            ? "bg-primary text-primary-foreground"
            : status === "active"
            ? "bg-ghost-warning/20 text-ghost-warning"
            : "bg-secondary text-muted-foreground"
        )}
      >
        {status === "complete" ? (
          <CheckCircle className="h-4 w-4" />
        ) : (
          <span className="font-mono text-sm font-bold">{number}</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className={cn("font-mono text-sm font-bold", status === "complete" && "text-primary")}>
            {title}
          </h4>
          {status === "active" && (
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-ghost-warning/20 text-ghost-warning">
              PROCESSING
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      <Icon
        className={cn(
          "h-5 w-5 shrink-0",
          status === "complete"
            ? "text-primary"
            : status === "active"
            ? "text-ghost-warning"
            : "text-muted-foreground"
        )}
      />
    </div>
  )
}

function ComplianceBadge({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="p-4 border border-border/50 rounded-xl bg-card/30 text-center">
      <Shield className="h-6 w-6 text-primary mx-auto mb-2" />
      <p className="font-mono text-sm font-bold">{title}</p>
      <p className="text-xs text-muted-foreground">{subtitle}</p>
    </div>
  )
}
