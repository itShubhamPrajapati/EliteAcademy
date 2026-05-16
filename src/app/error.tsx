'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, RotateCcw } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        <div className="w-20 h-20 rounded-3xl bg-destructive/10 border border-destructive/20 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={36} className="text-destructive" />
        </div>
        <h1 className="text-2xl font-extrabold text-white mb-3">Something went wrong</h1>
        <p className="text-white/40 mb-8 leading-relaxed">
          {error.message || 'An unexpected error occurred. Please try again.'}
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-semibold px-6 py-3 rounded-xl transition-all"
        >
          <RotateCcw size={16} /> Try Again
        </button>
      </motion.div>
    </div>
  )
}
