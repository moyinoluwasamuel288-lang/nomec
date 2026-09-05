"use client"

import { motion } from "framer-motion"
import { Users, BookOpen, Calendar, FileText, MessageSquare, LogOut, TrendingUp, CheckCircle } from "lucide-react"
import { useState } from "react"

export default function TeacherPortal() {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <div className="min-h-screen bg-nomec-cream pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-serif text-nomec-slate">Teacher Portal</h1>
          <p className="text-nomec-slate/60">Welcome, Mr. Paul Eghosa</p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-4 shadow-sm space-y-2">
              {[
                { id: "dashboard", icon: TrendingUp, label: "Dashboard" },
                { id: "classes", icon: Users, label: "My Classes" },
                { id: "timetable", icon: Calendar, label: "Timetable" },
                { id: "results", icon: FileText, label: "Enter Results" },
                { id: "resources", icon: BookOpen, label: "Resources" },
                { id: "messages", icon: MessageSquare, label: "Messages" },
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
                    { label: "Classes Today", value: "4", icon: Calendar, color: "text-nomec-green" },
                    { label: "Students", value: "156", icon: Users, color: "text-nomec-gold" },
                    { label: "Pending Grading", value: "12", icon: FileText, color: "text-nomec-coral" },
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
                  <h3 className="font-serif text-lg text-nomec-slate mb-4">Today&apos;s Schedule</h3>
                  <div className="space-y-3">
                    {[
                      { time: "8:00 AM - 8:45 AM", subject: "Mathematics", class: "SS2 Science", room: "Lab 3" },
                      { time: "9:00 AM - 9:45 AM", subject: "Mathematics", class: "SS1 Science", room: "Class 2B" },
                      { time: "10:00 AM - 10:45 AM", subject: "Further Mathematics", class: "SS3 Science", room: "Lab 1" },
                      { time: "11:00 AM - 11:45 AM", subject: "Mathematics", class: "JSS3", room: "Class 3A" },
                    ].map((schedule, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 bg-nomec-cream rounded-xl">
                        <div className="w-24 text-xs font-medium text-nomec-green shrink-0">{schedule.time}</div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-nomec-slate">{schedule.subject}</p>
                          <p className="text-xs text-nomec-slate/50">{schedule.class} - {schedule.room}</p>
                        </div>
                        <CheckCircle className="w-5 h-5 text-nomec-green/30" />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "results" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-serif text-lg text-nomec-slate mb-4">Enter Results - SS2 Science</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-nomec-green/10">
                        <th className="text-left py-3 text-sm font-medium text-nomec-slate/60">Student</th>
                        <th className="text-center py-3 text-sm font-medium text-nomec-slate/60">CA (40)</th>
                        <th className="text-center py-3 text-sm font-medium text-nomec-slate/60">Exam (60)</th>
                        <th className="text-center py-3 text-sm font-medium text-nomec-slate/60">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: "Eghosa Junior", ca: 38, exam: 52 },
                        { name: "Igbinoba Osayuki", ca: 35, exam: 48 },
                        { name: "Omoregie Ekiuwa", ca: 40, exam: 55 },
                        { name: "Asemota Grace", ca: 32, exam: 45 },
                      ].map((student) => (
                        <tr key={student.name} className="border-b border-nomec-green/5">
                          <td className="py-3 text-sm text-nomec-slate">{student.name}</td>
                          <td className="py-3 text-center">
                            <input type="number" defaultValue={student.ca} className="w-16 text-center px-2 py-1 border border-nomec-green/20 rounded-lg text-sm" />
                          </td>
                          <td className="py-3 text-center">
                            <input type="number" defaultValue={student.exam} className="w-16 text-center px-2 py-1 border border-nomec-green/20 rounded-lg text-sm" />
                          </td>
                          <td className="py-3 text-center text-sm font-medium text-nomec-slate">{student.ca + student.exam}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-6 flex justify-end">
                  <button className="px-6 py-3 bg-nomec-green text-white rounded-xl text-sm font-medium hover:bg-nomec-green-light transition-all">
                    Save Results
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab !== "dashboard" && activeTab !== "results" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl p-12 shadow-sm text-center">
                <div className="w-16 h-16 bg-nomec-cream rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-nomec-green/40" />
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
