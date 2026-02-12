"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { PwaRegister } from "@/components/pwa-register"
import { ToolCard } from "@/components/tool-card"
import { ImageToPdf } from "@/components/tools/image-to-pdf"
import { PdfToImage } from "@/components/tools/pdf-to-image"
import { PdfToText } from "@/components/tools/pdf-to-text"
import { PdfToWord } from "@/components/tools/pdf-to-word"
import { WordToPdf } from "@/components/tools/word-to-pdf"
import { EditPdf } from "@/components/tools/edit-pdf"
import { PhotoFilters } from "@/components/tools/photo-filters"
import { PhotoScanner } from "@/components/tools/photo-scanner"
import { BwConverter } from "@/components/tools/bw-converter"
import { PasswordProtect } from "@/components/tools/password-protect"
import { ZipCreator } from "@/components/tools/zip-creator"
import {
  FileImage,
  ImageDown,
  FileText,
  FileOutput,
  FileInput,
  PenLine,
  Palette,
  ScanLine,
  Contrast,
  Lock,
  FolderArchive,
  Sparkles,
} from "lucide-react"

type ToolId =
  | null
  | "img2pdf"
  | "pdf2img"
  | "pdf2text"
  | "pdf2word"
  | "word2pdf"
  | "editpdf"
  | "filters"
  | "scanner"
  | "bw"
  | "password"
  | "zip"

const TOOL_CATEGORIES = [
  {
    title: "PDF Tools",
    tools: [
      {
        id: "img2pdf" as ToolId,
        icon: FileImage,
        title: "Image to PDF",
        description: "Convert JPG, PNG images to PDF with auto-fit.",
        color: "bg-primary/10 text-primary",
      },
      {
        id: "pdf2img" as ToolId,
        icon: ImageDown,
        title: "PDF to Image",
        description: "Extract PDF pages as high-quality PNG images.",
        color: "bg-primary/10 text-primary",
      },
      {
        id: "pdf2text" as ToolId,
        icon: FileText,
        title: "PDF to Text",
        description: "Extract all text content from PDF documents.",
        color: "bg-primary/10 text-primary",
      },
      {
        id: "pdf2word" as ToolId,
        icon: FileOutput,
        title: "PDF to Word",
        description: "Convert PDF documents to Word (.doc) format.",
        color: "bg-primary/10 text-primary",
      },
      {
        id: "word2pdf" as ToolId,
        icon: FileInput,
        title: "Word to PDF",
        description: "Convert Word (.docx) documents to PDF format.",
        color: "bg-primary/10 text-primary",
      },
      {
        id: "editpdf" as ToolId,
        icon: PenLine,
        title: "Edit PDF",
        description: "Add text, draw lines on your PDF and export.",
        color: "bg-primary/10 text-primary",
      },
    ],
  },
  {
    title: "Image Tools",
    tools: [
      {
        id: "filters" as ToolId,
        icon: Palette,
        title: "Photo Filters",
        description: "Apply 16+ professional filters to photos.",
        color: "bg-secondary/15 text-secondary-foreground",
      },
      {
        id: "bw" as ToolId,
        icon: Contrast,
        title: "B/W Converter",
        description: "Convert color photos to black and white.",
        color: "bg-secondary/15 text-secondary-foreground",
      },
      {
        id: "scanner" as ToolId,
        icon: ScanLine,
        title: "Photo Scanner",
        description: "Scan documents from photos or camera to clean B/W.",
        color: "bg-secondary/15 text-secondary-foreground",
      },
    ],
  },
  {
    title: "Utility Tools",
    tools: [
      {
        id: "password" as ToolId,
        icon: Lock,
        title: "Password Protect",
        description: "Encrypt files with password protection.",
        color: "bg-muted text-foreground",
      },
      {
        id: "zip" as ToolId,
        icon: FolderArchive,
        title: "ZIP Creator",
        description: "Compress multiple files into a ZIP archive.",
        color: "bg-muted text-foreground",
      },
    ],
  },
]

export default function Home() {
  const [activeTool, setActiveTool] = useState<ToolId>(null)

  const goBack = () => setActiveTool(null)

  const renderTool = () => {
    switch (activeTool) {
      case "img2pdf":
        return <ImageToPdf onBack={goBack} />
      case "pdf2img":
        return <PdfToImage onBack={goBack} />
      case "pdf2text":
        return <PdfToText onBack={goBack} />
      case "pdf2word":
        return <PdfToWord onBack={goBack} />
      case "word2pdf":
        return <WordToPdf onBack={goBack} />
      case "editpdf":
        return <EditPdf onBack={goBack} />
      case "filters":
        return <PhotoFilters onBack={goBack} />
      case "scanner":
        return <PhotoScanner onBack={goBack} />
      case "bw":
        return <BwConverter onBack={goBack} />
      case "password":
        return <PasswordProtect onBack={goBack} />
      case "zip":
        return <ZipCreator onBack={goBack} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <PwaRegister />
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        {activeTool ? (
          renderTool()
        ) : (
          <>
            {/* Hero Section */}
            <div className="mb-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
                <Sparkles className="h-8 w-8" />
              </div>
              <h2 className="mb-3 text-balance text-3xl font-bold text-foreground md:text-4xl">
                All-in-One Document Converter
              </h2>
              <p className="mx-auto max-w-2xl text-pretty text-muted-foreground leading-relaxed">
                Free, fast, and secure. Convert PDFs, edit documents, apply
                photo filters, create ZIP files and more. Everything runs
                locally in your browser - your files never leave your device.
              </p>
              <p className="mt-2 text-sm font-semibold text-secondary">
                Created by Muhammad Hussain Shakir
              </p>
            </div>

            {/* Tool Categories */}
            {TOOL_CATEGORIES.map((category) => (
              <section key={category.title} className="mb-10">
                <h3 className="mb-4 text-lg font-bold text-foreground">
                  {category.title}
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {category.tools.map((tool) => (
                    <ToolCard
                      key={tool.id}
                      icon={tool.icon}
                      title={tool.title}
                      description={tool.description}
                      color={tool.color}
                      onClick={() => setActiveTool(tool.id)}
                    />
                  ))}
                </div>
              </section>
            ))}

            {/* Features Section */}
            <section className="mt-12 rounded-2xl bg-primary p-8 text-primary-foreground md:p-12">
              <h3 className="mb-6 text-2xl font-bold">
                Why Choose Elite Converter?
              </h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    title: "100% Free",
                    desc: "No limits, no watermarks, no registration required.",
                  },
                  {
                    title: "100% Secure",
                    desc: "All processing happens in your browser. Files never leave your device.",
                  },
                  {
                    title: "High Quality",
                    desc: "Crystal clear conversions with no quality loss.",
                  },
                  {
                    title: "11+ Tools",
                    desc: "PDF, Image, Scanner, Filters, ZIP, Password - all in one place.",
                  },
                ].map((feature) => (
                  <div
                    key={feature.title}
                    className="rounded-xl bg-primary-foreground/10 p-5"
                  >
                    <h4 className="mb-2 font-semibold text-secondary">
                      {feature.title}
                    </h4>
                    <p className="text-sm leading-relaxed text-primary-foreground/80">
                      {feature.desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* How It Works */}
            <section className="mt-10 rounded-2xl border border-border bg-card p-8 md:p-12">
              <h3 className="mb-6 text-2xl font-bold text-card-foreground">
                How It Works
              </h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {[
                  {
                    step: "1",
                    title: "Select a Tool",
                    desc: "Choose from 11+ professional tools for PDFs, images, and utilities.",
                  },
                  {
                    step: "2",
                    title: "Upload Your File",
                    desc: "Drop or select your files. Everything is processed locally in your browser.",
                  },
                  {
                    step: "3",
                    title: "Download Result",
                    desc: "Get your converted, filtered, or compressed files instantly.",
                  },
                ].map((step) => (
                  <div key={step.step} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground font-bold">
                      {step.step}
                    </div>
                    <div>
                      <h4 className="font-semibold text-card-foreground">
                        {step.title}
                      </h4>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Footer */}
            <footer className="mt-12 border-t border-border pt-8 text-center">
              <p className="text-sm text-muted-foreground">
                Free Online Document Converter - PDF, Image, Word, Filters, ZIP
                & More
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                2026 Elite Document Converter. All Rights Reserved.
              </p>
              <p className="mt-2 text-base font-bold text-primary">
                Created By Muhammad Hussain Shakir
              </p>
            </footer>
          </>
        )}
      </main>
    </div>
  )
}
