"use client"

import { motion, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

/**
 * Stagger Components
 *
 * Creates staggered entrance animations for lists and groups of elements.
 * Uses transform-only animation (no opacity) to avoid "disabled UI" appearance.
 * Respects user's reduced-motion preferences for accessibility.
 *
 * @see Design System Accessibility Guide: src/design-system/ACCESSIBILITY.md
 */

export function Stagger({
  children,
  className,
  once = true,
}: {
  children: React.ReactNode
  className?: string
  once?: boolean
}) {
  const reduce = useReducedMotion()

  return (
    <motion.div
      className={cn(className)}
      initial={reduce ? false : "hidden"}
      whileInView={reduce ? undefined : "show"}
      viewport={{ once, margin: "0px 0px -10% 0px" }}
      variants={{
        hidden: {},
        show: {
          transition: { staggerChildren: 0.06, delayChildren: 0.03 },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const reduce = useReducedMotion()

  // CLS-safe: Transform-only animation, no opacity fade
  // Content is always fully visible, just slides into position
  return (
    <motion.div
      className={cn(className)}
      variants={
        reduce
          ? undefined
          : {
              hidden: { y: 8 },
              show: { y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
            }
      }
    >
      {children}
    </motion.div>
  )
}
