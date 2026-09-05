"use client"

import { motion } from "framer-motion"
import { Home, Users, Trophy, Music, Palette, TreePine, Utensils, Shield, Wifi, HeartPulse } from "lucide-react"
import { SectionHeader } from "@/components/section-header"
import { ScrollReveal } from "@/components/scroll-reveal"

const houses = [
  { name: "Green House", color: "bg-green-600", motto: "Strength in Unity" },
  { name: "Yellow House", color: "bg-yellow-500", motto: "Excellence Always" },
  { name: "Blue House", color: "bg-blue-600", motto: "Wisdom and Courage" },
  { name: "Red House", color: "bg-red-600", motto: "Passion and Determination" },
]

const facilities = [
  { icon: Home, title: "Boarding", desc: "Separate modern hostels for boys and girls with comfortable dormitories, study halls, and recreational areas.", image: "/images/girls-hostel.png" },
  { icon: Utensils, title: "Dining", desc: "Nutritious meals prepared by professional caterers, accommodating dietary requirements and preferences." },
  { icon: HeartPulse, title: "Health Centre", desc: "On-site clinic staffed by qualified nurses with access to medical consultants for emergencies." },
  { icon: Shield, title: "Security", desc: "24-hour security personnel, CCTV surveillance, and controlled access points across the campus." },
  { icon: Wifi, title: "ICT Centre", desc: "High-speed internet connectivity, computer laboratories, and digital learning resources." },
  { icon: TreePine, title: "Green Spaces", desc: "Landscaped gardens, outdoor reading areas, and environmentally conscious campus design." },
]

export default function CampusLifePage() {
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
              <span className="text-xs uppercase tracking-[0.25em] text-nomec-gold font-medium">Campus</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-4">Campus Life</h1>
            <p className="text-white/70 max-w-2xl text-lg">
              A vibrant community where learning extends beyond the classroom through sports, arts, and character-building activities.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Sports Day Image Banner */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <img 
                src="/images/sports-day.png" 
                alt="NOMEC Inter-House Sports Competition"
                className="w-full h-80 md:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-nomec-slate/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6">
                <p className="text-white font-serif text-2xl">Inter-House Sports</p>
                <p className="text-white/70 text-sm mt-1">Annual athletic competition fostering teamwork and excellence</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Houses and Competitions" subtitle="Tradition" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {houses.map((house, i) => (
              <ScrollReveal key={house.name} delay={i * 0.1}>
                <motion.div whileHover={{ y: -6 }} className="bg-nomec-cream rounded-2xl p-6 text-center">
                  <div className={`w-16 h-16 ${house.color} rounded-full mx-auto mb-4 flex items-center justify-center`}>
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-serif text-lg text-nomec-slate mb-1">{house.name}</h4>
                  <p className="text-sm text-nomec-slate/60 italic">"{house.motto}"</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities with Images */}
      <section className="py-24 bg-nomec-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Student Facilities" subtitle="Amenities" />

          {/* Featured Hostels */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <ScrollReveal>
              <div className="relative rounded-2xl overflow-hidden shadow-lg group">
                <img 
                  src="/images/girls-hostel.png" 
                  alt="Girls Hostel"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-nomec-slate/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <p className="text-white font-serif text-xl">Girls Hostel</p>
                  <p className="text-white/70 text-sm">Modern residential facility with 24-hour supervision</p>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.15}>
              <div className="relative rounded-2xl overflow-hidden shadow-lg group">
                <img 
                  src="/images/boys-hostel.png" 
                  alt="Boys Hostel"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-nomec-slate/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <p className="text-white font-serif text-xl">Boys Hostel</p>
                  <p className="text-white/70 text-sm">Spacious accommodation with study and recreational areas</p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {facilities.filter(f => !f.image).map((facility, i) => (
              <ScrollReveal key={facility.title} delay={i * 0.1}>
                <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <facility.icon className="w-8 h-8 text-nomec-green mb-4" />
                  <h4 className="font-serif text-lg text-nomec-slate mb-2">{facility.title}</h4>
                  <p className="text-sm text-nomec-slate/60">{facility.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Football Field */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <img 
                src="/images/football-field.png" 
                alt="NOMEC Football Field"
                className="w-full h-80 md:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-nomec-slate/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6">
                <p className="text-white font-serif text-2xl">Sports Complex</p>
                <p className="text-white/70 text-sm mt-1">Standard football pitch and athletics facilities</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Extracurricular Activities" subtitle="Beyond Academics" />
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Trophy, title: "Sports", items: ["Football", "Athletics", "Basketball", "Volleyball", "Table Tennis", "Swimming"] },
              { icon: Music, title: "Performing Arts", items: ["Choir", "Drama Club", "Traditional Dance", "Modern Dance", "Debating Society"] },
              { icon: Palette, title: "Clubs and Societies", items: ["JETS Club", "Press Club", "Red Cross", "Literary Society", "Entrepreneurship Club"] },
            ].map((activity, i) => (
              <ScrollReveal key={activity.title} delay={i * 0.15}>
                <div className="bg-nomec-cream rounded-2xl p-8">
                  <activity.icon className="w-10 h-10 text-nomec-gold mb-4" />
                  <h3 className="text-xl font-serif text-nomec-slate mb-4">{activity.title}</h3>
                  <ul className="space-y-2">
                    {activity.items.map((item) => (
                      <li key={item} className="text-sm text-nomec-slate/70 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-nomec-green rounded-full" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
