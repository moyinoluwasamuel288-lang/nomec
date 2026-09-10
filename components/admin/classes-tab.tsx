"use client"

import { useEffect, useState, useCallback } from "react"
import { Plus, Pencil, Trash2, Check, X, CheckCircle2, AlertCircle, School, BookMarked, CalendarRange, Link2, ClipboardList } from "lucide-react"
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

  // Suggestions pulled from what's already been typed, so typing "JSS" surfaces
  // every level you've used before instead of retyping it each time.
  const levelSuggestions = Array.from(new Set(classes.map((c) => c.level).filter(Boolean)))
  const yearSuggestions = Array.from(new Set([...classes.map((c) => c.academic_year), ...terms.map((t) => t.academic_year)].filter(Boolean)))
  const subjectCodeSuggestions = Array.from(new Set(subjects.map((s) => s.code).filter(Boolean) as string[]))

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <ManagedListCard
        icon={School}
        title="Classes"
        placeholder="e.g. JSS 1A"
        fields={[
          { key: "level", placeholder: "Level, e.g. JSS1", suggestions: levelSuggestions },
          { key: "academic_year", placeholder: "Academic year, e.g. 2025/2026", suggestions: yearSuggestions },
        ]}
        rows={classes.map((c) => ({ id: c.id, name: c.name, values: { level: c.level, academic_year: c.academic_year }, display: `${c.name} (${c.level}, ${c.academic_year})` }))}
        onAdd={async (name, values) => {
          const { error } = await supabase.from("classes").insert({ name, level: values.level, academic_year: values.academic_year })
          if (!error) { loadAll(); showToast("Class added") }
          return error?.message
        }}
        onUpdate={async (id, name, values) => {
          const { error } = await supabase.from("classes").update({ name, level: values.level, academic_year: values.academic_year }).eq("id", id)
          if (!error) { loadAll(); showToast("Class updated") }
          return error?.message
        }}
        onDelete={async (id) => {
          const { error } = await supabase.from("classes").delete().eq("id", id)
          if (!error) { loadAll(); showToast("Class removed") }
          return error?.message
        }}
      />

      <ManagedListCard
        icon={BookMarked}
        title="Subjects"
        placeholder="e.g. Mathematics"
        fields={[{ key: "code", placeholder: "Code, e.g. MTH (optional)", suggestions: subjectCodeSuggestions }]}
        rows={subjects.map((s) => ({ id: s.id, name: s.name, values: { code: s.code || "" }, display: `${s.name}${s.code ? ` (${s.code})` : ""}` }))}
        onAdd={async (name, values) => {
          const { error } = await supabase.from("subjects").insert({ name, code: values.code || null })
          if (!error) { loadAll(); showToast("Subject added") }
          return error?.message
        }}
        onUpdate={async (id, name, values) => {
          const { error } = await supabase.from("subjects").update({ name, code: values.code || null }).eq("id", id)
          if (!error) { loadAll(); showToast("Subject updated") }
          return error?.message
        }}
        onDelete={async (id) => {
          const { error } = await supabase.from("subjects").delete().eq("id", id)
          if (!error) { loadAll(); showToast("Subject removed") }
          return error?.message
        }}
      />

      <ManagedListCard
        icon={CalendarRange}
        title="Terms"
        placeholder="e.g. First Term"
        fields={[{ key: "academic_year", placeholder: "Academic year, e.g. 2025/2026", suggestions: yearSuggestions }]}
        rows={terms.map((t) => ({ id: t.id, name: t.name, values: { academic_year: t.academic_year }, display: `${t.name} ${t.academic_year}${t.is_current ? " — current" : ""}` }))}
        onAdd={async (name, values) => {
          const { error } = await supabase.from("terms").insert({ name, academic_year: values.academic_year })
          if (!error) { loadAll(); showToast("Term added") }
          return error?.message
        }}
        onUpdate={async (id, name, values) => {
          const { error } = await supabase.from("terms").update({ name, academic_year: values.academic_year }).eq("id", id)
          if (!error) { loadAll(); showToast("Term updated") }
          return error?.message
        }}
        onDelete={async (id) => {
          const { error } = await supabase.from("terms").delete().eq("id", id)
          if (!error) { loadAll(); showToast("Term removed") }
          return error?.message
        }}
      />

      <div className="bg-white rounded-2xl p-6 shadow-sm h-fit">
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
            <div key={i} className="text-sm text-nomec-slate/70 flex items-center justify-between gap-2">
              <span>{a.teachers?.profiles?.full_name} — {a.classes?.name} · {a.subjects?.name}</span>
              <div className="flex items-center gap-2 shrink-0">
                {a.is_class_teacher && <span className="text-xs text-nomec-gold font-medium">Class Teacher</span>}
                <button
                  onClick={async () => {
                    if (!confirm("Remove this assignment?")) return
                    await supabase.from("teacher_classes").delete()
                      .eq("teacher_id", a.teacher_id).eq("class_id", a.class_id).eq("subject_id", a.subject_id)
                    loadAll()
                    showToast("Assignment removed")
                  }}
                  className="p-1 text-nomec-coral hover:bg-nomec-coral/10 rounded transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <RegisterSubjectsCard classes={classes} terms={terms} onDone={showToast} />

      {toast && (
        <div className="fixed bottom-6 right-6 flex items-center gap-2 bg-nomec-slate text-white px-4 py-3 rounded-xl shadow-lg text-sm">
          <CheckCircle2 className="w-4 h-4 text-nomec-green" /> {toast}
        </div>
      )}
    </div>
  )
}

interface FieldSpec { key: string; placeholder: string; suggestions: string[] }
interface RowSpec { id: string; name: string; values: Record<string, string>; display: string }

function ManagedListCard({
  icon: Icon, title, placeholder, fields, rows, onAdd, onUpdate, onDelete,
}: {
  icon: any
  title: string
  placeholder: string
  fields: FieldSpec[]
  rows: RowSpec[]
  onAdd: (name: string, values: Record<string, string>) => Promise<string | undefined>
  onUpdate: (id: string, name: string, values: Record<string, string>) => Promise<string | undefined>
  onDelete: (id: string) => Promise<string | undefined>
}) {
  const [name, setName] = useState("")
  const [extra, setExtra] = useState<Record<string, string>>({})
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [editValues, setEditValues] = useState<Record<string, string>>({})

  // Name suggestions too, since e.g. "JSS 1A", "JSS 1B" share a common prefix pattern.
  const nameSuggestions = Array.from(new Set(rows.map((r) => r.name)))
  const listId = `${title.replace(/\s+/g, "-")}-names`

  async function handleAdd() {
    setError("")
    if (!name) { setError("Name is required."); return }
    setSaving(true)
    const err = await onAdd(name, extra)
    setSaving(false)
    if (err) setError(err)
    else { setName(""); setExtra({}) }
  }

  function startEdit(row: RowSpec) {
    setEditingId(row.id)
    setEditName(row.name)
    setEditValues(row.values)
  }

  async function saveEdit(id: string) {
    const err = await onUpdate(id, editName, editValues)
    if (!err) setEditingId(null)
    else alert(err)
  }

  async function handleDelete(id: string, display: string) {
    if (!confirm(`Remove "${display}"? This can't be undone, and will fail safely if anything still references it.`)) return
    const err = await onDelete(id)
    if (err) alert(err)
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm h-fit">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-5 h-5 text-nomec-green" />
        <h3 className="font-serif text-lg text-nomec-slate">{title}</h3>
      </div>
      <div className="space-y-2 mb-3">
        <input
          list={listId}
          placeholder={placeholder}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-nomec-slate/15 rounded-lg text-sm"
        />
        <datalist id={listId}>
          {nameSuggestions.map((s) => <option key={s} value={s} />)}
        </datalist>

        {fields.map((f) => (
          <div key={f.key}>
            <input
              list={`${listId}-${f.key}`}
              placeholder={f.placeholder}
              value={extra[f.key] || ""}
              onChange={(e) => setExtra((prev) => ({ ...prev, [f.key]: e.target.value }))}
              className="w-full px-3 py-2 border border-nomec-slate/15 rounded-lg text-sm"
            />
            <datalist id={`${listId}-${f.key}`}>
              {f.suggestions.map((s) => <option key={s} value={s} />)}
            </datalist>
          </div>
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

      <div className="pt-3 border-t border-nomec-slate/10 space-y-1 max-h-56 overflow-y-auto">
        {rows.length === 0 && <p className="text-sm text-nomec-slate/40">None added yet.</p>}
        {rows.map((row) => (
          <div key={row.id} className="py-1.5">
            {editingId === row.id ? (
              <div className="flex flex-wrap items-center gap-1.5">
                <input value={editName} onChange={(e) => setEditName(e.target.value)} className="px-2 py-1 border border-nomec-slate/15 rounded text-sm flex-1 min-w-[100px]" />
                {fields.map((f) => (
                  <input
                    key={f.key}
                    value={editValues[f.key] || ""}
                    onChange={(e) => setEditValues((prev) => ({ ...prev, [f.key]: e.target.value }))}
                    className="px-2 py-1 border border-nomec-slate/15 rounded text-sm w-28"
                  />
                ))}
                <button onClick={() => saveEdit(row.id)} className="p-1.5 text-nomec-green hover:bg-nomec-green/10 rounded"><Check className="w-3.5 h-3.5" /></button>
                <button onClick={() => setEditingId(null)} className="p-1.5 text-nomec-slate/50 hover:bg-nomec-slate/10 rounded"><X className="w-3.5 h-3.5" /></button>
              </div>
            ) : (
              <div className="flex items-center justify-between group">
                <p className="text-sm text-nomec-slate/70">{row.display}</p>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => startEdit(row)} className="p-1.5 text-nomec-slate/50 hover:bg-nomec-slate/10 rounded"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(row.id, row.display)} className="p-1.5 text-nomec-coral hover:bg-nomec-coral/10 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            )}
          </div>
        ))}
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

function RegisterSubjectsCard({
  classes, terms, onDone,
}: {
  classes: ClassRow[]
  terms: TermRow[]
  onDone: (msg: string) => void
}) {
  const [classId, setClassId] = useState("")
  const [termId, setTermId] = useState("")
  const [working, setWorking] = useState(false)
  const [error, setError] = useState("")

  async function handleRegister() {
    setError("")
    if (!classId || !termId) { setError("Pick a class and a term."); return }
    setWorking(true)

    const [studentsRes, subjectsRes] = await Promise.all([
      supabase.from("students").select("id").eq("class_id", classId),
      supabase.from("teacher_classes").select("subject_id").eq("class_id", classId),
    ])

    const students = studentsRes.data || []
    const subjectIds = Array.from(new Set((subjectsRes.data || []).map((r) => r.subject_id)))

    if (students.length === 0) {
      setError("No students are in this class yet.")
      setWorking(false)
      return
    }
    if (subjectIds.length === 0) {
      setError("This class has no subjects assigned yet — assign a teacher to a subject for this class first.")
      setWorking(false)
      return
    }

    const rows = students.flatMap((s) =>
      subjectIds.map((subject_id) => ({
        student_id: s.id, subject_id, term_id: termId, ca_score: 0, exam_score: 0,
      }))
    )

    // ignoreDuplicates so any grade a teacher already entered is left untouched --
    // this only fills in the gaps, never overwrites real scores.
    const { error } = await supabase.from("grades").upsert(rows, {
      onConflict: "student_id,subject_id,term_id",
      ignoreDuplicates: true,
    })

    setWorking(false)
    if (error) setError(error.message)
    else onDone(`Registered ${students.length} student(s) across ${subjectIds.length} subject(s)`)
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm h-fit lg:col-span-2">
      <div className="flex items-center gap-2 mb-4">
        <ClipboardList className="w-5 h-5 text-nomec-green" />
        <h3 className="font-serif text-lg text-nomec-slate">Register Students for Subjects</h3>
      </div>
      <p className="text-sm text-nomec-slate/60 mb-4">
        Creates a 0.00 placeholder grade for every student in the class, for every subject already assigned to that class — so their dashboard shows real subjects to be graded instead of nothing, before any scores are entered.
      </p>
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label className="text-xs text-nomec-slate/50 block mb-1.5">Class</label>
          <select value={classId} onChange={(e) => setClassId(e.target.value)} className="px-3 py-2 border border-nomec-slate/15 rounded-lg text-sm min-w-[160px]">
            <option value="">Select class</option>
            {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-nomec-slate/50 block mb-1.5">Term</label>
          <select value={termId} onChange={(e) => setTermId(e.target.value)} className="px-3 py-2 border border-nomec-slate/15 rounded-lg text-sm min-w-[160px]">
            <option value="">Select term</option>
            {terms.map((t) => <option key={t.id} value={t.id}>{t.name} {t.academic_year}</option>)}
          </select>
        </div>
        <button
          onClick={handleRegister}
          disabled={working}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-nomec-green text-white rounded-lg text-sm font-medium hover:bg-nomec-green-light transition-colors disabled:opacity-60"
        >
          {working ? "Registering..." : "Register"}
        </button>
      </div>
      {error && <p className="text-xs text-red-600 mt-2 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {error}</p>}
    </div>
  )
}

