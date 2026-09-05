"use client"

import { motion } from "framer-motion"
import { BookOpen, FlaskConical, Calculator, Languages, Globe, Code } from "lucide-react"
import { SectionHeader } from "@/components/section-header"
import { ScrollReveal } from "@/components/scroll-reveal"

const departments = [
  { icon: FlaskConical, name: "Sciences", subjects: ["Physics", "Chemistry", "Biology", "Agricultural Science", "Further Mathematics"] },
  { icon: Languages, name: "Arts and Humanities", subjects: ["Literature in English", "Government", "History", "Christian Religious Knowledge", "French"] },
  { icon: Calculator, name: "Commercial", subjects: ["Accounting", "Commerce", "Economics", "Business Studies", "Insurance"] },
  { icon: Code, name: "Technology", subjects: ["Computer Science", "Data Processing", "Technical Drawing", "Food and Nutrition"] },
]

const montessoriSubjects = [
  { icon: BookOpen, title: "Language", desc: "Phonics, vocabulary building, reading comprehension, and creative writing using Montessori materials." },
  { icon: Calculator, title: "Mathematics", desc: "Concrete to abstract progression using golden beads, number rods, and spindle boxes." },
  { icon: FlaskConical, title: "Practical Life", desc: "Daily living skills, coordination, concentration, and independence through purposeful activities." },
  { icon: Globe, title: "Sensorial Culture", desc: "Exploration of the five senses, cultural geography, botany, zoology, and history." },
]

export default function AcademicsPage() {
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
              <span className="text-xs uppercase tracking-[0.25em] text-nomec-gold font-medium">Academics</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-4">Academic Programmes</h1>
            <p className="text-white/70 max-w-2xl text-lg">
              A comprehensive curriculum designed to challenge, inspire, and prepare students for tertiary education and beyond.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Montessori Academy" subtitle="Early Childhood" />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {montessoriSubjects.map((subject, i) => (
              <ScrollReveal key={subject.title} delay={i * 0.1}>
                <motion.div whileHover={{ y: -6 }} className="bg-nomec-cream rounded-2xl p-6 hover:shadow-lg transition-all">
                  <subject.icon className="w-8 h-8 text-nomec-green mb-4" />
                  <h4 className="font-serif text-lg text-nomec-slate mb-2">{subject.title}</h4>
                  <p className="text-sm text-nomec-slate/60">{subject.desc}</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-nomec-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Secondary School Departments" subtitle="Curriculum" />
          <div className="grid md:grid-cols-2 gap-8">
            {departments.map((dept, i) => (
              <ScrollReveal key={dept.name} delay={i * 0.1}>
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-nomec-green/10 rounded-xl flex items-center justify-center">
                      <dept.icon className="w-6 h-6 text-nomec-green" />
                    </div>
                    <h3 className="text-xl font-serif text-nomec-slate">{dept.name}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {dept.subjects.map((subject) => (
                      <span key={subject} className="px-3 py-1 bg-nomec-cream rounded-full text-sm text-nomec-slate/70">
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Examination Performance" subtitle="Results" />
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { exam: "WAEC", rate: "96%", detail: "Credit passes in five subjects including Mathematics and English" },
              { exam: "NECO", rate: "94%", detail: "Credit passes in five subjects including Mathematics and English" },
              { exam: "JAMB", rate: "92%", detail: "Students scoring 200 and above in Unified Tertiary Matriculation Examination" },
            ].map((stat) => (
              <ScrollReveal key={stat.exam}>
                <div className="text-center p-8 bg-nomec-cream rounded-2xl">
                  <p className="text-5xl font-serif font-bold text-nomec-green">{stat.rate}</p>
                  <p className="text-lg font-medium text-nomec-slate mt-2">{stat.exam} Pass Rate</p>
                  <p className="text-sm text-nomec-slate/60 mt-2">{stat.detail}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
