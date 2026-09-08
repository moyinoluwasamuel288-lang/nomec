"use client"

import { useState } from "react"
import { Wallet, UserPlus, School, LogOut } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { PortalGuard } from "@/components/portal-guard"
import { FeesTab } from "@/components/admin/fees-tab"
import { UsersTab } from "@/components/admin/users-tab"
import { ClassesTab } from "@/components/admin/classes-tab"

const tabs = [
  { id: "fees", icon: Wallet, label: "Fees" },
  { id: "users", icon: UserPlus, label: "Add User" },
  { id: "classes", icon: School, label: "Classes & Subjects" },
]

function AdminPortalContent() {
  const { profile, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState("fees")

  return (
    <section className="min-h-screen bg-nomec-cream pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-2xl text-nomec-slate">Bursary & Admin</h1>
            <p className="text-sm text-nomec-slate/60">Signed in as {profile?.full_name}</p>
          </div>
          <button
            onClick={signOut}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-nomec-slate/20 rounded-lg hover:bg-white transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>

        <div className="flex gap-2 mb-8 border-b border-nomec-slate/10">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
                activeTab === t.id
                  ? "border-nomec-green text-nomec-green"
                  : "border-transparent text-nomec-slate/50 hover:text-nomec-slate"
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === "fees" && <FeesTab />}
        {activeTab === "users" && <UsersTab />}
        {activeTab === "classes" && <ClassesTab />}
      </div>
    </section>
  )
}

export default function AdminPortalPage() {
  return (
    <PortalGuard allow={["admin"]}>
      <AdminPortalContent />
    </PortalGuard>
  )
}
