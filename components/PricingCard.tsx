"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

type PricingTier = "free" | "basic" | "premium" | "pro" | "founder" | "agentic"

interface PricingCardProps {
  title: string
  price: string
  description: string
  features: string[]
  tier: PricingTier
  className?: string
}

export default function PricingCard({ title, price, description, features, tier, className }: PricingCardProps) {
  // Define solid background colors based on tier for better mobile rendering
  const backgroundColors: Record<PricingTier, string> = {
    free: "rgba(59, 130, 246, 0.15)",
    basic: "rgba(34, 197, 94, 0.15)",
    premium: "rgba(168, 85, 247, 0.15)",
    pro: "rgba(236, 72, 153, 0.15)",
    founder: "rgba(245, 158, 11, 0.15)",
    agentic: "rgba(6, 182, 212, 0.15)",
  }

  // Define button styles based on tier
  const buttonStyles: Record<PricingTier, string> = {
    free: "bg-blue-600 hover:bg-blue-700",
    basic: "bg-green-600 hover:bg-green-700",
    premium: "bg-purple-600 hover:bg-purple-700",
    pro: "bg-pink-600 hover:bg-pink-700",
    founder: "bg-amber-600 hover:bg-amber-700",
    agentic: "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600",
  }

  // Define highlight colors based on tier
  const highlightColors: Record<PricingTier, string> = {
    free: "text-blue-400",
    basic: "text-green-400",
    premium: "text-purple-400",
    pro: "text-pink-400",
    founder: "text-amber-400",
    agentic: "text-cyan-400",
  }

  return (
    <motion.div
      className={cn("relative rounded-2xl overflow-hidden", className)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      {/* Solid background color for reliable mobile rendering */}
      <div
        className="absolute inset-0 rounded-2xl border border-white/10"
        style={{
          background: backgroundColors[tier],
          boxShadow: `0 0 30px 5px ${backgroundColors[tier]}`,
        }}
      />

      {/* Content - Optimized for mobile rendering */}
      <div className="relative p-5 md:p-6 z-10 flex flex-col">
        {/* Header */}
        <div className="mb-4 md:mb-6">
          <h3 className={`text-lg md:text-xl font-bold font-syncopate mb-1 ${highlightColors[tier]}`}>{title}</h3>
          <div className="flex items-baseline mb-2">
            <span className="text-2xl md:text-3xl font-bold text-white">{price}</span>
            {price !== "Free" && price !== "Contact Us" && (
              <span className="text-xs md:text-sm text-white/60 ml-1">/month</span>
            )}
          </div>
          <p className="text-white/80 text-xs md:text-sm">{description}</p>
        </div>

        {/* Features - Optimized for mobile with explicit styling for icons */}
        <div className="flex-grow">
          <ul className="space-y-2 md:space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <Check
                  className={`h-4 w-4 md:h-5 md:w-5 ${highlightColors[tier]} mr-2 mt-0.5 flex-shrink-0`}
                  strokeWidth={2.5} // Increased stroke width for better visibility
                />
                <span className="text-white/80 text-xs md:text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA Button */}
        <div className="mt-4 md:mt-6">
          <button
            className={`w-full py-2 md:py-2.5 px-4 rounded-full text-white text-sm md:text-base font-medium transition-all ${buttonStyles[tier]}`}
          >
            {tier === "free" ? "Get Started" : tier === "agentic" ? "Contact Us" : "Subscribe"}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

