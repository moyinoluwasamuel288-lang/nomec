"use client"

import Link from "next/link"
import { MapPin, Phone, Mail, Clock, Facebook } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-nomec-slate text-white/80">
      {/* Top accent line */}
      <div className="h-1 bg-gradient-to-r from-nomec-green via-nomec-gold to-nomec-green" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/images/nomec-logo.png"
                alt="Nosakhare Model Education Centre crest"
                className="w-11 h-11 object-contain"
              />
              <div>
                <p className="font-brand font-extrabold text-white tracking-tight">NOMEC</p>
                <p className="text-[10px] tracking-[0.15em] uppercase text-nomec-gold">
                  Nosakhare Model Education Centre
                </p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-white/60">
              Motto: Diligence, Knowledge, Faith in God. Benin City, Edo State, Nigeria.
            </p>
            <div className="flex gap-3 pt-2">
              <a
                href="https://www.facebook.com/1565900467033192"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="NOMEC on Facebook"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-nomec-green transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-white mb-6 text-lg">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: "About Our Institution", href: "/about" },
                { label: "Academic Programmes", href: "/academics" },
                { label: "Admission Process", href: "/admissions" },
                { label: "Campus Facilities", href: "/campus-life" },
                { label: "Contact Administration", href: "/contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-nomec-gold transition-colors animated-underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Portals */}
          <div>
            <h4 className="font-serif text-white mb-6 text-lg">Online Portals</h4>
            <ul className="space-y-3">
              {[
                { label: "Student Portal", href: "/portal/student" },
                { label: "Parent Portal", href: "/portal/parent" },
                { label: "Teacher Portal", href: "/portal/teacher" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-nomec-gold transition-colors animated-underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-white mb-6 text-lg">Contact Information</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-nomec-gold shrink-0 mt-0.5" />
                <span className="text-sm text-white/60">
                  148 Upper Mission Road, Benin City, Edo State, Nigeria
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-nomec-gold shrink-0" />
                <span className="text-sm text-white/60">0803 359 3293 / 0803 370 7191</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-nomec-gold shrink-0" />
                <span className="text-sm text-white/60">registrar@nosakhare.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-nomec-gold shrink-0" />
                <span className="text-sm text-white/60">Mon - Fri: 7:30 AM - 4:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} Nosakhare Model Education Centre. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-xs text-white/40 hover:text-white/70 transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-xs text-white/40 hover:text-white/70 transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="text-xs text-white/40 hover:text-white/70 transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
