"use client"

import { useEffect, useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Activity,
  ArrowRight,
  Cpu,
  Database,
  Loader2,
  MapPin,
  Package,
  RefreshCw,
  Recycle,
  ShieldCheck,
  Trash2,
  Truck,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Navigation } from "@/components/navigation"
import { getAssets, createAsset, deleteAsset } from "@/lib/api/assets"
import { getStats } from "@/lib/api/stats"

type Asset = {
  id: string
  type: "server" | "desktop" | "laptop" | "storage" | "network"
  model: string
  serial: string
  status:
    | "pending_pickup"
    | "in_transit"
    | "sanitizing"
    | "recovering"
    | "complete"
  location: string
  pickupDate?: string | null
  completedDate?: string | null
  materials?: {
    gold?: number
    silver?: number
    palladium?: number
    copper?: number
  } | null
  createdAt?: string
}

type Stats = {
  totalAssets: number
  completedAssets: number
  pendingAssets: number
  inTransitAssets: number
  sanitizingAssets: number
  recoveringAssets: number
  goldRecovered: number
}

const statusOptions = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending_pickup" },
  { label: "Transit", value: "in_transit" },
  { label: "Sanitizing", value: "sanitizing" },
  { label: "Recovering", value: "recovering" },
  { label: "Complete", value: "complete" },
]

const statusLabelMap: Record<string, string> = {
  pending_pickup: "Pending Pickup",
  in_transit: "In Transit",
  sanitizing: "Sanitizing",
  recovering: "Recovering",
  complete: "Complete",
}

function getStatusClasses(status: string) {
  switch (status) {
    case "complete":
      return "border-primary/30 bg-primary/10 text-primary"
    case "recovering":
      return "border-blue-500/30 bg-blue-500/10 text-blue-400"
    case "sanitizing":
      return "border-yellow-500/30 bg-yellow-500/10 text-yellow-400"
    case "in_transit":
      return "border-orange-500/30 bg-orange-500/10 text-orange-400"
    default:
      return "border-border/60 bg-secondary text-muted-foreground"
  }
}

function getTypeIcon(type: Asset["type"]) {
  switch (type) {
    case "server":
      return <Database className="h-4 w-4" />
    case "desktop":
      return <Cpu className="h-4 w-4" />
    case "laptop":
      return <Cpu className="h-4 w-4" />
    case "storage":
      return <Package className="h-4 w-4" />
    case "network":
      return <Activity className="h-4 w-4" />
    default:
      return <Package className="h-4 w-4" />
  }
}

export default function UrbanMiningPage() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [creating, setCreating] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [filter, setFilter] = useState("all")

  async function loadDashboard(selectedFilter = filter, showRefresh = false) {
    try {
      setError("")
      if (showRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }

      const [assetsData, statsData] = await Promise.all([
        getAssets(selectedFilter),
        getStats(),
      ])

      setAssets(assetsData)
      setStats(statsData)
    } catch (err) {
      setError("Failed to load dashboard data.")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  useEffect(() => {
    loadDashboard(filter, true)
  }, [filter])

  async function handleCreateDemoAsset() {
    try {
      setCreating(true)

      const serial = `SRV-${Date.now()}`
      await createAsset({
        type: "server",
        model: "Dell PowerEdge R760",
        serial,
        location: "Delhi, IN",
        status: "pending_pickup",
        pickupDate: new Date().toISOString().split("T")[0],
      })

      await loadDashboard(filter, true)
    } catch (err) {
      setError("Failed to create asset.")
    } finally {
      setCreating(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      setDeletingId(id)
      await deleteAsset(id)
      await loadDashboard(filter, true)
    } catch (err) {
      setError("Failed to delete asset.")
    } finally {
      setDeletingId(null)
    }
  }

  const completionRate = useMemo(() => {
    if (!stats || stats.totalAssets === 0) return 0
    return Math.round((stats.completedAssets / stats.totalAssets) * 100)
  }, [stats])

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        <div className="flex min-h-screen items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 rounded-2xl border border-border/50 bg-card/60 px-6 py-4 backdrop-blur-xl"
          >
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">
              Loading urban mining intelligence...
            </span>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="noise-overlay min-h-screen bg-background text-foreground">
      <Navigation />

      <main className="relative z-10 mx-auto max-w-7xl px-4 pb-12 pt-24 sm:px-6 lg:px-8">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-8"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-mono uppercase tracking-[0.25em] text-primary">
                <Recycle className="h-3.5 w-3.5" />
                Urban Mining Operations
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Hardware recovery and precious metal extraction
              </h1>

              <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
                Monitor pickup logistics, sanitization, recovery progress, and
                materials output from retired enterprise hardware.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <motion.div whileHover={{ rotate: 90 }} transition={{ duration: 0.25 }}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => loadDashboard(filter, true)}
                  disabled={refreshing}
                  className="gap-2"
                >
                  <RefreshCw className={refreshing ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
                  Refresh
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                <Button
                  onClick={handleCreateDemoAsset}
                  disabled={creating}
                  className="group gap-2"
                >
                  {creating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Truck className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  )}
                  {creating ? "Creating..." : "Schedule Pickup"}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.section>

        <AnimatePresence>
          {error ? (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-6 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            >
              {error}
            </motion.div>
          ) : null}
        </AnimatePresence>

        <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: "Total Assets",
              value: stats?.totalAssets ?? 0,
              icon: <Package className="h-5 w-5 text-primary" />,
            },
            {
              title: "Completed Assets",
              value: stats?.completedAssets ?? 0,
              icon: <ShieldCheck className="h-5 w-5 text-primary" />,
            },
            {
              title: "Gold Recovered",
              value: `${stats?.goldRecovered ?? 0} oz`,
              icon: <Recycle className="h-5 w-5 text-primary" />,
            },
            {
              title: "Completion Rate",
              value: `${completionRate}%`,
              icon: <Activity className="h-5 w-5 text-primary" />,
            },
          ].map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-border/50 bg-card/60 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur-xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{card.title}</p>
                <div className="rounded-xl border border-primary/20 bg-primary/10 p-2">
                  {card.icon}
                </div>
              </div>
              <p className="text-3xl font-bold tracking-tight">{card.value}</p>
            </motion.div>
          ))}
        </section>

        <section className="mb-8 flex flex-wrap gap-2">
          {statusOptions.map((item) => {
            const active = filter === item.value

            return (
              <motion.button
                key={item.value}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setFilter(item.value)}
                className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                  active
                    ? "border-primary/30 bg-primary text-primary-foreground"
                    : "border-border/50 bg-card/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                {item.label}
              </motion.button>
            )
          })}
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between border-b border-border/50 px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold">Asset Pipeline</h2>
                <p className="text-sm text-muted-foreground">
                  Live operational status across retired hardware inventory
                </p>
              </div>

              <div className="rounded-full border border-border/50 bg-secondary px-3 py-1 text-xs text-muted-foreground">
                {assets.length} records
              </div>
            </div>

            <div className="divide-y divide-border/50">
              <AnimatePresence mode="popLayout">
                {assets.length > 0 ? (
                  assets.map((asset, index) => (
                    <motion.div
                      key={asset.id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ delay: index * 0.03 }}
                      className="flex flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-secondary px-2.5 py-1 text-xs text-muted-foreground">
                            {getTypeIcon(asset.type)}
                            {asset.type}
                          </div>

                          <div
                            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs ${getStatusClasses(
                              asset.status
                            )}`}
                          >
                            {statusLabelMap[asset.status] || asset.status}
                          </div>
                        </div>

                        <h3 className="truncate text-base font-semibold">
                          {asset.model}
                        </h3>

                        <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                          <span>{asset.serial}</span>
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {asset.location}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                          >
                            View
                          </Button>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(asset.id)}
                            disabled={deletingId === asset.id}
                            className="gap-2"
                          >
                            {deletingId === asset.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                            Delete
                          </Button>
                        </motion.div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="px-5 py-10 text-center"
                  >
                    <p className="text-sm text-muted-foreground">
                      No assets found for the selected filter.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="rounded-2xl border border-border/50 bg-card/60 p-5 backdrop-blur-xl"
            >
              <h2 className="mb-4 text-lg font-semibold">Operational Breakdown</h2>

              <div className="space-y-4">
                {[
                  {
                    label: "Pending Pickup",
                    value: stats?.pendingAssets ?? 0,
                    color: "bg-zinc-500",
                  },
                  {
                    label: "In Transit",
                    value: stats?.inTransitAssets ?? 0,
                    color: "bg-orange-500",
                  },
                  {
                    label: "Sanitizing",
                    value: stats?.sanitizingAssets ?? 0,
                    color: "bg-yellow-500",
                  },
                  {
                    label: "Recovering",
                    value: stats?.recoveringAssets ?? 0,
                    color: "bg-blue-500",
                  },
                  {
                    label: "Complete",
                    value: stats?.completedAssets ?? 0,
                    color: "bg-emerald-500",
                  },
                ].map((item, index) => {
                  const total = stats?.totalAssets || 1
                  const width = Math.max((item.value / total) * 100, item.value > 0 ? 8 : 0)

                  return (
                    <div key={item.label}>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{item.label}</span>
                        <span className="font-medium text-foreground">{item.value}</span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-secondary">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${width}%` }}
                          transition={{ delay: 0.2 + index * 0.08, duration: 0.5 }}
                          className={`h-full rounded-full ${item.color}`}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-border/50 bg-card/60 p-5 backdrop-blur-xl"
            >
              <h2 className="mb-4 text-lg font-semibold">Recovery Yield</h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-border/50 bg-secondary/60 p-4">
                  <p className="text-sm text-muted-foreground">Gold</p>
                  <p className="mt-2 text-2xl font-bold text-primary">
                    {stats?.goldRecovered ?? 0} oz
                  </p>
                </div>

                <div className="rounded-xl border border-border/50 bg-secondary/60 p-4">
                  <p className="text-sm text-muted-foreground">Assets Completed</p>
                  <p className="mt-2 text-2xl font-bold">
                    {stats?.completedAssets ?? 0}
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-primary/20 bg-primary/10 p-4">
                <p className="text-sm text-primary">
                  Recovery metrics update automatically when completed assets
                  include material extraction data.
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  )
}
