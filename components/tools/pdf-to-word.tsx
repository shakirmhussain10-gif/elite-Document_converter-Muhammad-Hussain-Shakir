"use client"

import { useState, useRef } from "react"
import { Upload, FileDown, ArrowLeft } from "lucide-react"
import { loadPdfJs } from "@/lib/pdf-loader"

export function PdfToWord({ onBack }: { onBack: () => void }) {
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
      setStatus("Please select a PDF file.")
      return
    }
    setProcessing(true)
    setStatus("Extracting text from PDF...")

    try {
      const pdfjsLib = await loadPdfJs()

      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise
      let htmlContent = ""

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const content = await page.getTextContent()
        const pageText = content.items
          .map((item: { str?: string }) => ("str" in item ? item.str : ""))
          .join(" ")
        htmlContent += `<h2>Page ${i}</h2><p>${pageText}</p><br/>`
      }

      // Create a .doc file using HTML format (compatible with Word)
      const docContent = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
        <head><meta charset="utf-8"><title>Converted Document</title>
        <style>body{font-family:Calibri,sans-serif;font-size:12pt;line-height:1.6;margin:40px;}h2{color:#003366;font-size:16pt;}p{margin-bottom:12pt;}</style>
        </head><body>${htmlContent}</body></html>`

      const blob = new Blob([docContent], { type: "application/msword" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.download = `Elite_Converted_${Date.now()}.doc`
      link.href = url
      link.click()
      URL.revokeObjectURL(url)
      setStatus("Word document created successfully!")
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

      <h2 className="mb-2 text-2xl font-bold text-foreground">PDF to Word</h2>
      <p className="mb-6 text-muted-foreground">
        Convert PDF documents to Word (.doc) format.
      </p>

      <div
        onClick={() => inputRef.current?.click()}
        className="flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed border-border bg-muted/50 p-10 transition-colors hover:border-secondary hover:bg-muted"
      >
        <Upload className="h-10 w-10 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          {file ? file.name : "Click to select a PDF file"}
        </p>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
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
        {processing ? "Converting..." : "Convert to Word"}
      </button>

      {status && (
        <p className="mt-4 text-center text-sm font-medium text-muted-foreground">
          {status}
        </p>
      )}
    </div>
  )
}
