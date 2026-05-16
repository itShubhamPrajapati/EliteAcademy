'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, CheckCircle2 } from 'lucide-react'
import { submitLead, LeadFormValues } from '@/actions/leads'
import { Button } from '@/components/ui/Button'
import { Input, Select } from '@/components/ui/Input'

interface LeadModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function LeadModal({ isOpen, onClose }: LeadModalProps) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const data: LeadFormValues = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      grade: formData.get('grade') as string,
    }

    const res = await submitLead(data)
    if (res.success) {
      setSuccess(true)
      setTimeout(() => {
        onClose()
        setSuccess(false)
      }, 3000)
    } else {
      setError(res.error || 'Something went wrong')
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
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-2xl p-8 shadow-2xl"
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
                <h2 className="text-2xl font-bold text-white">Application Sent!</h2>
                <p className="text-white/60">Our academic counselor will call you within 24 hours.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-white">Apply Now</h2>
                  <p className="text-white/50 mt-2">Take the first step towards academic excellence.</p>
                </div>

                {error && (
                  <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-sm font-medium">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-white/40">Student Name</label>
                    <Input name="name" required placeholder="Enter full name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-white/40">Phone Number</label>
                    <Input name="phone" type="tel" required placeholder="+91 XXXXX XXXXX" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-white/40">Target Grade</label>
                    <Select name="grade" required>
                      <option value="">Select Grade</option>
                      <option value="9th">9th Standard (SSC)</option>
                      <option value="10th">10th Standard (SSC)</option>
                    </Select>
                  </div>

                  <Button disabled={loading} type="submit" className="w-full h-14 text-lg gap-2">
                    {loading ? 'Submitting...' : (
                      <>Submit Application <Send size={18} /></>
                    )}
                  </Button>
                </form>

                <p className="text-[10px] text-center text-white/30 uppercase tracking-widest">
                  By submitting, you agree to our privacy policy
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
