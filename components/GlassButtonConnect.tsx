"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface GlassButtonConnectProps {
  onClick: () => void
  className?: string
  isVisible: boolean
}

export default function GlassButtonConnect({ onClick, className = "", isVisible }: GlassButtonConnectProps) {
  const [isGlitching, setIsGlitching] = useState(false)

  // Add glitch effect during appearance
  useEffect(() => {
    if (isVisible) {
      // Start with glitch effect
      setIsGlitching(true)

      // End glitch effect after animation completes
      const timeout = setTimeout(() => {
        setIsGlitching(false)
      }, 1000)

      return () => clearTimeout(timeout)
    }
  }, [isVisible])

  // Completely simplified click handler
  const handleButtonClick = () => {
    console.log("GlassButtonConnect: Button clicked - DIRECT CALL")
    // Call the parent's onClick handler directly
    onClick()
  }

  return (
    <motion.div
      className={`flex flex-col items-center justify-center ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        y: isVisible ? 0 : 10,
      }}
      transition={{
        duration: 0.8,
        delay: 0.2,
        type: "spring",
        damping: 20,
      }}
    >
      {/* Button container with glitch effect */}
      <div className="relative">
        {/* Glitch overlay */}
        {isGlitching && (
          <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
            {/* Subtle scan lines */}
            <div className="absolute w-full h-full bg-scanlines opacity-10" />

            {/* Subtle pixel shifts */}
            <div className="absolute w-full h-[1px] bg-blue-400/30 top-[33%] left-0 animate-subtle-glitch-1" />
            <div className="absolute w-full h-[1px] bg-red-400/30 top-[67%] left-0 animate-subtle-glitch-2" />

            {/* Digital noise */}
            <div className="absolute inset-0 bg-noise opacity-5" />

            {/* Subtle RGB shift */}
            <div className="absolute inset-0 bg-red-500/5 mix-blend-screen translate-x-[0.5px]" />
            <div className="absolute inset-0 bg-blue-500/5 mix-blend-screen -translate-x-[0.5px]" />
          </div>
        )}

        {/* Glow effect */}
        <div className="absolute w-full h-full rounded-full bg-gradient-to-b from-white/30 to-gray-500/0 blur-[50px] -z-10" />

        {/* Use a regular button instead of motion.button to simplify */}
        <button
          className="relative px-6 sm:px-10 md:px-14 py-3 sm:py-4 md:py-5 rounded-full bg-gradient-to-b from-white/40 to-white/10 backdrop-blur-md border border-white/30 shadow-lg overflow-hidden group hover:scale-105 active:scale-95 transition-transform"
          onClick={handleButtonClick}
          style={{
            filter: isGlitching ? "brightness(1.05) contrast(1.02)" : "none",
            transform: isGlitching ? `translate(${Math.random() * 2 - 1}px, ${Math.random() * 2 - 1}px)` : "none",
          }}
        >
          {/* Inner glow effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Button text */}
          <span className="relative font-syncopate font-bold text-xl sm:text-2xl md:text-3xl tracking-wider text-white">
            CONNECT
          </span>

          {/* Shine effect */}
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shine_1.5s_ease-in-out_infinite]" />
        </button>
      </div>

      {/* Text below button */}
      <motion.p
        className="text-white/80 text-center text-sm mt-4 max-w-[280px] font-light"
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        Your X account will be used to generate your clone's knowledge
      </motion.p>
    </motion.div>
  )
}

