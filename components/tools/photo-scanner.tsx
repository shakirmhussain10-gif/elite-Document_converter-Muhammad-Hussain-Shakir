"use client"

import { useState, useRef, useCallback } from "react"
import { Upload, Download, FileDown, ArrowLeft, Camera } from "lucide-react"

export function PhotoScanner({ onBack }: { onBack: () => void }) {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [scannedSrc, setScannedSrc] = useState<string | null>(null)
  const [status, setStatus] = useState("")
  const [processing, setProcessing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const cameraRef = useRef<HTMLInputElement>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setImageSrc(reader.result as string)
        setScannedSrc(null)
        setStatus("")
      }
      reader.readAsDataURL(file)
    }
  }

  const scanImage = useCallback(() => {
    if (!imageSrc) return
    setProcessing(true)
    setStatus("Scanning and enhancing...")

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = imageSrc
    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext("2d")!

      // Apply document scanning effect: grayscale + high contrast + sharpen
      ctx.filter = "grayscale(100%) contrast(180%) brightness(120%)"
      ctx.drawImage(img, 0, 0)

      // Additional threshold processing for clean scan look
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data
      for (let i = 0; i < data.length; i += 4) {
        const avg = data[i]
        const threshold = avg > 140 ? 255 : 0
        data[i] = threshold
        data[i + 1] = threshold
        data[i + 2] = threshold
      }
      ctx.putImageData(imageData, 0, 0)

      setScannedSrc(canvas.toDataURL("image/png"))
      setStatus("Scan complete!")
      setProcessing(false)
    }
  }, [imageSrc])

  const downloadScanned = () => {
    if (!scannedSrc) return
    const link = document.createElement("a")
    link.download = `Elite_Scanned_${Date.now()}.png`
    link.href = scannedSrc
    link.click()
  }

  const exportAsPdf = async () => {
    if (!scannedSrc) return
    setProcessing(true)
    try {
      const { jsPDF } = await import("jspdf")
      const pdf = new jsPDF("p", "mm", "a4")
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()

      const img = new Image()
      img.crossOrigin = "anonymous"
      img.src = scannedSrc
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
          pdf.addImage(scannedSrc!, "PNG", x, y, fW, fH)
          resolve()
        }
      })
      pdf.save(`Elite_Scanned_${Date.now()}.pdf`)
      setStatus("PDF saved!")
    } catch {
      setStatus("Error exporting PDF.")
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
        Photo Scanner
      </h2>
      <p className="mb-6 text-muted-foreground">
        Scan photos/documents: import from gallery or camera, enhance to clean B/W scan, and export as image or PDF.
      </p>

      {!imageSrc && (
        <div className="flex flex-col gap-3">
          <div
            onClick={() => inputRef.current?.click()}
            className="flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed border-border bg-muted/50 p-10 transition-colors hover:border-secondary hover:bg-muted"
          >
            <Upload className="h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Import from Gallery
            </p>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="hidden"
            />
          </div>
          <button
            onClick={() => cameraRef.current?.click()}
            className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/50 p-6 text-sm text-muted-foreground transition-colors hover:border-secondary hover:bg-muted"
          >
            <Camera className="h-5 w-5" />
            Capture from Camera
            <input
              ref={cameraRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFile}
              className="hidden"
            />
          </button>
        </div>
      )}

      {imageSrc && !scannedSrc && (
        <>
          <div className="mb-4 overflow-hidden rounded-xl border border-border">
            <img src={imageSrc} alt="Original" className="w-full" />
          </div>
          <button
            onClick={scanImage}
            disabled={processing}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {processing ? "Scanning..." : "Scan & Enhance"}
          </button>
        </>
      )}

      {scannedSrc && (
        <>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <p className="mb-1 text-xs font-medium text-muted-foreground">
                Original
              </p>
              <img
                src={imageSrc!}
                alt="Original"
                className="w-full rounded-lg border border-border"
              />
            </div>
            <div>
              <p className="mb-1 text-xs font-medium text-muted-foreground">
                Scanned
              </p>
              <img
                src={scannedSrc}
                alt="Scanned"
                className="w-full rounded-lg border border-border"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={downloadScanned}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Download className="h-4 w-4" />
              Download Image
            </button>
            <button
              onClick={exportAsPdf}
              disabled={processing}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-secondary px-4 py-3 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-secondary/90"
            >
              <FileDown className="h-4 w-4" />
              Export as PDF
            </button>
          </div>
          <button
            onClick={() => {
              setImageSrc(null)
              setScannedSrc(null)
            }}
            className="mt-3 w-full rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Scan Another
          </button>
        </>
      )}

      {status && (
        <p className="mt-4 text-center text-sm font-medium text-muted-foreground">
          {status}
        </p>
      )}
    </div>
  )
}
