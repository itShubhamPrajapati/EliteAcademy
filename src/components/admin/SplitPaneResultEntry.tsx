'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ChevronRight, User, Award, FileUp, Zap, CheckCircle2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Input, Select } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { uploadIndividualResult } from '@/actions/admin/results'
import { useRouter } from 'next/navigation'

interface Student {
  id: string
  name: string
  email: string
}

interface Batch {
  id: string
  grade: string
  users: Student[]
}

export default function SplitPaneResultEntry({ batches }: { batches: Batch[] }) {
  const [selectedBatchId, setSelectedBatchId] = useState(batches[0]?.id || '')
  const [selectedStudentId, setSelectedStudentId] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  
  const formRef = useRef<HTMLFormElement>(null)
  const scoreInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const currentBatch = batches.find(b => b.id === selectedBatchId)
  const filteredStudents = currentBatch?.users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  const handleStudentSelect = (id: string) => {
    setSelectedStudentId(id)
    setSuccess(false)
    setTimeout(() => scoreInputRef.current?.focus(), 100)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedStudentId) return

    setLoading(true)
    const formData = new FormData(e.currentTarget)
    formData.append('studentId', selectedStudentId)

    const res = await uploadIndividualResult(formData)
    setLoading(false)

    if (res.success) {
      setSuccess(true)
      router.refresh()
      
      // Auto-advance to next student
      const currentIndex = filteredStudents.findIndex(s => s.id === selectedStudentId)
      if (currentIndex < filteredStudents.length - 1) {
        setTimeout(() => {
          handleStudentSelect(filteredStudents[currentIndex + 1].id)
        }, 800)
      }
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[700px]">
      {/* LEFT PANE: Student List */}
      <Card className="lg:col-span-4 flex flex-col overflow-hidden border-white/5 bg-white/[0.01]">
        <div className="p-4 border-b border-white/10 space-y-4 bg-white/[0.02]">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Select Batch</label>
            <Select 
              value={selectedBatchId} 
              onChange={(e) => setSelectedBatchId(e.target.value)}
              className="h-10 bg-white/5"
            >
              {batches.map(b => (
                <option key={b.id} value={b.id}>Class {b.grade}</option>
              ))}
            </Select>
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
            <input 
              placeholder="Quick filter students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-primary/50 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
          {filteredStudents.length > 0 ? (
            <div className="space-y-1">
              {filteredStudents.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleStudentSelect(s.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all group ${
                    selectedStudentId === s.id 
                      ? 'bg-primary text-white shadow-[0_8px_24px_rgba(10,132,255,0.3)]' 
                      : 'text-white/40 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                      selectedStudentId === s.id ? 'bg-white/20' : 'bg-white/5 group-hover:bg-white/10'
                    }`}>
                      {s.name.charAt(0)}
                    </div>
                    <div className="text-left">
                      <p className={`text-sm font-bold ${selectedStudentId === s.id ? 'text-white' : 'text-white/80'}`}>{s.name}</p>
                      <p className={`text-[10px] ${selectedStudentId === s.id ? 'text-white/60' : 'text-white/20'}`}>{s.email}</p>
                    </div>
                  </div>
                  {selectedStudentId === s.id && <ChevronRight size={16} />}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-white/20 gap-2 italic">
              <User size={24} className="opacity-10" />
              <p className="text-xs">No students in this batch.</p>
            </div>
          )}
        </div>
      </Card>

      {/* RIGHT PANE: Entry Form */}
      <Card className="lg:col-span-8 overflow-hidden border-white/5 bg-white/[0.01]">
        <AnimatePresence mode="wait">
          {!selectedStudentId ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-full text-center space-y-4 p-8"
            >
              <div className="w-20 h-20 rounded-[32px] bg-white/[0.02] border border-white/5 flex items-center justify-center text-white/10">
                <Zap size={40} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white/40 tracking-tight">Select a student to begin</h3>
                <p className="text-sm text-white/20 mt-1 max-w-xs mx-auto">Click on a student in the left pane to start industrial-speed data entry.</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={selectedStudentId}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="h-full flex flex-col"
            >
              <div className="p-8 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-3xl bg-primary/20 border border-primary/30 flex items-center justify-center text-2xl font-black text-primary">
                    {filteredStudents.find(s => s.id === selectedStudentId)?.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold text-white tracking-tight">
                      {filteredStudents.find(s => s.id === selectedStudentId)?.name}
                    </h2>
                    <p className="text-sm text-primary font-bold uppercase tracking-widest mt-0.5">Entering Result Mode</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                  <Zap size={12} className="text-primary" /> Power Entry Active
                </div>
              </div>

              <div className="flex-1 p-8">
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/30">Test Title</label>
                    <Input 
                      name="title" 
                      required 
                      defaultValue="Algebra Weekly Test"
                      placeholder="e.g. Science Mock - Chapter 1"
                      className="h-14 text-lg font-bold bg-white/[0.03] border-white/10"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-white/30">Marks Obtained</label>
                      <Input 
                        ref={scoreInputRef}
                        name="obtainedMarks" 
                        required 
                        type="number" 
                        placeholder="0"
                        className="h-16 text-3xl font-black text-primary bg-white/[0.03] border-white/10"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-white/30">Total Marks</label>
                      <Input 
                        name="totalMarks" 
                        required 
                        type="number" 
                        defaultValue="50"
                        className="h-16 text-3xl font-black text-white/80 bg-white/[0.03] border-white/10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/30">Scan PDF (Optional)</label>
                    <div className="flex items-center gap-4 p-6 rounded-2xl border-2 border-dashed border-white/10 bg-white/[0.01] hover:bg-white/[0.03] hover:border-primary/30 transition-all cursor-pointer">
                      <FileUp size={24} className="text-white/20" />
                      <input name="file" type="file" accept=".pdf" className="text-xs text-white/40" />
                    </div>
                  </div>

                  <div className="pt-4 flex items-center gap-4">
                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="h-14 px-12 text-base font-black shadow-[0_0_30px_rgba(10,132,255,0.4)]"
                    >
                      {loading ? 'Processing...' : 'Submit & Next [Enter]'}
                    </Button>
                    
                    {success && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-2 text-success font-bold text-sm"
                      >
                        <CheckCircle2 size={20} /> Result Saved Successfully
                      </motion.div>
                    )}
                  </div>
                </form>
              </div>

              <div className="p-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-center gap-6">
                <div className="flex items-center gap-2 text-[10px] font-bold text-white/20 uppercase tracking-widest">
                  <span className="text-white/40 font-mono">Tab</span> Switch Focus
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-white/20 uppercase tracking-widest">
                  <span className="text-white/40 font-mono">Enter</span> Fast Submit
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  )
}
