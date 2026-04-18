"use client"

import { useMemo, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import {
  Activity,
  ArrowRight,
  Award,
  CheckCircle2,
  Cpu,
  Database,
  FileBadge2,
  MapPin,
  Package,
  Recycle,
  ShieldCheck,
  Trash2,
  Truck,
  X,
} from "lucide-react"

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

const demoAssets: Asset[] = [
  {
    id: "1",
    type: "server",
    model: "Dell PowerEdge R760",
    serial: "SRV-2026-001",
    status: "complete",
    location: "Delhi, IN",
    pickupDate: "2026-04-10",
    completedDate: "2026-04-15",
    materials: {
      gold: 0.34,
      silver: 2.1,
      palladium: 0.12,
      copper: 145,
    },
  },
  {
    id: "2",
    type: "desktop",
    model: "HP EliteDesk 800 G6",
    serial: "DST-2026-002",
    status: "recovering",
    location: "Noida, IN",
    pickupDate: "2026-04-13",
    completedDate: null,
    materials: {
      gold: 0.16,
      silver: 1.2,
      palladium: 0.06,
      copper: 102,
    },
  },
  {
    id: "3",
    type: "storage",
    model: "NetApp FAS2720",
    serial: "STG-2026-003",
    status: "pending_pickup",
    location: "Gurugram, IN",
    pickupDate: "2026-04-18",
    completedDate: null,
    materials: {
      gold: 0,
      silver: 0,
      palladium: 0,
      copper: 0,
    },
  },
]

function formatDate(date?: string | null) {
  if (!date) return "—"
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

function getStatusClasses(status: string) {
  switch (status) {
    case "complete":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
    case "recovering":
      return "border-blue-500/30 bg-blue-500/10 text-blue-400"
    case "sanitizing":
      return "border-yellow-500/30 bg-yellow-500/10 text-yellow-400"
    case "in_transit":
      return "border-orange-500/30 bg-orange-500/10 text-orange-400"
    default:
      return "border-zinc-700 bg-zinc-800/80 text-zinc-300"
  }
}

function getTypeIcon(type: Asset["type"]) {
  switch (type) {
    case "server":
      return <Database className="h-4 w-4" />
    case "desktop":
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

function CertificateModal({
  asset,
  open,
  onClose,
}: {
  asset: Asset | null
  open: boolean
  onClose: () => void
}) {
  if (!open || !asset) return null

  const materials = asset.materials || {
    gold: 0.34,
    silver: 2.1,
    palladium: 0.12,
    copper: 145,
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.97 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl border border-zinc-800 bg-zinc-950 shadow-2xl"
        >
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-800 bg-zinc-950/90 px-6 py-4 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-2">
                <FileBadge2 className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Recovery Certificate</h2>
                <p className="text-sm text-zinc-400">
                  Click outside or press close to dismiss
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ rotate: 90, scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              onClick={onClose}
              className="rounded-xl border border-zinc-700 bg-zinc-900 p-2 text-zinc-400 transition-colors hover:text-white"
            >
              <X className="h-4 w-4" />
            </motion.button>
          </div>

          <div className="p-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-zinc-950 via-zinc-900 to-emerald-950/20"
            >
              <div className="border-b border-zinc-800 px-6 py-6">
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-mono uppercase tracking-[0.25em] text-emerald-400">
                      <Award className="h-3.5 w-3.5" />
                      Certified Recovery
                    </div>

                    <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                      Certificate of Responsible IT Asset Recovery
                    </h3>

                    <p className="mt-2 max-w-2xl text-sm text-zinc-400">
                      This certifies that the listed enterprise asset has been
                      securely processed through collection, sanitization,
                      disposition, and material recovery workflow.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-right">
                    <p className="text-xs uppercase tracking-[0.2em] text-emerald-300/80">
                      Certificate ID
                    </p>
                    <p className="mt-1 font-mono text-sm text-emerald-400">
                      CERT-{asset.serial}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 px-6 py-6 lg:grid-cols-[1.15fr_0.85fr]">
                <div className="space-y-6">
                  <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
                    <div className="mb-4 flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-emerald-400" />
                      <h4 className="text-base font-semibold text-white">Asset Details</h4>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                          Equipment Model
                        </p>
                        <p className="mt-1 text-sm font-medium text-white">{asset.model}</p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                          Asset Type
                        </p>
                        <p className="mt-1 text-sm font-medium capitalize text-white">
                          {asset.type}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                          Serial Number
                        </p>
                        <p className="mt-1 font-mono text-sm text-white">{asset.serial}</p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                          Recovery Status
                        </p>
                        <p className="mt-1 text-sm font-medium text-white">
                          {statusLabelMap[asset.status] || asset.status}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                          Pickup Date
                        </p>
                        <p className="mt-1 text-sm font-medium text-white">
                          {formatDate(asset.pickupDate)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                          Completed Date
                        </p>
                        <p className="mt-1 text-sm font-medium text-white">
                          {formatDate(asset.completedDate || new Date().toISOString())}
                        </p>
                      </div>

                      <div className="sm:col-span-2">
                        <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                          Processing Facility
                        </p>
                        <p className="mt-1 text-sm font-medium text-white">
                          Urban Mining Hub Secure Recovery Center, {asset.location}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
                    <div className="mb-4 flex items-center gap-2">
                      <Recycle className="h-4 w-4 text-emerald-400" />
                      <h4 className="text-base font-semibold text-white">Recovered Materials</h4>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                        <p className="text-xs uppercase tracking-[0.14em] text-emerald-300/80">
                          Gold
                        </p>
                        <p className="mt-2 text-2xl font-bold text-emerald-400">
                          {materials.gold ?? 0} oz
                        </p>
                      </div>

                      <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4">
                        <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">
                          Silver
                        </p>
                        <p className="mt-2 text-2xl font-bold text-white">
                          {materials.silver ?? 0} oz
                        </p>
                      </div>

                      <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4">
                        <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">
                          Palladium
                        </p>
                        <p className="mt-2 text-2xl font-bold text-white">
                          {materials.palladium ?? 0} oz
                        </p>
                      </div>

                      <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4">
                        <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">
                          Copper
                        </p>
                        <p className="mt-2 text-2xl font-bold text-white">
                          {materials.copper ?? 0} g
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5">
                    <div className="mb-4 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <h4 className="text-base font-semibold text-white">
                        Compliance Summary
                      </h4>
                    </div>

                    <div className="space-y-3">
                      {[
                        "Chain-of-custody verified",
                        "Forensic sanitization completed",
                        "Material recovery documented",
                        "Disposition workflow archived",
                      ].map((item) => (
                        <div
                          key={item}
                          className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950/70 px-4 py-3"
                        >
                          <div className="rounded-full bg-emerald-500/15 p-1.5">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                          </div>
                          <p className="text-sm text-white">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5">
                    <p className="text-xs uppercase tracking-[0.16em] text-emerald-300/80">
                      Authorized By
                    </p>
                    <p className="mt-2 text-lg font-semibold text-white">
                      Urban Mining Hub
                    </p>
                    <p className="mt-1 text-sm text-zinc-300">
                      Secure Asset Recovery & Precious Material Reclamation Unit
                    </p>

                    <div className="mt-6 border-t border-emerald-500/15 pt-4">
                      <p className="font-mono text-sm text-emerald-400">
                        Digitally validated for audit reference
                      </p>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 font-medium text-black transition hover:bg-emerald-400"
                  >
                    <FileBadge2 className="h-4 w-4" />
                    Download Certificate
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function UrbanMiningPage() {
  const [assets, setAssets] = useState<Asset[]>(demoAssets)
  const [filter, setFilter] = useState("all")
  const [selectedCertificateAsset, setSelectedCertificateAsset] =
    useState<Asset | null>(null)

  const filteredAssets = useMemo(() => {
    if (filter === "all") return assets
    return assets.filter((asset) => asset.status === filter)
  }, [assets, filter])

  const stats = useMemo(() => {
    const totalAssets = assets.length
    const completedAssets = assets.filter((a) => a.status === "complete").length
    const pendingAssets = assets.filter((a) => a.status === "pending_pickup").length
    const inTransitAssets = assets.filter((a) => a.status === "in_transit").length
    const sanitizingAssets = assets.filter((a) => a.status === "sanitizing").length
    const recoveringAssets = assets.filter((a) => a.status === "recovering").length
    const goldRecovered = assets.reduce(
      (sum, item) => sum + (item.materials?.gold ?? 0),
      0
    )

    return {
      totalAssets,
      completedAssets,
      pendingAssets,
      inTransitAssets,
      sanitizingAssets,
      recoveringAssets,
      goldRecovered: Number(goldRecovered.toFixed(2)),
    }
  }, [assets])

  const completionRate = useMemo(() => {
    if (stats.totalAssets === 0) return 0
    return Math.round((stats.completedAssets / stats.totalAssets) * 100)
  }, [stats])

  const handleCreateDemoAsset = () => {
    const newAsset: Asset = {
      id: String(Date.now()),
      type: "server",
      model: "Dell PowerEdge R760",
      serial: `SRV-${Date.now()}`,
      status: "pending_pickup",
      location: "Delhi, IN",
      pickupDate: new Date().toISOString().split("T")[0],
      completedDate: null,
      materials: {
        gold: 0,
        silver: 0,
        palladium: 0,
        copper: 0,
      },
    }

    setAssets((prev) => [newAsset, ...prev])
  }

  const handleDelete = (id: string) => {
    setAssets((prev) => prev.filter((asset) => asset.id !== id))
    if (selectedCertificateAsset?.id === id) {
      setSelectedCertificateAsset(null)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <CertificateModal
        asset={selectedCertificateAsset}
        open={!!selectedCertificateAsset}
        onClose={() => setSelectedCertificateAsset(null)}
      />

      <div className="fixed inset-x-0 top-0 z-40 border-b border-zinc-800/80 bg-black/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-emerald-400">
              Urban Mining Hub
            </p>
            <h1 className="text-sm font-semibold text-white">
              Recovery Intelligence Console
            </h1>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 pb-12 pt-24 sm:px-6 lg:px-8">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-8"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-mono uppercase tracking-[0.25em] text-emerald-400">
                <Recycle className="h-3.5 w-3.5" />
                Urban Mining Operations
              </div>

              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Hardware recovery and precious metal extraction
              </h2>

              <p className="mt-3 max-w-2xl text-sm text-zinc-400 sm:text-base">
                Monitor pickup logistics, sanitization, recovery progress, and
                material output from retired enterprise hardware.
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCreateDemoAsset}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 font-medium text-black transition hover:bg-emerald-400"
            >
              <Truck className="h-4 w-4" />
              Schedule Pickup
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </div>
        </motion.section>

        <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: "Total Assets",
              value: stats.totalAssets,
              icon: <Package className="h-5 w-5 text-emerald-400" />,
            },
            {
              title: "Completed Assets",
              value: stats.completedAssets,
              icon: <ShieldCheck className="h-5 w-5 text-emerald-400" />,
            },
            {
              title: "Gold Recovered",
              value: `${stats.goldRecovered} oz`,
              icon: <Recycle className="h-5 w-5 text-emerald-400" />,
            },
            {
              title: "Completion Rate",
              value: `${completionRate}%`,
              icon: <Activity className="h-5 w-5 text-emerald-400" />,
            },
          ].map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 backdrop-blur-xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-zinc-400">{card.title}</p>
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-2">
                  {card.icon}
                </div>
              </div>
              <p className="text-3xl font-bold tracking-tight text-white">{card.value}</p>
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
                    ? "border-emerald-500/30 bg-emerald-500 text-black"
                    : "border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white"
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
            className="rounded-2xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
              <div>
                <h3 className="text-lg font-semibold text-white">Asset Pipeline</h3>
                <p className="text-sm text-zinc-400">
                  Live operational status across retired hardware inventory
                </p>
              </div>

              <div className="rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1 text-xs text-zinc-400">
                {filteredAssets.length} records
              </div>
            </div>

            <div className="divide-y divide-zinc-800">
              <AnimatePresence mode="popLayout">
                {filteredAssets.length > 0 ? (
                  filteredAssets.map((asset, index) => (
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
                          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-800 px-2.5 py-1 text-xs text-zinc-300">
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

                        <h4 className="truncate text-base font-semibold text-white">
                          {asset.model}
                        </h4>

                        <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-zinc-400">
                          <span>{asset.serial}</span>
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {asset.location}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => setSelectedCertificateAsset(asset)}
                          className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
                        >
                          <FileBadge2 className="h-4 w-4" />
                          View Certificate
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => handleDelete(asset.id)}
                          className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </motion.button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="px-5 py-10 text-center"
                  >
                    <p className="text-sm text-zinc-400">
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
              className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 backdrop-blur-xl"
            >
              <h3 className="mb-4 text-lg font-semibold text-white">
                Operational Breakdown
              </h3>

              <div className="space-y-4">
                {[
                  {
                    label: "Pending Pickup",
                    value: stats.pendingAssets,
                    color: "bg-zinc-500",
                  },
                  {
                    label: "In Transit",
                    value: stats.inTransitAssets,
                    color: "bg-orange-500",
                  },
                  {
                    label: "Sanitizing",
                    value: stats.sanitizingAssets,
                    color: "bg-yellow-500",
                  },
                  {
                    label: "Recovering",
                    value: stats.recoveringAssets,
                    color: "bg-blue-500",
                  },
                  {
                    label: "Complete",
                    value: stats.completedAssets,
                    color: "bg-emerald-500",
                  },
                ].map((item, index) => {
                  const total = stats.totalAssets || 1
                  const width = Math.max((item.value / total) * 100, item.value > 0 ? 8 : 0)

                  return (
                    <div key={item.label}>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="text-zinc-400">{item.label}</span>
                        <span className="font-medium text-white">{item.value}</span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
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
              className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 backdrop-blur-xl"
            >
              <h3 className="mb-4 text-lg font-semibold text-white">Recovery Yield</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4">
                  <p className="text-sm text-zinc-400">Gold</p>
                  <p className="mt-2 text-2xl font-bold text-emerald-400">
                    {stats.goldRecovered} oz
                  </p>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-4">
                  <p className="text-sm text-zinc-400">Assets Completed</p>
                  <p className="mt-2 text-2xl font-bold text-white">
                    {stats.completedAssets}
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                <p className="text-sm text-emerald-300">
                  View Certificate button par click karte hi certificate modal open ho jayega.
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  )
}
