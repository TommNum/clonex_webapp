"use client"

import { useEffect } from "react"

export default function SimpleAudioFallback() {
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined' || typeof document === 'undefined') return

    // This component is a last resort fallback
    // It will try to play the audio using the most basic approach
    const tryPlayAudio = () => {
      const audio = document.getElementById("background-audio") as HTMLAudioElement
      if (audio && audio.paused) {
        // Try to play on user interaction
        const playPromise = audio.play()
        if (playPromise) {
          playPromise.catch((err) => {
            console.log("Simple fallback couldn't play audio:", err)
          })
        }
      }
    }

    // Try to play on any user interaction
    const handleUserInteraction = () => {
      tryPlayAudio()
      // Remove listeners after first interaction
      document.removeEventListener("click", handleUserInteraction)
      document.removeEventListener("touchstart", handleUserInteraction)
      document.removeEventListener("keydown", handleUserInteraction)
    }

    document.addEventListener("click", handleUserInteraction)
    document.addEventListener("touchstart", handleUserInteraction)
    document.addEventListener("keydown", handleUserInteraction)

    return () => {
      document.removeEventListener("click", handleUserInteraction)
      document.removeEventListener("touchstart", handleUserInteraction)
      document.removeEventListener("keydown", handleUserInteraction)
    }
  }, [])

  return null // This component doesn't render anything
}

