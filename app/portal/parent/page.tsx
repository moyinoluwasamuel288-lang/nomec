"use client"

import { useEffect, useState } from "react"
import { BookOpen, Calendar, FileText, TrendingUp, Bell, LogOut, Clock, Wallet, Users } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/components/auth-provider"
import { PortalGuard } from "@/components/portal-guard"

interface ChildRecord {
  id: string
  full_name: string
  admission_number: string
  class_id: string | null
  classes: { name: string; level: string } | null
}
interface GradeRow {
  id: string
  ca_score: number
  exam_score: number
  total_score: number
  grade_letter: string | null
  subjects: { name: string } | null
  terms: { name: string; academic_year: string } | null
}
interface FeeRow {
  id: string
  amount_due: number
  amount_paid: number
  terms: { name: string; academic_year: string } | null
}
interface AnnouncementRow {
  id: string
  title: string
  body: string
  created_at: string
}

const tabs = [
  { id: "dashboard", icon: TrendingUp, label: "Dashboard" },
  { id: "results", icon: FileText, label: "Results" },
  { id: "fees", icon: Wallet, label: "Fees" },
  { id: "notifications", icon: Bell, label: "Notifications" },
]

function ParentPortalContent() {
  const { profile, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [children, setChildren] = useState<ChildRecord[]>([])
  const [selectedChildId, setSelectedChildId] = useState<string>("")
  const [grades, setGrades] = useState<GradeRow[]>([])
  const [fees, setFees] = useState<FeeRow[]>([])
  const [attendance, setAttendance] = useState<{ present: number; absent: number; late: number; excused: number }>({ present: 0, absent: 0, late: 0, excused: 0 })
  const [announcements, setAnnouncements] = useState<AnnouncementRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile) return
    ;(async () => {
      const { data } = await supabase
        .from("student_guardians")
        .select("students(id, full_name, admission_number, class_id, classes(name, level))")
        .eq("guardian_profile_id", profile.id)

      const kids = ((data as any) || []).map((r: any) => r.students).filter(Boolean)
      setChildren(kids)
      if (kids.length > 0) setSelectedChildId(kids[0].id)

      const { data: ann } = await supabase.from("announcements").select("id, title, body, created_at").order("created_at", { ascending: false }).limit(10)
      setAnnouncements((ann as any) || [])
      setLoading(false)
    })()
  }, [profile])

  useEffect(() => {
    if (!selectedChildId) return
    ;(async () => {
      const [gradesRes, feesRes, attendanceRes] = await Promise.all([
        supabase.from("grades").select("id, ca_score, exam_score, total_score, grade_letter, subjects(name), terms(name, academic_year)").eq("student_id", selectedChildId),
        supabase.from("fees").select("id, amount_due, amount_paid, terms(name, academic_year)").eq("student_id", selectedChildId),
        supabase.from("attendance").select("status").eq("student_id", selectedChildId),
      ])
      setGrades((gradesRes.data as any) || [])
      setFees((feesRes.data as any) || [])
      const counts = { present: 0, absent: 0, late: 0, excused: 0 }
      ;((attendanceRes.data as any) || []).forEach((r: any) => { counts[r.status as keyof typeof counts]++ })
      setAttendance(counts)
    })()
  }, [selectedChildId])

  const selectedChild = children.find((c) => c.id === selectedChildId)
  const totalAttendance = attendance.present + attendance.absent + attendance.late + attendance.excused
  const attendancePct = totalAttendance > 0 ? Math.round((attendance.present / totalAttendance) * 100) : null
  const totalDue = fees.reduce((s, f) => s + Number(f.amount_due), 0)
  const totalPaid = fees.reduce((s, f) => s + Number(f.amount_paid), 0)

  return (
    <div className="min-h-screen bg-nomec-cream pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-nomec-slate">Parent Portal</h1>
          <p className="text-nomec-slate/60">Welcome, {profile?.full_name}</p>
        </div>

        {!loading && children.length === 0 && (
          <div className="bg-white rounded-2xl p-8 text-center">
            <p className="text-nomec-slate/60 mb-4">
              No children are linked to your account yet. Contact the school office to have this set up.
            </p>
            <button onClick={signOut} className="inline-flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        )}

        {children.length > 0 && (
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-4 shadow-sm space-y-2">
                {children.length > 1 && (
                  <div className="px-2 pb-2 mb-2 border-b border-nomec-green/10">
                    <label className="flex items-center gap-2 text-xs text-nomec-slate/50 mb-2">
                      <Users className="w-3.5 h-3.5" /> Viewing child
                    </label>
                    <select
                      value={selectedChildId}
                      onChange={(e) => setSelectedChildId(e.target.value)}
                      className="w-full px-3 py-2 border border-nomec-slate/15 rounded-lg text-sm"
                    >
                      {children.map((c) => (
                        <option key={c.id} value={c.id}>{c.full_name}</option>
                      ))}
                    </select>
                  </div>
                )}
                {selectedChild && (
                  <div className="px-4 py-3 mb-2">
                    <p className="text-sm font-medium text-nomec-slate">{selectedChild.full_name}</p>
                    <p className="text-xs text-nomec-slate/40">{selectedChild.admission_number} · {selectedChild.classes?.name || "Unassigned class"}</p>
                  </div>
                )}
                {tabs.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      activeTab === item.id ? "bg-nomec-green text-white" : "text-nomec-slate/70 hover:bg-nomec-cream"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </button>
                ))}
                <div className="pt-4 border-t border-nomec-green/10">
                  <button onClick={signOut} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3 space-y-6">
              {activeTab === "dashboard" && (
                <>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-nomec-slate/60">Attendance</span>
                        <Clock className="w-5 h-5 text-nomec-green" />
                      </div>
                      <p className="text-3xl font-serif font-bold text-nomec-slate">{attendancePct !== null ? `${attendancePct}%` : "—"}</p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-nomec-slate/60">Subjects Graded</span>
                        <BookOpen className="w-5 h-5 text-nomec-gold" />
                      </div>
                      <p className="text-3xl font-serif font-bold text-nomec-slate">{grades.length}</p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-nomec-slate/60">Fee Balance</span>
                        <Wallet className="w-5 h-5 text-nomec-coral" />
                      </div>
                      <p className="text-3xl font-serif font-bold text-nomec-slate">₦{(totalDue - totalPaid).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h3 className="font-serif text-lg text-nomec-slate mb-4">Recent Results</h3>
                    {grades.length === 0 ? (
                      <p className="text-sm text-nomec-slate/50">No grades recorded yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {grades.slice(0, 5).map((g) => (
                          <div key={g.id} className="flex items-center justify-between p-3 bg-nomec-cream rounded-xl">
                            <span className="text-sm font-medium text-nomec-slate">{g.subjects?.name}</span>
                            <span className="text-sm font-bold text-nomec-green">{g.grade_letter || g.total_score}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              {activeTab === "results" && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="font-serif text-lg text-nomec-slate mb-4">All Results</h3>
                  {grades.length === 0 ? (
                    <p className="text-sm text-nomec-slate/50">No grades recorded yet.</p>
                  ) : (
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-nomec-green/10">
                          <th className="text-left py-3 text-sm font-medium text-nomec-slate/60">Subject</th>
                          <th className="text-left py-3 text-sm font-medium text-nomec-slate/60">Term</th>
                          <th className="text-center py-3 text-sm font-medium text-nomec-slate/60">Total</th>
                          <th className="text-center py-3 text-sm font-medium text-nomec-slate/60">Grade</th>
                        </tr>
                      </thead>
                      <tbody>
                        {grades.map((g) => (
                          <tr key={g.id} className="border-b border-nomec-green/5">
                            <td className="py-3 text-sm text-nomec-slate">{g.subjects?.name}</td>
                            <td className="py-3 text-sm text-nomec-slate/60">{g.terms?.name} {g.terms?.academic_year}</td>
                            <td className="py-3 text-sm text-center font-medium text-nomec-slate">{g.total_score}</td>
                            <td className="py-3 text-sm text-center font-bold text-nomec-green">{g.grade_letter || "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {activeTab === "fees" && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="font-serif text-lg text-nomec-slate mb-4">Fee Records</h3>
                  {fees.length === 0 ? (
                    <p className="text-sm text-nomec-slate/50">No fee records yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {fees.map((f) => {
                        const bal = Number(f.amount_due) - Number(f.amount_paid)
                        return (
                          <div key={f.id} className="flex items-center justify-between p-4 bg-nomec-cream rounded-xl">
                            <div>
                              <p className="text-sm font-medium text-nomec-slate">{f.terms?.name} {f.terms?.academic_year}</p>
                              <p className="text-xs text-nomec-slate/50">Due ₦{Number(f.amount_due).toLocaleString()} · Paid ₦{Number(f.amount_paid).toLocaleString()}</p>
                            </div>
                            <span className={`text-sm font-bold ${bal > 0 ? "text-nomec-coral" : "text-nomec-green"}`}>
                              {bal > 0 ? `₦${bal.toLocaleString()} due` : "Cleared"}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="font-serif text-lg text-nomec-slate mb-4">Announcements</h3>
                  {announcements.length === 0 ? (
                    <p className="text-sm text-nomec-slate/50">No announcements yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {announcements.map((a) => (
                        <div key={a.id} className="p-4 bg-nomec-cream rounded-xl">
                          <p className="text-sm font-medium text-nomec-slate">{a.title}</p>
                          <p className="text-sm text-nomec-slate/60 mt-1">{a.body}</p>
                          <p className="text-xs text-nomec-slate/40 mt-2">{new Date(a.created_at).toLocaleDateString()}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ParentPortal() {
  return (
    <PortalGuard allow={["parent"]}>
      <ParentPortalContent />
    </PortalGuard>
  )
}
