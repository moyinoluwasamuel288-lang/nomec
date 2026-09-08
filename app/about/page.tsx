"use client"

import { motion } from "framer-motion"
import { Target, Eye, Heart, Shield, Lightbulb, Globe } from "lucide-react"
import { SectionHeader } from "@/components/section-header"
import { ScrollReveal } from "@/components/scroll-reveal"

const values = [
  {
    icon: Shield,
    title: "Diligence",
    description: "Consistent, hard-working effort in academics, conduct, and daily school life.",
  },
  {
    icon: Lightbulb,
    title: "Knowledge",
    description: "Rigorous academic foundation building literacy, numeracy, and critical thinking.",
  },
  {
    icon: Heart,
    title: "Faith in God",
    description: "Moral and spiritual grounding woven into the school's daily life and character formation.",
  },
  {
    icon: Globe,
    title: "Service",
    description: "Educating \"the total man\", preparing pupils to contribute meaningfully to society.",
  },
]

const timeline = [
  {
    year: "1996",
    title: "Foundation",
    description: "First mixed intake into Nursery, Primary, and Secondary by Deacon (Ambassador) Daniel Nosakhare Eghobamien on Upper Mission Road, Benin City.",
  },
  {
    year: "2002–2003",
    title: "Secondary Decentralised",
    description: "Central administration of the secondary school split into separately managed Junior and Senior Secondary sections.",
  },
  {
    year: "2003",
    title: "Montessori Section Established",
    description: "Montessori section founded on 13 January 2003 by Executive Director Mrs. M. O. Omobude.",
  },
  {
    year: "2005",
    title: "Elementary Section Split",
    description: "On 12 September 2005, the elementary section was separated into KG (Nursery) and Primary, with Montessori still attached to Primary.",
  },
  {
    year: "2007",
    title: "Montessori Independent",
    description: "On 10 September 2007, the Montessori section became fully independent with its own academic management.",
  },
]

export default function AboutPage() {
  return (
    <>
      {/* Page Header */}
      <section className="pt-32 pb-16 bg-nomec-green relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px w-8 bg-nomec-gold" />
              <span className="text-xs uppercase tracking-[0.25em] text-nomec-gold font-medium">About Us</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-4">
              Our Story and Mission
            </h1>
            <p className="text-white/70 max-w-2xl text-lg">
              Discover the foundation, vision, and values that have made NOMEC a distinguished 
              institution of learning in Nigeria.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission and Vision */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <ScrollReveal>
              <div className="bg-nomec-cream rounded-2xl p-8 md:p-10 h-full">
                <div className="w-14 h-14 bg-nomec-green/10 rounded-xl flex items-center justify-center mb-6">
                  <Target className="w-7 h-7 text-nomec-green" />
                </div>
                <h3 className="text-2xl font-serif text-nomec-slate mb-4">Our Mission</h3>
                <p className="text-nomec-slate/70 leading-relaxed">
                  To provide a model educational environment that nurtures disciplined, knowledgeable, 
                  and service-oriented individuals capable of contributing meaningfully to national 
                  development and global citizenship through a blend of traditional values and modern 
                  pedagogical approaches.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="bg-nomec-cream rounded-2xl p-8 md:p-10 h-full">
                <div className="w-14 h-14 bg-nomec-gold/10 rounded-xl flex items-center justify-center mb-6">
                  <Eye className="w-7 h-7 text-nomec-gold" />
                </div>
                <h3 className="text-2xl font-serif text-nomec-slate mb-4">Our Vision</h3>
                <p className="text-nomec-slate/70 leading-relaxed">
                  To be the foremost model educational institution in Nigeria, recognised nationally 
                  and internationally for producing graduates who exemplify discipline, possess deep 
                  knowledge, and demonstrate unwavering commitment to service in every sphere of life.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Campus Image */}
      <section className="py-12 bg-nomec-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <img 
                src="/images/school-gate.png" 
                alt="NOMEC School Gate and Main Building"
                className="w-full h-80 md:h-[28rem] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-nomec-slate/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6">
                <p className="text-white font-serif text-2xl">Our Institution</p>
                <p className="text-white/70 text-sm mt-1">A model of architectural excellence and learning environment</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-nomec-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="The Pillars of Our Institution"
            subtitle="Core Values"
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <ScrollReveal key={value.title} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -6 }}
                  className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all border border-nomec-green/5"
                >
                  <div className="w-12 h-12 bg-nomec-green/10 rounded-xl flex items-center justify-center mb-5">
                    <value.icon className="w-6 h-6 text-nomec-green" />
                  </div>
                  <h4 className="font-serif text-lg text-nomec-slate mb-2">{value.title}</h4>
                  <p className="text-sm text-nomec-slate/60 leading-relaxed">{value.description}</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Our Journey Through the Years"
            subtitle="History"
          />

          <div className="relative">
            <div className="absolute left-4 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-nomec-green/20" />

            {timeline.map((event, i) => (
              <ScrollReveal key={event.year} delay={i * 0.1}>
                <div className={`relative flex items-start gap-8 mb-12 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className="hidden md:block w-1/2" />

                  <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-nomec-gold rounded-full border-4 border-white shadow-md -translate-x-1/2 mt-1.5" />

                  <div className="ml-12 md:ml-0 md:w-1/2">
                    <div className={`bg-nomec-cream rounded-xl p-6 ${i % 2 === 0 ? 'md:mr-8' : 'md:ml-8'}`}>
                      <span className="text-nomec-gold font-serif font-bold text-xl">{event.year}</span>
                      <h4 className="font-serif text-lg text-nomec-slate mt-1 mb-2">{event.title}</h4>
                      <p className="text-sm text-nomec-slate/60">{event.description}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-24 bg-nomec-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Leadership"
            subtitle="Leadership"
          />

          <div className="grid sm:grid-cols-2 gap-8 max-w-3xl">
            {[
              { name: "Deacon (Ambassador) Daniel Nosakhare Eghobamien", role: "Founder (1996–2026)", desc: "Established the school on Upper Mission Road, Benin City, with its first intake in September 1996. Passed away in 2026.", photo: "/images/founder-eghobamien.jpg" },
              { name: "Mrs. M. O. Omobude", role: "Executive Director", desc: "Established the Montessori section on 13 January 2003 and has overseen its growth since.", photo: null },
            ].map((officer, i) => (
              <ScrollReveal key={officer.name} delay={i * 0.1}>
                <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  {officer.photo ? (
                    <div className="w-16 h-16 rounded-full overflow-hidden mb-4">
                      <img
                        src={officer.photo}
                        alt={officer.name}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-nomec-green/10 rounded-full flex items-center justify-center mb-4">
                      <span className="text-nomec-green font-serif font-bold text-xl">
                        {officer.name.split(" ").filter(w => /^[A-Z]/.test(w)).map(n => n[0]).slice(0,2).join("")}
                      </span>
                    </div>
                  )}
                  <h4 className="font-serif text-lg text-nomec-slate">{officer.name}</h4>
                  <p className="text-sm text-nomec-gold font-medium mt-1">{officer.role}</p>
                  <p className="text-sm text-nomec-slate/60 mt-3">{officer.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
          <p className="text-xs text-nomec-slate/40 mt-8 max-w-2xl">
            Current Principal and departmental heads to be added when confirmed by the school.
          </p>
        </div>
      </section>
    </>
  )
}
