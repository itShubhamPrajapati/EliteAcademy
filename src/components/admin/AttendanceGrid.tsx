'use client'

import { useState, useOptimistic, useTransition, useEffect } from 'react'
import { submitBulkAttendance, AttendanceInput } from '@/actions/admin/attendance'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, Clock, Save, Calendar, Search } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input, Select } from '@/components/ui/Input'

type Student = { id: string; name: string; batchId: string | null }
type AttendanceMap = Record<string, AttendanceInput>

export default function AttendanceGrid({
  batches,
  students,
}: {
  batches: { id: string; grade: string }[]
  students: Student[]
}) {
  const router = useRouter()
  const [selectedBatch, setSelectedBatch] = useState(batches[0]?.id || '')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [searchQuery, setSearchQuery] = useState('')
  const [isPending, startTransition] = useTransition()

  // Filter students based on selected batch AND student name search query
  const currentStudents = students.filter(s => 
    s.batchId === selectedBatch &&
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getDefaultRecords = () => {
    const map: AttendanceMap = {}
    currentStudents.forEach(s => {
      map[s.id] = { studentId: s.id, status: 'PRESENT', remarks: '' }
    })
    return map
  }

  const [records, setRecords] = useState<AttendanceMap>(getDefaultRecords)
  const [optimisticRecords, updateOptimistic] = useOptimistic(
    records,
    (_state, updated: AttendanceMap) => updated
  )
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  // Reset records map when changing batches
  useEffect(() => {
    setRecords(getDefaultRecords())
  }, [selectedBatch])

  const handleStatusChange = (studentId: string, status: 'PRESENT' | 'ABSENT' | 'LATE') => {
    const newRecords = {
      ...records,
      [studentId]: { ...records[studentId], studentId, status, remarks: records[studentId]?.remarks || '' },
    }
    startTransition(() => {
      updateOptimistic(newRecords)
      setRecords(newRecords)
    })
  }

  const handleRemarksChange = (studentId: string, remarks: string) => {
    setRecords(prev => ({
      ...prev,
      [studentId]: { studentId, status: prev[studentId]?.status || 'PRESENT', remarks },
    }))
  }

  const markAll = (status: 'PRESENT' | 'ABSENT') => {
    const newRecords: AttendanceMap = {}
    currentStudents.forEach(s => {
      newRecords[s.id] = { studentId: s.id, status, remarks: records[s.id]?.remarks || '' }
    })
    startTransition(() => {
      updateOptimistic(newRecords)
      setRecords(newRecords)
    })
  }

  const handleSubmit = async () => {
    const payload = currentStudents.map(
      s => optimisticRecords[s.id] || { studentId: s.id, status: 'PRESENT', remarks: '' }
    )

    startTransition(async () => {
      const res = await submitBulkAttendance(new Date(date), payload)
      if (res.success) {
        setFeedback({ type: 'success', message: 'Attendance saved and notifications sent!' })
        router.refresh()
      } else {
        setFeedback({ type: 'error', message: res.error || 'Failed to save attendance' })
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="border-white/5 bg-white/[0.01]">
        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/30">Select Grade Batch</label>
            <Select value={selectedBatch} onChange={e => setSelectedBatch(e.target.value)} className="bg-white/5 border-white/10 select-custom-arrow">
              {batches.map(b => <option key={b.id} value={b.id} className="bg-black">Class {b.grade}</option>)}
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/30">Target Calendar Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
              <Input type="date" value={date} onChange={e => setDate(e.target.value)} className="pl-9 bg-white/5 border-white/10" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/30">Search Students</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
              <Input 
                type="text" 
                placeholder="Type student name..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9 bg-white/5 border-white/10 text-white placeholder-white/20" 
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feedback Alert */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`p-4 rounded-xl text-sm font-semibold border ${
              feedback.type === 'success'
                ? 'bg-success/10 text-success border-success/20'
                : 'bg-destructive/10 text-destructive border-destructive/20'
            }`}
          >
            {feedback.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid List */}
      <Card className="border-white/5 bg-white/[0.01]">
        <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 border-b border-white/10 pb-4">
          <CardTitle className="text-lg font-bold text-white">Daily Grid — {currentStudents.length} Students</CardTitle>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => markAll('PRESENT')} className="text-success text-xs font-bold bg-success/10 hover:bg-success/20 rounded-full px-4 border border-success/20">
              ✓ All Present
            </Button>
            <Button size="sm" variant="ghost" onClick={() => markAll('ABSENT')} className="text-destructive text-xs font-bold bg-destructive/10 hover:bg-destructive/20 rounded-full px-4 border border-destructive/20">
              ✗ All Absent
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {currentStudents.length === 0 ? (
            <p className="text-white/20 text-center py-12 text-sm italic">No students matched the filtering criteria.</p>
          ) : (
            <div className="space-y-3">
              {currentStudents.map(student => {
                const currentStatus = optimisticRecords[student.id]?.status || 'PRESENT'
                return (
                  <motion.div
                    key={student.id}
                    layout
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-primary/20 hover:shadow-[0_0_15px_rgba(10,132,255,0.05)] transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xs font-black text-white shrink-0 shadow-inner">
                        {student.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-extrabold text-sm text-white tracking-tight">{student.name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {[
                        { status: 'PRESENT', icon: Check, activeClass: 'bg-success text-black shadow-[0_0_12px_rgba(50,215,75,0.4)]', inactiveClass: 'border border-white/5 text-white/30 hover:bg-success/10 hover:text-success' },
                        { status: 'ABSENT', icon: X, activeClass: 'bg-destructive text-white shadow-[0_0_12px_rgba(255,69,58,0.4)]', inactiveClass: 'border border-white/5 text-white/30 hover:bg-destructive/10 hover:text-destructive' },
                        { status: 'LATE', icon: Clock, activeClass: 'bg-warning text-black shadow-[0_0_12px_rgba(255,159,10,0.4)]', inactiveClass: 'border border-white/5 text-white/30 hover:bg-warning/10 hover:text-warning' },
                      ].map(({ status, icon: Icon, activeClass, inactiveClass }) => (
                        <motion.button
                          key={status}
                          whileTap={{ scale: 0.85 }}
                          onClick={() => handleStatusChange(student.id, status as any)}
                          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                            currentStatus === status ? activeClass : inactiveClass
                          }`}
                        >
                          <Icon size={16} />
                        </motion.button>
                      ))}
                    </div>

                    <Input
                      type="text"
                      placeholder="Remarks…"
                      value={optimisticRecords[student.id]?.remarks || ''}
                      onChange={e => handleRemarksChange(student.id, e.target.value)}
                      className="w-full sm:w-44 text-xs h-9 bg-white/5 border-white/10"
                    />
                  </motion.div>
                )
              })}

              <div className="flex justify-end pt-4">
                <Button onClick={handleSubmit} disabled={isPending} className="gap-2 px-8 h-12 text-sm font-black shadow-[0_0_24px_rgba(10,132,255,0.3)]">
                  <Save size={16} />
                  {isPending ? 'Saving state...' : 'Publish Session Attendance'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
