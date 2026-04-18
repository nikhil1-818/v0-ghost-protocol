"use client"

import { Upload, RefreshCw, CheckCircle, FileWarning } from "lucide-react"
import { useState, useCallback, useEffect } from "react"

interface FileItem {
  id: string
  name: string
  size: number
  status: "pending" | "processing" | "destroyed"
}

export default function IncineratorPage() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // ✅ FETCH FILES
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
        }))
      )
    }

    fetchFiles()
  }, [])

  // 🔹 DRAG EVENTS
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

  // 🔹 FILE SELECT
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    addFilesToQueue(selectedFiles)
  }

  // ✅ UPLOAD
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
        },
      ])
    }
  }

  // ✅ PROCESS
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
    }

    setTimeout(() => {
      setFiles((prev) =>
        prev.map((f) => ({ ...f, status: "destroyed" }))
      )
      setIsProcessing(false)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">

      {/* 🔥 HEADER */}
      <h1 className="text-3xl font-bold mb-6">Digital Incinerator</h1>

      {/* 🔥 DROP ZONE (FIXED) */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById("fileInput")?.click()}
        className={`border-2 border-dashed rounded-xl p-12 text-center transition cursor-pointer ${
          isDragging ? "border-green-400 bg-green-900/20" : "border-gray-600"
        }`}
      >
        <input
          id="fileInput"
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />

        <Upload className="mx-auto mb-4 w-10 h-10 text-green-400" />
        <p className="text-lg font-semibold">Drop files to incinerate</p>
        <p className="text-sm text-gray-400">or click to browse</p>
      </div>

      {/* 📁 FILE LIST */}
      <div className="mt-6 space-y-3">
        {files.map((file) => (
          <div
            key={file.id}
            className="flex items-center justify-between border border-gray-700 rounded-lg p-3"
          >
            <div className="flex items-center gap-3">
              {file.status === "pending" && <FileWarning />}
              {file.status === "processing" && <RefreshCw className="animate-spin" />}
              {file.status === "destroyed" && <CheckCircle className="text-green-400" />}

              <span>{file.name}</span>
            </div>

            <span className="text-sm text-gray-400">{file.status}</span>
          </div>
        ))}
      </div>

      {/* 🚀 BUTTON */}
      <button
        onClick={initiateGhosting}
        disabled={isProcessing}
        className="mt-6 w-full bg-red-600 hover:bg-red-700 py-3 rounded font-bold"
      >
        {isProcessing ? "Processing..." : "INITIATE GHOST PROTOCOL"}
      </button>

    </div>
  )
}
