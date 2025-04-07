"use client"

import type React from "react"
import { motion } from "framer-motion"

interface UnifiedGlassButtonProps {
  onClick: () => void
  className?: string
  children?: React.ReactNode
  text?: string
  isVisible?: boolean
}

export default function UnifiedGlassButton({
  onClick,
  className = "",
  children,
  text,
  isVisible = true,
}: UnifiedGlassButtonProps) {
  // Direct click handler with console logging for debugging
  const handleClick = () => {
    console.log("UnifiedGlassButton: Button clicked")
    onClick()
  }

  if (!isVisible) return null

  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      {/* Glow effect */}
      <div className="absolute w-full h-full rounded-full bg-gradient-to-b from-white/30 to-gray-500/0 blur-[50px] -z-10" />

      <motion.button
        className="relative px-6 sm:px-10 md:px-14 py-3 sm:py-4 md:py-5 rounded-full bg-gradient-to-b from-white/40 to-white/10 backdrop-blur-md border border-white/30 shadow-lg overflow-hidden group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleClick}
      >
        {/* Inner glow effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Button text */}
        <span className="relative font-syncopate font-bold text-xl sm:text-2xl md:text-3xl tracking-wider text-white">
          {children || text || "BUTTON"}
        </span>

        {/* Shine effect on hover */}
        <motion.div
          className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full"
          animate={{ translateX: ["100%", "-100%"] }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
            ease: "linear",
            repeatDelay: 1,
          }}
        />
      </motion.button>
    </motion.div>
  )
}

