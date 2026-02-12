"use client"

import { useState, useRef } from "react"
import { Upload, FileDown, ArrowLeft, Type, Minus } from "lucide-react"

export function EditPdf({ onBack }: { onBack: () => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [pages, setPages] = useState<string[]>([])
  const [annotations, setAnnotations] = useState<
    { pageIndex: number; x: number; y: number; text: string; type: "text" | "line"; x2?: number; y2?: number }[]
  >([])
  const [status, setStatus] = useState("")
  const [processing, setProcessing] = useState(false)
  const [activeTool, setActiveTool] = useState<"text" | "line">("text")
  const [textInput, setTextInput] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const [activePageIndex, setActivePageIndex] = useState(0)
  const [lineStart, setLineStart] = useState<{ x: number; y: number } | null>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0])
      setPages([])
      setAnnotations([])
      setStatus("")
      loadPdf(e.target.files[0])
    }
  }

  const loadPdf = async (pdfFile: File) => {
    setProcessing(true)
    setStatus("Loading PDF...")
    try {
      const pdfjsLib = await import("pdfjs-dist")
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

      const arrayBuffer = await pdfFile.arrayBuffer()
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise
      const rendered: string[] = []

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const viewport = page.getViewport({ scale: 1.5 })
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")!
        canvas.width = viewport.width
        canvas.height = viewport.height
        await page.render({ canvasContext: ctx, viewport }).promise
        rendered.push(canvas.toDataURL("image/png"))
      }

      setPages(rendered)
      setStatus("Click on the page to add text annotations.")
    } catch {
      setStatus("Error loading PDF.")
    }
    setProcessing(false)
  }

  const handlePageClick = (e: React.MouseEvent<HTMLDivElement>, pageIndex: number) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    if (activeTool === "text" && textInput.trim()) {
      setAnnotations((prev) => [
        ...prev,
        { pageIndex, x, y, text: textInput, type: "text" },
      ])
      setTextInput("")
    } else if (activeTool === "line") {
      if (!lineStart) {
        setLineStart({ x, y })
        setActivePageIndex(pageIndex)
      } else {
        setAnnotations((prev) => [
          ...prev,
          { pageIndex: activePageIndex, x: lineStart.x, y: lineStart.y, text: "", type: "line", x2: x, y2: y },
        ])
        setLineStart(null)
      }
    }
  }

  const exportPdf = async () => {
    if (pages.length === 0) return
    setProcessing(true)
    setStatus("Generating edited PDF...")

    try {
      const { jsPDF } = await import("jspdf")
      const pdf = new jsPDF("p", "mm", "a4")
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()

      for (let i = 0; i < pages.length; i++) {
        if (i > 0) pdf.addPage()
        pdf.addImage(pages[i], "PNG", 0, 0, pageWidth, pageHeight)

        const pageAnnotations = annotations.filter((a) => a.pageIndex === i)
        for (const ann of pageAnnotations) {
          if (ann.type === "text") {
            pdf.setFontSize(12)
            pdf.setTextColor(220, 50, 50)
            pdf.text(ann.text, (ann.x / 100) * pageWidth, (ann.y / 100) * pageHeight)
          } else if (ann.type === "line" && ann.x2 !== undefined && ann.y2 !== undefined) {
            pdf.setDrawColor(220, 50, 50)
            pdf.setLineWidth(0.5)
            pdf.line(
              (ann.x / 100) * pageWidth,
              (ann.y / 100) * pageHeight,
              (ann.x2 / 100) * pageWidth,
              (ann.y2 / 100) * pageHeight
            )
          }
        }
      }

      pdf.save(`Elite_Edited_${Date.now()}.pdf`)
      setStatus("Edited PDF saved!")
    } catch {
      setStatus("Error saving PDF.")
    }
    setProcessing(false)
  }

  const removeAnnotation = (index: number) => {
    setAnnotations((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="mx-auto max-w-4xl">
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Tools
      </button>

      <h2 className="mb-2 text-2xl font-bold text-foreground">Edit PDF</h2>
      <p className="mb-6 text-muted-foreground">
        Add text annotations and lines to your PDF, then export.
      </p>

      {pages.length === 0 && (
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
      )}

      {pages.length > 0 && (
        <>
          <div className="mb-4 flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card p-3">
            <button
              onClick={() => setActiveTool("text")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                activeTool === "text"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground hover:bg-muted/80"
              }`}
            >
              <Type className="h-4 w-4" />
              Text
            </button>
            <button
              onClick={() => { setActiveTool("line"); setLineStart(null) }}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                activeTool === "line"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground hover:bg-muted/80"
              }`}
            >
              <Minus className="h-4 w-4" />
              Line
            </button>
            {activeTool === "text" && (
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Type text, then click on page..."
                className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
              />
            )}
            {activeTool === "line" && lineStart && (
              <span className="text-xs text-muted-foreground">
                Click again to finish line
              </span>
            )}
          </div>

          <div className="space-y-4">
            {pages.map((page, i) => (
              <div
                key={i}
                className="relative cursor-crosshair rounded-lg border border-border"
                onClick={(e) => handlePageClick(e, i)}
              >
                <img src={page} alt={`Page ${i + 1}`} className="w-full rounded-lg" />
                {annotations
                  .filter((a) => a.pageIndex === i)
                  .map((ann, j) =>
                    ann.type === "text" ? (
                      <div
                        key={j}
                        className="absolute text-xs font-bold text-destructive"
                        style={{ left: `${ann.x}%`, top: `${ann.y}%`, transform: "translate(-50%, -50%)" }}
                        onClick={(e) => {
                          e.stopPropagation()
                          removeAnnotation(annotations.indexOf(ann))
                        }}
                      >
                        {ann.text}
                      </div>
                    ) : (
                      <svg
                        key={j}
                        className="pointer-events-none absolute inset-0 h-full w-full"
                      >
                        <line
                          x1={`${ann.x}%`}
                          y1={`${ann.y}%`}
                          x2={`${ann.x2}%`}
                          y2={`${ann.y2}%`}
                          stroke="hsl(0 72% 51%)"
                          strokeWidth="2"
                        />
                      </svg>
                    )
                  )}
                <div className="absolute bottom-2 left-2 rounded bg-foreground/70 px-2 py-0.5 text-xs text-background">
                  Page {i + 1}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={exportPdf}
            disabled={processing}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            <FileDown className="h-5 w-5" />
            {processing ? "Exporting..." : "Export Edited PDF"}
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
