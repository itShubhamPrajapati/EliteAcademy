'use client'

import { useState, useOptimistic, useTransition } from 'react'
import { submitBulkAttendance, AttendanceInput } from '@/actions/admin/attendance'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, Clock, Save, Calendar } from 'lucide-react'
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
  const [isPending, startTransition] = useTransition()

  const currentStudents = students.filter(s => s.batchId === selectedBatch)

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
      <Card>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-white/40">Batch</label>
            <Select value={selectedBatch} onChange={e => setSelectedBatch(e.target.value)}>
              {batches.map(b => <option key={b.id} value={b.id}>Class {b.grade}</option>)}
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-white/40">Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
              <Input type="date" value={date} onChange={e => setDate(e.target.value)} className="pl-9" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feedback */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`p-4 rounded-xl text-sm font-medium border ${
              feedback.type === 'success'
                ? 'bg-success/10 text-success border-success/20'
                : 'bg-destructive/10 text-destructive border-destructive/20'
            }`}
          >
            {feedback.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 border-b border-white/10 pb-4">
          <CardTitle>Daily Grid — {currentStudents.length} students</CardTitle>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => markAll('PRESENT')} className="text-success text-xs bg-success/10 hover:bg-success/20 rounded-full px-4">
              ✓ All Present
            </Button>
            <Button size="sm" variant="ghost" onClick={() => markAll('ABSENT')} className="text-destructive text-xs bg-destructive/10 hover:bg-destructive/20 rounded-full px-4">
              ✗ All Absent
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          {currentStudents.length === 0 ? (
            <p className="text-white/30 text-center py-12 text-sm">No students in this batch.</p>
          ) : (
            <div className="space-y-3">
              {currentStudents.map(student => {
                const currentStatus = optimisticRecords[student.id]?.status || 'PRESENT'
                return (
                  <motion.div
                    key={student.id}
                    layout
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white shrink-0">
                        {student.name.charAt(0)}
                      </div>
                      <span className="font-semibold text-sm text-white">{student.name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {[
                        { status: 'PRESENT', icon: Check, activeClass: 'bg-success text-white shadow-[0_0_12px_rgba(50,215,75,0.4)]', inactiveClass: 'border border-white/10 text-white/30 hover:bg-success/10 hover:text-success' },
                        { status: 'ABSENT', icon: X, activeClass: 'bg-destructive text-white shadow-[0_0_12px_rgba(255,69,58,0.4)]', inactiveClass: 'border border-white/10 text-white/30 hover:bg-destructive/10 hover:text-destructive' },
                        { status: 'LATE', icon: Clock, activeClass: 'bg-warning text-white shadow-[0_0_12px_rgba(255,159,10,0.4)]', inactiveClass: 'border border-white/10 text-white/30 hover:bg-warning/10 hover:text-warning' },
                      ].map(({ status, icon: Icon, activeClass, inactiveClass }) => (
                        <motion.button
                          key={status}
                          whileTap={{ scale: 0.85 }}
                          onClick={() => handleStatusChange(student.id, status as any)}
                          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-150 ${
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
                      className="w-full sm:w-44 text-xs h-9"
                    />
                  </motion.div>
                )
              })}

              <div className="flex justify-end pt-4">
                <Button onClick={handleSubmit} disabled={isPending} className="gap-2 px-8">
                  <Save size={16} />
                  {isPending ? 'Saving…' : 'Save Attendance'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
