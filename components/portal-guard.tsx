"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import type { Role } from "@/lib/supabase"

export function PortalGuard({
  allow,
  children,
}: {
  allow: Role[]
  children: React.ReactNode
}) {
  const { session, profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (!session) {
      router.replace("/portal/login")
    }
  }, [loading, session, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-nomec-cream pt-24">
        <p className="text-nomec-slate/50 text-sm">Loading...</p>
      </div>
    )
  }

  if (!session) return null // redirect is in flight

  if (!profile || !allow.includes(profile.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-nomec-cream pt-24 px-4">
        <div className="text-center max-w-sm">
          <p className="font-serif text-xl text-nomec-slate mb-2">Access restricted</p>
          <p className="text-sm text-nomec-slate/60">
            Your account doesn't have permission to view this page.
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
