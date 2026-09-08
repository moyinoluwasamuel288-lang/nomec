"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Lock, User, AlertCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/components/auth-provider"

const roleRedirect: Record<string, string> = {
  student: "/portal/student",
  parent: "/portal/parent",
  teacher: "/portal/teacher",
  admin: "/portal/admin",
}

export default function LoginPage() {
  const router = useRouter()
  const { session, profile, loading } = useAuth()
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!loading && session && profile) {
      router.replace(roleRedirect[profile.role] || "/")
    }
  }, [loading, session, profile, router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSubmitting(true)

    let email = identifier.trim()
    if (!email.includes("@")) {
      // Not an email -- treat it as a login ID (e.g. NOMEC202502) and resolve it first.
      const { data, error: lookupError } = await supabase
        .from("login_ids")
        .select("email")
        .eq("login_id", email.toUpperCase())
        .single()
      if (lookupError || !data) {
        setError("That User ID wasn't found. Check it and try again, or use your email instead.")
        setSubmitting(false)
        return
      }
      email = data.email
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setSubmitting(false)
    if (error) setError(error.message)
    // On success, the useEffect above handles redirecting once the profile loads.
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-nomec-cream px-4 pt-24 pb-16">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8">
        <h1 className="font-serif text-2xl text-nomec-slate mb-1">Portal Sign In</h1>
        <p className="text-sm text-nomec-slate/60 mb-8">
          Students, parents, teachers, and staff all sign in here.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-nomec-slate mb-2">Email or User ID</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-nomec-slate/40" />
              <input
                type="text"
                required
                placeholder="you@email.com or NOMEC202502"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-nomec-slate/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-nomec-green/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-nomec-slate mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-nomec-slate/40" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-nomec-slate/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-nomec-green/30"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 rounded-lg p-3">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-nomec-green text-white rounded-xl font-medium hover:bg-nomec-green-light transition-colors disabled:opacity-60"
          >
            {submitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-xs text-center text-nomec-slate/40 mt-6">
          Accounts are created by the school. Contact the office if you need access.{" "}
          <Link href="/contact" className="text-nomec-green hover:underline">Contact page</Link>
        </p>
      </div>
    </section>
  )
}
