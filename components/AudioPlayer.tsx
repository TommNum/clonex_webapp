"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Volume2, VolumeX, Music } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [showVolumeControl, setShowVolumeControl] = useState(false)
  const [audioLoaded, setAudioLoaded] = useState(false)
  const [audioError, setAudioError] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioElementRef = useRef<HTMLAudioElement | null>(null)

  // Initialize audio on component mount
  useEffect(() => {
    // Check if we're in the browser environment
    if (typeof window === "undefined") return

    // Load saved preferences
    const savedVolume = localStorage.getItem("audioVolume")
    const savedMuted = localStorage.getItem("audioMuted")

    if (savedVolume) {
      const parsedVolume = Number.parseFloat(savedVolume)
      setVolume(parsedVolume)
    }

    if (savedMuted === "true") {
      setIsMuted(true)
    }

    // Try to get the existing audio element first
    const existingAudio = document.getElementById("background-audio") as HTMLAudioElement

    if (existingAudio) {
      console.log("Using existing audio element")
      audioElementRef.current = existingAudio

      // Set up event listeners
      existingAudio.addEventListener("canplaythrough", handleCanPlayThrough)
      existingAudio.addEventListener("error", handleAudioError)
      existingAudio.addEventListener("playing", () => setIsPlaying(true))
      existingAudio.addEventListener("pause", () => setIsPlaying(false))

      // Set volume
      existingAudio.volume = isMuted ? 0 : volume

      // Check if already loaded
      if (existingAudio.readyState >= 3) {
        setAudioLoaded(true)
        if (!isMuted) {
          tryPlayAudio(existingAudio)
        }
      }

      audioRef.current = existingAudio
    } else {
      console.log("Creating new audio element")
      // Create a new audio element if none exists
      const audio = new Audio()

      // Add event listeners
      audio.addEventListener("canplaythrough", handleCanPlayThrough)
      audio.addEventListener("error", handleAudioError)
      audio.addEventListener("playing", () => setIsPlaying(true))
      audio.addEventListener("pause", () => setIsPlaying(false))

      // Set properties
      audio.loop = true
      audio.volume = isMuted ? 0 : volume
      audio.preload = "auto"

      // Try different audio formats
      audio.innerHTML = `
        <source src="/ethereal-passage.mp3" type="audio/mpeg">
        <source src="/ethereal-passage.wav" type="audio/wav">
      `

      // Set source as a fallback
      audio.src = "/ethereal-passage.mp3"

      audioRef.current = audio

      // Append to body to ensure it's in the DOM
      audio.style.display = "none"
      document.body.appendChild(audio)
      audioElementRef.current = audio
    }

    // Clean up on unmount
    return () => {
      const audio = audioRef.current
      if (audio) {
        audio.pause()
        audio.removeEventListener("canplaythrough", handleCanPlayThrough)
        audio.removeEventListener("error", handleAudioError)
        audio.removeEventListener("playing", () => setIsPlaying(true))
        audio.removeEventListener("pause", () => setIsPlaying(false))

        // Only remove if we created it
        if (audio !== document.getElementById("background-audio")) {
          audio.remove()
        }
      }
    }
  }, [])

  // Event handlers
  const handleCanPlayThrough = () => {
    console.log("Audio can play through")
    setAudioLoaded(true)

    // Try to play if not muted
    if (!isMuted && audioRef.current) {
      tryPlayAudio(audioRef.current)
    }
  }

  const handleAudioError = (e: Event) => {
    const audio = e.target as HTMLAudioElement
    console.error("Audio error details:", {
      code: audio.error?.code,
      message: audio.error?.message,
      errorType: audio.error?.name,
      event: e,
    })
    setAudioError(true)
    setIsPlaying(false)
  }

  // Try to play audio with error handling
  const tryPlayAudio = (audio: HTMLAudioElement) => {
    const playPromise = audio.play()
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log("Audio playback started successfully")
          setIsPlaying(true)
        })
        .catch((error) => {
          console.log("Audio playback was prevented:", error)
          setIsPlaying(false)
        })
    }
  }

  // Update volume when changed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }

    // Save preferences
    localStorage.setItem("audioVolume", volume.toString())
    localStorage.setItem("audioMuted", isMuted.toString())
  }, [volume, isMuted])

  // Toggle play/pause
  const togglePlay = () => {
    if (!audioRef.current || !audioLoaded) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      tryPlayAudio(audioRef.current)
    }
  }

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number.parseFloat(e.target.value)
    setVolume(newVolume)
  }

  // Simple equalizer bars for visualization
  const renderEqualizer = () => {
    if (!isPlaying || isMuted) {
      return (
        <div className="ml-2 h-8 flex items-center space-x-[2px]">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-1 h-1 bg-white/30 rounded-full" />
          ))}
        </div>
      )
    }

    return (
      <div className="ml-2 h-8 flex items-center space-x-[2px]">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            className="w-1 bg-white/70 rounded-full"
            animate={{
              height: [3, 10 + Math.random() * 15, 3],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 0.8 + Math.random() * 0.5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              delay: i * 0.1,
            }}
            style={{ minHeight: 3 }}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="fixed top-4 left-4 z-50 flex items-center">
      {/* Mute/Unmute Button with glow effect */}
      <motion.button
        onClick={toggleMute}
        onMouseEnter={() => setShowVolumeControl(true)}
        className="relative w-10 h-10 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-md border border-white/20 text-white hover:bg-black/50 transition-colors"
        aria-label={isMuted ? "Unmute" : "Mute"}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={
          isPlaying && !isMuted
            ? {
                boxShadow: [
                  "0 0 0 rgba(255, 255, 255, 0.3)",
                  "0 0 10px rgba(255, 255, 255, 0.5)",
                  "0 0 0 rgba(255, 255, 255, 0.3)",
                ],
              }
            : {}
        }
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
      >
        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </motion.button>

      {/* Simple Equalizer */}
      {renderEqualizer()}

      {/* Volume Control Slider */}
      <AnimatePresence>
        {showVolumeControl && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 100 }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
            className="ml-2 bg-black/30 backdrop-blur-md rounded-full px-3 py-1 border border-white/20"
            onMouseLeave={() => setShowVolumeControl(false)}
          >
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full accent-white/70 cursor-pointer"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Play/Pause Button - Only shown if autoplay was blocked or audio is paused */}
      {!isPlaying && audioLoaded && !audioError && (
        <motion.button
          onClick={togglePlay}
          className="ml-2 w-8 h-8 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-md border border-white/20 text-white hover:bg-black/50 transition-colors"
          aria-label="Play"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Music size={16} />
        </motion.button>
      )}

      {/* Loading or Error Message */}
      {(!audioLoaded || audioError) && (
        <div className="ml-2 text-xs text-white/70 bg-black/30 backdrop-blur-md rounded-full px-3 py-1">
          {audioError ? "Audio unavailable" : "Loading..."}
        </div>
      )}
    </div>
  )
}

