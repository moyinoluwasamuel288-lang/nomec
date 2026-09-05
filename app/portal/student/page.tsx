"use client"

import { motion } from "framer-motion"
import { BookOpen, Calendar, FileText, TrendingUp, Bell, User, LogOut, Award, Clock } from "lucide-react"
import { useState } from "react"

export default function StudentPortal() {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="min-h-screen bg-nomec-cream pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-serif text-nomec-slate">Student Portal</h1>
          <p className="text-nomec-slate/60">Welcome back, Master Eghosa</p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-4 shadow-sm space-y-2">
              {[
                { id: "dashboard", icon: TrendingUp, label: "Dashboard" },
                { id: "results", icon: FileText, label: "Results" },
                { id: "timetable", icon: Calendar, label: "Timetable" },
                { id: "assignments", icon: BookOpen, label: "Assignments" },
                { id: "notifications", icon: Bell, label: "Notifications" },
                { id: "profile", icon: User, label: "Profile" },
              ].map((item) => (
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
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            {activeTab === "dashboard" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    { label: "Current GPA", value: "4.85", icon: Award, color: "text-nomec-gold" },
                    { label: "Attendance", value: "96%", icon: Clock, color: "text-nomec-green" },
                    { label: "Pending Tasks", value: "3", icon: BookOpen, color: "text-nomec-coral" },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-white rounded-2xl p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-nomec-slate/60">{stat.label}</span>
                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                      </div>
                      <p className="text-3xl font-serif font-bold text-nomec-slate">{stat.value}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="font-serif text-lg text-nomec-slate mb-4">Recent Results</h3>
                  <div className="space-y-3">
                    {[
                      { subject: "Mathematics", score: 92, grade: "A1" },
                      { subject: "English Language", score: 88, grade: "A2" },
                      { subject: "Physics", score: 85, grade: "A2" },
                      { subject: "Chemistry", score: 90, grade: "A1" },
                    ].map((result) => (
                      <div key={result.subject} className="flex items-center justify-between p-3 bg-nomec-cream rounded-xl">
                        <span className="text-sm font-medium text-nomec-slate">{result.subject}</span>
                        <div className="flex items-center gap-4">
                          <div className="w-32 h-2 bg-white rounded-full overflow-hidden">
                            <div className="h-full bg-nomec-green rounded-full" style={{ width: `${result.score}%` }} />
                          </div>
                          <span className="text-sm font-bold text-nomec-green">{result.grade}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "results" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-serif text-lg text-nomec-slate mb-4">Terminal Results - Third Term 2024</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-nomec-green/10">
                        <th className="text-left py-3 text-sm font-medium text-nomec-slate/60">Subject</th>
                        <th className="text-center py-3 text-sm font-medium text-nomec-slate/60">CA</th>
                        <th className="text-center py-3 text-sm font-medium text-nomec-slate/60">Exam</th>
                        <th className="text-center py-3 text-sm font-medium text-nomec-slate/60">Total</th>
                        <th className="text-center py-3 text-sm font-medium text-nomec-slate/60">Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { subject: "Mathematics", ca: 40, exam: 52, total: 92, grade: "A1" },
                        { subject: "English", ca: 38, exam: 50, total: 88, grade: "A2" },
                        { subject: "Physics", ca: 35, exam: 50, total: 85, grade: "A2" },
                        { subject: "Chemistry", ca: 40, exam: 50, total: 90, grade: "A1" },
                        { subject: "Biology", ca: 36, exam: 48, total: 84, grade: "A2" },
                      ].map((row) => (
                        <tr key={row.subject} className="border-b border-nomec-green/5">
                          <td className="py-3 text-sm text-nomec-slate">{row.subject}</td>
                          <td className="py-3 text-sm text-center text-nomec-slate/70">{row.ca}</td>
                          <td className="py-3 text-sm text-center text-nomec-slate/70">{row.exam}</td>
                          <td className="py-3 text-sm text-center font-medium text-nomec-slate">{row.total}</td>
                          <td className="py-3 text-sm text-center font-bold text-nomec-green">{row.grade}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab !== "dashboard" && activeTab !== "results" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl p-12 shadow-sm text-center">
                <div className="w-16 h-16 bg-nomec-cream rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-nomec-green/40" />
                </div>
                <h3 className="font-serif text-lg text-nomec-slate mb-2">Coming Soon</h3>
                <p className="text-sm text-nomec-slate/60">This feature is currently under development.</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
