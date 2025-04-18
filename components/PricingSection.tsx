"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import PricingCard from "./PricingCard"
import { useMediaQuery } from "@/hooks/use-media-query"

export default function PricingSection() {
  const [scrollY, setScrollY] = useState(0)
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Handle scroll for parallax effect
  useEffect(() => {
    const handleScroll = () => {
      // Get the section element
      const section = document.getElementById("pricing-section")
      if (section) {
        // Calculate scroll position relative to the section
        const rect = section.getBoundingClientRect()
        if (rect.top <= window.innerHeight && rect.bottom >= 0) {
          // Only update scrollY when the section is visible
          const relativeScroll = Math.max(0, -rect.top)
          setScrollY(relativeScroll)
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const pricingTiers = [
    {
      title: "Free",
      price: "Free",
      description: "Experience your Clone posting directly on your X account.",
      features: [
        "Your GPT clone posts on X directly from your account",
        "No need to transfer content between systems",
        "Experience personalized content creation",
        "Limited to 1 post per day",
      ],
      tier: "free" as const,
    },
    {
      title: "Basic",
      price: "$4.99",
      description: "Respond and schedule with your clone through our extension.",
      features: [
        "Everything in the Free tier",
        "Respond with your clone using embedded reply button",
        "Schedule cloned content in the chrome extension",
        "Continue surfing the timeline while your clone works",
        "Limited to 2 posts per day & 25 replies monthly",
      ],
      tier: "basic" as const,
    },
    {
      title: "Premium",
      price: "$19.99",
      description: "Target accounts and increase visibility with the X Algo Agent.",
      features: [
        "Everything in the Basic tier",
        "Target specific accounts for daily replies",
        "Get noticed with X Algo Agent for increased visibility",
        "Optimize your posts and replies for maximum engagement",
        "Limited to 4 posts per day, 50 replies monthly & 3 targeted accounts",
      ],
      tier: "premium" as const,
    },
    {
      title: "Pro",
      price: "$49.99",
      description: "Auto-reply to mentions with perfect timing for maximum engagement.",
      features: [
        "Everything in the Premium tier",
        "Auto-reply to all mentions on your posts",
        "Drive replies with algo-friendly timing",
        "Keep conversations flowing in your threads",
        "Limited to 8 posts per day, 100 replies monthly & 10 targeted accounts",
      ],
      tier: "pro" as const,
    },
    {
      title: "Founder",
      price: "$199.99",
      description: "Your clone operates on complete autopilot with your perfected voice.",
      features: [
        "Everything in the Pro tier",
        "Clone replies agentically with your tone",
        "Discover more content you should be replying to",
        "Unlimited posts, replies, and targeted accounts",
      ],
      tier: "founder" as const,
    },
    {
      title: "Agentic",
      price: "Contact Us",
      description: "Let your clone do everything on X for you with your tone.",
      features: [
        "Everything in the Founder tier",
        "You will never have to be on twitter again if you wish!",
        "We will email you with a digest of your weekly activity and engagement",
        "Eligible to connect this agent to other platforms when they become available",
        "Unlimited posts, replies, and targeted accounts",
      ],
      tier: "agentic" as const,
    },
  ]

  return (
    <section
      id="pricing-section"
      className="min-h-screen bg-gradient-to-b from-gray-900 to-black relative overflow-y-auto"
    >
      {/* Background decorative elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden opacity-30 pointer-events-none">
        {/* Gradient orbs with fixed positions */}
        <div
          className="fixed top-10 left-10 w-64 h-64 rounded-full bg-blue-500/20"
          style={{
            transform: `translateY(${scrollY * 0.1}px)`,
            boxShadow: "0 0 80px 30px rgba(59, 130, 246, 0.2)",
          }}
        />
        <div
          className="fixed top-40 right-20 w-80 h-80 rounded-full bg-purple-500/20"
          style={{
            transform: `translateY(${scrollY * 0.15}px)`,
            boxShadow: "0 0 80px 30px rgba(168, 85, 247, 0.2)",
          }}
        />
        <div
          className="fixed bottom-20 left-40 w-72 h-72 rounded-full bg-pink-500/20"
          style={{
            transform: `translateY(${scrollY * -0.1}px)`,
            boxShadow: "0 0 80px 30px rgba(236, 72, 153, 0.2)",
          }}
        />
        <div
          className="fixed bottom-40 right-10 w-96 h-96 rounded-full bg-cyan-500/20"
          style={{
            transform: `translateY(${scrollY * -0.05}px)`,
            boxShadow: "0 0 80px 30px rgba(6, 182, 212, 0.2)",
          }}
        />
      </div>

      <div className="container max-w-7xl px-4 py-16 md:py-20 mx-auto relative z-10">
        <div className="text-center mb-8 md:mb-14">
          <div className="flex items-center justify-center mb-2">
            <h1 className="text-3xl md:text-5xl font-bold font-syncopate">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">CLONEX</span>
            </h1>
          </div>
          <h2 className="text-xl md:text-3xl font-bold mb-3 md:mb-4 text-white">Your GPT Clone. Your X Presence.</h2>
          <p className="text-sm md:text-lg text-white/70 max-w-2xl mx-auto">
            Amplify your presence on X with your personalized Clone that posts and engages just like you would.
            Uninterrupted, intelligent, and always on-brand.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 auto-rows-fr mb-8">
          {pricingTiers.map((tier) => (
            <PricingCard key={tier.title} {...tier} className="w-full" />
          ))}
        </div>

        <div className="mt-8 md:mt-14 text-center pb-8">
          <div className="flex flex-wrap gap-4 justify-center items-center">
            <motion.button
              className="relative px-6 sm:px-10 md:px-14 py-3 sm:py-4 md:py-5 rounded-full bg-gradient-to-b from-white/40 to-white/10 backdrop-blur-md border border-white/30 shadow-lg overflow-hidden group hover:scale-105 active:scale-95 transition-transform"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                filter: "brightness(1.05) contrast(1.02)",
              }}
            >
              {/* Inner glow effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Button text */}
              <span className="relative font-syncopate font-bold text-xl sm:text-2xl md:text-3xl tracking-wider text-white z-10 flex items-center justify-center">
                Start Your Free Trial
              </span>

              {/* Shine effect */}
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shine_1.5s_ease-in-out_infinite]" />
            </motion.button>

            <motion.button
              className="relative px-6 sm:px-10 md:px-14 py-3 sm:py-4 md:py-5 rounded-full bg-gradient-to-b from-white/40 to-white/10 backdrop-blur-md border border-white/30 shadow-lg overflow-hidden group hover:scale-105 active:scale-95 transition-transform"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                filter: "brightness(1.05) contrast(1.02)",
              }}
            >
              {/* Inner glow effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Button text */}
              <span className="relative font-syncopate font-bold text-xl sm:text-2xl md:text-3xl tracking-wider text-white z-10 flex items-center justify-center">
                Contact Sales
              </span>

              {/* Shine effect */}
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shine_1.5s_ease-in-out_infinite]" />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  )
}

