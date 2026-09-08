"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Lock, AlertCircle, CheckCircle2 } from "lucide-react"
import { supabase } from "@/lib/supabase"

const roleRedirect: Record<string, string> = {
  student: "/portal/student",
  parent: "/portal/parent",
  teacher: "/portal/teacher",
  admin: "/portal/admin",
}

export default function SetPasswordPage() {
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    // supabase-js automatically picks up the invite/recovery token from the URL hash
    // on load. We just wait for a session to appear before showing the form.
    supabase.auth.getSession().then(({ data: { session } }) => {
      setReady(!!session)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setReady(!!session)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }
    if (password !== confirm) {
      setError("Passwords don't match.")
      return
    }
    setSaving(true)
    const { error } = await supabase.auth.updateUser({ password })
    setSaving(false)
    if (error) {
      setError(error.message)
      return
    }
    setSuccess(true)

    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()
      setTimeout(() => {
        router.replace(profile ? roleRedirect[profile.role] || "/" : "/portal/login")
      }, 1500)
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-nomec-cream px-4 pt-24 pb-16">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8">
        <h1 className="font-serif text-2xl text-nomec-slate mb-1">Set Your Password</h1>
        <p className="text-sm text-nomec-slate/60 mb-8">
          Choose a password to finish setting up your account.
        </p>

        {!ready && !success && (
          <p className="text-sm text-nomec-slate/50">
            Verifying your invite link... If nothing happens after a few seconds, the link may have expired — ask the school office to send a new invite.
          </p>
        )}

        {ready && !success && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-nomec-slate mb-2">New Password</label>
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
            <div>
              <label className="block text-sm font-medium text-nomec-slate mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-nomec-slate/40" />
                <input
                  type="password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
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
              disabled={saving}
              className="w-full py-3 bg-nomec-green text-white rounded-xl font-medium hover:bg-nomec-green-light transition-colors disabled:opacity-60"
            >
              {saving ? "Saving..." : "Set Password & Continue"}
            </button>
          </form>
        )}

        {success && (
          <div className="flex items-start gap-2 text-sm text-nomec-green bg-nomec-green/10 rounded-lg p-4">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>Password set! Taking you to your portal...</span>
          </div>
        )}
      </div>
    </section>
  )
}
