"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import Hammer from "hammerjs"

interface ScrollManagerProps {
  children: React.ReactNode
}

export default function ScrollManager({ children }: ScrollManagerProps) {
  const [currentSection, setCurrentSection] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const [allowNormalScroll, setAllowNormalScroll] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const childrenArray = Array.isArray(children) ? children : [children]
  const totalSections = childrenArray.length

  useEffect(() => {
    if (!containerRef.current) return

    // Function to check if we're in the pricing section
    const checkIfPricingSection = () => {
      return currentSection === 1 // Assuming pricing is the second section (index 1)
    }

    // Update allowNormalScroll state
    const updateScrollBehavior = () => {
      setAllowNormalScroll(checkIfPricingSection())
    }

    // Call initially
    updateScrollBehavior()

    // Prevent default scrolling behavior except in pricing section
    const preventDefaultScroll = (e: WheelEvent) => {
      if (allowNormalScroll && checkIfPricingSection()) {
        // Check if we're at the top of the pricing section and scrolling up
        const pricingSection = document.getElementById("pricing-section")
        if (pricingSection && pricingSection.scrollTop === 0 && e.deltaY < 0) {
          e.preventDefault()
          if (!isScrolling && currentSection > 0) {
            scrollToSection(currentSection - 1)
          }
        }
        // Check if we're at the bottom of the pricing section and scrolling down
        else if (
          pricingSection &&
          pricingSection.scrollHeight - pricingSection.scrollTop <= pricingSection.clientHeight + 5 &&
          e.deltaY > 0
        ) {
          e.preventDefault()
          if (!isScrolling && currentSection < totalSections - 1) {
            scrollToSection(currentSection + 1)
          }
        }
        // Otherwise allow normal scrolling within the pricing section
        return
      }

      // Prevent default for other sections
      e.preventDefault()
    }

    window.addEventListener("wheel", preventDefaultScroll, { passive: false })

    // Setup Hammer.js for swipe detection
    const hammer = new Hammer(containerRef.current)
    hammer.get("swipe").set({ direction: Hammer.DIRECTION_VERTICAL })

    hammer.on("swipeup", () => {
      if (allowNormalScroll) return // Skip in pricing section

      if (!isScrolling && currentSection < totalSections - 1) {
        scrollToSection(currentSection + 1)
      }
    })

    hammer.on("swipedown", () => {
      if (allowNormalScroll) return // Skip in pricing section

      if (!isScrolling && currentSection > 0) {
        scrollToSection(currentSection - 1)
      }
    })

    // Handle mouse wheel scrolling
    const handleWheel = (e: WheelEvent) => {
      if (isScrolling || allowNormalScroll) return

      if (e.deltaY > 0 && currentSection < totalSections - 1) {
        scrollToSection(currentSection + 1)
      } else if (e.deltaY < 0 && currentSection > 0) {
        scrollToSection(currentSection - 1)
      }
    }

    window.addEventListener("wheel", handleWheel)

    // Handle keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isScrolling || allowNormalScroll) return

      if ((e.key === "ArrowDown" || e.key === "PageDown") && currentSection < totalSections - 1) {
        scrollToSection(currentSection + 1)
      } else if ((e.key === "ArrowUp" || e.key === "PageUp") && currentSection > 0) {
        scrollToSection(currentSection - 1)
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("wheel", preventDefaultScroll)
      window.removeEventListener("wheel", handleWheel)
      window.removeEventListener("keydown", handleKeyDown)
      hammer.destroy()
    }
  }, [currentSection, isScrolling, totalSections, allowNormalScroll])

  // Update allowNormalScroll when currentSection changes
  useEffect(() => {
    setAllowNormalScroll(currentSection === 1) // Assuming pricing is the second section (index 1)
  }, [currentSection])

  const scrollToSection = (index: number) => {
    setIsScrolling(true)
    setCurrentSection(index)

    // Reset scrolling state after animation completes
    setTimeout(() => {
      setIsScrolling(false)
    }, 1000) // Match this with the CSS transition duration
  }

  return (
    <div ref={containerRef} className="h-screen w-full overflow-hidden">
      <div
        className="transition-transform duration-1000 ease-in-out h-full"
        style={{ transform: `translateY(-${currentSection * 100}%)` }}
      >
        {childrenArray.map((child, index) => (
          <div
            key={index}
            className="h-screen w-full"
            style={{
              transform: `translateY(${(index - currentSection) * 20}px) scale(${index === currentSection ? 1 : index < currentSection ? 0.95 : 1.05})`,
              opacity: index === currentSection ? 1 : 0.5,
              transition: "transform 1s ease-in-out, opacity 1s ease-in-out",
              overflow: index === 1 ? "auto" : "hidden", // Allow scrolling in pricing section
              touchAction: index === 1 ? "auto" : "none", // Allow touch scrolling in pricing section
            }}
          >
            {child}
          </div>
        ))}
      </div>

      {/* Navigation dots */}
      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50">
        <div className="flex flex-col space-y-4">
          {Array.from({ length: totalSections }).map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToSection(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentSection === index ? "bg-white scale-125" : "bg-gray-500 hover:bg-gray-300"
              }`}
              aria-label={`Go to section ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

