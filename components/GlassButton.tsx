"use client"

import type React from "react"
import { motion } from "framer-motion"

interface GlassButtonProps {
  onClick: () => void
  className?: string
  children?: React.ReactNode
}

export default function GlassButton({ onClick, className = "", children }: GlassButtonProps) {
  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      {/* Glow effect */}
      <div className="absolute w-full h-full rounded-full bg-gradient-to-b from-white/30 to-gray-500/0 blur-[50px] -z-10" />

      {/* Completely revised button with simplified glass effect for maximum mobile compatibility */}
      <motion.button
        className="relative px-6 sm:px-10 md:px-14 py-3 sm:py-4 md:py-5 rounded-full border border-white/30 shadow-lg overflow-hidden group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        style={{
          background: "rgba(255, 255, 255, 0.2)",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        {/* Solid background fallback for browsers that don't support backdrop-filter */}
        <div className="absolute inset-0 bg-black/20 -z-1" />

        {/* Inner glow effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Button text with enhanced visibility */}
        <span className="relative font-syncopate font-bold text-xl sm:text-2xl md:text-3xl tracking-wider text-white z-10 flex items-center justify-center">
          {children || "CLONEX"}
        </span>

        {/* Shine effect on hover */}
        <motion.div
          className="absolute inset-0 w-full h-full overflow-hidden bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full"
          style={{ width: "100%", height: "100%" }}
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

