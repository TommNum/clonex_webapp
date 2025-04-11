import type React from "react"
import "./globals.css"
import { Inter, Syncopate, Cormorant_Garamond } from "next/font/google"
import StardustCursor from "@/components/StardustCursor"
import AudioPlayer from "@/components/AudioPlayer"
import Script from "next/script"
import type { Metadata } from "next"
import { AuthProvider } from "@/contexts/AuthContext"

const inter = Inter({ subsets: ["latin"] })
const syncopate = Syncopate({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-syncopate",
})
const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
})

export const metadata: Metadata = {
  title: "CloneX",
  description: "Twitter clone with advanced features",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Preload audio files */}
        <link rel="preload" href="/ethereal-passage.mp3" as="audio" />
        <link rel="preload" href="/ethereal-passage.wav" as="audio" />
      </head>
      <body className={`${inter.className} ${syncopate.variable} ${cormorantGaramond.variable}`}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <StardustCursor />

        {/* Hidden audio element with multiple sources */}
        <audio id="background-audio" preload="auto" loop style={{ display: "none" }}>
          <source src="/ethereal-passage.mp3" type="audio/mpeg" />
          <source src="/ethereal-passage.wav" type="audio/wav" />
          Your browser does not support the audio element.
        </audio>

        {/* Audio player component */}
        <AudioPlayer />

        {/* Script to ensure audio is loaded */}
        <Script id="audio-loader" strategy="afterInteractive">
          {`
            document.addEventListener('DOMContentLoaded', function() {
              const audio = document.getElementById('background-audio');
              if (audio) {
                audio.load();
                console.log('Background audio loaded via fallback element');
                
                // Force a reload after a short delay as a fallback
                setTimeout(function() {
                  if (audio.readyState < 2) {
                    audio.load();
                    console.log('Forced audio reload');
                  }
                }, 2000);
              }
            });
          `}
        </Script>
      </body>
    </html>
  )
}

import './globals.css'