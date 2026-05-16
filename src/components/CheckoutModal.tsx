'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CreditCard, Lock, CheckCircle2, X } from 'lucide-react'
import { enrollStudent } from '@/actions/student/enroll'
import { useRouter } from 'next/navigation'

export default function CheckoutModal({ batches }: { batches: { id: string, grade: string }[] }) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedBatch, setSelectedBatch] = useState(batches[0]?.id || '')
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleEnroll = async () => {
    if (!selectedBatch) return
    setProcessing(true)
    // Simulate payment gateway delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const res = await enrollStudent(selectedBatch)
    if (res.success) {
      setSuccess(true)
      setTimeout(() => {
        setIsOpen(false)
        router.refresh()
      }, 1500)
    } else {
      setProcessing(false)
      alert(res.error)
    }
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-lg text-center">
        <Lock size={64} className="text-on-surface-variant/50" />
        <div>
          <h2 className="text-3xl font-bold text-on-surface mb-xs">Enrollment Locked</h2>
          <p className="text-on-surface-variant max-w-md mx-auto">You must enroll in a batch to access the Student Portal, Study Materials, and Mock Tests.</p>
        </div>
        <button onClick={() => setIsOpen(true)} className="btn-gradient px-2xl py-md rounded-full font-bold text-lg shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
          Enroll Now
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-md bg-background/80 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="bg-surface-container w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-outline/30 relative">
              <button onClick={() => !processing && !success && setIsOpen(false)} className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface disabled:opacity-50">
                <X size={24} />
              </button>
              
              {success ? (
                <div className="p-2xl flex flex-col items-center text-center space-y-md">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1, rotate: 360 }} transition={{ type: 'spring', damping: 15 }}>
                    <CheckCircle2 size={80} className="text-green-500" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-on-surface">Payment Successful</h3>
                  <p className="text-on-surface-variant">Welcome to EliteAcademy!</p>
                </div>
              ) : (
                <div className="p-xl space-y-xl">
                  <div className="flex items-center gap-sm border-b border-outline/50 pb-md">
                    <CreditCard className="text-primary" size={28} />
                    <h3 className="text-xl font-bold text-on-surface">Secure Checkout</h3>
                  </div>

                  <div className="space-y-sm">
                    <label className="text-sm font-semibold text-on-surface-variant">Select Your Batch</label>
                    <select value={selectedBatch} onChange={e => setSelectedBatch(e.target.value)} className="w-full bg-background border border-outline rounded-xl p-md text-on-surface focus:border-primary outline-none transition-colors">
                      {batches.map(b => (
                        <option key={b.id} value={b.id}>Class {b.grade} - Elite Batch</option>
                      ))}
                    </select>
                  </div>

                  <div className="bg-background/50 rounded-xl p-md space-y-sm">
                    <div className="flex justify-between text-on-surface-variant">
                      <span>Tuition Fee</span>
                      <span>$499.00</span>
                    </div>
                    <div className="flex justify-between text-on-surface-variant">
                      <span>Platform Fee</span>
                      <span>$0.00</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-on-surface pt-sm border-t border-outline/50">
                      <span>Total</span>
                      <span>$499.00</span>
                    </div>
                  </div>

                  <button onClick={handleEnroll} disabled={processing || !selectedBatch} className="w-full btn-gradient p-md rounded-xl font-bold text-lg flex justify-center items-center gap-sm disabled:opacity-70">
                    {processing ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full" />
                    ) : (
                      'Pay & Enroll'
                    )}
                  </button>
                  <p className="text-center text-xs text-on-surface-variant mt-sm">Secured by Stripe Simulation</p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
