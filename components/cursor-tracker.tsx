"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function CursorTracker() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [spinnerHovered, setSpinnerHovered] = useState(false)
  const spinnerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)

    const timer = setTimeout(() => setIsLoading(false), 2500)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      clearTimeout(timer)
    }
  }, [])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-nomec-cream flex flex-col items-center justify-center"
        >
          {/* Cursor-following glow */}
          <div
            className="cursor-glow"
            style={{
              left: mousePos.x,
              top: mousePos.y,
            }}
          />

          {/* Interactive spinner */}
          <motion.div
            ref={spinnerRef}
            className="relative cursor-pointer"
            onMouseEnter={() => setSpinnerHovered(true)}
            onMouseLeave={() => setSpinnerHovered(false)}
            animate={{
              rotate: spinnerHovered ? 180 : 0,
              scale: spinnerHovered ? 1.15 : 1,
            }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <svg
              width="80"
              height="80"
              viewBox="0 0 80 80"
              fill="none"
              className="spinner-interactive"
            >
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="#1a5f2a"
                strokeWidth="3"
                strokeDasharray="180"
                strokeDashoffset="60"
                strokeLinecap="round"
              />
              <circle
                cx="40"
                cy="40"
                r="24"
                stroke="#c9a227"
                strokeWidth="2"
                strokeDasharray="120"
                strokeDashoffset="30"
                strokeLinecap="round"
                transform="rotate(45 40 40)"
              />
            </svg>
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-2 h-2 bg-nomec-green rounded-full" />
            </motion.div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-nomec-slate font-brand font-extrabold text-lg tracking-widest uppercase"
          >
            Nosakhare Model Education Centre
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.6 }}
            className="mt-2 text-sm text-nomec-slate/60"
          >
            Diligence, Knowledge, Faith in God
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
