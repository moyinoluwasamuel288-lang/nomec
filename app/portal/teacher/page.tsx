"use client"

import { useEffect, useState } from "react"
import { Users, ClipboardCheck, GraduationCap, Bell, LogOut, CheckCircle2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/components/auth-provider"
import { PortalGuard } from "@/components/portal-guard"

interface AssignmentOption {
  class_id: string
  subject_id: string
  class_name: string
  subject_name: string
}
interface StudentRow {
  id: string
  full_name: string
  admission_number: string
}
interface TermOption {
  id: string
  name: string
  academic_year: string
}
interface AnnouncementRow {
  id: string
  title: string
  body: string
  created_at: string
}

const tabs = [
  { id: "classes", icon: Users, label: "My Classes" },
  { id: "attendance", icon: ClipboardCheck, label: "Take Attendance" },
  { id: "grades", icon: GraduationCap, label: "Enter Grades" },
  { id: "notifications", icon: Bell, label: "Announcements" },
]

function TeacherPortalContent() {
  const { profile, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState("classes")
  const [teacherId, setTeacherId] = useState<string>("")
  const [assignments, setAssignments] = useState<AssignmentOption[]>([])
  const [terms, setTerms] = useState<TermOption[]>([])
  const [announcements, setAnnouncements] = useState<AnnouncementRow[]>([])
  const [selectedAssignment, setSelectedAssignment] = useState<string>("")
  const [students, setStudents] = useState<StudentRow[]>([])
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [attendanceStatus, setAttendanceStatus] = useState<Record<string, string>>({})
  const [selectedTerm, setSelectedTerm] = useState("")
  const [scores, setScores] = useState<Record<string, { ca: string; exam: string }>>({})
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState("")

  useEffect(() => {
    if (!profile) return
    ;(async () => {
      const { data: teacher } = await supabase.from("teachers").select("id").eq("profile_id", profile.id).single()
      if (!teacher) return
      setTeacherId(teacher.id)

      const { data: tc } = await supabase
        .from("teacher_classes")
        .select("class_id, subject_id, classes(name), subjects(name)")
        .eq("teacher_id", teacher.id)

      const opts = ((tc as any) || []).map((r: any) => ({
        class_id: r.class_id,
        subject_id: r.subject_id,
        class_name: r.classes?.name,
        subject_name: r.subjects?.name,
      }))
      setAssignments(opts)
      if (opts.length > 0) setSelectedAssignment(`${opts[0].class_id}|${opts[0].subject_id}`)

      const { data: termsData } = await supabase.from("terms").select("id, name, academic_year")
      setTerms(termsData || [])
      if (termsData && termsData.length > 0) setSelectedTerm(termsData[0].id)

      const { data: ann } = await supabase.from("announcements").select("id, title, body, created_at").order("created_at", { ascending: false }).limit(10)
      setAnnouncements((ann as any) || [])
    })()
  }, [profile])

  const currentClassId = selectedAssignment.split("|")[0]
  const currentSubjectId = selectedAssignment.split("|")[1]

  useEffect(() => {
    if (!currentClassId) return
    supabase.from("students").select("id, full_name, admission_number").eq("class_id", currentClassId).then(({ data }) => {
      setStudents(data || [])
    })
  }, [currentClassId])

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(""), 3000)
  }

  async function submitAttendance() {
    setSaving(true)
    const rows = students
      .filter((s) => attendanceStatus[s.id])
      .map((s) => ({
        student_id: s.id,
        class_id: currentClassId,
        date,
        status: attendanceStatus[s.id],
        recorded_by: profile?.id,
      }))
    const { error } = await supabase.from("attendance").upsert(rows, { onConflict: "student_id,date" })
    setSaving(false)
    if (error) showToast(`Error: ${error.message}`)
    else showToast("Attendance saved")
  }

  async function submitGrades() {
    setSaving(true)
    const rows = students
      .filter((s) => scores[s.id]?.ca || scores[s.id]?.exam)
      .map((s) => ({
        student_id: s.id,
        subject_id: currentSubjectId,
        term_id: selectedTerm,
        ca_score: Number(scores[s.id]?.ca || 0),
        exam_score: Number(scores[s.id]?.exam || 0),
        recorded_by: profile?.id,
      }))
    const { error } = await supabase.from("grades").upsert(rows, { onConflict: "student_id,subject_id,term_id" })
    setSaving(false)
    if (error) showToast(`Error: ${error.message}`)
    else showToast("Grades saved")
  }

  return (
    <div className="min-h-screen bg-nomec-cream pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-nomec-slate">Teacher Portal</h1>
          <p className="text-nomec-slate/60">Welcome, {profile?.full_name}</p>
        </div>

        {teacherId && assignments.length === 0 && (
          <div className="bg-white rounded-2xl p-8 text-center">
            <p className="text-nomec-slate/60 mb-4">No classes assigned to you yet. Contact the school office.</p>
            <button onClick={signOut} className="inline-flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        )}

        {assignments.length > 0 && (
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-4 shadow-sm space-y-2">
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
              {activeTab !== "notifications" && (
                <div className="bg-white rounded-2xl p-4 shadow-sm">
                  <label className="text-xs text-nomec-slate/50 block mb-2">Class / Subject</label>
                  <select
                    value={selectedAssignment}
                    onChange={(e) => setSelectedAssignment(e.target.value)}
                    className="w-full px-3 py-2 border border-nomec-slate/15 rounded-lg text-sm"
                  >
                    {assignments.map((a) => (
                      <option key={`${a.class_id}|${a.subject_id}`} value={`${a.class_id}|${a.subject_id}`}>
                        {a.class_name} — {a.subject_name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {activeTab === "classes" && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="font-serif text-lg text-nomec-slate mb-4">Students in this class</h3>
                  {students.length === 0 ? (
                    <p className="text-sm text-nomec-slate/50">No students in this class yet.</p>
                  ) : (
                    <div className="divide-y divide-nomec-slate/5">
                      {students.map((s) => (
                        <div key={s.id} className="flex items-center justify-between py-3">
                          <span className="text-sm text-nomec-slate">{s.full_name}</span>
                          <span className="text-xs text-nomec-slate/40">{s.admission_number}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "attendance" && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-serif text-lg text-nomec-slate">Take Attendance</h3>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="px-3 py-2 border border-nomec-slate/15 rounded-lg text-sm" />
                  </div>
                  {students.length === 0 ? (
                    <p className="text-sm text-nomec-slate/50">No students in this class yet.</p>
                  ) : (
                    <>
                      <div className="space-y-2 mb-4">
                        {students.map((s) => (
                          <div key={s.id} className="flex items-center justify-between p-3 bg-nomec-cream rounded-xl">
                            <span className="text-sm text-nomec-slate">{s.full_name}</span>
                            <div className="flex gap-1">
                              {["present", "absent", "late", "excused"].map((st) => (
                                <button
                                  key={st}
                                  onClick={() => setAttendanceStatus((prev) => ({ ...prev, [s.id]: st }))}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                                    attendanceStatus[s.id] === st ? "bg-nomec-green text-white" : "bg-white text-nomec-slate/60 hover:bg-nomec-slate/5"
                                  }`}
                                >
                                  {st}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={submitAttendance}
                        disabled={saving}
                        className="px-5 py-2.5 bg-nomec-green text-white rounded-lg text-sm font-medium hover:bg-nomec-green-light transition-colors disabled:opacity-60"
                      >
                        {saving ? "Saving..." : "Save Attendance"}
                      </button>
                    </>
                  )}
                </div>
              )}

              {activeTab === "grades" && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-serif text-lg text-nomec-slate">Enter Grades</h3>
                    <select value={selectedTerm} onChange={(e) => setSelectedTerm(e.target.value)} className="px-3 py-2 border border-nomec-slate/15 rounded-lg text-sm">
                      {terms.map((t) => (
                        <option key={t.id} value={t.id}>{t.name} {t.academic_year}</option>
                      ))}
                    </select>
                  </div>
                  {students.length === 0 ? (
                    <p className="text-sm text-nomec-slate/50">No students in this class yet.</p>
                  ) : (
                    <>
                      <div className="overflow-x-auto mb-4">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-nomec-green/10">
                              <th className="text-left py-2 text-sm font-medium text-nomec-slate/60">Student</th>
                              <th className="text-center py-2 text-sm font-medium text-nomec-slate/60">CA (max 40)</th>
                              <th className="text-center py-2 text-sm font-medium text-nomec-slate/60">Exam (max 60)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {students.map((s) => (
                              <tr key={s.id} className="border-b border-nomec-green/5">
                                <td className="py-2 text-sm text-nomec-slate">{s.full_name}</td>
                                <td className="py-2 text-center">
                                  <input
                                    type="number"
                                    className="w-20 px-2 py-1.5 border border-nomec-slate/15 rounded-lg text-sm text-center"
                                    value={scores[s.id]?.ca || ""}
                                    onChange={(e) => setScores((prev) => ({ ...prev, [s.id]: { ca: e.target.value, exam: prev[s.id]?.exam || "" } }))}
                                  />
                                </td>
                                <td className="py-2 text-center">
                                  <input
                                    type="number"
                                    className="w-20 px-2 py-1.5 border border-nomec-slate/15 rounded-lg text-sm text-center"
                                    value={scores[s.id]?.exam || ""}
                                    onChange={(e) => setScores((prev) => ({ ...prev, [s.id]: { ca: prev[s.id]?.ca || "", exam: e.target.value } }))}
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <button
                        onClick={submitGrades}
                        disabled={saving}
                        className="px-5 py-2.5 bg-nomec-green text-white rounded-lg text-sm font-medium hover:bg-nomec-green-light transition-colors disabled:opacity-60"
                      >
                        {saving ? "Saving..." : "Save Grades"}
                      </button>
                    </>
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

      {toast && (
        <div className="fixed bottom-6 right-6 flex items-center gap-2 bg-nomec-slate text-white px-4 py-3 rounded-xl shadow-lg text-sm">
          <CheckCircle2 className="w-4 h-4 text-nomec-green" /> {toast}
        </div>
      )}
    </div>
  )
}

export default function TeacherPortal() {
  return (
    <PortalGuard allow={["teacher"]}>
      <TeacherPortalContent />
    </PortalGuard>
  )
}
