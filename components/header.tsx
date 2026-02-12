"use client"

import { Download, Menu, X } from "lucide-react"
import { usePwaInstall } from "@/hooks/use-pwa-install"
import { useState } from "react"

export function Header() {
  const { isInstallable, install } = usePwaInstall()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground font-bold text-lg">
            E
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">Elite Converter</h1>
            <p className="text-xs text-primary-foreground/70">
              by Muhammad Hussain
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isInstallable && (
            <button
              onClick={install}
              className="hidden items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-secondary/90 md:flex"
            >
              <Download className="h-4 w-4" />
              Install App
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 transition-colors hover:bg-primary-foreground/10 md:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-primary-foreground/10 px-4 pb-4 md:hidden">
          {isInstallable && (
            <button
              onClick={() => {
                install()
                setMobileMenuOpen(false)
              }}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-secondary px-4 py-3 text-sm font-semibold text-secondary-foreground"
            >
              <Download className="h-4 w-4" />
              Install App
            </button>
          )}
        </div>
      )}
    </header>
  )
}
