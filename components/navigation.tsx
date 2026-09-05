"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ChevronDown } from "lucide-react"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/academics", label: "Academics" },
  { href: "/admissions", label: "Admissions" },
  { href: "/campus-life", label: "Campus Life" },
  { href: "/contact", label: "Contact" },
]

const portalLinks = [
  { href: "/portal/student", label: "Student Portal" },
  { href: "/portal/parent", label: "Parent Portal" },
  { href: "/portal/teacher", label: "Teacher Portal" },
]

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isPortalOpen, setIsPortalOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-xl shadow-lg border-b border-nomec-green/10"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <img
                src="/images/nomec-logo.png"
                alt="Nosakhare Model Education Centre crest"
                className="w-12 h-12 object-contain group-hover:scale-105 transition-transform"
              />
              <div className="hidden sm:block">
                <p className={`font-brand font-extrabold text-lg leading-tight tracking-tight transition-colors ${isScrolled ? "text-nomec-slate" : "text-nomec-slate"}`}>
                  NOMEC
                </p>
                <p className={`text-[10px] tracking-[0.2em] uppercase transition-colors ${isScrolled ? "text-nomec-green" : "text-nomec-green"}`}>
                  Nosakhare Model Education Centre
                </p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors animated-underline ${
                    pathname === link.href
                      ? "text-nomec-green"
                      : "text-nomec-slate/80 hover:text-nomec-green"
                  }`}
                >
                  {link.label}
                  {pathname === link.href && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute bottom-0 left-4 right-4 h-0.5 bg-nomec-gold"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              ))}

              {/* Portal Dropdown */}
              <div className="relative ml-2">
                <button
                  onClick={() => setIsPortalOpen(!isPortalOpen)}
                  className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-nomec-slate/80 hover:text-nomec-green transition-colors"
                >
                  Portals
                  <ChevronDown className={`w-4 h-4 transition-transform ${isPortalOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {isPortalOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-nomec-green/10 overflow-hidden"
                    >
                      {portalLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="block px-4 py-3 text-sm text-nomec-slate hover:bg-nomec-green/5 hover:text-nomec-green transition-colors"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="lg:hidden p-2 text-nomec-slate hover:text-nomec-green transition-colors"
            >
              {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-white pt-24 px-6 lg:hidden"
          >
            <nav className="flex flex-col gap-2">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={link.href}
                    className={`block py-3 text-lg font-medium border-b border-nomec-green/10 ${
                      pathname === link.href ? "text-nomec-green" : "text-nomec-slate"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <div className="mt-4 pt-4 border-t border-nomec-green/10">
                <p className="text-xs uppercase tracking-widest text-nomec-slate/50 mb-3">Portals</p>
                {portalLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      className="block py-2 text-nomec-slate/80 hover:text-nomec-green transition-colors"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
