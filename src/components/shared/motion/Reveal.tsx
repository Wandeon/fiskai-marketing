"use client"

import { motion, type MotionProps, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

/**
 * Reveal Component
 *
 * A scroll-triggered animation that slides content into view.
 * Uses transform-only animation (no opacity) to avoid "disabled UI" appearance.
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

  // CLS-safe: Transform-only animation, no opacity fade
  // Content is always fully visible, just slides into position
  return (
    <motion.div
      className={cn(className)}
      initial={reduce ? false : { y }}
      whileInView={reduce ? undefined : { y: 0 }}
      viewport={{ once, margin: "0px 0px -15% 0px" }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
