"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface CardData {
  id: number
  title: string
  type: "primary" | "secondary" | "tertiary"
  topics?: { name: string; percentage: number }[]
  content?: string
}

interface ProfileCardProps {
  card: CardData
  profileImage: string
  isActive: boolean
}

export default function ProfileCard({ card, profileImage, isActive }: ProfileCardProps) {
  return (
    <div className="w-full h-full relative overflow-hidden">
      {/* Glass card with morphism effect */}
      <div className="absolute inset-0 rounded-3xl overflow-hidden">
        {/* Background gradient and blur */}
        <div className="absolute inset-0 bg-gradient-radial from-white/30 via-white/20 to-white/10 backdrop-blur-md" />

        {/* Subtle rainbow edge effect */}
        <motion.div
          className="absolute -inset-1 opacity-30 blur-xl z-0"
          style={{
            background:
              "linear-gradient(45deg, rgba(255,0,128,0.1), rgba(121,40,202,0.1), rgba(0,112,243,0.1), rgba(0,223,216,0.1))",
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

        {/* Inner highlight */}
        <div className="absolute inset-[1px] rounded-3xl bg-gradient-to-tr from-white/20 to-transparent z-2" />

        {/* Card border */}
        <div className="absolute inset-0 rounded-3xl border border-white/30 z-3" />
      </div>

      {/* Card content */}
      <div className="relative h-full flex flex-col p-6 z-10">
        {/* Profile image section */}
        <div className="flex items-center mb-6">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white/50 shadow-lg">
            <Image src={profileImage || "/placeholder.svg"} alt="Profile" fill className="object-cover" />
          </div>
          <div className="ml-4">
            <h3 className="text-white font-bold text-lg">@explorer</h3>
            <p className="text-white/70 text-sm">Clone Profile</p>
          </div>
        </div>

        {/* Card specific content */}
        <div className="flex-1">
          {card.type === "primary" ? (
            <div className="h-full flex flex-col">
              <h2 className="text-white font-bold text-xl mb-6">{card.title}</h2>

              <div className="grid grid-cols-3 gap-4 mb-4">
                {card.topics?.map((topic) => (
                  <div key={topic.name} className="text-center">
                    <p className="text-white font-medium">{topic.name}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-4">
                {card.topics?.map((topic) => (
                  <div key={`percentage-${topic.name}`} className="flex flex-col items-center">
                    <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden mb-1">
                      <motion.div
                        className="h-full bg-white"
                        initial={{ width: 0 }}
                        animate={{ width: `${topic.percentage}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                    <p className="text-white/80 text-sm">{topic.percentage}%</p>
                  </div>
                ))}
              </div>

              <div className="mt-auto">
                <p className="text-white/60 text-sm italic">Based on your timeline activity</p>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center">
              <h2 className="text-white font-bold text-xl mb-4">{card.title}</h2>
              <p className="text-white/60 text-center">{card.content}</p>
              <motion.div
                className="w-16 h-16 rounded-full bg-white/10 mt-6 flex items-center justify-center"
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.7, 0.9, 0.7],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "loop",
                }}
              >
                <span className="text-white/80 text-xs">Coming soon</span>
              </motion.div>
            </div>
          )}
        </div>

        {/* Card indicator */}
        <div className="absolute bottom-4 right-4">
          <div className="flex gap-1">
            {[1, 2, 3].map((num) => (
              <div key={num} className={cn("w-1.5 h-1.5 rounded-full", num === card.id ? "bg-white" : "bg-white/30")} />
            ))}
          </div>
        </div>
      </div>

      {/* Hover effect */}
      {isActive && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-white/5 rounded-3xl pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        />
      )}
    </div>
  )
}

