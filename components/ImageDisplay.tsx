"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Cormorant_Garamond } from "next/font/google"
import { useMediaQuery } from "@/hooks/use-media-query"

// Load Cormorant Garamond font
const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
})

interface ImageDisplayProps {
  isVisible: boolean
  onClose: () => void
  imageUrl?: string
  onConnectClick?: () => void
  onAnimationsComplete?: () => void
}

export default function ImageDisplay({
  isVisible,
  onClose,
  imageUrl,
  onConnectClick,
  onAnimationsComplete,
}: ImageDisplayProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [currentCaptionIndex, setCurrentCaptionIndex] = useState(-1)
  const [showCaptions, setShowCaptions] = useState(false)
  const [captionsComplete, setCaptionsComplete] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isGlitching, setIsGlitching] = useState(false)
  const [showConnectButton, setShowConnectButton] = useState(false)
  const [finalTransition, setFinalTransition] = useState(false)
  const [rainbowMode, setRainbowMode] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const transitionRefs = useRef<NodeJS.Timeout[]>([])
  const animationsCompletedRef = useRef(false)

  // Check if device is mobile
  const isMobile = useMediaQuery("(max-width: 768px)")

  // New SVG image sources in the specified order
  const svgImages = [
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMAGE01-OfHHiNRWoWaOl9ttSkkIzn90zpZ3DB.svg", // IMAGE01.svg
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMAGE02-50QUIYMuEFujRJMjlmkSV6w6AfGca7.svg", // IMAGE02.svg
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMAGE03-fp8qtXOsjLw23aw8jTZysAhSLq5crc.svg", // IMAGE03.svg
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMAGE04-oneooJvl7pJ5NO2dFv161G4EaRCWOF.svg", // IMAGE04.svg
  ]

  // Temple image URL (used for both captions background and final image)
  const templeImageUrl =
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/goodmonth.eth_httpss.mj.runs7yzYz0oEEo_finding_a_temple_that__8c3e9093-92ff-4fdd-8a26-f0949f134a9f_1-4SBkjLgH2bs0KElekhT1Uyqk8hxy2m.png"

  // Captions with their display durations in milliseconds (increased by 1 second each)
  const captions = [
    { text: "Our clones are as ancient as they are futuristic...", duration: 3000 },
    { text: "based on your X timeline we can create a personalized clone", duration: 4000 },
    { text: "This clone is designed to enhance your presence on X", duration: 3000 },
    { text: "But first we have to go back in time....", duration: 2000 },
  ]

  // Simplified direct connect handler
  const handleConnectClick = () => {
    console.log("ImageDisplay: Connect button clicked - DIRECT CALL")

    // First close the image display
    setTimeout(() => {
      onClose()

      // Then call the connect handler after a short delay
      setTimeout(() => {
        if (onConnectClick) {
          onConnectClick()
        }
      }, 100)
    }, 300)
  }

  // Clear all timeouts
  const clearAllTimeouts = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    transitionRefs.current.forEach((timeout) => {
      clearTimeout(timeout)
    })

    transitionRefs.current = []
  }

  // Reset states when visibility changes
  useEffect(() => {
    if (isVisible) {
      setIsLoading(true)
      setCurrentCaptionIndex(-1)
      setShowCaptions(true)
      setCaptionsComplete(false)
      setCurrentImageIndex(0)
      setIsGlitching(false)
      setShowConnectButton(false)
      setFinalTransition(false)
      setRainbowMode(false)
      animationsCompletedRef.current = false

      // Start caption sequence after a short delay
      setTimeout(() => {
        setCurrentCaptionIndex(0)
      }, 500)
    } else {
      clearAllTimeouts()
    }

    return clearAllTimeouts
  }, [isVisible])

  // Handle caption sequence
  useEffect(() => {
    if (currentCaptionIndex >= 0 && currentCaptionIndex < captions.length) {
      // Set timeout for next caption based on current caption's duration
      timeoutRef.current = setTimeout(() => {
        if (currentCaptionIndex < captions.length - 1) {
          setCurrentCaptionIndex(currentCaptionIndex + 1)
        } else {
          // All captions have been shown
          setCaptionsComplete(true)
          setShowCaptions(false)
        }
      }, captions[currentCaptionIndex].duration)
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [currentCaptionIndex])

  // Function to create a transition with the same glitch effect
  const createTransition = (fromIndex: number, toIndex: number, delay: number) => {
    const transitionTimeout = setTimeout(() => {
      // Start subtle glitch effect
      setIsGlitching(true)

      // After brief glitch effect, change image
      const glitchTimeout = setTimeout(() => {
        setCurrentImageIndex(toIndex)

        // End glitch effect shortly after image change
        const endGlitchTimeout = setTimeout(() => {
          setIsGlitching(false)

          // If there's another image to transition to, schedule it
          if (toIndex < svgImages.length - 1) {
            createTransition(toIndex, toIndex + 1, 3000)
          } else {
            // This is the final image - schedule the final transition
            const finalTimeout = setTimeout(() => {
              setIsGlitching(true)

              // Start rainbow mode
              setRainbowMode(true)

              // After brief glitch, show final state
              setTimeout(() => {
                setFinalTransition(true)

                // End glitch effect
                setTimeout(() => {
                  setIsGlitching(false)

                  // Immediately mark animations as completed and close
                  if (!animationsCompletedRef.current && onAnimationsComplete) {
                    console.log("Animations completed, notifying parent")
                    animationsCompletedRef.current = true
                    onAnimationsComplete()
                  }
                }, 300)
              }, 400)
            }, 3000) // Same 3-second delay for final image

            transitionRefs.current.push(finalTimeout)
          }
        }, 300)

        transitionRefs.current.push(endGlitchTimeout)
      }, 400)

      transitionRefs.current.push(glitchTimeout)
    }, delay)

    transitionRefs.current.push(transitionTimeout)
  }

  // Handle image transitions
  useEffect(() => {
    if (captionsComplete && currentImageIndex === 0) {
      // Start the chain of transitions
      createTransition(0, 1, 3000)
    }

    return () => {
      clearAllTimeouts()
    }
  }, [captionsComplete])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-30 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Backdrop overlay with enhanced blur */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Glass container - adjusted for mobile */}
          <motion.div
            className="relative w-[95vw] md:w-[85vw] max-w-[800px] aspect-[16/9] rounded-2xl overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Rainbow chromatic background effects - only active in final state */}
            {rainbowMode ? (
              <>
                <motion.div
                  className="absolute -inset-4 blur-2xl opacity-70 z-0"
                  style={{
                    background: "linear-gradient(45deg, #ff0080, #7928ca, #0070f3, #00dfd8, #ff0080)",
                    backgroundSize: "400% 400%",
                  }}
                  animate={{
                    backgroundPosition: ["0% 0%", "100% 100%"],
                  }}
                  transition={{
                    duration: 15,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "mirror",
                    ease: "linear",
                  }}
                />
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-1" />
              </>
            ) : (
              <>
                {/* Standard chromatic aberration effects - simplified for mobile */}
                <div
                  className="absolute -inset-4 bg-blue-500/20 blur-2xl opacity-70 z-0 animate-pulse"
                  style={{ animationDuration: isMobile ? "5s" : "4s" }}
                />
                {!isMobile && (
                  <>
                    <div
                      className="absolute -inset-4 bg-purple-500/20 blur-2xl opacity-70 z-0 animate-pulse"
                      style={{ animationDuration: "5s", animationDelay: "0.5s" }}
                    />
                    <div
                      className="absolute -inset-4 bg-teal-500/20 blur-2xl opacity-70 z-0 animate-pulse"
                      style={{ animationDuration: "6s", animationDelay: "1s" }}
                    />
                  </>
                )}

                {/* Red chromatic shift */}
                <div className="absolute -inset-2 -left-3 bg-red-500/10 blur-xl opacity-60 z-0" />

                {/* Blue chromatic shift */}
                <div className="absolute -inset-2 -right-3 bg-blue-500/10 blur-xl opacity-60 z-0" />
              </>
            )}

            {/* Glass effect background with enhanced blur */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-white/5 backdrop-blur-md border border-white/30 shadow-2xl z-1" />

            {/* Inner glow effects */}
            <div className="absolute inset-[1px] rounded-2xl bg-gradient-to-tr from-white/5 to-transparent z-2" />

            {/* Animated color highlights - simplified for mobile */}
            {!isMobile && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 via-transparent to-blue-500/5 z-2"
                animate={{
                  background: rainbowMode
                    ? [
                        "linear-gradient(to top right, rgba(255, 0, 128, 0.1), transparent, rgba(0, 112, 243, 0.1))",
                        "linear-gradient(to top right, rgba(121, 40, 202, 0.1), transparent, rgba(255, 0, 128, 0.1))",
                        "linear-gradient(to top right, rgba(0, 112, 243, 0.1), transparent, rgba(0, 223, 216, 0.1))",
                        "linear-gradient(to top right, rgba(0, 223, 216, 0.1), transparent, rgba(121, 40, 202, 0.1))",
                      ]
                    : [
                        "linear-gradient(to top right, rgba(168, 85, 247, 0.05), transparent, rgba(59, 130, 246, 0.05))",
                        "linear-gradient(to top right, rgba(59, 130, 246, 0.05), transparent, rgba(236, 72, 153, 0.05))",
                        "linear-gradient(to top right, rgba(236, 72, 153, 0.05), transparent, rgba(16, 185, 129, 0.05))",
                        "linear-gradient(to top right, rgba(16, 185, 129, 0.05), transparent, rgba(168, 85, 247, 0.05))",
                      ],
                }}
                transition={{ duration: rainbowMode ? 8 : 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              />
            )}

            {/* Edge highlight */}
            <div className="absolute inset-0 rounded-2xl border border-white/40 z-3" />

            {/* Image container with subtle inner shadow */}
            <div className="absolute inset-[3px] rounded-2xl overflow-hidden z-10 flex items-center justify-center shadow-inner">
              {/* Loading spinner - only show when loading image and captions are complete */}
              {isLoading && captionsComplete && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-20">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-t-white/80 border-r-white/40 border-b-white/20 border-l-white/60 rounded-full animate-spin" />
                    <p className="mt-4 text-white/80 font-syncopate text-xs md:text-sm">LOADING</p>
                  </div>
                </div>
              )}

              {/* Animated captions with temple image background */}
              {showCaptions && (
                <div className="absolute inset-0 flex items-end justify-center z-20">
                  {/* Temple image as background */}
                  <div className="absolute inset-0 w-full h-full">
                    <Image
                      src={templeImageUrl || "/placeholder.svg"}
                      alt="Ancient Temple"
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 768px) 95vw, 85vw"
                    />
                    {/* Overlay gradient for better text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
                  </div>

                  <AnimatePresence mode="wait">
                    {currentCaptionIndex >= 0 && (
                      <motion.div
                        key={currentCaptionIndex}
                        className="relative px-4 md:px-8 py-4 md:py-6 mb-6 md:mb-12 max-w-[90%] md:max-w-[80%] rounded-lg bg-black/50 backdrop-blur-sm border border-white/10 z-30"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                      >
                        {/* Caption text */}
                        <p
                          className={`text-white text-center text-lg md:text-2xl lg:text-3xl ${cormorantGaramond.className}`}
                        >
                          {captions[currentCaptionIndex].text}
                        </p>

                        {/* Progress bar */}
                        <motion.div
                          className="absolute bottom-0 left-0 h-[2px] bg-white/70"
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{
                            duration: captions[currentCaptionIndex].duration / 1000,
                            ease: "linear",
                          }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* SVG Images with glitch transition - show when captions are complete */}
              {captionsComplete && (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-gray-900/90 to-black/90">
                  {/* Glitch overlay - simplified for mobile */}
                  {isGlitching && (
                    <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
                      {/* Subtle scan lines */}
                      <div className="absolute w-full h-full bg-scanlines opacity-10" />

                      {/* Subtle pixel shifts - reduced for mobile */}
                      {!isMobile && (
                        <>
                          <div className="absolute w-full h-[1px] bg-blue-400/30 top-[33%] left-0 animate-subtle-glitch-1" />
                          <div className="absolute w-full h-[1px] bg-red-400/30 top-[67%] left-0 animate-subtle-glitch-2" />
                        </>
                      )}

                      {/* Digital noise - reduced for mobile */}
                      <div className="absolute inset-0 bg-noise opacity-5" />

                      {/* Subtle RGB shift - reduced for mobile */}
                      {!isMobile && (
                        <>
                          <div className="absolute inset-0 bg-red-500/5 mix-blend-screen translate-x-[0.5px]" />
                          <div className="absolute inset-0 bg-blue-500/5 mix-blend-screen -translate-x-[0.5px]" />
                        </>
                      )}
                    </div>
                  )}

                  {/* First SVG image (IMAGE01.svg) */}
                  <motion.div
                    className="relative w-full h-full flex items-center justify-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{
                      opacity: currentImageIndex === 0 ? 1 : 0,
                      scale: currentImageIndex === 0 ? 1 : 0.99,
                      x: isGlitching && !isMobile ? [0, -1, 1, 0] : 0,
                      y: isGlitching && !isMobile ? [0, 0.5, -0.5, 0] : 0,
                    }}
                    transition={{
                      opacity: { duration: 0.4 },
                      scale: { duration: 0.4 },
                      x: { duration: 0.1, repeat: isGlitching && !isMobile ? 2 : 0 },
                      y: { duration: 0.1, repeat: isGlitching && !isMobile ? 2 : 0 },
                    }}
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={svgImages[0] || "/placeholder.svg"}
                        alt="IMAGE01"
                        fill
                        className="object-cover"
                        priority
                        sizes="(max-width: 768px) 95vw, 85vw"
                        onLoadingComplete={() => setIsLoading(false)}
                        style={{
                          filter: isGlitching ? "brightness(1.05) contrast(1.02)" : "none",
                        }}
                      />
                    </div>
                  </motion.div>

                  {/* Second SVG image (IMAGE02.svg) */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0, scale: 1.01 }}
                    animate={{
                      opacity: currentImageIndex === 1 ? 1 : 0,
                      scale: currentImageIndex === 1 ? 1 : 1.01,
                      x: isGlitching && !isMobile ? [0, 1, -1, 0] : 0,
                      y: isGlitching && !isMobile ? [0, -0.5, 0.5, 0] : 0,
                    }}
                    transition={{
                      opacity: { duration: 0.4 },
                      scale: { duration: 0.4 },
                      x: { duration: 0.1, repeat: isGlitching && !isMobile ? 2 : 0 },
                      y: { duration: 0.1, repeat: isGlitching && !isMobile ? 2 : 0 },
                    }}
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={svgImages[1] || "/placeholder.svg"}
                        alt="IMAGE02"
                        fill
                        className="object-cover"
                        priority
                        sizes="(max-width: 768px) 95vw, 85vw"
                        style={{
                          filter: isGlitching ? "brightness(1.05) contrast(1.02)" : "none",
                        }}
                      />
                    </div>
                  </motion.div>

                  {/* Third SVG image (IMAGE03.svg) */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0, scale: 1.01 }}
                    animate={{
                      opacity: currentImageIndex === 2 ? 1 : 0,
                      scale: currentImageIndex === 2 ? 1 : 1.01,
                      x: isGlitching && !isMobile ? [0, 1, -1, 0] : 0,
                      y: isGlitching && !isMobile ? [0, -0.5, 0.5, 0] : 0,
                    }}
                    transition={{
                      opacity: { duration: 0.4 },
                      scale: { duration: 0.4 },
                      x: { duration: 0.1, repeat: isGlitching && !isMobile ? 2 : 0 },
                      y: { duration: 0.1, repeat: isGlitching && !isMobile ? 2 : 0 },
                    }}
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={svgImages[2] || "/placeholder.svg"}
                        alt="IMAGE03"
                        fill
                        className="object-cover"
                        priority
                        sizes="(max-width: 768px) 95vw, 85vw"
                        style={{
                          filter: isGlitching ? "brightness(1.05) contrast(1.02)" : "none",
                        }}
                      />
                    </div>
                  </motion.div>

                  {/* Fourth SVG image (IMAGE04.svg) */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0, scale: 1.01 }}
                    animate={{
                      opacity: currentImageIndex === 3 && !finalTransition ? 1 : 0,
                      scale: currentImageIndex === 3 && !finalTransition ? 1 : 1.01,
                      x: isGlitching && !isMobile ? [0, 1, -1, 0] : 0,
                      y: isGlitching && !isMobile ? [0, -0.5, 0.5, 0] : 0,
                    }}
                    transition={{
                      opacity: { duration: 0.4 },
                      scale: { duration: 0.4 },
                      x: { duration: 0.1, repeat: isGlitching && !isMobile ? 2 : 0 },
                      y: { duration: 0.1, repeat: isGlitching && !isMobile ? 2 : 0 },
                    }}
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={svgImages[3] || "/placeholder.svg"}
                        alt="IMAGE04"
                        fill
                        className="object-cover"
                        priority
                        sizes="(max-width: 768px) 95vw, 85vw"
                        style={{
                          filter: isGlitching ? "brightness(1.05) contrast(1.02)" : "none",
                        }}
                      />
                    </div>
                  </motion.div>

                  {/* Final image (temple) */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0, scale: 1.01 }}
                    animate={{
                      opacity: currentImageIndex === 4 ? 1 : 0,
                      scale: currentImageIndex === 4 ? 1 : 1.01,
                      x: isGlitching && !isMobile ? [0, 1, -1, 0] : 0,
                      y: isGlitching && !isMobile ? [0, -0.5, 0.5, 0] : 0,
                    }}
                    transition={{
                      opacity: { duration: 0.4 },
                      scale: { duration: 0.4 },
                      x: { duration: 0.1, repeat: isGlitching && !isMobile ? 2 : 0 },
                      y: { duration: 0.1, repeat: isGlitching && !isMobile ? 2 : 0 },
                    }}
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={templeImageUrl || "/placeholder.svg"}
                        alt="Ancient Temple"
                        fill
                        className="object-cover"
                        priority
                        sizes="(max-width: 768px) 95vw, 85vw"
                        style={{
                          filter: isGlitching ? "brightness(1.05) contrast(1.02)" : "none",
                        }}
                      />
                    </div>
                  </motion.div>

                  {/* Final state - empty state for transition effect only */}
                  {finalTransition && (
                    <div className="relative w-full h-full flex items-center justify-center">
                      {/* No content - just for transition effect */}
                    </div>
                  )}

                  {/* Enhanced glow effects - simplified for mobile */}
                  <div
                    className={`absolute inset-0 blur-2xl rounded-full ${
                      rainbowMode
                        ? "bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-pink-500/10"
                        : "bg-blue-500/10"
                    }`}
                  />
                  {!isMobile && (
                    <div
                      className={`absolute inset-0 blur-xl rounded-full animate-pulse ${
                        rainbowMode
                          ? "bg-gradient-to-r from-pink-500/5 via-purple-500/5 to-blue-500/5"
                          : "bg-purple-500/5"
                      }`}
                      style={{ animationDuration: "3s" }}
                    />
                  )}
                </div>
              )}
            </div>

            {/* Close button with glow - enlarged for mobile */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 md:top-4 md:right-4 w-12 h-12 md:w-10 md:h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center z-40 hover:bg-black/60 transition-colors group"
              aria-label="Close"
            >
              <div className="absolute inset-0 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M1 1L13 13M1 13L13 1"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

