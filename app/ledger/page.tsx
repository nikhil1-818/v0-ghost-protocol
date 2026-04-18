"use client"

import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Shield,
  Search,
  Copy,
  CheckCircle,
  ExternalLink,
  FileText,
  Lock,
  Clock,
  Hash,
  Server,
  Download,
} from "lucide-react"
import { useState } from "react"

interface Certificate {
  id: string
  hash: string
  assetType: string
  assetModel: string
  serial: string
  destructionDate: string
  nistTimestamp: string
  blockNumber: number
  organization: string
  method: string
  verificationStatus: "verified" | "pending" | "failed"
}

const mockCertificates: Certificate[] = [
  {
    id: "COD-2024-001",
    hash: "0x7a2f9c4b1e8d3f6a5b0c2e9d8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8",
    assetType: "Server",
    assetModel: "Dell PowerEdge R740",
    serial: "SRV-2024-XK7891",
    destructionDate: "2024-01-22T14:32:00Z",
    nistTimestamp: "2024-01-22T14:32:00.000000Z",
    blockNumber: 19847623,
    organization: "Acme Corporation",
    method: "NIST 800-88 Triple-Pass",
    verificationStatus: "verified",
  },
  {
    id: "COD-2024-002",
    hash: "0x3e8f7b2a1c9d5e4f6a0b3c7d8e9f1a2b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0",
    assetType: "Storage Array",
    assetModel: "NetApp FAS8200",
    serial: "NAS-2023-RT4521",
    destructionDate: "2024-01-20T09:15:00Z",
    nistTimestamp: "2024-01-20T09:15:00.000000Z",
    blockNumber: 19841892,
    organization: "TechStart Inc",
    method: "NIST 800-88 Triple-Pass",
    verificationStatus: "verified",
  },
  {
    id: "COD-2024-003",
    hash: "0x5c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d",
    assetType: "Workstation",
    assetModel: "HP EliteDesk 800 G6",
    serial: "DKT-2024-PQ1234",
    destructionDate: "2024-01-18T16:45:00Z",
    nistTimestamp: "2024-01-18T16:45:00.000000Z",
    blockNumber: 19835421,
    organization: "Global Finance Ltd",
    method: "NIST 800-88 Triple-Pass",
    verificationStatus: "verified",
  },
  {
    id: "COD-2024-004",
    hash: "0x9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e",
    assetType: "Laptop Fleet",
    assetModel: "Various (15 units)",
    serial: "BATCH-2024-LPT-015",
    destructionDate: "2024-01-15T11:20:00Z",
    nistTimestamp: "2024-01-15T11:20:00.000000Z",
    blockNumber: 19828754,
    organization: "SecureBank Corp",
    method: "NIST 800-88 Triple-Pass",
    verificationStatus: "verified",
  },
]

export default function LedgerPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null)
  const [copiedHash, setCopiedHash] = useState<string | null>(null)

  const filteredCerts = mockCertificates.filter(
    (cert) =>
      cert.hash.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.serial.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.organization.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedHash(text)
    setTimeout(() => setCopiedHash(null), 2000)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const truncateHash = (hash: string) => {
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`
  }

  return (
    <div className="min-h-screen bg-background noise-overlay">
      <Navigation />

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-xs text-primary tracking-widest">MODULE C</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-primary/10 text-primary border border-primary/20">
                BLOCKCHAIN
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold">Forensic Zero Ledger</h1>
            <p className="text-muted-foreground mt-2">
              Immutable certificates of destruction. Blockchain-verified, NIST-compliant timestamps.
            </p>
          </div>

          {/* Search */}
          <div className="mb-8">
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by certificate ID, hash, serial, or organization..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm font-mono text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Certificate List */}
            <div className="lg:col-span-2 space-y-4">
              {filteredCerts.map((cert) => (
                <CertificateCard
                  key={cert.id}
                  certificate={cert}
                  isSelected={selectedCert?.id === cert.id}
                  onClick={() => setSelectedCert(cert)}
                  onCopyHash={() => copyToClipboard(cert.hash)}
                  copiedHash={copiedHash}
                  truncateHash={truncateHash}
                  formatDate={formatDate}
                />
              ))}

              {filteredCerts.length === 0 && (
                <div className="p-12 text-center border border-border/50 rounded-xl bg-card/30">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No certificates found matching your search.</p>
                </div>
              )}
            </div>

            {/* Certificate Details */}
            <div className="space-y-6">
              {selectedCert ? (
                <>
                  <div className="border border-border/50 rounded-xl bg-card/30 backdrop-blur-sm overflow-hidden">
                    <div className="p-4 border-b border-border/50 flex items-center justify-between">
                      <h3 className="font-mono text-sm font-bold tracking-wider">CERTIFICATE DETAILS</h3>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-xs bg-primary/10 text-primary">
                        <CheckCircle className="h-3 w-3" />
                        VERIFIED
                      </span>
                    </div>
                    <div className="p-4 space-y-4">
                      <DetailRow label="Certificate ID" value={selectedCert.id} mono />
                      <DetailRow label="Organization" value={selectedCert.organization} />
                      <DetailRow label="Asset Type" value={selectedCert.assetType} />
                      <DetailRow label="Model" value={selectedCert.assetModel} />
                      <DetailRow label="Serial" value={selectedCert.serial} mono />
                      <DetailRow label="Method" value={selectedCert.method} />
                      <DetailRow label="Destruction Date" value={formatDate(selectedCert.destructionDate)} />

                      <div className="pt-4 border-t border-border/30">
                        <p className="font-mono text-xs text-muted-foreground mb-2">BLOCKCHAIN HASH</p>
                        <div className="flex items-center gap-2 p-3 bg-black/30 rounded-lg">
                          <code className="font-mono text-xs text-primary flex-1 break-all">
                            {selectedCert.hash}
                          </code>
                          <button
                            onClick={() => copyToClipboard(selectedCert.hash)}
                            className="shrink-0 p-1.5 hover:bg-secondary rounded transition-colors"
                          >
                            {copiedHash === selectedCert.hash ? (
                              <CheckCircle className="h-4 w-4 text-primary" />
                            ) : (
                              <Copy className="h-4 w-4 text-muted-foreground" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 pt-2">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Server className="h-3.5 w-3.5" />
                          Block #{selectedCert.blockNumber.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          NIST Timestamp
                        </div>
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button className="flex-1 font-mono text-xs" variant="outline">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          VIEW ON CHAIN
                        </Button>
                        <Button className="flex-1 font-mono text-xs bg-primary hover:bg-primary/90 text-primary-foreground">
                          <Download className="h-4 w-4 mr-2" />
                          DOWNLOAD PDF
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Verification Info */}
                  <div className="border border-primary/20 rounded-xl bg-primary/5 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Shield className="h-5 w-5 text-primary" />
                      <h3 className="font-mono text-sm font-bold tracking-wider text-primary">
                        NIST COMPLIANCE
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      This certificate is compliant with NIST Special Publication 800-88 Guidelines for Media
                      Sanitization. The destruction was performed using the Triple-Pass algorithm and
                      timestamped using NIST-traceable time sources.
                    </p>
                  </div>
                </>
              ) : (
                <div className="border border-border/50 rounded-xl bg-card/30 backdrop-blur-sm p-8 text-center">
                  <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">Select a certificate to view details</p>
                </div>
              )}

              {/* Verification Portal */}
              <div className="border border-border/50 rounded-xl bg-card/30 backdrop-blur-sm p-4">
                <h3 className="font-mono text-xs text-muted-foreground tracking-wider mb-3">
                  VERIFY CERTIFICATE
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Enter a certificate hash to verify its authenticity on the blockchain.
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="0x..."
                    className="flex-1 px-3 py-2 rounded-lg border border-border/50 bg-black/30 font-mono text-xs placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                  />
                  <Button size="sm" className="font-mono text-xs bg-primary hover:bg-primary/90 text-primary-foreground">
                    VERIFY
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border border-border/50 rounded-xl bg-card/30 text-center">
                  <Hash className="h-5 w-5 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold">{mockCertificates.length}</p>
                  <p className="font-mono text-xs text-muted-foreground">CERTIFICATES</p>
                </div>
                <div className="p-4 border border-border/50 rounded-xl bg-card/30 text-center">
                  <CheckCircle className="h-5 w-5 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold">100%</p>
                  <p className="font-mono text-xs text-muted-foreground">VERIFIED</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function CertificateCard({
  certificate,
  isSelected,
  onClick,
  onCopyHash,
  copiedHash,
  truncateHash,
  formatDate,
}: {
  certificate: Certificate
  isSelected: boolean
  onClick: () => void
  onCopyHash: () => void
  copiedHash: string | null
  truncateHash: (hash: string) => string
  formatDate: (date: string) => string
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "p-4 border rounded-xl cursor-pointer transition-all",
        isSelected
          ? "border-primary/50 bg-primary/5"
          : "border-border/50 bg-card/30 hover:border-primary/30 hover:bg-card/50"
      )}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-sm font-bold">{certificate.id}</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-mono text-[10px] bg-primary/10 text-primary">
              <CheckCircle className="h-2.5 w-2.5" />
              VERIFIED
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{certificate.organization}</p>
        </div>
        <div className="text-right">
          <p className="text-sm">{certificate.assetType}</p>
          <p className="text-xs text-muted-foreground">{formatDate(certificate.destructionDate)}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 p-2 bg-black/30 rounded-lg">
        <Hash className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <code className="font-mono text-xs text-primary/80 flex-1 truncate">
          {truncateHash(certificate.hash)}
        </code>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onCopyHash()
          }}
          className="shrink-0 p-1 hover:bg-secondary rounded transition-colors"
        >
          {copiedHash === certificate.hash ? (
            <CheckCircle className="h-3.5 w-3.5 text-primary" />
          ) : (
            <Copy className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </button>
      </div>

      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
        <span>Model: {certificate.assetModel}</span>
        <span>Block #{certificate.blockNumber.toLocaleString()}</span>
      </div>
    </div>
  )
}

function DetailRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="font-mono text-xs text-muted-foreground mb-1">{label.toUpperCase()}</p>
      <p className={cn("text-sm", mono && "font-mono")}>{value}</p>
    </div>
  )
}
