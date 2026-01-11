import Link from "next/link"
import { Shield } from "lucide-react"
import { cn } from "@/lib/utils"

// ============================================================================
// Types
// ============================================================================

export type TrustBadgeVariant = "subtle" | "inline" | "callout"

export type TrustBadgePreset = "readiness" | "no-oversell" | "transparent"

export interface TrustBadgeProps {
  /** Visual style variant */
  variant?: TrustBadgeVariant
  /** Use a preset copy or provide custom text */
  preset?: TrustBadgePreset
  /** Custom text (overrides preset) */
  text?: string
  /** Link destination */
  href?: string
  /** Show shield icon */
  icon?: boolean
  /** Additional className */
  className?: string
}

// ============================================================================
// Copy Presets
// ============================================================================

const PRESET_COPY: Record<TrustBadgePreset, string> = {
  readiness: "Javno stanje spremnosti: što je spremno, što je u izradi.",
  "no-oversell": "Ne prodajemo 'uskoro' kao 'gotovo'. Pogledaj stanje.",
  transparent: "Transparentno: spremno / u izradi / nije dostupno.",
}

// ============================================================================
// Component
// ============================================================================

export function TrustBadge({
  variant = "subtle",
  preset = "readiness",
  text,
  href = "/spremnost",
  icon = true,
  className,
}: TrustBadgeProps) {
  const displayText = text || PRESET_COPY[preset]

  const baseStyles = "group inline-flex items-center gap-1.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"

  const variantStyles: Record<TrustBadgeVariant, string> = {
    subtle: cn(
      "text-xs text-white/50 hover:text-white/70",
      "py-1"
    ),
    inline: cn(
      "text-sm text-white/60 hover:text-accent-light",
      "rounded-full bg-white/5 border border-white/10 px-3 py-1.5",
      "hover:bg-white/10 hover:border-white/20"
    ),
    callout: cn(
      "text-sm text-white/70 hover:text-white/90",
      "rounded-lg bg-accent/5 border border-accent/20 px-4 py-2",
      "hover:bg-accent/10 hover:border-accent/30"
    ),
  }

  const iconStyles: Record<TrustBadgeVariant, string> = {
    subtle: "h-3 w-3 text-white/40 group-hover:text-white/60",
    inline: "h-3.5 w-3.5 text-white/50 group-hover:text-accent-light",
    callout: "h-4 w-4 text-accent/60 group-hover:text-accent-light",
  }

  return (
    <Link
      href={href}
      className={cn(baseStyles, variantStyles[variant], className)}
      aria-label={`${displayText} - Pogledaj stanje spremnosti`}
    >
      {icon && <Shield className={iconStyles[variant]} aria-hidden="true" />}
      <span>{displayText}</span>
    </Link>
  )
}
