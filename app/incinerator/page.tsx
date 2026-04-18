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
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [globalEntropy, setGlobalEntropy] = useState(0)
  const logEndRef = useRef<HTMLDivElement>(null)

  function getTimestamp() {
    return new Date().toISOString().slice(11, 23)
  }

  function addLog(type: LogEntry["type"], message: string) {
    setLogs((prev) => [...prev, { timestamp: getTimestamp(), type, message }])
  }

  // ✅ FETCH FILES FROM BACKEND
  useEffect(() => {
    async function fetchFiles() {
      const res = await fetch("http://localhost:5000/api/incinerator")
      const data = await res.json()

      setFiles(
        data.map((f: any) => ({
          id: f._id,
          name: f.filename,
          size: f.size,
          status: f.status,
          entropy: 0,
        }))
      )
    }

    fetchFiles()
  }, [])

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [logs])

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

  // ✅ UPLOAD TO BACKEND
  async function addFilesToQueue(newFiles: File[]) {
    for (let file of newFiles) {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("http://localhost:5000/api/incinerator/upload", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()

      setFiles((prev) => [
        ...prev,
        {
          id: data._id,
          name: file.name,
          size: file.size,
          status: "pending",
          entropy: 0,
        },
      ])

      addLog("info", `UPLOADED: ${file.name}`)
    }
  }

  // ✅ PROCESS (GHOSTING)
  async function initiateGhosting() {
    setIsProcessing(true)

    for (let file of files) {
      await fetch(`http://localhost:5000/api/incinerator/process/${file.id}`, {
        method: "POST",
      })

      setFiles((prev) =>
        prev.map((f) =>
          f.id === file.id ? { ...f, status: "processing" } : f
        )
      )

      addLog("warning", `PROCESSING: ${file.name}`)
    }

    setTimeout(() => {
      setFiles((prev) =>
        prev.map((f) => ({ ...f, status: "destroyed", entropy: 100 }))
      )
      setGlobalEntropy(100)
      setIsProcessing(false)
      addLog("success", "ALL FILES DESTROYED")
    }, 3000)
  }

  function clearDestroyed() {
    setFiles((prev) => prev.filter((f) => f.status !== "destroyed"))
    setGlobalEntropy(0)
    addLog("info", "SYSTEM: Cleared")
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 px-6">
        <div className="max-w-5xl mx-auto space-y-6">

          {/* Upload Box */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn("border-2 border-dashed p-10 text-center rounded-xl", isDragging && "border-primary")}
          >
            <input type="file" multiple onChange={handleFileSelect} className="hidden" />
            <Upload className="mx-auto mb-4" />
            <p>Drop files or click to upload</p>
          </div>

          {/* Files */}
          {files.map((file) => (
            <div key={file.id} className="flex justify-between border p-3 rounded">
              <span>{file.name}</span>
              <span>{file.status}</span>
            </div>
          ))}

          {/* Buttons */}
          <Button onClick={initiateGhosting} disabled={isProcessing}>
            {isProcessing ? "Processing..." : "Start Ghosting"}
          </Button>

          <Button onClick={clearDestroyed} variant="ghost">
            Clear
          </Button>

          {/* Logs */}
          <div className="bg-black text-xs p-3 h-40 overflow-auto font-mono">
            {logs.map((log, i) => (
              <div key={i}>
                [{log.timestamp}] {log.message}
              </div>
            ))}
            <div ref={logEndRef} />
          </div>

        </div>
      </main>
    </div>
  )
}
