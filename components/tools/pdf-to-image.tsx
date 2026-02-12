"use client"

import { useState, useRef } from "react"
import { Upload, ImageDown, ArrowLeft } from "lucide-react"
import { loadPdfJs } from "@/lib/pdf-loader"

export function PdfToImage({ onBack }: { onBack: () => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [images, setImages] = useState<string[]>([])
  const [status, setStatus] = useState("")
  const [processing, setProcessing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0])
      setImages([])
      setStatus("")
    }
  }

  const extract = async () => {
    if (!file) {
      setStatus("Please select a PDF file.")
      return
    }
    setProcessing(true)
    setStatus("Extracting pages...")

    try {
      const pdfjsLib = await loadPdfJs()

      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise
      const extracted: string[] = []

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const viewport = page.getViewport({ scale: 2.0 })
        const canvas = document.createElement("canvas")
        const context = canvas.getContext("2d")!
        canvas.height = viewport.height
        canvas.width = viewport.width
        await page.render({ canvasContext: context, viewport }).promise
        extracted.push(canvas.toDataURL("image/png"))
      }

      setImages(extracted)
      setStatus(`Extracted ${extracted.length} page(s) successfully!`)
    } catch {
      setStatus("Error extracting pages. Please try again.")
    }
    setProcessing(false)
  }

  const downloadImage = (dataUrl: string, index: number) => {
    const link = document.createElement("a")
    link.download = `Elite_Page_${index + 1}.png`
    link.href = dataUrl
    link.click()
  }

  const downloadAll = () => {
    images.forEach((img, i) => downloadImage(img, i))
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
        PDF to Image
      </h2>
      <p className="mb-6 text-muted-foreground">
        Extract all pages from a PDF as high-quality PNG images.
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
        onClick={extract}
        disabled={processing || !file}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
      >
        <ImageDown className="h-5 w-5" />
        {processing ? "Extracting..." : "Extract All Pages"}
      </button>

      {status && (
        <p className="mt-4 text-center text-sm font-medium text-muted-foreground">
          {status}
        </p>
      )}

      {images.length > 0 && (
        <div className="mt-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Extracted Pages</h3>
            <button
              onClick={downloadAll}
              className="rounded-lg bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-secondary/90"
            >
              Download All
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {images.map((img, i) => (
              <div key={i} className="group relative">
                <img
                  src={img}
                  alt={`Page ${i + 1}`}
                  className="w-full rounded-lg border border-border"
                />
                <button
                  onClick={() => downloadImage(img, i)}
                  className="absolute inset-0 flex items-center justify-center rounded-lg bg-foreground/60 text-sm font-semibold text-background opacity-0 transition-opacity group-hover:opacity-100"
                >
                  Download Page {i + 1}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
