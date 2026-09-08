"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowRight, BookOpen, Users, Trophy, Building2,
  GraduationCap, FlaskConical, Palette, Music, Dumbbell,
  ChevronRight, Star, Quote, MapPin, Medal
} from "lucide-react"
import { SectionHeader } from "@/components/section-header"
import { AnimatedCounter } from "@/components/animated-counter"
import { ScrollReveal } from "@/components/scroll-reveal"

const quickLinks = [
  { href: "/about", label: "About" },
  { href: "/academics", label: "Academics" },
  { href: "/admissions", label: "Admissions" },
  { href: "/campus-life", label: "Campus Life" },
  { href: "/portal/login", label: "Portal Login" },
  { href: "/contact", label: "Contact" },
]

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section
        id="main-content"
        aria-label="Introduction"
        className="relative min-h-screen flex items-end overflow-hidden"
      >
        {/* Entrance photo overlay */}
        <div className="absolute inset-0">
          <img
            src="/images/school-gate.png"
            alt="Nosakhare Model Education Centre main entrance gate, Benin City"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-nomec-slate via-nomec-slate/70 to-nomec-slate/30" />
          <div className="absolute inset-0 bg-nomec-green/10" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-14">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full mb-5 border border-white/20">
              <MapPin className="w-3.5 h-3.5 text-nomec-gold" />
              <span className="text-xs font-medium text-white/90 tracking-wide">Benin City, Edo State, Nigeria</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-brand font-extrabold uppercase tracking-tight text-white leading-[1.1] mb-4">
              Nosakhare Model{" "}
              <span className="text-nomec-gold">Education Centre</span>
            </h1>

            <p className="text-base md:text-lg text-white/80 leading-relaxed mb-8 max-w-xl">
              Diligence, knowledge, and faith in God. Nursery through Senior Secondary in Benin City.
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <Link
                href="/admissions"
                className="group inline-flex items-center gap-2 px-7 py-3.5 bg-nomec-gold text-nomec-slate rounded-xl font-medium hover:bg-white transition-all"
              >
                Apply Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/portal/login"
                className="inline-flex items-center gap-2 px-7 py-3.5 border-2 border-white/40 text-white rounded-xl font-medium hover:border-white hover:bg-white/10 transition-all"
              >
                Portal Login
              </Link>
            </div>

            {/* Quick access to key sections */}
            <nav aria-label="Quick links to key sections" className="flex flex-wrap gap-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-sm text-white/85 bg-white/5 hover:bg-white/15 border border-white/10 rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-nomec-green relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '30px 30px'
          }} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <AnimatedCounter end={30} suffix="+" label="Years of Service" />
            <AnimatedCounter end={150} suffix="+" label="Qualified Teachers" />
            <AnimatedCounter end={2000} suffix="+" label="Enrolled Students" />
            <AnimatedCounter end={50} suffix="+" label="Awards Won" />
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="A Legacy of Academic Distinction"
            subtitle="About Us"
          />

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal>
              <div className="relative">
                <div className="aspect-[4/3] rounded-2xl bg-nomec-cream overflow-hidden">
                  <img 
                    src="/images/classroom.png" 
                    alt="NOMEC Classroom"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 w-48 h-48 border-2 border-nomec-gold/30 rounded-2xl -z-10" />
                <div className="absolute -top-6 -left-6 w-32 h-32 bg-nomec-green/5 rounded-2xl -z-10" />
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="space-y-6">
                <h3 className="text-2xl md:text-3xl font-serif text-nomec-slate">
                  Diligence, Knowledge, Faith in God
                </h3>
                <p className="text-nomec-slate/70 leading-relaxed">
                  Founded in 1996 by Deacon (Ambassador) Daniel Nosakhare Eghobamien, NOMEC has grown from a single
                  mixed intake into a full Montessori-to-Senior-Secondary institution in Benin City, guided by the
                  belief that every child has potential worth developing.
                </p>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  {[
                    "Montessori Curriculum",
                    "Individualised Learning",
                    "Modern Facilities",
                    "Character Development",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-nomec-gold rounded-full" />
                      <span className="text-sm text-nomec-slate/80">{item}</span>
                    </div>
                  ))}
                </div>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-nomec-green font-medium hover:text-nomec-gold transition-colors mt-4"
                >
                  Read Our Full Story
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Academic Programmes */}
      <section className="py-24 bg-nomec-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Comprehensive Academic Programmes"
            subtitle="Academics"
          />

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                title: "Montessori Academy",
                description: "Our early childhood programme employs the Montessori method, offering language, mathematics, practical life, sensorial culture, and ministry-prescribed subjects for holistic development.",
                color: "bg-nomec-green/10 text-nomec-green",
              },
              {
                icon: Users,
                title: "Junior Secondary",
                description: "A robust three-year programme aligned with the Nigerian Basic Education Curriculum, preparing students for the Junior Secondary School Certificate Examination with excellence.",
                color: "bg-nomec-gold/10 text-nomec-gold",
              },
              {
                icon: GraduationCap,
                title: "Senior Secondary",
                description: "Our senior programme offers Science, Arts, and Commercial streams, meticulously preparing students for WAEC, NECO, and JAMB examinations with outstanding results.",
                color: "bg-nomec-coral/10 text-nomec-coral",
              },
            ].map((programme, i) => (
              <ScrollReveal key={programme.title} delay={i * 0.15}>
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-shadow border border-nomec-green/5"
                >
                  <div className={`w-14 h-14 rounded-xl ${programme.color} flex items-center justify-center mb-6`}>
                    <programme.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-serif font-semibold text-nomec-slate mb-3">
                    {programme.title}
                  </h3>
                  <p className="text-nomec-slate/60 leading-relaxed text-sm">
                    {programme.description}
                  </p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="World-Class Facilities"
            subtitle="Campus"
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: FlaskConical, title: "Science Laboratories", desc: "Fully equipped physics, chemistry, and biology labs for practical experimentation." },
              { icon: Dumbbell, title: "Sports Complex", desc: "Standard football pitch, athletics track, and indoor sports facilities." },
              { icon: Building2, title: "Boarding Facilities", desc: "Separate modern hostels for boys and girls with 24-hour supervision." },
              { icon: Palette, title: "Arts and Culture", desc: "Dedicated studios for visual arts, music, and cultural activities." },
            ].map((facility, i) => (
              <ScrollReveal key={facility.title} delay={i * 0.1}>
                <div className="group p-6 rounded-2xl bg-nomec-cream hover:bg-nomec-green transition-colors duration-500 cursor-pointer">
                  <facility.icon className="w-8 h-8 text-nomec-green group-hover:text-nomec-gold transition-colors mb-4" />
                  <h4 className="font-serif text-lg text-nomec-slate group-hover:text-white transition-colors mb-2">
                    {facility.title}
                  </h4>
                  <p className="text-sm text-nomec-slate/60 group-hover:text-white/70 transition-colors">
                    {facility.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Notable Achievements"
            subtitle="Recognition"
          />

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                year: "2019",
                title: "Reading Championship Contest",
                desc: "Dorcas Okolie placed 1st runner-up in Group A among 770 finalists from 81 schools across Edo State, organised by Readers Resort Initiative of Africa. Won a medal and Award of Excellence plaque.",
              },
              {
                year: "2018/2019",
                title: "Nigeria Mathematics and Science Olympiads",
                desc: "Aideyan Freda placed 2nd in Physics in Edo State among over 1,000 candidates, awarded a medal by the Ministry of Education and the National Mathematical Centre. Azugo Victoria, Obanisagbon Beverlyn, and Edomwonyi Ijesuorode Winifred also qualified and were certified at state level.",
              },
              {
                year: "2018",
                title: "National Mathematics Competition",
                desc: "NOMEC placed first in an inter-school Mathematics competition held nationally.",
              },
              {
                year: "2019",
                title: "Spelling Bee Competition",
                desc: "NOMEC students won the Spelling Bee Competition.",
              },
            ].map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 0.1}>
                <div className="flex gap-4 p-6 rounded-2xl bg-nomec-cream hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-nomec-gold/15 flex items-center justify-center shrink-0">
                    <Medal className="w-6 h-6 text-nomec-gold" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-nomec-green mb-1">{item.year}</p>
                    <h4 className="font-serif text-lg text-nomec-slate mb-2">{item.title}</h4>
                    <p className="text-sm text-nomec-slate/60 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-nomec-slate relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionHeader
            title="Voices from Our Community"
            subtitle="Testimonials"
            light
          />

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "NOMEC provided my children with not just academic knowledge but the discipline and character that has shaped them into responsible young adults. The Montessori approach was transformative.",
                name: "Mrs. Eghosa Osemwengie",
                role: "Parent of Two Alumni",
              },
              {
                quote: "The individualised attention and practical learning methods at NOMEC allowed me to develop at my own pace. I received double promotion and went on to excel in my university studies.",
                name: "Engr. Osayuki Igbinoba",
                role: "Alumnus, Class of 2015",
              },
              {
                quote: "Teaching at NOMEC is a privilege. The administration provides every resource needed, and the students are eager to learn. It is an environment where excellence is the standard.",
                name: "Mr. Paul Eghosa",
                role: "Senior Secondary Teacher",
              },
            ].map((testimonial, i) => (
              <ScrollReveal key={testimonial.name} delay={i * 0.15}>
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-nomec-gold/30 transition-colors">
                  <Quote className="w-8 h-8 text-nomec-gold/40 mb-4" />
                  <p className="text-white/80 leading-relaxed text-sm mb-6 italic">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-nomec-green/30 flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {testimonial.name.split(" ").map(n => n[0]).join("")}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">{testimonial.name}</p>
                      <p className="text-white/50 text-xs">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-nomec-cream">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="relative bg-nomec-green rounded-3xl p-12 md:p-16 overflow-hidden text-center">
              <div className="absolute top-0 right-0 w-64 h-64 bg-nomec-gold/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
                  Begin Your Child&apos;s Journey to Excellence
                </h2>
                <p className="text-white/70 max-w-2xl mx-auto mb-8">
                  Admission into Nosakhare Model Education Centre is the first step toward a future defined 
                  by discipline, knowledge, and service. Our doors are open to young minds ready to embrace greatness.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link
                    href="/admissions"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-white text-nomec-green rounded-xl font-medium hover:bg-nomec-gold hover:text-white transition-all"
                  >
                    Apply for Admission
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/30 text-white rounded-xl font-medium hover:bg-white/10 transition-all"
                  >
                    Schedule a Visit
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
