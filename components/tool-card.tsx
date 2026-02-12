"use client"

import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface ToolCardProps {
  icon: LucideIcon
  title: string
  description: string
  onClick: () => void
  color?: string
}

export function ToolCard({
  icon: Icon,
  title,
  description,
  onClick,
  color = "bg-primary/10 text-primary",
}: ToolCardProps) {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 text-center text-card-foreground transition-all hover:-translate-y-1 hover:border-secondary hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
    >
      <div
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-xl transition-transform group-hover:scale-110",
          color
        )}
      >
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </button>
  )
}
