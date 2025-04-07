"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence, type PanInfo } from "framer-motion"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import ProfileCard from "./profile-card"
import { cn } from "@/lib/utils"

interface CardStackProps {
  isVisible: boolean
  profileImage: string
  onClose: () => void
}

export default function CardStack({ isVisible, profileImage, onClose }: CardStackProps) {
  const [activeCardIndex, setActiveCardIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const constraintsRef = useRef<HTMLDivElement>(null)

  // Card data
  const cards = [
    {
      id: 1,
      title: "Timeline Analysis",
      type: "primary",
      topics: [
        { name: "Travel", percentage: 45 },
        { name: "Photography", percentage: 30 },
        { name: "Adventure", percentage: 25 },
      ],
    },
    {
      id: 2,
      title: "Tone",
      type: "secondary",
      content: "Content will be populated later",
    },
    {
      id: 3,
      title: "Knowledge",
      type: "tertiary",
      content: "Content will be populated later",
    },
  ]

  // Handle card navigation
  const navigateCards = (newIndex: number) => {
    if (newIndex >= 0 && newIndex < cards.length) {
      setDirection(newIndex > activeCardIndex ? 1 : -1)
      setActiveCardIndex(newIndex)
    }
  }

  // Handle drag end
  const handleDragEnd = (info: PanInfo) => {
    const threshold = 100
    if (info.offset.x < -threshold && activeCardIndex < cards.length - 1) {
      navigateCards(activeCardIndex + 1)
    } else if (info.offset.x > threshold && activeCardIndex > 0) {
      navigateCards(activeCardIndex - 1)
    }
  }

  // Reset to first card when becoming visible
  useEffect(() => {
    if (isVisible) {
      setActiveCardIndex(0)
    }
  }, [isVisible])

  if (!isVisible) return null

  return (
    <motion.div
      className="fixed inset-0 z-40 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Card stack container */}
      <div ref={constraintsRef} className="relative w-full max-w-md aspect-[1/1.4] mx-4 perspective-1000">
        <AnimatePresence mode="popLayout" initial={false} custom={direction}>
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              className={cn(
                "absolute inset-0",
                index === activeCardIndex ? "z-30" : "z-10",
                index < activeCardIndex ? "z-20" : "",
              )}
              initial={{
                rotateY: direction > 0 ? 90 : -90,
                scale: 0.9,
                opacity: 0,
                y: direction > 0 ? 20 : -20,
              }}
              animate={{
                rotateY: index === activeCardIndex ? 0 : direction > 0 ? -90 : 90,
                scale: index === activeCardIndex ? 1 : 0.9,
                opacity: index === activeCardIndex ? 1 : 0,
                y: index === activeCardIndex ? 0 : direction > 0 ? -20 : 20,
                x: index === activeCardIndex ? 0 : direction > 0 ? -10 : 10,
              }}
              exit={{
                rotateY: direction > 0 ? -90 : 90,
                scale: 0.9,
                opacity: 0,
                y: direction > 0 ? -20 : 20,
                transition: { duration: 0.4 },
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                duration: 0.4,
              }}
              drag={index === activeCardIndex ? "x" : false}
              dragConstraints={constraintsRef}
              onDragEnd={(_, info) => handleDragEnd(info)}
              style={{
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
              }}
            >
              <ProfileCard card={card} profileImage={profileImage} isActive={index === activeCardIndex} />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Navigation controls */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-8 z-50">
          <button
            onClick={() => navigateCards(activeCardIndex - 1)}
            disabled={activeCardIndex === 0}
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              activeCardIndex === 0 ? "text-white/30 bg-white/10" : "text-white bg-white/20 hover:bg-white/30"
            } backdrop-blur-md transition-colors`}
            aria-label="Previous card"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Indicators */}
          <div className="flex gap-2">
            {cards.map((_, idx) => (
              <button
                key={idx}
                onClick={() => navigateCards(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  idx === activeCardIndex ? "bg-white scale-125" : "bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Go to card ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => navigateCards(activeCardIndex + 1)}
            disabled={activeCardIndex === cards.length - 1}
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              activeCardIndex === cards.length - 1
                ? "text-white/30 bg-white/10"
                : "text-white bg-white/20 hover:bg-white/30"
            } backdrop-blur-md transition-colors`}
            aria-label="Next card"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center z-50 hover:bg-black/60 transition-colors"
          aria-label="Close card stack"
        >
          <X size={18} className="text-white" />
        </button>
      </div>
    </motion.div>
  )
}

