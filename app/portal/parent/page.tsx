"use client"

import { motion } from "framer-motion"
import { Users, CreditCard, MessageSquare, FileText, Bell, LogOut, TrendingUp, AlertCircle } from "lucide-react"
import { useState } from "react"

export default function ParentPortal() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-nomec-cream pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-serif text-nomec-slate">Parent Portal</h1>
          <p className="text-nomec-slate/60">Welcome, Mr. and Mrs. Eghosa</p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-4 shadow-sm space-y-2">
              {[
                { id: "overview", icon: TrendingUp, label: "Overview" },
                { id: "wards", icon: Users, label: "My Wards" },
                { id: "fees", icon: CreditCard, label: "Fee Payment" },
                { id: "messages", icon: MessageSquare, label: "Messages" },
                { id: "reports", icon: FileText, label: "Reports" },
                { id: "notifications", icon: Bell, label: "Notifications" },
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
            {activeTab === "overview" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    { label: "Wards Enrolled", value: "2", icon: Users, color: "text-nomec-green" },
                    { label: "Outstanding Fees", value: "N125,000", icon: CreditCard, color: "text-nomec-coral" },
                    { label: "Unread Messages", value: "4", icon: MessageSquare, color: "text-nomec-gold" },
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
                  <h3 className="font-serif text-lg text-nomec-slate mb-4">Ward Performance Summary</h3>
                  <div className="space-y-4">
                    {[
                      { name: "Master Eghosa Junior", class: "SS2 Science", gpa: "4.85", attendance: "96%" },
                      { name: "Miss Eghosa Grace", class: "JSS3", gpa: "4.72", attendance: "98%" },
                    ].map((ward) => (
                      <div key={ward.name} className="p-4 bg-nomec-cream rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-medium text-nomec-slate">{ward.name}</p>
                            <p className="text-xs text-nomec-slate/50">{ward.class}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-nomec-green">GPA: {ward.gpa}</p>
                            <p className="text-xs text-nomec-slate/50">Attendance: {ward.attendance}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "fees" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-serif text-lg text-nomec-slate mb-4">Fee Statement</h3>
                <div className="space-y-3">
                  {[
                    { item: "Third Term Tuition", amount: "N85,000", status: "Paid", date: "05/01/2024" },
                    { item: "Boarding Fee", amount: "N45,000", status: "Paid", date: "05/01/2024" },
                    { item: "Examination Fee", amount: "N15,000", status: "Outstanding", date: "-" },
                    { item: "Sports Levy", amount: "N10,000", status: "Outstanding", date: "-" },
                  ].map((fee) => (
                    <div key={fee.item} className="flex items-center justify-between p-4 bg-nomec-cream rounded-xl">
                      <div>
                        <p className="text-sm font-medium text-nomec-slate">{fee.item}</p>
                        <p className="text-xs text-nomec-slate/50">{fee.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-nomec-slate">{fee.amount}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          fee.status === "Paid" ? "bg-nomec-green/10 text-nomec-green" : "bg-red-50 text-red-500"
                        }`}>
                          {fee.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-nomec-gold/10 rounded-xl flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-nomec-gold" />
                  <p className="text-sm text-nomec-slate/70">Outstanding balance: <span className="font-bold text-nomec-slate">N25,000</span></p>
                </div>
              </motion.div>
            )}

            {activeTab !== "overview" && activeTab !== "fees" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl p-12 shadow-sm text-center">
                <div className="w-16 h-16 bg-nomec-cream rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-nomec-green/40" />
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
