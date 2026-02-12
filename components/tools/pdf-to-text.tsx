"use client"

import { useState, useRef } from "react"
import { Upload, FileText, Copy, Download, ArrowLeft } from "lucide-react"

export function PdfToText({ onBack }: { onBack: () => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [text, setText] = useState("")
  const [status, setStatus] = useState("")
  const [processing, setProcessing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0])
      setText("")
      setStatus("")
    }
  }

  const extractText = async () => {
    if (!file) {
      setStatus("Please select a PDF file.")
      return
    }
    setProcessing(true)
    setStatus("Extracting text...")

    try {
      const pdfjsLib = await import("pdfjs-dist")
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise
      let fullText = ""

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const content = await page.getTextContent()
        const pageText = content.items
          .map((item: { str?: string }) => ("str" in item ? item.str : ""))
          .join(" ")
        fullText += `--- Page ${i} ---\n${pageText}\n\n`
      }

      setText(fullText)
      setStatus(`Extracted text from ${pdf.numPages} page(s).`)
    } catch {
      setStatus("Error extracting text. Please try again.")
    }
    setProcessing(false)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text)
    setStatus("Text copied to clipboard!")
  }

  const downloadText = () => {
    const blob = new Blob([text], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.download = `Elite_Text_${Date.now()}.txt`
    link.href = url
    link.click()
    URL.revokeObjectURL(url)
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

      <h2 className="mb-2 text-2xl font-bold text-foreground">PDF to Text</h2>
      <p className="mb-6 text-muted-foreground">
        Extract all text content from a PDF file.
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
        onClick={extractText}
        disabled={processing || !file}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
      >
        <FileText className="h-5 w-5" />
        {processing ? "Extracting..." : "Extract Text"}
      </button>

      {status && (
        <p className="mt-4 text-center text-sm font-medium text-muted-foreground">
          {status}
        </p>
      )}

      {text && (
        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Extracted Text</h3>
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
              >
                <Copy className="h-3 w-3" />
                Copy
              </button>
              <button
                onClick={downloadText}
                className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
              >
                <Download className="h-3 w-3" />
                Download .txt
              </button>
            </div>
          </div>
          <textarea
            readOnly
            value={text}
            className="h-64 w-full resize-y rounded-lg border border-border bg-muted/50 p-4 text-sm text-foreground"
          />
        </div>
      )}
    </div>
  )
}
