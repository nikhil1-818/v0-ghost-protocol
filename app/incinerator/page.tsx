"use client"

import { Navigation } from "@/components/navigation"
import { EntropyMeter, DataFlowVisualizer } from "@/components/entropy-meter"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Upload, FileWarning, CheckCircle, AlertTriangle, Trash2, Shield, RefreshCw } from "lucide-react"
import { useState, useCallback, useRef, useEffect } from "react"

interface FileItem {
  id: string
  name: string
  size: number
  status: "pending" | "processing" | "destroyed"
  entropy: number
}

interface LogEntry {
  timestamp: string
  type: "info" | "warning" | "success" | "error"
  message: string
}

export default function IncineratorPage() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [logs, setLogs] = useState<LogEntry[]>([
    { timestamp: getTimestamp(), type: "info", message: "SYSTEM: RAM-Disk environment initialized" },
    { timestamp: getTimestamp(), type: "info", message: "SYSTEM: Volatile sandbox ready" },
    { timestamp: getTimestamp(), type: "success", message: "SYSTEM: Awaiting data ingress..." },
  ])
  const [globalEntropy, setGlobalEntropy] = useState(0)
  const logEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [logs])

  function getTimestamp() {
    return new Date().toISOString().slice(11, 23)
  }

  function addLog(type: LogEntry["type"], message: string) {
    setLogs((prev) => [...prev, { timestamp: getTimestamp(), type, message }])
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFiles = Array.from(e.dataTransfer.files)
    addFilesToQueue(droppedFiles)
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    addFilesToQueue(selectedFiles)
  }, [])

  function addFilesToQueue(newFiles: File[]) {
    const fileItems: FileItem[] = newFiles.map((f) => ({
      id: crypto.randomUUID(),
      name: f.name,
      size: f.size,
      status: "pending",
      entropy: 0,
    }))
    setFiles((prev) => [...prev, ...fileItems])
    fileItems.forEach((f) => {
      addLog("info", `INGRESS: ${f.name} (${formatBytes(f.size)}) loaded into RAM`)
    })
  }

  function formatBytes(bytes: number) {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  async function initiateGhosting() {
    if (files.length === 0 || isProcessing) return
    setIsProcessing(true)
    addLog("warning", "INITIATING GHOST PROTOCOL...")
    addLog("info", "VOLATILE: All processing in RAM-disk only")

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (file.status === "destroyed") continue

      setFiles((prev) =>
        prev.map((f) => (f.id === file.id ? { ...f, status: "processing" } : f))
      )

      // Pass 1: Zeroing
      addLog("info", `PASS 1/3: 0x00 Zeroing sectors for ${file.name}`)
      await simulatePass(file.id, 33)

      // Pass 2: One-filling
      addLog("info", `PASS 2/3: 0xFF Complementing for ${file.name}`)
      await simulatePass(file.id, 66)

      // Pass 3: ISAAC PRNG
      addLog("info", `PASS 3/3: ISAAC PRNG noise for ${file.name}`)
      await simulatePass(file.id, 100)

      // Metadata scrubbing
      addLog("warning", `SCRUBBING: Inode structures, journals, slack space`)
      await delay(300)

      setFiles((prev) =>
        prev.map((f) => (f.id === file.id ? { ...f, status: "destroyed", entropy: 100 } : f))
      )
      addLog("success", `GHOSTED: ${file.name} - Data unrecoverable`)
    }

    setGlobalEntropy(100)
    addLog("success", "PROTOCOL COMPLETE: RAM power-cycle flush executed")
    addLog("info", "SYSTEM: All traces eliminated from volatile memory")
    setIsProcessing(false)
  }

  async function simulatePass(fileId: string, targetEntropy: number) {
    const steps = 10
    const stepDelay = 150
    for (let i = 1; i <= steps; i++) {
      await delay(stepDelay)
      const entropy = (targetEntropy / steps) * i
      setFiles((prev) =>
        prev.map((f) => (f.id === fileId ? { ...f, entropy } : f))
      )
      setGlobalEntropy((prev) => Math.max(prev, entropy * 0.9))
    }
  }

  function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  function clearDestroyed() {
    setFiles((prev) => prev.filter((f) => f.status !== "destroyed"))
    setGlobalEntropy(0)
    addLog("info", "SYSTEM: Destroyed file records cleared")
  }

  return (
    <div className="min-h-screen bg-background noise-overlay">
      <Navigation />

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-xs text-primary tracking-widest">MODULE A</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-primary/10 text-primary border border-primary/20">
                B2C
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold">Digital Incinerator</h1>
            <p className="text-muted-foreground mt-2">
              Volatile sandbox destruction. RAM-only processing. Zero SSD contact.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Drop Zone + File List */}
            <div className="lg:col-span-2 space-y-6">
              {/* Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                  "relative border-2 border-dashed rounded-xl p-8 sm:p-12 text-center transition-all cursor-pointer",
                  isDragging
                    ? "border-primary bg-primary/5 border-glow"
                    : "border-border/50 hover:border-primary/50 hover:bg-secondary/30"
                )}
              >
                <input
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Upload className={cn("h-8 w-8 text-primary transition-transform", isDragging && "scale-110")} />
                  </div>
                  <div>
                    <p className="text-lg font-medium">Drop files to incinerate</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      or click to browse. All processing in volatile RAM.
                    </p>
                  </div>
                </div>
              </div>

              {/* File Queue */}
              {files.length > 0 && (
                <div className="border border-border/50 rounded-xl bg-card/30 backdrop-blur-sm overflow-hidden">
                  <div className="p-4 border-b border-border/50 flex items-center justify-between">
                    <h3 className="font-mono text-sm font-bold tracking-wider">
                      DESTRUCTION QUEUE ({files.length})
                    </h3>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearDestroyed}
                        disabled={!files.some((f) => f.status === "destroyed")}
                        className="font-mono text-xs"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        CLEAR
                      </Button>
                    </div>
                  </div>
                  <div className="divide-y divide-border/30 max-h-80 overflow-y-auto">
                    {files.map((file) => (
                      <FileRow key={file.id} file={file} />
                    ))}
                  </div>
                  <div className="p-4 border-t border-border/50 bg-secondary/20">
                    <Button
                      onClick={initiateGhosting}
                      disabled={isProcessing || files.every((f) => f.status === "destroyed")}
                      className="w-full font-mono text-sm tracking-wider bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          GHOSTING IN PROGRESS...
                        </>
                      ) : (
                        <>
                          <Shield className="h-4 w-4 mr-2" />
                          INITIATE GHOST PROTOCOL
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: System Status */}
            <div className="space-y-6">
              {/* Global Entropy */}
              <div className="p-6 border border-border/50 rounded-xl bg-card/30 backdrop-blur-sm">
                <h3 className="font-mono text-xs text-muted-foreground tracking-wider mb-4">
                  GLOBAL DATA ENTROPY
                </h3>
                <EntropyMeter value={globalEntropy} animate={false} />
              </div>

              {/* Data Flow Visualizer */}
              <div className="p-6 border border-border/50 rounded-xl bg-card/30 backdrop-blur-sm">
                <h3 className="font-mono text-xs text-muted-foreground tracking-wider mb-4">
                  RAM SECTOR ACTIVITY
                </h3>
                <DataFlowVisualizer active={isProcessing} />
              </div>

              {/* Terminal Log */}
              <div className="border border-border/50 rounded-xl bg-black/40 backdrop-blur-sm overflow-hidden">
                <div className="p-3 border-b border-border/50 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-destructive/60" />
                    <div className="w-3 h-3 rounded-full bg-ghost-warning/60" />
                    <div className="w-3 h-3 rounded-full bg-primary/60" />
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">SYSTEM LOG</span>
                </div>
                <div className="p-4 h-64 overflow-y-auto font-mono text-xs space-y-1">
                  {logs.map((log, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="text-muted-foreground shrink-0">[{log.timestamp}]</span>
                      <span
                        className={cn(
                          log.type === "success" && "text-primary",
                          log.type === "warning" && "text-ghost-warning",
                          log.type === "error" && "text-destructive",
                          log.type === "info" && "text-muted-foreground"
                        )}
                      >
                        {log.message}
                      </span>
                    </div>
                  ))}
                  <div ref={logEndRef} />
                </div>
              </div>

              {/* Protocol Info */}
              <div className="p-4 border border-primary/20 rounded-xl bg-primary/5">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-mono text-xs font-bold text-primary">TRIPLE-PASS ALGORITHM</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Pass 1: 0x00 (Zeroing) → Pass 2: 0xFF (Complementing) → Pass 3: ISAAC PRNG (Random noise)
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

function FileRow({ file }: { file: FileItem }) {
  const statusConfig = {
    pending: { icon: FileWarning, color: "text-muted-foreground", label: "PENDING" },
    processing: { icon: RefreshCw, color: "text-ghost-warning", label: "PROCESSING" },
    destroyed: { icon: CheckCircle, color: "text-primary", label: "GHOSTED" },
  }

  const { icon: Icon, color, label } = statusConfig[file.status]

  return (
    <div className="p-4 flex items-center gap-4">
      <div className={cn("p-2 rounded-lg bg-secondary/50", file.status === "destroyed" && "bg-primary/10")}>
        <Icon
          className={cn("h-5 w-5", color, file.status === "processing" && "animate-spin")}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-mono text-sm truncate">{file.name}</p>
        <p className="text-xs text-muted-foreground">
          {formatBytes(file.size)} • {label}
        </p>
      </div>
      <div className="w-32 hidden sm:block">
        <EntropyMeter value={file.entropy} showPercentage={false} animate={false} />
      </div>
    </div>
  )
}

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}
