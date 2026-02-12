"use client"

import { useState, useRef } from "react"
import { Upload, FileDown, X, ArrowLeft } from "lucide-react"

export function ImageToPdf({ onBack }: { onBack: () => void }) {
  const [files, setFiles] = useState<File[]>([])
  const [status, setStatus] = useState("")
  const [processing, setProcessing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
      setStatus("")
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const convert = async () => {
    if (files.length === 0) {
      setStatus("Please select at least one image.")
      return
    }
    setProcessing(true)
    setStatus("Processing...")

    try {
      const { jsPDF } = await import("jspdf")
      const pdf = new jsPDF("p", "mm", "a4")
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()

      for (let i = 0; i < files.length; i++) {
        const imgData = await readFileAsDataURL(files[i])
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.src = imgData
        await new Promise<void>((resolve) => {
          img.onload = () => {
            const margin = 5
            const maxW = pageWidth - margin * 2
            const maxH = pageHeight - margin * 2
            const ratio = Math.min(maxW / img.width, maxH / img.height)
            const fW = img.width * ratio
            const fH = img.height * ratio
            const x = (pageWidth - fW) / 2
            const y = (pageHeight - fH) / 2
            if (i > 0) pdf.addPage()
            pdf.addImage(imgData, "JPEG", x, y, fW, fH, undefined, "FAST")
            resolve()
          }
        })
      }
      pdf.save(`Elite_Converter_${Date.now()}.pdf`)
      setStatus("PDF created successfully!")
    } catch {
      setStatus("Error creating PDF. Please try again.")
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

      <h2 className="mb-2 text-2xl font-bold text-foreground">
        Image to PDF
      </h2>
      <p className="mb-6 text-muted-foreground">
        Convert one or multiple images into a PDF document.
      </p>

      <div
        onClick={() => inputRef.current?.click()}
        className="flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed border-border bg-muted/50 p-10 transition-colors hover:border-secondary hover:bg-muted"
      >
        <Upload className="h-10 w-10 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Click to select images (JPG, PNG)
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
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
              <span className="truncate text-sm text-foreground">
                {f.name}
              </span>
              <button
                onClick={() => removeFile(i)}
                className="ml-2 text-muted-foreground hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={convert}
        disabled={processing || files.length === 0}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
      >
        <FileDown className="h-5 w-5" />
        {processing ? "Converting..." : "Convert to PDF"}
      </button>

      {status && (
        <p className="mt-4 text-center text-sm font-medium text-muted-foreground">
          {status}
        </p>
      )}
    </div>
  )
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
