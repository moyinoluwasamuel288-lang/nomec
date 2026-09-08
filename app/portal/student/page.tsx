"use client"

import { useEffect, useState } from "react"
import { BookOpen, Calendar, FileText, TrendingUp, Bell, LogOut, Clock, Wallet } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/components/auth-provider"
import { PortalGuard } from "@/components/portal-guard"

interface StudentRecord {
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
interface TimetableRow {
  id: string
  day_of_week: number
  start_time: string
  end_time: string
  subjects: { name: string } | null
}
interface AnnouncementRow {
  id: string
  title: string
  body: string
  created_at: string
}

const days = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
const tabs = [
  { id: "dashboard", icon: TrendingUp, label: "Dashboard" },
  { id: "results", icon: FileText, label: "Results" },
  { id: "timetable", icon: Calendar, label: "Timetable" },
  { id: "fees", icon: Wallet, label: "Fees" },
  { id: "notifications", icon: Bell, label: "Notifications" },
]

function StudentPortalContent() {
  const { profile, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [student, setStudent] = useState<StudentRecord | null>(null)
  const [grades, setGrades] = useState<GradeRow[]>([])
  const [fees, setFees] = useState<FeeRow[]>([])
  const [attendance, setAttendance] = useState<{ present: number; absent: number; late: number; excused: number }>({ present: 0, absent: 0, late: 0, excused: 0 })
  const [timetable, setTimetable] = useState<TimetableRow[]>([])
  const [announcements, setAnnouncements] = useState<AnnouncementRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile) return
    ;(async () => {
      const { data: studentData } = await supabase
        .from("students")
        .select("id, full_name, admission_number, class_id, classes(name, level)")
        .eq("profile_id", profile.id)
        .single()

      if (!studentData) {
        setLoading(false)
        return
      }
      setStudent(studentData as any)

      const [gradesRes, feesRes, attendanceRes, announcementsRes] = await Promise.all([
        supabase.from("grades").select("id, ca_score, exam_score, total_score, grade_letter, subjects(name), terms(name, academic_year)").eq("student_id", studentData.id),
        supabase.from("fees").select("id, amount_due, amount_paid, terms(name, academic_year)").eq("student_id", studentData.id),
        supabase.from("attendance").select("status").eq("student_id", studentData.id),
        supabase.from("announcements").select("id, title, body, created_at").order("created_at", { ascending: false }).limit(10),
      ])

      setGrades((gradesRes.data as any) || [])
      setFees((feesRes.data as any) || [])
      setAnnouncements((announcementsRes.data as any) || [])

      const counts = { present: 0, absent: 0, late: 0, excused: 0 }
      ;((attendanceRes.data as any) || []).forEach((r: any) => { counts[r.status as keyof typeof counts]++ })
      setAttendance(counts)

      if (studentData.class_id) {
        const { data: tt } = await supabase
          .from("timetable")
          .select("id, day_of_week, start_time, end_time, subjects(name)")
          .eq("class_id", studentData.class_id)
          .order("day_of_week")
        setTimetable((tt as any) || [])
      }

      setLoading(false)
    })()
  }, [profile])

  const totalAttendance = attendance.present + attendance.absent + attendance.late + attendance.excused
  const attendancePct = totalAttendance > 0 ? Math.round((attendance.present / totalAttendance) * 100) : null
  const totalDue = fees.reduce((s, f) => s + Number(f.amount_due), 0)
  const totalPaid = fees.reduce((s, f) => s + Number(f.amount_paid), 0)

  return (
    <div className="min-h-screen bg-nomec-cream pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-nomec-slate">Student Portal</h1>
          <p className="text-nomec-slate/60">
            {student ? `Welcome back, ${student.full_name}` : `Welcome, ${profile?.full_name}`}
          </p>
        </div>

        {!loading && !student && (
          <div className="bg-white rounded-2xl p-8 text-center">
            <p className="text-nomec-slate/60">
              Your account isn't linked to a student record yet. Contact the school office to have this set up.
            </p>
          </div>
        )}

        {student && (
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-4 shadow-sm space-y-2">
                <div className="px-4 py-3 mb-2">
                  <p className="text-xs text-nomec-slate/40">{student.admission_number}</p>
                  <p className="text-sm font-medium text-nomec-slate">{student.classes?.name || "Unassigned class"}</p>
                </div>
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
                            <div className="flex items-center gap-4">
                              <div className="w-32 h-2 bg-white rounded-full overflow-hidden">
                                <div className="h-full bg-nomec-green rounded-full" style={{ width: `${Math.min(Number(g.total_score), 100)}%` }} />
                              </div>
                              <span className="text-sm font-bold text-nomec-green">{g.grade_letter || g.total_score}</span>
                            </div>
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
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-nomec-green/10">
                            <th className="text-left py-3 text-sm font-medium text-nomec-slate/60">Subject</th>
                            <th className="text-left py-3 text-sm font-medium text-nomec-slate/60">Term</th>
                            <th className="text-center py-3 text-sm font-medium text-nomec-slate/60">CA</th>
                            <th className="text-center py-3 text-sm font-medium text-nomec-slate/60">Exam</th>
                            <th className="text-center py-3 text-sm font-medium text-nomec-slate/60">Total</th>
                            <th className="text-center py-3 text-sm font-medium text-nomec-slate/60">Grade</th>
                          </tr>
                        </thead>
                        <tbody>
                          {grades.map((g) => (
                            <tr key={g.id} className="border-b border-nomec-green/5">
                              <td className="py-3 text-sm text-nomec-slate">{g.subjects?.name}</td>
                              <td className="py-3 text-sm text-nomec-slate/60">{g.terms?.name} {g.terms?.academic_year}</td>
                              <td className="py-3 text-sm text-center text-nomec-slate/70">{g.ca_score}</td>
                              <td className="py-3 text-sm text-center text-nomec-slate/70">{g.exam_score}</td>
                              <td className="py-3 text-sm text-center font-medium text-nomec-slate">{g.total_score}</td>
                              <td className="py-3 text-sm text-center font-bold text-nomec-green">{g.grade_letter || "—"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "timetable" && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="font-serif text-lg text-nomec-slate mb-4">Weekly Timetable</h3>
                  {timetable.length === 0 ? (
                    <p className="text-sm text-nomec-slate/50">No timetable published yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {timetable.map((t) => (
                        <div key={t.id} className="flex items-center justify-between p-3 bg-nomec-cream rounded-xl text-sm">
                          <span className="font-medium text-nomec-slate w-24">{days[t.day_of_week]}</span>
                          <span className="text-nomec-slate/70 flex-1">{t.subjects?.name}</span>
                          <span className="text-nomec-slate/50">{t.start_time?.slice(0, 5)} – {t.end_time?.slice(0, 5)}</span>
                        </div>
                      ))}
                    </div>
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

export default function StudentPortal() {
  return (
    <PortalGuard allow={["student"]}>
      <StudentPortalContent />
    </PortalGuard>
  )
}
