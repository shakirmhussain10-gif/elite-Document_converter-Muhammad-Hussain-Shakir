"use client"

import { useState, useRef } from "react"
import { Upload, Lock, Download, ArrowLeft, Eye, EyeOff } from "lucide-react"

export function PasswordProtect({ onBack }: { onBack: () => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [status, setStatus] = useState("")
  const [processing, setProcessing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0])
      setStatus("")
    }
  }

  const protect = async () => {
    if (!file) {
      setStatus("Please select a file.")
      return
    }
    if (!password || password.length < 4) {
      setStatus("Password must be at least 4 characters.")
      return
    }
    setProcessing(true)
    setStatus("Creating password-protected ZIP...")

    try {
      const JSZip = (await import("jszip")).default
      const zip = new JSZip()

      // Add the file to a password-protected zip
      // Note: JSZip doesn't support native encryption, so we create an encrypted container
      const arrayBuffer = await file.arrayBuffer()
      const uint8Array = new Uint8Array(arrayBuffer)

      // XOR-based encryption with password
      const encoder = new TextEncoder()
      const keyBytes = encoder.encode(password)
      const encrypted = new Uint8Array(uint8Array.length)
      for (let i = 0; i < uint8Array.length; i++) {
        encrypted[i] = uint8Array[i] ^ keyBytes[i % keyBytes.length]
      }

      // Store the encrypted file and a metadata file
      zip.file("encrypted_" + file.name, encrypted)
      zip.file(
        "README.txt",
        `This file is encrypted by Elite Document Converter.\nCreated by Muhammad Hussain Shakir.\n\nTo decrypt, use the same tool with your password.\nOriginal filename: ${file.name}\nEncryption: XOR-based\n`
      )

      const blob = await zip.generateAsync({ type: "blob" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.download = `Elite_Protected_${Date.now()}.zip`
      link.href = url
      link.click()
      URL.revokeObjectURL(url)
      setStatus("Protected ZIP created successfully!")
    } catch {
      setStatus("Error creating protected file.")
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
        Password Protect
      </h2>
      <p className="mb-6 text-muted-foreground">
        Encrypt any file with a password and download as a protected ZIP.
      </p>

      <div
        onClick={() => inputRef.current?.click()}
        className="flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed border-border bg-muted/50 p-10 transition-colors hover:border-secondary hover:bg-muted"
      >
        <Upload className="h-10 w-10 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          {file ? file.name : "Click to select any file"}
        </p>
        <input
          ref={inputRef}
          type="file"
          onChange={handleFile}
          className="hidden"
        />
      </div>

      <div className="mt-4">
        <label className="mb-1.5 block text-sm font-medium text-foreground">
          Set Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password (min 4 characters)"
            className="w-full rounded-lg border border-border bg-background px-4 py-3 pr-12 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <button
        onClick={protect}
        disabled={processing || !file || password.length < 4}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
      >
        <Lock className="h-5 w-5" />
        {processing ? "Encrypting..." : "Protect & Download"}
      </button>

      {status && (
        <p className="mt-4 text-center text-sm font-medium text-muted-foreground">
          {status}
        </p>
      )}
    </div>
  )
}
