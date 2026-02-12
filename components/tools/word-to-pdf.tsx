"use client"

import { useState, useRef } from "react"
import { Upload, FileDown, ArrowLeft } from "lucide-react"

export function WordToPdf({ onBack }: { onBack: () => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState("")
  const [processing, setProcessing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0])
      setStatus("")
    }
  }

  const convert = async () => {
    if (!file) {
      setStatus("Please select a Word file.")
      return
    }
    setProcessing(true)
    setStatus("Converting Word to PDF...")

    try {
      const mammoth = await import("mammoth")
      const arrayBuffer = await file.arrayBuffer()
      const result = await mammoth.convertToHtml({ arrayBuffer })
      const htmlContent = result.value

      const { jsPDF } = await import("jspdf")
      const pdf = new jsPDF("p", "mm", "a4")
      const pageWidth = pdf.internal.pageSize.getWidth()
      const margin = 15
      const maxWidth = pageWidth - margin * 2
      const lineHeight = 6
      let y = margin

      // Strip HTML tags for text extraction
      const div = document.createElement("div")
      div.innerHTML = htmlContent
      const textContent = div.innerText || div.textContent || ""
      const lines = pdf.splitTextToSize(textContent, maxWidth)

      for (const line of lines) {
        if (y > pdf.internal.pageSize.getHeight() - margin) {
          pdf.addPage()
          y = margin
        }
        pdf.text(line, margin, y)
        y += lineHeight
      }

      pdf.save(`Elite_WordToPdf_${Date.now()}.pdf`)
      setStatus("PDF created successfully!")
    } catch {
      setStatus("Error converting. Please try again.")
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

      <h2 className="mb-2 text-2xl font-bold text-foreground">Word to PDF</h2>
      <p className="mb-6 text-muted-foreground">
        Convert Word documents (.docx) to PDF format.
      </p>

      <div
        onClick={() => inputRef.current?.click()}
        className="flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed border-border bg-muted/50 p-10 transition-colors hover:border-secondary hover:bg-muted"
      >
        <Upload className="h-10 w-10 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          {file ? file.name : "Click to select a Word file (.docx)"}
        </p>
        <input
          ref={inputRef}
          type="file"
          accept=".docx,.doc"
          onChange={handleFile}
          className="hidden"
        />
      </div>

      <button
        onClick={convert}
        disabled={processing || !file}
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
