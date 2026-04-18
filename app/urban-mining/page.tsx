"use client"

import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Package,
  CheckCircle,
  Clock,
  MapPin,
  Cpu,
  HardDrive,
  Server,
  Plus,
  Eye,
  FileText,
  Leaf,
  TrendingUp,
} from "lucide-react"
import { useEffect, useMemo, useState } from "react"

interface Asset {
  id: string
  type: "server" | "desktop" | "laptop" | "storage" | "network"
  model: string
  serial: string
  status: "pending_pickup" | "in_transit" | "sanitizing" | "recovering" | "complete"
  location: string
  pickupDate?: string
  completedDate?: string
  materials?: {
    gold: number
    silver: number
    palladium: number
    copper: number
  } | null
}

interface Stats {
  total: number
  inProgress: number
  completed: number
  eWasteDiverted: number
  goldRecovered: number
  co2Offset: number
}

const statusConfig = {
  pending_pickup: { label: "PENDING PICKUP", color: "text-muted-foreground", bg: "bg-secondary" },
  in_transit: { label: "IN TRANSIT", color: "text-ghost-warning", bg: "bg-ghost-warning/10" },
  sanitizing: { label: "SANITIZING", color: "text-destructive", bg: "bg-destructive/10" },
  recovering: { label: "MATERIAL RECOVERY", color: "text-primary", bg: "bg-primary/10" },
  complete: { label: "COMPLETE", color: "text-primary", bg: "bg-primary/10" },
}

const typeIcons = {
  server: Server,
  desktop: Cpu,
  laptop: Cpu,
  storage: HardDrive,
  network: Server,
}

export default function UrbanMiningPage() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [filter, setFilter] = useState<Asset["status"] | "all">("all")
  const [loading, setLoading] = useState(true)

  const [stats, setStats] = useState<Stats>({
    total: 0,
    inProgress: 0,
    completed: 0,
    eWasteDiverted: 0,
    goldRecovered: 0,
    co2Offset: 0,
  })

  const fetchAssets = async () => {
    try {
      const res = await fetch("/api/assets", {
        method: "GET",
        cache: "no-store",
      })

      if (!res.ok) {
        throw new Error("Failed to fetch assets")
      }

      const data = await res.json()
      setAssets(data)
    } catch (error) {
      console.error("Error fetching assets:", error)
    }
  }

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/stats", {
        method: "GET",
        cache: "no-store",
      })

      if (!res.ok) {
        throw new Error("Failed to fetch stats")
      }

      const data = await res.json()
      setStats(data)
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  const fetchAllData = async () => {
    try {
      setLoading(true)
      await Promise.all([fetchAssets(), fetchStats()])
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllData()
  }, [])

  const filteredAssets =
    filter === "all" ? assets : assets.filter((a) => a.status === filter)

  const handleSchedulePickup = async () => {
    try {
      const newAsset = {
        type: "server",
        model: "Dell PowerEdge R750",
        serial: `SRV-${Date.now()}`,
        status: "pending_pickup",
        location: "Delhi, IN",
        pickupDate: new Date().toISOString().split("T")[0],
      }

      const res = await fetch("/api/assets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAsset),
      })

      if (!res.ok) {
        throw new Error("Failed to create asset")
      }

      await fetchAllData()
    } catch (error) {
      console.error("Error scheduling pickup:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background noise-overlay">
        <Navigation />
        <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="border border-border/50 rounded-xl bg-card/30 backdrop-blur-sm p-8 text-center">
              <p className="font-mono text-sm text-muted-foreground">Loading urban mining data...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background noise-overlay">
      <Navigation />

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-xs text-primary tracking-widest">MODULE B</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-primary/10 text-primary border border-primary/20">
                  B2B
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold">Urban Mining Hub</h1>
              <p className="text-muted-foreground mt-2">
                Hardware logistics, forensic sanitization, and precious metal recovery.
              </p>
            </div>
            <Button
              onClick={handleSchedulePickup}
              className="font-mono text-sm tracking-wider bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Plus className="h-4 w-4 mr-2" />
              SCHEDULE PICKUP
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon={Package}
              label="TOTAL ASSETS"
              value={stats.total.toString()}
              subtext="In pipeline"
            />
            <StatCard
              icon={Clock}
              label="IN PROGRESS"
              value={stats.inProgress.toString()}
              subtext="Being processed"
            />
            <StatCard
              icon={Leaf}
              label="E-WASTE DIVERTED"
              value={`${stats.eWasteDiverted} kg`}
              subtext="From landfills"
              highlight
            />
            <StatCard
              icon={TrendingUp}
              label="GOLD RECOVERED"
              value={`${stats.goldRecovered.toFixed(2)} g`}
              subtext="Precious metals"
              highlight
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Asset List */}
            <div className="lg:col-span-2">
              <div className="border border-border/50 rounded-xl bg-card/30 backdrop-blur-sm overflow-hidden">
                {/* Filters */}
                <div className="p-4 border-b border-border/50 flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground mr-2">FILTER:</span>
                  {(["all", "pending_pickup", "in_transit", "sanitizing", "recovering", "complete"] as const).map(
                    (status) => (
                      <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg font-mono text-xs transition-all",
                          filter === status
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary"
                        )}
                      >
                        {status === "all" ? "ALL" : statusConfig[status].label}
                      </button>
                    )
                  )}
                </div>

                {/* Asset Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border/30 bg-secondary/20">
                        <th className="px-4 py-3 text-left font-mono text-xs text-muted-foreground tracking-wider">
                          ASSET
                        </th>
                        <th className="px-4 py-3 text-left font-mono text-xs text-muted-foreground tracking-wider hidden sm:table-cell">
                          LOCATION
                        </th>
                        <th className="px-4 py-3 text-left font-mono text-xs text-muted-foreground tracking-wider">
                          STATUS
                        </th>
                        <th className="px-4 py-3 text-right font-mono text-xs text-muted-foreground tracking-wider">
                          ACTIONS
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {filteredAssets.map((asset) => {
                        const Icon = typeIcons[asset.type]
                        const status = statusConfig[asset.status]
                        return (
                          <tr
                            key={asset.id}
                            className={cn(
                              "hover:bg-secondary/30 transition-colors cursor-pointer",
                              selectedAsset?.id === asset.id && "bg-primary/5"
                            )}
                            onClick={() => setSelectedAsset(asset)}
                          >
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-secondary/50">
                                  <Icon className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div>
                                  <p className="font-mono text-sm">{asset.model}</p>
                                  <p className="text-xs text-muted-foreground">{asset.serial}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 hidden sm:table-cell">
                              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                <MapPin className="h-3.5 w-3.5" />
                                {asset.location}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <span
                                className={cn(
                                  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-xs",
                                  status.bg,
                                  status.color
                                )}
                              >
                                {asset.status === "complete" && <CheckCircle className="h-3 w-3" />}
                                {status.label}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="font-mono text-xs"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedAsset(asset)
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Selected Asset Details */}
              {selectedAsset ? (
                <div className="border border-border/50 rounded-xl bg-card/30 backdrop-blur-sm overflow-hidden">
                  <div className="p-4 border-b border-border/50">
                    <h3 className="font-mono text-sm font-bold tracking-wider">ASSET DETAILS</h3>
                  </div>
                  <div className="p-4 space-y-4">
                    <div>
                      <p className="font-mono text-xs text-muted-foreground mb-1">MODEL</p>
                      <p className="text-sm">{selectedAsset.model}</p>
                    </div>
                    <div>
                      <p className="font-mono text-xs text-muted-foreground mb-1">SERIAL</p>
                      <p className="font-mono text-sm">{selectedAsset.serial}</p>
                    </div>
                    <div>
                      <p className="font-mono text-xs text-muted-foreground mb-1">LOCATION</p>
                      <p className="text-sm">{selectedAsset.location}</p>
                    </div>

                    {/* Progress Timeline */}
                    <div className="pt-4 border-t border-border/30">
                      <p className="font-mono text-xs text-muted-foreground mb-3">PROGRESS</p>
                      <div className="space-y-3">
                        {(["pending_pickup", "in_transit", "sanitizing", "recovering", "complete"] as const).map(
                          (step) => {
                            const stepIndex = [
                              "pending_pickup",
                              "in_transit",
                              "sanitizing",
                              "recovering",
                              "complete",
                            ].indexOf(selectedAsset.status)

                            const currentStepIndex = [
                              "pending_pickup",
                              "in_transit",
                              "sanitizing",
                              "recovering",
                              "complete",
                            ].indexOf(step)

                            const isComplete = currentStepIndex < stepIndex
                            const isCurrent = currentStepIndex === stepIndex

                            return (
                              <div key={step} className="flex items-center gap-3">
                                <div
                                  className={cn(
                                    "w-3 h-3 rounded-full border-2",
                                    isComplete
                                      ? "bg-primary border-primary"
                                      : isCurrent
                                      ? "border-primary"
                                      : "border-border"
                                  )}
                                />
                                <span
                                  className={cn(
                                    "font-mono text-xs",
                                    isComplete || isCurrent ? "text-foreground" : "text-muted-foreground"
                                  )}
                                >
                                  {statusConfig[step].label}
                                </span>
                              </div>
                            )
                          }
                        )}
                      </div>
                    </div>

                    {/* Material Recovery */}
                    {selectedAsset.materials && (
                      <div className="pt-4 border-t border-border/30">
                        <p className="font-mono text-xs text-muted-foreground mb-3">RECOVERED MATERIALS</p>
                        <div className="grid grid-cols-2 gap-3">
                          <MaterialBadge label="Gold" value={`${selectedAsset.materials.gold}g`} color="bg-yellow-500/10 text-yellow-500" />
                          <MaterialBadge label="Silver" value={`${selectedAsset.materials.silver}g`} color="bg-gray-400/10 text-gray-400" />
                          <MaterialBadge label="Palladium" value={`${selectedAsset.materials.palladium}g`} color="bg-blue-400/10 text-blue-400" />
                          <MaterialBadge label="Copper" value={`${selectedAsset.materials.copper}g`} color="bg-orange-500/10 text-orange-500" />
                        </div>
                      </div>
                    )}

                    {selectedAsset.status === "complete" && (
                      <Button className="w-full font-mono text-xs mt-4" variant="outline">
                        <FileText className="h-4 w-4 mr-2" />
                        VIEW CERTIFICATE
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="border border-border/50 rounded-xl bg-card/30 backdrop-blur-sm p-8 text-center">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">Select an asset to view details</p>
                </div>
              )}

              {/* Environmental Impact */}
              <div className="border border-primary/20 rounded-xl bg-primary/5 p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Leaf className="h-5 w-5 text-primary" />
                  <h3 className="font-mono text-sm font-bold tracking-wider text-primary">
                    ENVIRONMENTAL OFFSET
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">E-waste diverted</span>
                    <span className="font-mono text-sm">{stats.eWasteDiverted} kg</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">CO2 offset</span>
                    <span className="font-mono text-sm">{stats.co2Offset} tonnes</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Assets processed</span>
                    <span className="font-mono text-sm">{stats.completed}</span>
                  </div>
                </div>
              </div>

              {/* Process Info */}
              <div className="p-4 border border-border/50 rounded-xl bg-card/30 backdrop-blur-sm">
                <h3 className="font-mono text-xs text-muted-foreground tracking-wider mb-3">
                  PROCESS FLOW
                </h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="px-2 py-1 bg-secondary rounded">Pickup</span>
                  <span>→</span>
                  <span className="px-2 py-1 bg-secondary rounded">Sanitize</span>
                  <span>→</span>
                  <span className="px-2 py-1 bg-secondary rounded">Recover</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  subtext,
  highlight = false,
}: {
  icon: typeof Package
  label: string
  value: string
  subtext: string
  highlight?: boolean
}) {
  return (
    <div
      className={cn(
        "p-4 rounded-xl border",
        highlight
          ? "border-primary/30 bg-primary/5"
          : "border-border/50 bg-card/30 backdrop-blur-sm"
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        <Icon className={cn("h-4 w-4", highlight ? "text-primary" : "text-muted-foreground")} />
        <span className="font-mono text-xs text-muted-foreground tracking-wider">{label}</span>
      </div>
      <p className={cn("text-2xl font-bold", highlight && "text-primary")}>{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{subtext}</p>
    </div>
  )
}

function MaterialBadge({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className={cn("px-3 py-2 rounded-lg", color)}>
      <p className="text-xs opacity-70">{label}</p>
      <p className="font-mono text-sm font-bold">{value}</p>
    </div>
  )
}
