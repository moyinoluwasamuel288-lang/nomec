"use client"

import { useEffect, useState, useCallback } from "react"
import { Plus, CheckCircle2, AlertCircle, School, BookMarked, CalendarRange, Link2 } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface ClassRow { id: string; name: string; level: string; academic_year: string }
interface SubjectRow { id: string; name: string; code: string | null }
interface TermRow { id: string; name: string; academic_year: string; is_current: boolean }
interface TeacherRow { id: string; staff_id: string; profiles: { full_name: string } | null }
interface AssignmentRow {
  teacher_id: string; class_id: string; subject_id: string; is_class_teacher: boolean
  teachers: { staff_id: string; profiles: { full_name: string } | null } | null
  classes: { name: string } | null
  subjects: { name: string } | null
}

export function ClassesTab() {
  const [classes, setClasses] = useState<ClassRow[]>([])
  const [subjects, setSubjects] = useState<SubjectRow[]>([])
  const [terms, setTerms] = useState<TermRow[]>([])
  const [teachers, setTeachers] = useState<TeacherRow[]>([])
  const [assignments, setAssignments] = useState<AssignmentRow[]>([])
  const [toast, setToast] = useState("")

  const loadAll = useCallback(async () => {
    const [c, s, t, tc, asg] = await Promise.all([
      supabase.from("classes").select("id, name, level, academic_year").order("name"),
      supabase.from("subjects").select("id, name, code").order("name"),
      supabase.from("terms").select("id, name, academic_year, is_current").order("academic_year"),
      supabase.from("teachers").select("id, staff_id, profiles(full_name)"),
      supabase.from("teacher_classes").select("teacher_id, class_id, subject_id, is_class_teacher, teachers(staff_id, profiles(full_name)), classes(name), subjects(name)"),
    ])
    setClasses(c.data || [])
    setSubjects(s.data || [])
    setTerms(t.data || [])
    setTeachers((tc.data as any) || [])
    setAssignments((asg.data as any) || [])
  }, [])

  useEffect(() => { loadAll() }, [loadAll])

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(""), 3000)
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <QuickAddCard
        icon={School}
        title="Classes"
        placeholder="e.g. JSS 1A"
        extraFields={["level", "academic_year"]}
        items={classes.map((c) => `${c.name} (${c.level}, ${c.academic_year})`)}
        onAdd={async (values) => {
          const { error } = await supabase.from("classes").insert({ name: values.name, level: values.level, academic_year: values.academic_year })
          if (!error) { loadAll(); showToast("Class added") }
          return error?.message
        }}
      />

      <QuickAddCard
        icon={BookMarked}
        title="Subjects"
        placeholder="e.g. Mathematics"
        extraFields={["code"]}
        items={subjects.map((s) => `${s.name}${s.code ? ` (${s.code})` : ""}`)}
        onAdd={async (values) => {
          const { error } = await supabase.from("subjects").insert({ name: values.name, code: values.code || null })
          if (!error) { loadAll(); showToast("Subject added") }
          return error?.message
        }}
      />

      <QuickAddCard
        icon={CalendarRange}
        title="Terms"
        placeholder="e.g. First Term"
        extraFields={["academic_year"]}
        items={terms.map((t) => `${t.name} ${t.academic_year}${t.is_current ? " — current" : ""}`)}
        onAdd={async (values) => {
          const { error } = await supabase.from("terms").insert({ name: values.name, academic_year: values.academic_year })
          if (!error) { loadAll(); showToast("Term added") }
          return error?.message
        }}
      />

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Link2 className="w-5 h-5 text-nomec-green" />
          <h3 className="font-serif text-lg text-nomec-slate">Assign Teacher</h3>
        </div>
        <AssignTeacherForm
          teachers={teachers}
          classes={classes}
          subjects={subjects}
          onAssigned={() => { loadAll(); showToast("Teacher assigned") }}
        />
        <div className="mt-5 pt-5 border-t border-nomec-slate/10 space-y-2 max-h-48 overflow-y-auto">
          {assignments.length === 0 && <p className="text-sm text-nomec-slate/40">No assignments yet.</p>}
          {assignments.map((a, i) => (
            <div key={i} className="text-sm text-nomec-slate/70 flex items-center justify-between">
              <span>{a.teachers?.profiles?.full_name} — {a.classes?.name} · {a.subjects?.name}</span>
              {a.is_class_teacher && <span className="text-xs text-nomec-gold font-medium">Class Teacher</span>}
            </div>
          ))}
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 flex items-center gap-2 bg-nomec-slate text-white px-4 py-3 rounded-xl shadow-lg text-sm">
          <CheckCircle2 className="w-4 h-4 text-nomec-green" /> {toast}
        </div>
      )}
    </div>
  )
}

function QuickAddCard({
  icon: Icon, title, placeholder, extraFields, items, onAdd,
}: {
  icon: any
  title: string
  placeholder: string
  extraFields: string[]
  items: string[]
  onAdd: (values: Record<string, string>) => Promise<string | undefined>
}) {
  const [name, setName] = useState("")
  const [extra, setExtra] = useState<Record<string, string>>({})
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  async function handleAdd() {
    setError("")
    if (!name) { setError("Name is required."); return }
    setSaving(true)
    const err = await onAdd({ name, ...extra })
    setSaving(false)
    if (err) setError(err)
    else { setName(""); setExtra({}) }
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-5 h-5 text-nomec-green" />
        <h3 className="font-serif text-lg text-nomec-slate">{title}</h3>
      </div>
      <div className="space-y-2 mb-3">
        <input
          placeholder={placeholder}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-nomec-slate/15 rounded-lg text-sm"
        />
        {extraFields.map((f) => (
          <input
            key={f}
            placeholder={f === "academic_year" ? "e.g. 2025/2026" : f === "level" ? "e.g. JSS1" : "e.g. MTH"}
            value={extra[f] || ""}
            onChange={(e) => setExtra((prev) => ({ ...prev, [f]: e.target.value }))}
            className="w-full px-3 py-2 border border-nomec-slate/15 rounded-lg text-sm"
          />
        ))}
        {error && (
          <p className="text-xs text-red-600 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {error}</p>
        )}
        <button
          onClick={handleAdd}
          disabled={saving}
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-nomec-green/10 text-nomec-green rounded-lg text-sm font-medium hover:bg-nomec-green/20 transition-colors disabled:opacity-60"
        >
          <Plus className="w-3.5 h-3.5" /> {saving ? "Adding..." : "Add"}
        </button>
      </div>
      <div className="pt-3 border-t border-nomec-slate/10 space-y-1 max-h-32 overflow-y-auto">
        {items.length === 0 && <p className="text-sm text-nomec-slate/40">None added yet.</p>}
        {items.map((it, i) => <p key={i} className="text-sm text-nomec-slate/70">{it}</p>)}
      </div>
    </div>
  )
}

function AssignTeacherForm({
  teachers, classes, subjects, onAssigned,
}: {
  teachers: TeacherRow[]
  classes: ClassRow[]
  subjects: SubjectRow[]
  onAssigned: () => void
}) {
  const [teacherId, setTeacherId] = useState("")
  const [classId, setClassId] = useState("")
  const [subjectId, setSubjectId] = useState("")
  const [isClassTeacher, setIsClassTeacher] = useState(false)
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (!teacherId || !classId || !subjectId) { setError("All three fields are required."); return }
    setSaving(true)
    const { error } = await supabase.from("teacher_classes").insert({
      teacher_id: teacherId, class_id: classId, subject_id: subjectId, is_class_teacher: isClassTeacher,
    })
    setSaving(false)
    if (error) setError(error.message)
    else { setTeacherId(""); setClassId(""); setSubjectId(""); setIsClassTeacher(false); onAssigned() }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <select value={teacherId} onChange={(e) => setTeacherId(e.target.value)} className="w-full px-3 py-2 border border-nomec-slate/15 rounded-lg text-sm">
        <option value="">Select teacher</option>
        {teachers.map((t) => <option key={t.id} value={t.id}>{t.profiles?.full_name} ({t.staff_id})</option>)}
      </select>
      <select value={classId} onChange={(e) => setClassId(e.target.value)} className="w-full px-3 py-2 border border-nomec-slate/15 rounded-lg text-sm">
        <option value="">Select class</option>
        {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
      <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)} className="w-full px-3 py-2 border border-nomec-slate/15 rounded-lg text-sm">
        <option value="">Select subject</option>
        {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
      </select>
      <label className="flex items-center gap-2 text-sm text-nomec-slate/70 py-1">
        <input type="checkbox" checked={isClassTeacher} onChange={(e) => setIsClassTeacher(e.target.checked)} />
        Class teacher for this class
      </label>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={saving}
        className="inline-flex items-center gap-1.5 px-3 py-2 bg-nomec-green text-white rounded-lg text-sm font-medium hover:bg-nomec-green-light transition-colors disabled:opacity-60"
      >
        <Plus className="w-3.5 h-3.5" /> {saving ? "Assigning..." : "Assign"}
      </button>
    </form>
  )
}
