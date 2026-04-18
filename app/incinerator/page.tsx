"use client"

import { Upload } from "lucide-react"
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

  // 🔹 FETCH FILES FROM BACKEND
  useEffect(() => {
    async function fetchFiles() {
      try {
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
      } catch (err) {
        console.log("Fetch error:", err)
      }
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

  // 🔹 UPLOAD FILE
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

  // 🔹 PROCESS FILE
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
    <div className="min-h-screen p-6 space-y-6">

      {/* 🔥 DROP ZONE FIXED */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById("fileInput")?.click()}
        className={`border-2 border-dashed p-10 text-center rounded-xl cursor-pointer ${
          isDragging ? "border-blue-500 bg-blue-100" : ""
        }`}
      >
        <input
          id="fileInput"
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />

        <Upload className="mx-auto mb-4" />
        <p className="text-lg font-medium">Click or Drop files</p>
      </div>

      {/* 📁 FILE LIST */}
      {files.map((file) => (
        <div key={file.id} className="border p-3 rounded flex justify-between">
          <span>{file.name}</span>
          <span>{file.status}</span>
        </div>
      ))}

      {/* 🚀 BUTTON */}
      <button
        onClick={initiateGhosting}
        disabled={isProcessing}
        className="px-4 py-2 bg-red-500 text-white rounded"
      >
        {isProcessing ? "Processing..." : "Start Ghosting"}
      </button>

    </div>
  )
}
