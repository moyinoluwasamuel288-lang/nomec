"use client"

import { motion } from "framer-motion"
import { MapPin, Phone, Mail, Clock, Send, Facebook } from "lucide-react"
import { SectionHeader } from "@/components/section-header"
import { ScrollReveal } from "@/components/scroll-reveal"
import { useState } from "react"

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <>
      <section className="pt-32 pb-16 bg-nomec-green relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px w-8 bg-nomec-gold" />
              <span className="text-xs uppercase tracking-[0.25em] text-nomec-gold font-medium">Contact</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-4">Get in Touch</h1>
            <p className="text-white/70 max-w-2xl text-lg">
              We welcome your enquiries, feedback, and visits. Reach out to our administration office.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            <ScrollReveal className="lg:col-span-2">
              <div className="bg-nomec-cream rounded-2xl p-8 md:p-10">
                <h3 className="text-2xl font-serif text-nomec-slate mb-6">Send a Message</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-nomec-slate mb-2">Full Name</label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-nomec-green/20 focus:border-nomec-green focus:ring-2 focus:ring-nomec-green/20 outline-none transition-all bg-white"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-nomec-slate mb-2">Email Address</label>
                      <input
                        type="email"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-nomec-green/20 focus:border-nomec-green focus:ring-2 focus:ring-nomec-green/20 outline-none transition-all bg-white"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-nomec-slate mb-2">Subject</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-nomec-green/20 focus:border-nomec-green focus:ring-2 focus:ring-nomec-green/20 outline-none transition-all bg-white"
                      placeholder="Enquiry about admission"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-nomec-slate mb-2">Message</label>
                    <textarea
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl border border-nomec-green/20 focus:border-nomec-green focus:ring-2 focus:ring-nomec-green/20 outline-none transition-all bg-white resize-none"
                      placeholder="Your message..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-nomec-green text-white rounded-xl font-medium hover:bg-nomec-green-light transition-all"
                  >
                    <Send className="w-4 h-4" />
                    {submitted ? "Message Sent" : "Send Message"}
                  </button>
                </form>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="space-y-6">
                {[
                  { icon: MapPin, title: "Address", lines: ["148 Upper Mission Road", "Benin City, Edo State, Nigeria"] },
                  { icon: Phone, title: "Phone", lines: ["0803 359 3293", "0803 370 7191"] },
                  { icon: Mail, title: "Email", lines: ["registrar@nosakhare.com", "principal@nosakhare.com"] },
                  { icon: Clock, title: "Office Hours", lines: ["Monday - Friday: 7:30 AM - 4:00 PM", "Saturday: 9:00 AM - 12:00 PM"] },
                ].map((item) => (
                  <div key={item.title} className="bg-nomec-cream rounded-2xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-nomec-green/10 rounded-lg flex items-center justify-center shrink-0">
                        <item.icon className="w-5 h-5 text-nomec-green" />
                      </div>
                      <div>
                        <h4 className="font-medium text-nomec-slate">{item.title}</h4>
                        {item.lines.map((line) => (
                          <p key={line} className="text-sm text-nomec-slate/60 mt-1">{line}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex gap-3">
                  <a
                    href="https://www.facebook.com/1565900467033192"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="NOMEC on Facebook"
                    className="w-10 h-10 bg-nomec-green rounded-lg flex items-center justify-center text-white hover:bg-nomec-gold transition-colors"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  )
}
