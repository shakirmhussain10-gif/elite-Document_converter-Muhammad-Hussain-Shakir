"use client"

import { useState, useRef } from "react"
import { Upload, Download, X, ArrowLeft, FolderArchive } from "lucide-react"

export function ZipCreator({ onBack }: { onBack: () => void }) {
  const [files, setFiles] = useState<File[]>([])
  const [zipName, setZipName] = useState("")
  const [status, setStatus] = useState("")
  const [processing, setProcessing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)])
      setStatus("")
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const createZip = async () => {
    if (files.length === 0) {
      setStatus("Please add at least one file.")
      return
    }
    setProcessing(true)
    setStatus("Creating ZIP archive...")

    try {
      const JSZip = (await import("jszip")).default
      const zip = new JSZip()

      for (const file of files) {
        const buffer = await file.arrayBuffer()
        zip.file(file.name, buffer)
      }

      const blob = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: { level: 6 },
      })

      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.download = `${zipName || "Elite_Archive"}_${Date.now()}.zip`
      link.href = url
      link.click()
      URL.revokeObjectURL(url)
      setStatus(
        `ZIP created! ${files.length} file(s) compressed to ${formatSize(blob.size)}.`
      )
    } catch {
      setStatus("Error creating ZIP archive.")
    }
    setProcessing(false)
  }

  return (
    <div className="mx-auto max-w-2xl">
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Tools
      </button>

      <h2 className="mb-2 text-2xl font-bold text-foreground">ZIP Creator</h2>
      <p className="mb-6 text-muted-foreground">
        Combine multiple files into a compressed ZIP archive.
      </p>

      <div
        onClick={() => inputRef.current?.click()}
        className="flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed border-border bg-muted/50 p-10 transition-colors hover:border-secondary hover:bg-muted"
      >
        <Upload className="h-10 w-10 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Click to add files
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          onChange={handleFiles}
          className="hidden"
        />
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((f, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-2"
            >
              <div className="flex-1 truncate">
                <span className="text-sm text-foreground">{f.name}</span>
                <span className="ml-2 text-xs text-muted-foreground">
                  ({formatSize(f.size)})
                </span>
              </div>
              <button
                onClick={() => removeFile(i)}
                className="ml-2 text-muted-foreground hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          <p className="text-xs text-muted-foreground">
            {files.length} file(s) - Total:{" "}
            {formatSize(files.reduce((acc, f) => acc + f.size, 0))}
          </p>
        </div>
      )}

      <div className="mt-4">
        <label className="mb-1.5 block text-sm font-medium text-foreground">
          ZIP Name (optional)
        </label>
        <input
          type="text"
          value={zipName}
          onChange={(e) => setZipName(e.target.value)}
          placeholder="Elite_Archive"
          className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <button
        onClick={createZip}
        disabled={processing || files.length === 0}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
      >
        <FolderArchive className="h-5 w-5" />
        {processing ? "Creating..." : "Create ZIP"}
      </button>

      {status && (
        <p className="mt-4 text-center text-sm font-medium text-muted-foreground">
          {status}
        </p>
      )}
    </div>
  )
}
