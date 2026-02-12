"use client"

import { useState, useRef, useCallback } from "react"
import { Upload, Download, ArrowLeft } from "lucide-react"

export function BwConverter({ onBack }: { onBack: () => void }) {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [bwSrc, setBwSrc] = useState<string | null>(null)
  const [status, setStatus] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setImageSrc(reader.result as string)
        setBwSrc(null)
        setStatus("")
      }
      reader.readAsDataURL(file)
    }
  }

  const convertToBW = useCallback(() => {
    if (!imageSrc) return
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = imageSrc
    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext("2d")!
      ctx.drawImage(img, 0, 0)

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data
      for (let i = 0; i < data.length; i += 4) {
        const avg = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114
        data[i] = avg
        data[i + 1] = avg
        data[i + 2] = avg
      }
      ctx.putImageData(imageData, 0, 0)
      setBwSrc(canvas.toDataURL("image/png"))
      setStatus("Conversion complete!")
    }
  }, [imageSrc])

  const downloadBW = () => {
    if (!bwSrc) return
    const link = document.createElement("a")
    link.download = `Elite_BW_${Date.now()}.png`
    link.href = bwSrc
    link.click()
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
        B/W Converter
      </h2>
      <p className="mb-6 text-muted-foreground">
        Convert any color photo to professional black and white.
      </p>

      {!imageSrc && (
        <div
          onClick={() => inputRef.current?.click()}
          className="flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed border-border bg-muted/50 p-10 transition-colors hover:border-secondary hover:bg-muted"
        >
          <Upload className="h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Click to select a photo
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
          />
        </div>
      )}

      {imageSrc && !bwSrc && (
        <>
          <div className="mb-4 overflow-hidden rounded-xl border border-border">
            <img src={imageSrc} alt="Original" className="w-full" />
          </div>
          <button
            onClick={convertToBW}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Convert to B/W
          </button>
        </>
      )}

      {bwSrc && (
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
                Black & White
              </p>
              <img
                src={bwSrc}
                alt="B/W"
                className="w-full rounded-lg border border-border"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setImageSrc(null)
                setBwSrc(null)
              }}
              className="flex-1 rounded-lg border border-border px-6 py-3 font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Choose Another
            </button>
            <button
              onClick={downloadBW}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Download className="h-5 w-5" />
              Download
            </button>
          </div>
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
