"use client"

import { useState, useRef, useCallback } from "react"
import { Upload, Download, ArrowLeft } from "lucide-react"

const FILTERS = [
  { name: "Original", filter: "none" },
  { name: "B/W", filter: "grayscale(100%)" },
  { name: "Sepia", filter: "sepia(100%)" },
  { name: "Vintage", filter: "sepia(50%) contrast(90%) brightness(90%)" },
  { name: "High Contrast", filter: "contrast(150%)" },
  { name: "Bright", filter: "brightness(130%)" },
  { name: "Warm", filter: "sepia(30%) saturate(140%)" },
  { name: "Cool", filter: "hue-rotate(180deg) saturate(80%)" },
  { name: "Dramatic", filter: "contrast(130%) brightness(80%) saturate(120%)" },
  { name: "Fade", filter: "brightness(110%) contrast(85%) saturate(80%)" },
  { name: "Vivid", filter: "saturate(180%) contrast(110%)" },
  { name: "Invert", filter: "invert(100%)" },
  { name: "Blur", filter: "blur(3px)" },
  { name: "Sharpen", filter: "contrast(120%) brightness(105%)" },
  { name: "Noir", filter: "grayscale(100%) contrast(140%) brightness(90%)" },
  { name: "Pop", filter: "saturate(200%) contrast(120%)" },
]

export function PhotoFilters({ onBack }: { onBack: () => void }) {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState(FILTERS[0])
  const [status, setStatus] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => setImageSrc(reader.result as string)
      reader.readAsDataURL(file)
      setActiveFilter(FILTERS[0])
      setStatus("")
    }
  }

  const downloadFiltered = useCallback(() => {
    if (!imageSrc) return
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = imageSrc
    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext("2d")!
      ctx.filter = activeFilter.filter
      ctx.drawImage(img, 0, 0)
      const link = document.createElement("a")
      link.download = `Elite_${activeFilter.name}_${Date.now()}.png`
      link.href = canvas.toDataURL("image/png")
      link.click()
      setStatus("Image downloaded!")
    }
  }, [imageSrc, activeFilter])

  return (
    <div className="mx-auto max-w-4xl">
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Tools
      </button>

      <h2 className="mb-2 text-2xl font-bold text-foreground">
        Photo Filters
      </h2>
      <p className="mb-6 text-muted-foreground">
        Apply professional filters to your photos including B/W, Sepia, Vintage
        and more.
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

      {imageSrc && (
        <>
          <div className="mb-6 overflow-hidden rounded-xl border border-border">
            <img
              src={imageSrc}
              alt="Preview"
              className="w-full"
              style={{ filter: activeFilter.filter }}
            />
          </div>

          <div className="mb-6 grid grid-cols-4 gap-2 md:grid-cols-8">
            {FILTERS.map((f) => (
              <button
                key={f.name}
                onClick={() => setActiveFilter(f)}
                className={`flex flex-col items-center gap-1 rounded-lg border p-2 text-xs transition-all ${
                  activeFilter.name === f.name
                    ? "border-secondary bg-secondary/10 font-semibold text-foreground"
                    : "border-border text-muted-foreground hover:border-secondary/50"
                }`}
              >
                <div className="h-10 w-10 overflow-hidden rounded">
                  <img
                    src={imageSrc}
                    alt={f.name}
                    className="h-full w-full object-cover"
                    style={{ filter: f.filter }}
                  />
                </div>
                {f.name}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setImageSrc(null)
                setActiveFilter(FILTERS[0])
              }}
              className="flex-1 rounded-lg border border-border px-6 py-3 font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Choose Another
            </button>
            <button
              onClick={downloadFiltered}
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
