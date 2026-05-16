'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Phone, Calendar, BookOpen, TrendingUp, MessageSquare, ShieldCheck, Clock, Download, Users } from 'lucide-react'
import { getUser360Data } from '@/actions/admin/accounts'
import { Card, CardContent } from '@/components/ui/Card'
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'

export default function UserSlideOver({ userId, onClose }: { userId: string | null, onClose: () => void }) {
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (userId) {
      setLoading(true)
      getUser360Data(userId).then(res => {
        if (res.success) setUserData(res.data)
        setLoading(false)
      })
    }
  }, [userId])

  return (
    <AnimatePresence>
      {userId && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 z-[70] w-full max-w-xl bg-black/80 backdrop-blur-3xl border-l border-white/10 shadow-[-32px_0_64px_rgba(0,0,0,0.5)] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-xl font-bold text-primary">
                  {userData?.name?.charAt(0) || '?'}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">{userData?.name || 'Loading...'}</h2>
                  <p className="text-xs text-white/40 font-semibold uppercase tracking-widest">{userData?.role || 'User Profile'}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 text-white/40 hover:text-white transition-all">
                <X size={20} />
              </button>
            </div>

            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="text-white/20 text-sm font-medium">Assembling 360° Insight...</p>
              </div>
            ) : userData && (
              <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Attendance</p>
                    <p className="text-2xl font-black text-success">92%</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Avg. Score</p>
                    <p className="text-2xl font-black text-primary">84.5</p>
                  </div>
                </div>

                {/* Profile Details */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Contact & Links</h3>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                      <Mail size={16} className="text-white/30" />
                      <span className="text-sm text-white/70">{userData.email}</span>
                    </div>
                    {userData.role === 'STUDENT' && (
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                        <Users size={16} className="text-white/30" />
                        <span className="text-sm text-white/70">Linked Parent: <span className="text-white font-bold">{userData.parent?.name || 'Not Linked'}</span></span>
                      </div>
                    )}
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                      <BookOpen size={16} className="text-white/30" />
                      <span className="text-sm text-white/70">Batch: <span className="text-white font-bold">Class {userData.batch?.grade || 'N/A'}</span></span>
                    </div>
                  </div>
                </div>

                {/* Test Performance Chart */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Test Performance</h3>
                    <TrendingUp size={14} className="text-primary" />
                  </div>
                  <div className="h-48 w-full bg-white/[0.02] border border-white/5 rounded-2xl p-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={userData.testScores?.map((s: any) => ({ val: (s.score/s.maxScore)*100 })) || []}>
                        <XAxis hide />
                        <YAxis hide domain={[0, 100]} />
                        <Tooltip 
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-black/80 backdrop-blur-xl border border-white/10 p-2 rounded-lg shadow-2xl">
                                  <p className="text-xs font-bold text-white">{payload[0].value?.toString()}%</p>
                                </div>
                              )
                            }
                            return null
                          }}
                        />
                        <Line type="monotone" dataKey="val" stroke="#0A84FF" strokeWidth={3} dot={{ fill: '#0A84FF', strokeWidth: 2, r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Recent Logs */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Recent Activity Logs</h3>
                  <div className="space-y-2">
                    {userData.attendance?.slice(0, 3).map((a: any, i: number) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                        <div className="flex items-center gap-3">
                          <Clock size={14} className="text-white/20" />
                          <span className="text-xs text-white/60">{new Date(a.date).toLocaleDateString()}</span>
                        </div>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${a.status === 'PRESENT' ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'}`}>
                          {a.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 grid grid-cols-2 gap-4">
                  <button className="flex items-center justify-center gap-2 h-12 rounded-2xl bg-primary text-white font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(10,132,255,0.3)]">
                    <MessageSquare size={18} /> Message
                  </button>
                  <button className="flex items-center justify-center gap-2 h-12 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-all">
                    <Download size={18} /> Report Card
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
