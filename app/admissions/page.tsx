"use client"

import { motion } from "framer-motion"
import { CheckCircle, FileText, Calendar, Phone, ArrowRight, AlertCircle } from "lucide-react"
import { SectionHeader } from "@/components/section-header"
import { ScrollReveal } from "@/components/scroll-reveal"
import Link from "next/link"

const steps = [
  { step: "01", title: "Obtain Application Form", desc: "Visit our administrative office or download the application form from our website. Forms are also available at designated sales points in Benin City." },
  { step: "02", title: "Complete and Submit", desc: "Fill out the form accurately with all required information. Attach passport photographs, birth certificate, and previous academic records." },
  { step: "03", title: "Entrance Examination", desc: "All applicants must sit for our entrance examination which assesses proficiency in Mathematics, English Language, and General Knowledge." },
  { step: "04", title: "Oral Interview", desc: "Shortlisted candidates and their parents or guardians will be invited for an interview with the admissions committee." },
  { step: "05", title: "Admission Offer", desc: "Successful candidates will receive an admission letter with instructions on fee payment and resumption details." },
]

const requirements = [
  "Completed application form",
  "Two recent passport photographs",
  "Birth certificate or sworn affidavit of age",
  "Transfer certificate from previous school (if applicable)",
  "Last academic report or transcript",
  "Immunisation record",
  "Letter of recommendation from previous school",
]

export default function AdmissionsPage() {
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
              <span className="text-xs uppercase tracking-[0.25em] text-nomec-gold font-medium">Admissions</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-4">Join NOMEC</h1>
            <p className="text-white/70 max-w-2xl text-lg">
              We welcome applications from families who share our commitment to excellence, discipline, and service.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Application Process" subtitle="How to Apply" />
          <div className="space-y-8">
            {steps.map((item, i) => (
              <ScrollReveal key={item.step} delay={i * 0.1}>
                <div className="flex gap-6 items-start">
                  <div className="w-16 h-16 bg-nomec-green rounded-2xl flex items-center justify-center shrink-0">
                    <span className="text-white font-serif font-bold text-xl">{item.step}</span>
                  </div>
                  <div className="pt-2">
                    <h3 className="text-xl font-serif text-nomec-slate mb-2">{item.title}</h3>
                    <p className="text-nomec-slate/60 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-nomec-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <ScrollReveal>
              <h3 className="text-2xl font-serif text-nomec-slate mb-6">Required Documents</h3>
              <ul className="space-y-4">
                {requirements.map((req) => (
                  <li key={req} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-nomec-green shrink-0 mt-0.5" />
                    <span className="text-nomec-slate/70">{req}</span>
                  </li>
                ))}
              </ul>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <h3 className="text-2xl font-serif text-nomec-slate mb-6">Important Dates</h3>
              <div className="space-y-4">
                {[
                  { date: "January 15 - March 30", event: "Application Window" },
                  { date: "April 15", event: "Entrance Examination" },
                  { date: "April 22 - May 10", event: "Oral Interviews" },
                  { date: "May 20", event: "Admission Letters Issued" },
                  { date: "September 10", event: "Resumption Date" },
                ].map((date) => (
                  <div key={date.event} className="flex items-center gap-4 p-4 bg-white rounded-xl">
                    <Calendar className="w-5 h-5 text-nomec-gold shrink-0" />
                    <div>
                      <p className="font-medium text-nomec-slate">{date.event}</p>
                      <p className="text-sm text-nomec-slate/60">{date.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <div className="bg-nomec-green rounded-3xl p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-nomec-gold/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <h2 className="text-3xl font-serif text-white mb-4 relative z-10">Ready to Apply?</h2>
              <p className="text-white/70 mb-8 relative z-10">
                Take the first step toward securing a world-class education for your child.
              </p>
              <div className="flex flex-wrap justify-center gap-4 relative z-10">
                <button className="inline-flex items-center gap-2 px-8 py-4 bg-white text-nomec-green rounded-xl font-medium hover:bg-nomec-gold hover:text-white transition-all">
                  <FileText className="w-4 h-4" />
                  Download Form
                </button>
                <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/30 text-white rounded-xl font-medium hover:bg-white/10 transition-all">
                  <Phone className="w-4 h-4" />
                  Contact Admissions
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
