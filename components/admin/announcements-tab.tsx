"use client"

import { useEffect, useState, useCallback } from "react"
import { Megaphone, Plus, Trash2, CheckCircle2, AlertCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface ClassOption { id: string; name: string }
interface AnnouncementRow {
  id: string
  title: string
  body: string
  audience: string
  class_id: string | null
  created_at: string
  classes: { name: string } | null
}

const audiences = [
  { value: "all", label: "Everyone" },
  { value: "students", label: "All Students" },
  { value: "parents", label: "All Parents" },
  { value: "teachers", label: "All Teachers" },
  { value: "class", label: "One Class" },
]

export function AnnouncementsTab() {
  const [announcements, setAnnouncements] = useState<AnnouncementRow[]>([])
  const [classes, setClasses] = useState<ClassOption[]>([])
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [audience, setAudience] = useState("all")
  const [classId, setClassId] = useState("")
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState("")

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("announcements")
      .select("id, title, body, audience, class_id, created_at, classes(name)")
      .order("created_at", { ascending: false })
    setAnnouncements((data as any) || [])
  }, [])

  useEffect(() => {
    load()
    supabase.from("classes").select("id, name").then(({ data }) => setClasses(data || []))
  }, [load])

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(""), 3000)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (!title || !body) { setError("Title and message are required."); return }
    if (audience === "class" && !classId) { setError("Pick which class this is for."); return }
    setSaving(true)
    const { error } = await supabase.from("announcements").insert({
      title, body, audience, class_id: audience === "class" ? classId : null,
    })
    setSaving(false)
    if (error) setError(error.message)
    else { setTitle(""); setBody(""); setAudience("all"); setClassId(""); load(); showToast("Announcement posted") }
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this announcement?")) return
    await supabase.from("announcements").delete().eq("id", id)
    load()
    showToast("Announcement removed")
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm h-fit">
        <div className="flex items-center gap-2 mb-5">
          <Megaphone className="w-5 h-5 text-nomec-green" />
          <h3 className="font-serif text-lg text-nomec-slate">Post an Announcement</h3>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-nomec-slate/50 block mb-1.5">Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2.5 border border-nomec-slate/15 rounded-lg text-sm" />
          </div>
          <div>
            <label className="text-xs text-nomec-slate/50 block mb-1.5">Message</label>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4} className="w-full px-3 py-2.5 border border-nomec-slate/15 rounded-lg text-sm" />
          </div>
          <div>
            <label className="text-xs text-nomec-slate/50 block mb-1.5">Audience</label>
            <select value={audience} onChange={(e) => setAudience(e.target.value)} className="w-full px-3 py-2.5 border border-nomec-slate/15 rounded-lg text-sm">
              {audiences.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
            </select>
          </div>
          {audience === "class" && (
            <div>
              <label className="text-xs text-nomec-slate/50 block mb-1.5">Which Class</label>
              <select value={classId} onChange={(e) => setClassId(e.target.value)} className="w-full px-3 py-2.5 border border-nomec-slate/15 rounded-lg text-sm">
                <option value="">Select class</option>
                {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          )}
          {error && (
            <p className="text-sm text-red-600 flex items-center gap-1.5"><AlertCircle className="w-4 h-4" /> {error}</p>
          )}
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-nomec-green text-white rounded-lg text-sm font-medium hover:bg-nomec-green-light transition-colors disabled:opacity-60"
          >
            <Plus className="w-4 h-4" /> {saving ? "Posting..." : "Post Announcement"}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm h-fit">
        <h3 className="font-serif text-lg text-nomec-slate mb-4">Recent Announcements</h3>
        <div className="space-y-3 max-h-[500px] overflow-y-auto">
          {announcements.length === 0 && <p className="text-sm text-nomec-slate/40">Nothing posted yet.</p>}
          {announcements.map((a) => (
            <div key={a.id} className="p-3 bg-nomec-cream rounded-xl">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-nomec-slate">{a.title}</p>
                  <p className="text-xs text-nomec-slate/50 capitalize mt-0.5">
                    {a.audience === "class" ? `Class: ${a.classes?.name}` : a.audience}
                    {" · "}{new Date(a.created_at).toLocaleDateString()}
                  </p>
                </div>
                <button onClick={() => handleDelete(a.id)} className="p-1.5 text-nomec-coral hover:bg-nomec-coral/10 rounded shrink-0">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-sm text-nomec-slate/60 mt-2">{a.body}</p>
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
