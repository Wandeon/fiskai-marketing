"use client"

import { motion, type MotionProps, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

/**
 * Reveal Component
 *
 * A scroll-triggered animation that fades and slides content into view.
 * Respects user's reduced-motion preferences for accessibility.
 *
 * @see Design System Accessibility Guide: src/design-system/ACCESSIBILITY.md
 */

type RevealProps = MotionProps & {
  children: React.ReactNode
  className?: string
  y?: number
  once?: boolean
  delay?: number
}

export function Reveal({
  children,
  className,
  y = 12,
  once = true,
  delay = 0,
  ...props
}: RevealProps) {
  const reduce = useReducedMotion()

  // CLS-safe: Use transform instead of layout-affecting properties
  // Content is always visible, just slightly faded initially
  return (
    <motion.div
      className={cn("will-change-[opacity,transform]", className)}
      initial={reduce ? false : { opacity: 0.3, y }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once, margin: "0px 0px -15% 0px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay }}
      style={{ transform: "translateZ(0)" }} // Force GPU layer
      {...props}
    >
      {children}
    </motion.div>
  )
}
