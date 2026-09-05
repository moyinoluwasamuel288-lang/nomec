"use client"

import { motion } from "framer-motion"

interface SectionHeaderProps {
  title: string
  subtitle?: string
  centered?: boolean
  light?: boolean
}

export function SectionHeader({ title, subtitle, centered = true, light = false }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className={`mb-12 ${centered ? "text-center" : ""}`}
    >
      <div className={`inline-flex items-center gap-3 mb-4 ${centered ? "justify-center" : ""}`}>
        <div className="h-px w-8 bg-nomec-gold" />
        <span className="text-xs uppercase tracking-[0.25em] text-nomec-green font-medium">
          {subtitle || "Section"}
        </span>
        <div className="h-px w-8 bg-nomec-gold" />
      </div>
      <h2 className={`text-3xl md:text-4xl lg:text-5xl font-serif ${light ? "text-white" : "text-nomec-slate"}`}>
        {title}
      </h2>
    </motion.div>
  )
}
