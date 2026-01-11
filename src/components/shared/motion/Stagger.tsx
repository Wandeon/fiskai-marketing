"use client"

import { motion, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

/**
 * Stagger Components
 *
 * Creates staggered entrance animations for lists and groups of elements.
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
          transition: { staggerChildren: 0.08, delayChildren: 0.05 },
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

  // CLS-safe: Content starts visible (slightly faded) to prevent layout shift
  return (
    <motion.div
      className={cn("will-change-[opacity,transform]", className)}
      style={{ transform: "translateZ(0)" }} // Force GPU layer
      variants={
        reduce
          ? undefined
          : {
              hidden: { opacity: 0.3, y: 8 },
              show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
            }
      }
    >
      {children}
    </motion.div>
  )
}
