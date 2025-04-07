"use client"

import dynamic from "next/dynamic"
import { Suspense, useState, useEffect } from "react"
import PricingSection from "@/components/PricingSection"
import GlassButton from "@/components/GlassButton"
import ImageDisplay from "@/components/ImageDisplay"
import CardStack from "@/components/glass-card-stack/card-stack"

// Dynamically import all browser-dependent components
const Globe = dynamic(() => import("@/components/Globe"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-pulse text-white">Loading...</div>
    </div>
  )
})

const ScrollManager = dynamic(() => import("@/components/ScrollManager"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-pulse text-white">Loading...</div>
    </div>
  )
})

const SimpleAudioFallback = dynamic(() => import("@/components/SimpleAudioFallback"), {
  ssr: false
})

export default function Home() {
  const [showImageDisplay, setShowImageDisplay] = useState(false)
  const [showCardStack, setShowCardStack] = useState(false)
  const [animationsCompleted, setAnimationsCompleted] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Reset animations completed state when image display is shown
  useEffect(() => {
    if (showImageDisplay) {
      setAnimationsCompleted(false)
    }
  }, [showImageDisplay])

  // Handle the completion of animations
  const handleAnimationsComplete = () => {
    console.log("Animations completed, hiding image display")
    setShowImageDisplay(false)
    setAnimationsCompleted(true)
  }

  // Simplified direct approach to handle the connect click
  const handleConnectClick = () => {
    console.log("Home: Connect button clicked - showing card stack")
    setShowCardStack(true)
  }

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse text-white">Loading...</div>
      </div>
    )
  }

  return (
    <main className="relative min-h-screen bg-black overflow-hidden">
      <SimpleAudioFallback />
      <ScrollManager>
        <section className="relative min-h-screen bg-black">
          <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading Globe...</div>}>
            <Globe />
          </Suspense>

          {/* Glass Buttons - only show when neither image display nor card stack is visible */}
          {!showImageDisplay && !showCardStack && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center justify-center gap-4 md:gap-6 w-full max-w-[90vw] md:max-w-none px-4 md:px-0">
              <div className="w-full max-w-[280px]">
                <GlassButton onClick={() => setShowImageDisplay(true)}>CLONEX</GlassButton>
              </div>

              {/* Only show Connect button after animations have completed */}
              {animationsCompleted && (
                <div className="flex flex-col items-center w-full max-w-[280px]">
                  <GlassButton
                    onClick={handleConnectClick}
                    className="w-full bg-gradient-to-b from-purple-500/40 to-purple-500/10"
                  >
                    Connect X
                  </GlassButton>
                  <p className="text-white/80 text-center text-sm mt-3 md:mt-4 max-w-[280px] font-light px-4">
                    Your X account will be used to generate your clone's knowledge
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Image Display Overlay with animation completion handler */}
          <ImageDisplay
            isVisible={showImageDisplay}
            onClose={() => setShowImageDisplay(false)}
            onConnectClick={handleConnectClick}
            onAnimationsComplete={handleAnimationsComplete}
          />

          {/* Card Stack */}
          <CardStack
            isVisible={showCardStack}
            profileImage="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CLONEX.jpg-1zLX9ELMgI9lWHn6Lqk4ECClA4EtQl.jpeg"
            onClose={() => setShowCardStack(false)}
          />

          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-center z-10 animate-bounce">
            <p className="text-white text-sm mb-2"></p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </div>
        </section>

        <section className="min-h-screen">
          <PricingSection />
        </section>
      </ScrollManager>
    </main>
  )
}

