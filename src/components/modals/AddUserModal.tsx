'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, UserPlus, GraduationCap, Users, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { createStudentWithParent } from '@/actions/admin/accounts'
import { Button } from '@/components/ui/Button'
import { Input, Select } from '@/components/ui/Input'

interface AddUserModalProps {
  isOpen: boolean
  onClose: () => void
  batches: { id: string; grade: string }[]
}

export default function AddUserModal({ isOpen, onClose, batches }: AddUserModalProps) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    studentName: '',
    studentEmail: '',
    batchId: '',
    parentName: '',
    parentEmail: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    const res = await createStudentWithParent(formData)
    if (res.success) {
      setSuccess(true)
      setTimeout(() => {
        onClose()
        setSuccess(false)
        setStep(1)
        setFormData({
          studentName: '',
          studentEmail: '',
          batchId: '',
          parentName: '',
          parentEmail: '',
        })
      }, 2000)
    } else {
      setError(res.error || 'Failed to create accounts')
    }
    setLoading(false)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] backdrop-blur-2xl p-8 shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute right-6 top-6 text-white/40 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            {success ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto text-success">
                  <CheckCircle2 size={40} />
                </div>
                <h2 className="text-2xl font-bold text-white">Accounts Created!</h2>
                <p className="text-white/60">Student and Parent linked successfully.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
                    <UserPlus className="text-primary" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Add New User</h2>
                    <p className="text-white/40 text-sm">Step {step} of 2</p>
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-sm font-medium">
                    {error}
                  </div>
                )}

                {/* Step indicators */}
                <div className="flex gap-2 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-500 rounded-full ${step >= 1 ? 'bg-primary w-1/2' : 'w-0'}`} />
                  <div className={`h-full transition-all duration-500 rounded-full ${step >= 2 ? 'bg-primary w-1/2' : 'w-0'}`} />
                </div>

                <div className="min-h-[300px]">
                  {step === 1 ? (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-5"
                    >
                      <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-widest">
                        <GraduationCap size={14} /> Student Details
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-white/40">Full Name</label>
                          <Input name="studentName" value={formData.studentName} onChange={handleChange} placeholder="e.g. Arjun Kumar" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-white/40">Email Address</label>
                          <Input name="studentEmail" type="email" value={formData.studentEmail} onChange={handleChange} placeholder="student@example.com" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-white/40">Assign Batch</label>
                          <Select name="batchId" value={formData.batchId} onChange={handleChange}>
                            <option value="">Select Batch</option>
                            {batches.map(b => (
                              <option key={b.id} value={b.id}>Class {b.grade}</option>
                            ))}
                          </Select>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-5"
                    >
                      <div className="flex items-center gap-2 text-warning text-xs font-bold uppercase tracking-widest">
                        <Users size={14} /> Parent Details
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-white/40">Parent Name</label>
                          <Input name="parentName" value={formData.parentName} onChange={handleChange} placeholder="e.g. Rajesh Kumar" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-white/40">Parent Email</label>
                          <Input name="parentEmail" type="email" value={formData.parentEmail} onChange={handleChange} placeholder="parent@example.com" />
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-white/40 leading-relaxed italic">
                          Default password for both accounts will be "password123". Users are encouraged to change it on first login.
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  {step === 2 && (
                    <Button variant="outline" onClick={() => setStep(1)} className="flex-1 gap-2">
                      <ArrowLeft size={16} /> Back
                    </Button>
                  )}
                  <Button 
                    disabled={loading || (step === 1 && (!formData.studentName || !formData.studentEmail || !formData.batchId))}
                    onClick={() => {
                      if (step === 1) setStep(2)
                      else handleSubmit()
                    }}
                    className="flex-1 gap-2 h-12"
                  >
                    {loading ? 'Creating...' : (
                      step === 1 ? (
                        <>Continue <ArrowRight size={16} /></>
                      ) : (
                        <>Create Accounts <CheckCircle2 size={16} /></>
                      )
                    )}
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
