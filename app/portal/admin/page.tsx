"use client"

import { useEffect, useState, useCallback } from "react"
import { Search, Plus, Wallet, LogOut, X, CheckCircle2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/components/auth-provider"
import { PortalGuard } from "@/components/portal-guard"

interface FeeRow {
  id: string
  amount_due: number
  amount_paid: number
  due_date: string | null
  students: { id: string; full_name: string; admission_number: string } | null
  terms: { id: string; name: string; academic_year: string } | null
}

interface StudentOption {
  id: string
  full_name: string
  admission_number: string
}

interface TermOption {
  id: string
  name: string
  academic_year: string
}

function AdminPortalContent() {
  const { profile, signOut } = useAuth()
  const [fees, setFees] = useState<FeeRow[]>([])
  const [students, setStudents] = useState<StudentOption[]>([])
  const [terms, setTerms] = useState<TermOption[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [showAddFee, setShowAddFee] = useState(false)
  const [payingFee, setPayingFee] = useState<FeeRow | null>(null)
  const [toast, setToast] = useState("")

  const loadFees = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from("fees")
      .select("id, amount_due, amount_paid, due_date, students(id, full_name, admission_number), terms(id, name, academic_year)")
      .order("due_date", { ascending: true })
    setFees((data as any) || [])
    setLoading(false)
  }, [])

  useEffect(() => {
    loadFees()
    supabase.from("students").select("id, full_name, admission_number").then(({ data }) => setStudents(data || []))
    supabase.from("terms").select("id, name, academic_year").then(({ data }) => setTerms(data || []))
  }, [loadFees])

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(""), 3000)
  }

  const filtered = fees.filter((f) =>
    f.students?.full_name.toLowerCase().includes(search.toLowerCase()) ||
    f.students?.admission_number.toLowerCase().includes(search.toLowerCase())
  )

  const totalDue = filtered.reduce((sum, f) => sum + Number(f.amount_due), 0)
  const totalPaid = filtered.reduce((sum, f) => sum + Number(f.amount_paid), 0)

  return (
    <section className="min-h-screen bg-nomec-cream pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-2xl text-nomec-slate">Bursary</h1>
            <p className="text-sm text-nomec-slate/60">Signed in as {profile?.full_name}</p>
          </div>
          <button
            onClick={signOut}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-nomec-slate/20 rounded-lg hover:bg-white transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>

        {/* Summary */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5">
            <p className="text-xs text-nomec-slate/50 mb-1">Total Due</p>
            <p className="text-2xl font-serif text-nomec-slate">₦{totalDue.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl p-5">
            <p className="text-xs text-nomec-slate/50 mb-1">Total Collected</p>
            <p className="text-2xl font-serif text-nomec-green">₦{totalPaid.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl p-5">
            <p className="text-xs text-nomec-slate/50 mb-1">Outstanding</p>
            <p className="text-2xl font-serif text-nomec-coral">₦{(totalDue - totalPaid).toLocaleString()}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-nomec-slate/40" />
            <input
              placeholder="Search by name or admission no."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-nomec-slate/15 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-nomec-green/30 bg-white"
            />
          </div>
          <button
            onClick={() => setShowAddFee(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-nomec-green text-white rounded-lg text-sm font-medium hover:bg-nomec-green-light transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Fee Record
          </button>
        </div>

        {/* Fee table */}
        <div className="bg-white rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-nomec-slate/10 text-left text-nomec-slate/50">
                <th className="px-5 py-3 font-medium">Student</th>
                <th className="px-5 py-3 font-medium">Term</th>
                <th className="px-5 py-3 font-medium">Due</th>
                <th className="px-5 py-3 font-medium">Paid</th>
                <th className="px-5 py-3 font-medium">Balance</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-nomec-slate/40">Loading...</td></tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-nomec-slate/40">No fee records yet.</td></tr>
              )}
              {filtered.map((fee) => {
                const balance = Number(fee.amount_due) - Number(fee.amount_paid)
                return (
                  <tr key={fee.id} className="border-b border-nomec-slate/5 last:border-0">
                    <td className="px-5 py-3">
                      <p className="text-nomec-slate">{fee.students?.full_name}</p>
                      <p className="text-xs text-nomec-slate/40">{fee.students?.admission_number}</p>
                    </td>
                    <td className="px-5 py-3 text-nomec-slate/70">{fee.terms?.name} {fee.terms?.academic_year}</td>
                    <td className="px-5 py-3 text-nomec-slate/70">₦{Number(fee.amount_due).toLocaleString()}</td>
                    <td className="px-5 py-3 text-nomec-slate/70">₦{Number(fee.amount_paid).toLocaleString()}</td>
                    <td className={`px-5 py-3 font-medium ${balance > 0 ? "text-nomec-coral" : "text-nomec-green"}`}>
                      {balance > 0 ? `₦${balance.toLocaleString()}` : "Cleared"}
                    </td>
                    <td className="px-5 py-3 text-right">
                      {balance > 0 && (
                        <button
                          onClick={() => setPayingFee(fee)}
                          className="text-xs px-3 py-1.5 bg-nomec-gold/15 text-nomec-slate rounded-lg hover:bg-nomec-gold/25 transition-colors"
                        >
                          Record Payment
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showAddFee && (
        <AddFeeModal
          students={students}
          terms={terms}
          onClose={() => setShowAddFee(false)}
          onSaved={() => { setShowAddFee(false); loadFees(); showToast("Fee record added") }}
        />
      )}
      {payingFee && (
        <RecordPaymentModal
          fee={payingFee}
          recordedBy={profile?.id || null}
          onClose={() => setPayingFee(null)}
          onSaved={() => { setPayingFee(null); loadFees(); showToast("Payment recorded") }}
        />
      )}
      {toast && (
        <div className="fixed bottom-6 right-6 flex items-center gap-2 bg-nomec-slate text-white px-4 py-3 rounded-xl shadow-lg text-sm">
          <CheckCircle2 className="w-4 h-4 text-nomec-green" /> {toast}
        </div>
      )}
    </section>
  )
}

function AddFeeModal({
  students, terms, onClose, onSaved,
}: {
  students: StudentOption[]
  terms: TermOption[]
  onClose: () => void
  onSaved: () => void
}) {
  const [studentId, setStudentId] = useState("")
  const [termId, setTermId] = useState("")
  const [amount, setAmount] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (!studentId || !termId || !amount) {
      setError("Student, term, and amount are required.")
      return
    }
    setSaving(true)
    const { error } = await supabase.from("fees").insert({
      student_id: studentId,
      term_id: termId,
      amount_due: Number(amount),
      due_date: dueDate || null,
    })
    setSaving(false)
    if (error) setError(error.message)
    else onSaved()
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-serif text-lg text-nomec-slate">Add Fee Record</h3>
          <button onClick={onClose}><X className="w-5 h-5 text-nomec-slate/40" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <select value={studentId} onChange={(e) => setStudentId(e.target.value)} className="w-full px-3 py-2.5 border border-nomec-slate/15 rounded-lg text-sm">
            <option value="">Select student</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>{s.full_name} ({s.admission_number})</option>
            ))}
          </select>
          <select value={termId} onChange={(e) => setTermId(e.target.value)} className="w-full px-3 py-2.5 border border-nomec-slate/15 rounded-lg text-sm">
            <option value="">Select term</option>
            {terms.map((t) => (
              <option key={t.id} value={t.id}>{t.name} {t.academic_year}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Amount due (₦)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2.5 border border-nomec-slate/15 rounded-lg text-sm"
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-3 py-2.5 border border-nomec-slate/15 rounded-lg text-sm"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={saving}
            className="w-full py-2.5 bg-nomec-green text-white rounded-lg text-sm font-medium hover:bg-nomec-green-light transition-colors disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Fee Record"}
          </button>
        </form>
      </div>
    </div>
  )
}

function RecordPaymentModal({
  fee, recordedBy, onClose, onSaved,
}: {
  fee: FeeRow
  recordedBy: string | null
  onClose: () => void
  onSaved: () => void
}) {
  const balance = Number(fee.amount_due) - Number(fee.amount_paid)
  const [amount, setAmount] = useState(String(balance))
  const [method, setMethod] = useState("Cash")
  const [reference, setReference] = useState("")
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (!amount || Number(amount) <= 0) {
      setError("Enter a valid amount.")
      return
    }
    setSaving(true)
    const { error } = await supabase.from("fee_payments").insert({
      fee_id: fee.id,
      amount: Number(amount),
      method,
      reference: reference || null,
      recorded_by: recordedBy,
    })
    setSaving(false)
    if (error) setError(error.message)
    else onSaved()
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-serif text-lg text-nomec-slate">Record Payment</h3>
          <button onClick={onClose}><X className="w-5 h-5 text-nomec-slate/40" /></button>
        </div>
        <p className="text-sm text-nomec-slate/60 mb-5">
          {fee.students?.full_name} — balance ₦{balance.toLocaleString()}
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="number"
            placeholder="Amount (₦)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2.5 border border-nomec-slate/15 rounded-lg text-sm"
          />
          <select value={method} onChange={(e) => setMethod(e.target.value)} className="w-full px-3 py-2.5 border border-nomec-slate/15 rounded-lg text-sm">
            <option>Cash</option>
            <option>Bank Transfer</option>
            <option>POS</option>
            <option>Paystack</option>
          </select>
          <input
            placeholder="Reference / receipt no. (optional)"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            className="w-full px-3 py-2.5 border border-nomec-slate/15 rounded-lg text-sm"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={saving}
            className="w-full py-2.5 bg-nomec-green text-white rounded-lg text-sm font-medium hover:bg-nomec-green-light transition-colors disabled:opacity-60"
          >
            <Wallet className="w-4 h-4 inline mr-2" />
            {saving ? "Saving..." : "Confirm Payment"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function AdminPortalPage() {
  return (
    <PortalGuard allow={["admin"]}>
      <AdminPortalContent />
    </PortalGuard>
  )
}
