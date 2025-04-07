"use client"

import { useRef, useEffect } from "react"
import { motion } from "framer-motion"

interface AudioVisualizerProps {
  frequencyData: Uint8Array | null
  isPlaying: boolean
  isMuted: boolean
}

export default function AudioVisualizer({ frequencyData, isPlaying, isMuted }: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Canvas visualization
  useEffect(() => {
    if (!canvasRef.current || !frequencyData || !isPlaying || isMuted) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height)

    // Draw visualization
    const barWidth = rect.width / (frequencyData.length / 2)
    const centerY = rect.height / 2

    for (let i = 0; i < frequencyData.length / 2; i++) {
      const value = frequencyData[i] || 0
      const percent = value / 255
      const barHeight = percent * rect.height * 0.5 + 2

      // Gradient for bars
      const gradient = ctx.createLinearGradient(0, centerY - barHeight, 0, centerY + barHeight)
      gradient.addColorStop(0, "rgba(138, 43, 226, 0.8)") // Purple top
      gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.8)") // White middle
      gradient.addColorStop(1, "rgba(65, 105, 225, 0.8)") // Blue bottom

      ctx.fillStyle = gradient

      // Draw mirrored bars
      ctx.fillRect(i * barWidth, centerY - barHeight, barWidth - 1, barHeight)
      ctx.fillRect(i * barWidth, centerY, barWidth - 1, barHeight)
    }
  }, [frequencyData, isPlaying, isMuted])

  // If not playing or muted, show static bars
  if (!isPlaying || isMuted || !frequencyData) {
    return (
      <div className="ml-2 h-8 flex items-center space-x-[2px]">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="w-1 h-1 bg-white/30 rounded-full" />
        ))}
      </div>
    )
  }

  return (
    <div className="ml-2 h-8 flex items-center">
      {/* Simple bar visualizer for small screens */}
      <div className="flex items-center space-x-[2px] md:hidden">
        {Array.from({ length: 10 }).map((_, i) => {
          const index = Math.floor(i * (frequencyData.length / 10))
          const value = frequencyData[index] || 0
          const height = Math.max(3, (value / 255) * 100)

          return (
            <motion.div
              key={i}
              className="w-1 bg-white/70 rounded-full"
              animate={{ height: `${Math.max(15, height)}%` }}
              transition={{ duration: 0.1 }}
              style={{ minHeight: 3 }}
            />
          )
        })}
      </div>

      {/* Canvas visualizer for larger screens */}
      <canvas ref={canvasRef} className="hidden md:block w-32 h-8" />
    </div>
  )
}

