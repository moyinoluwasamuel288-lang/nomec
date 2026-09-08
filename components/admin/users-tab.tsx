"use client"

import { useEffect, useState } from "react"
import { UserPlus, CheckCircle2, AlertCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface ClassOption { id: string; name: string }
interface StudentOption { id: string; full_name: string; admission_number: string }

export function UsersTab() {
  const [role, setRole] = useState<"student" | "parent" | "teacher" | "admin">("student")
  const [email, setEmail] = useState("")
  const [fullName, setFullName] = useState("")
  const [admissionNumber, setAdmissionNumber] = useState("")
  const [classId, setClassId] = useState("")
  const [staffId, setStaffId] = useState("")
  const [linkStudentId, setLinkStudentId] = useState("")
  const [relationship, setRelationship] = useState("")

  const [classes, setClasses] = useState<ClassOption[]>([])
  const [students, setStudents] = useState<StudentOption[]>([])
  const [saving, setSaving] = useState(false)
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null)

  useEffect(() => {
    supabase.from("classes").select("id, name").then(({ data }) => setClasses(data || []))
    supabase.from("students").select("id, full_name, admission_number").then(({ data }) => setStudents(data || []))
  }, [])

  function resetForm() {
    setEmail(""); setFullName(""); setAdmissionNumber(""); setClassId("")
    setStaffId(""); setLinkStudentId(""); setRelationship("")
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setResult(null)
    if (!email || !fullName) {
      setResult({ ok: false, message: "Email and full name are required." })
      return
    }
    setSaving(true)
    const { data, error } = await supabase.functions.invoke("invite-user", {
      body: {
        email, full_name: fullName, role,
        admission_number: admissionNumber || undefined,
        class_id: classId || undefined,
        staff_id: staffId || undefined,
        link_student_id: linkStudentId || undefined,
        relationship: relationship || undefined,
        redirect_to: `${window.location.origin}/portal/set-password`,
      },
    })
    setSaving(false)

    if (error || data?.error) {
      setResult({ ok: false, message: data?.error || error?.message || "Something went wrong." })
    } else {
      setResult({ ok: true, message: `Invite sent to ${email}. They'll get an email to set their password.` })
      resetForm()
    }
  }

  return (
    <div className="max-w-lg">
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-5">
          <UserPlus className="w-5 h-5 text-nomec-green" />
          <h3 className="font-serif text-lg text-nomec-slate">Invite a User</h3>
        </div>
        <p className="text-sm text-nomec-slate/60 mb-6">
          Creates the account and emails them a secure link to set their own password — nothing to type or share manually.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-nomec-slate/50 block mb-1.5">Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value as any)} className="w-full px-3 py-2.5 border border-nomec-slate/15 rounded-lg text-sm">
              <option value="student">Student</option>
              <option value="parent">Parent</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin / Bursary Staff</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-nomec-slate/50 block mb-1.5">Full Name</label>
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-3 py-2.5 border border-nomec-slate/15 rounded-lg text-sm" />
          </div>

          <div>
            <label className="text-xs text-nomec-slate/50 block mb-1.5">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2.5 border border-nomec-slate/15 rounded-lg text-sm" />
          </div>

          {role === "student" && (
            <>
              <div>
                <label className="text-xs text-nomec-slate/50 block mb-1.5">Admission Number</label>
                <input value={admissionNumber} onChange={(e) => setAdmissionNumber(e.target.value)} className="w-full px-3 py-2.5 border border-nomec-slate/15 rounded-lg text-sm" />
              </div>
              <div>
                <label className="text-xs text-nomec-slate/50 block mb-1.5">Class</label>
                <select value={classId} onChange={(e) => setClassId(e.target.value)} className="w-full px-3 py-2.5 border border-nomec-slate/15 rounded-lg text-sm">
                  <option value="">Select class</option>
                  {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </>
          )}

          {role === "teacher" && (
            <div>
              <label className="text-xs text-nomec-slate/50 block mb-1.5">Staff ID</label>
              <input value={staffId} onChange={(e) => setStaffId(e.target.value)} className="w-full px-3 py-2.5 border border-nomec-slate/15 rounded-lg text-sm" />
            </div>
          )}

          {role === "parent" && (
            <>
              <div>
                <label className="text-xs text-nomec-slate/50 block mb-1.5">Link to Child (optional — can also link later)</label>
                <select value={linkStudentId} onChange={(e) => setLinkStudentId(e.target.value)} className="w-full px-3 py-2.5 border border-nomec-slate/15 rounded-lg text-sm">
                  <option value="">Select student</option>
                  {students.map((s) => <option key={s.id} value={s.id}>{s.full_name} ({s.admission_number})</option>)}
                </select>
              </div>
              {linkStudentId && (
                <div>
                  <label className="text-xs text-nomec-slate/50 block mb-1.5">Relationship</label>
                  <input placeholder="e.g. Mother, Father, Guardian" value={relationship} onChange={(e) => setRelationship(e.target.value)} className="w-full px-3 py-2.5 border border-nomec-slate/15 rounded-lg text-sm" />
                </div>
              )}
            </>
          )}

          {result && (
            <div className={`flex items-start gap-2 text-sm rounded-lg p-3 ${result.ok ? "text-nomec-green bg-nomec-green/10" : "text-red-600 bg-red-50"}`}>
              {result.ok ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
              <span>{result.message}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full py-2.5 bg-nomec-green text-white rounded-lg text-sm font-medium hover:bg-nomec-green-light transition-colors disabled:opacity-60"
          >
            {saving ? "Sending invite..." : "Send Invite"}
          </button>
        </form>
      </div>
    </div>
  )
}
