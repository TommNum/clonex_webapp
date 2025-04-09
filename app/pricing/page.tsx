"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check } from "lucide-react"
import Link from "next/link"

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")

  const plans = [
    {
      name: "Basic",
      description: "Essential features for individuals",
      price: billingCycle === "monthly" ? 19 : 190,
      features: ["1 Clone", "Basic customization", "24-hour response time", "Email support", "1GB storage"],
      highlighted: false,
      ctaText: "Get Started",
    },
    {
      name: "Pro",
      description: "Advanced features for professionals",
      price: billingCycle === "monthly" ? 49 : 490,
      features: [
        "3 Clones",
        "Advanced customization",
        "4-hour response time",
        "Priority support",
        "10GB storage",
        "API access",
        "Analytics dashboard",
      ],
      highlighted: true,
      ctaText: "Get Started",
    },
    {
      name: "Enterprise",
      description: "Custom solutions for teams",
      price: billingCycle === "monthly" ? 99 : 990,
      features: [
        "Unlimited Clones",
        "Full customization",
        "1-hour response time",
        "Dedicated support",
        "Unlimited storage",
        "Advanced API access",
        "Custom analytics",
        "SSO integration",
        "Custom training",
      ],
      highlighted: false,
      ctaText: "Contact Sales",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white overflow-y-auto relative">
      {/* Background gradient orbs with fixed positioning */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden opacity-30 pointer-events-none">
        <div className="fixed top-10 left-10 w-64 h-64 rounded-full bg-blue-500/20"
          style={{ boxShadow: "0 0 80px 30px rgba(59, 130, 246, 0.2)" }} />
        <div className="fixed top-40 right-20 w-80 h-80 rounded-full bg-purple-500/20"
          style={{ boxShadow: "0 0 80px 30px rgba(168, 85, 247, 0.2)" }} />
        <div className="fixed bottom-20 left-40 w-72 h-72 rounded-full bg-pink-500/20"
          style={{ boxShadow: "0 0 80px 30px rgba(236, 72, 153, 0.2)" }} />
        <div className="fixed bottom-40 right-10 w-96 h-96 rounded-full bg-cyan-500/20"
          style={{ boxShadow: "0 0 80px 30px rgba(6, 182, 212, 0.2)" }} />
      </div>

      {/* Content container with relative positioning and z-index */}
      <div className="relative z-10">
        {/* Header */}
        <header className="pt-24 pb-12 px-4 md:px-6 text-center">
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 font-syncopate"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Choose Your Plan
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Select the perfect plan for your needs and start creating your digital clone today
          </motion.p>
        </header>

        {/* Billing toggle */}
        <motion.div
          className="flex justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="bg-gray-800/50 p-1 rounded-full backdrop-blur-sm border border-white/10">
            <div className="flex items-center">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  billingCycle === "monthly"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  billingCycle === "yearly"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                Yearly <span className="text-xs opacity-75">(Save 20%)</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Pricing cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                className={`relative rounded-2xl overflow-hidden ${
                  plan.highlighted
                    ? "border-2 border-purple-500 shadow-lg shadow-purple-500/20"
                    : "border border-white/10"
                }`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              >
                {/* Glass effect background */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md z-0" />

                {/* Popular badge */}
                {plan.highlighted && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-3 py-1 transform translate-x-[30%] translate-y-[30%] rotate-45">
                    POPULAR
                  </div>
                )}

                <div className="relative p-6 md:p-8 z-10">
                  <h3 className="text-xl font-bold font-syncopate">{plan.name}</h3>
                  <p className="text-gray-400 mt-2 h-12">{plan.description}</p>
                  <div className="mt-6 mb-8">
                    <span className="text-5xl font-bold">${plan.price}</span>
                    <span className="text-gray-400 ml-2">/{billingCycle === "monthly" ? "mo" : "yr"}</span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center">
                        <Check className="h-5 w-5 text-purple-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="#"
                    className={`block w-full py-3 px-4 rounded-full text-center font-medium transition-all ${
                      plan.highlighted
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:shadow-purple-500/20"
                        : "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
                    }`}
                  >
                    {plan.ctaText}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <motion.h2
            className="text-3xl font-bold text-center mb-12 font-syncopate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Frequently Asked Questions
          </motion.h2>

          <div className="space-y-6">
            {[
              {
                question: "What is a digital clone?",
                answer:
                  "A digital clone is an AI-powered replica of your online presence that can interact with others on your behalf, maintaining your unique style and knowledge base.",
              },
              {
                question: "Can I upgrade or downgrade my plan?",
                answer:
                  "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.",
              },
              {
                question: "Is there a free trial available?",
                answer:
                  "We offer a 14-day free trial on all plans so you can experience the full power of our platform before committing.",
              },
              {
                question: "What payment methods do you accept?",
                answer:
                  "We accept all major credit cards, PayPal, and cryptocurrency payments including Bitcoin and Ethereum.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
              >
                <h3 className="text-xl font-medium mb-2">{faq.question}</h3>
                <p className="text-gray-400">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <motion.div
            className="relative rounded-2xl overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            {/* Background with gradient and blur */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-md z-0" />

            {/* Content */}
            <div className="relative p-8 md:p-12 z-10 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-syncopate">Ready to get started?</h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of users who are already using CloneX to enhance their digital presence
              </p>
              <Link
                href="/"
                className="inline-block py-3 px-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:shadow-lg hover:shadow-purple-500/20 transition-all"
              >
                Create Your Clone Now
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="border-t border-white/10 py-12 px-4">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <Link href="/" className="text-2xl font-bold font-syncopate">
                CLONEX
              </Link>
              <p className="text-gray-400 mt-2">Your digital presence, amplified.</p>
            </div>
            <div className="flex space-x-8">
              <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/pricing" className="text-gray-300 hover:text-white transition-colors">
                Pricing
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                About
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-white/10 text-center text-gray-400">
            <p>© {new Date().getFullYear()} CloneX. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  )
}

