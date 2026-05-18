'use client'

import { useEffect, useState } from 'react'
import { useTestStore } from '@/store/useTestStore'
import { submitTest } from '@/actions/student/test'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Clock, Award, Shield, CheckCircle } from 'lucide-react'

type MockTestProps = {
  id: string
  title: string
  durationMinutes: number
  questions: {
    id: string
    text: string
    options: { id: string, text: string }[]
  }[]
}

export default function TestEngine({ test }: { test: MockTestProps }) {
  const { answers, timeLeft, setAnswer, decrementTimer, reset, setTimeLeft } = useTestStore()
  const [submitting, setSubmitting] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0) // -1 for left, 1 for right
  const router = useRouter()

  useEffect(() => {
    // Initialize timer only once if not started
    if (timeLeft === 0) {
      setTimeLeft(test.durationMinutes * 60)
    }
    const timer = setInterval(decrementTimer, 1000)
    return () => clearInterval(timer)
  }, [decrementTimer, test.durationMinutes])

  useEffect(() => {
    if (timeLeft === 0 && !submitting && Object.keys(answers).length > 0) {
      handleSubmit()
    }
  }, [timeLeft])

  const handleSubmit = async () => {
    if (!submitting) {
      if (Object.keys(answers).length < test.questions.length) {
        if (!confirm('You have unanswered questions. Are you sure you want to submit your attempt?')) {
          return
        }
      }
      setSubmitting(true)
      try {
        const res = await submitTest(test.id, answers)
        if (res.success) {
          reset()
          router.push(`/dashboard/student/result/${res.scoreId}`)
        }
      } catch (e) {
        console.error(e)
        setSubmitting(false)
      }
    }
  }

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const secs = s % 60
    return `${m}:${secs < 10 ? '0' : ''}${secs}`
  }

  const isLowTime = timeLeft > 0 && timeLeft < 300 // under 5 mins

  // Framer Motion slide variants
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 100 : -100,
      opacity: 0
    })
  }

  const currentQuestion = test.questions[currentIndex]
  const totalQuestions = test.questions.length
  const answeredCount = Object.keys(answers).length

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setDirection(1)
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handleBack = () => {
    if (currentIndex > 0) {
      setDirection(-1)
      setCurrentIndex(currentIndex - 1)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Top Bar Navigation */}
      <header className="h-16 border-b border-white/5 bg-black/40 backdrop-blur-2xl flex items-center justify-between px-6 z-10 sticky top-0 shrink-0">
        <div className="flex items-center gap-3">
          <Shield className="text-primary animate-pulse" size={20} />
          <div>
            <h1 className="text-sm font-extrabold tracking-tight text-white">{test.title}</h1>
            <p className="text-[9px] text-white/30 font-bold uppercase tracking-wider mt-0.5">Secure Exam Sandbox</p>
          </div>
        </div>

        {/* Floating Pulsing Timer */}
        <motion.div
          animate={isLowTime ? { scale: [1, 1.05, 1] } : {}}
          transition={isLowTime ? { duration: 1, repeat: Infinity, ease: 'easeInOut' } : {}}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-black tracking-wider uppercase transition-all duration-300 ${
            isLowTime 
              ? 'bg-destructive/20 text-destructive border-destructive/40 shadow-[0_0_15px_rgba(255,69,58,0.2)]'
              : 'bg-primary/20 text-primary border-primary/40 shadow-[0_0_15px_rgba(10,132,255,0.2)]'
          }`}
        >
          <Clock size={14} className={isLowTime ? 'animate-spin' : ''} />
          <span>Timer: {formatTime(timeLeft)}</span>
        </motion.div>
      </header>

      {/* Main Focus Matrix */}
      <div className="flex-1 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 md:p-6 overflow-hidden">
        
        {/* LEFT COLUMN: Distraction-free sliding Question panel */}
        <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
          <div className="flex-1 bg-white/[0.01] border border-white/5 rounded-3xl p-6 md:p-8 relative overflow-hidden flex flex-col justify-center">
            
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentQuestion.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="space-y-6"
              >
                {/* Heading */}
                <div className="flex items-start gap-4">
                  <span className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-sm font-black text-primary shrink-0">
                    Q{currentIndex + 1}
                  </span>
                  <div className="space-y-2">
                    <span className="text-[10px] text-white/30 uppercase tracking-widest font-black">Question {currentIndex + 1} of {totalQuestions}</span>
                    <h2 className="text-xl font-bold leading-snug tracking-tight text-white/95">
                      {currentQuestion.text}
                    </h2>
                  </div>
                </div>

                {/* Options Layout */}
                <div className="space-y-3 pt-4">
                  {currentQuestion.options.map((opt, oIdx) => {
                    const isSelected = answers[currentQuestion.id] === opt.id
                    const charOption = String.fromCharCode(65 + oIdx) // A, B, C, D

                    return (
                      <label 
                        key={opt.id} 
                        className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all duration-300 ${
                          isSelected 
                            ? 'border-primary/50 bg-primary/10 shadow-[0_0_15px_rgba(10,132,255,0.1)]' 
                            : 'border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10'
                        }`}
                      >
                        <input
                          type="radio"
                          name={currentQuestion.id}
                          value={opt.id}
                          checked={isSelected}
                          onChange={() => setAnswer(currentQuestion.id, opt.id)}
                          className="sr-only"
                        />
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black uppercase tracking-wider transition-colors ${
                          isSelected 
                            ? 'bg-primary text-black' 
                            : 'bg-white/5 text-white/50 border border-white/10'
                        }`}>
                          {charOption}
                        </span>
                        <span className="text-sm font-semibold text-white/90">{opt.text}</span>
                      </label>
                    )
                  })}
                </div>

              </motion.div>
            </AnimatePresence>

          </div>

          {/* Sliding actions footer */}
          <div className="flex items-center justify-between bg-white/[0.01] border border-white/5 p-4 rounded-2xl">
            <button
              onClick={handleBack}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-white/50 hover:text-white disabled:opacity-20 transition-all px-4 py-2 hover:bg-white/5 rounded-xl border border-transparent disabled:hover:bg-transparent"
            >
              <ChevronLeft size={16} /> Prev Question
            </button>

            <div className="text-[10px] text-white/30 uppercase tracking-widest font-black hidden sm:block">
              Unsaved changes are saved locally
            </div>

            {currentIndex === totalQuestions - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-black bg-success hover:bg-success-dark px-6 py-3 rounded-xl shadow-[0_0_20px_rgba(50,215,75,0.3)] transition-all active:scale-95"
              >
                <CheckCircle size={15} /> {submitting ? 'Submitting...' : 'Complete Exam'}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-black bg-primary hover:bg-primary/95 px-6 py-3 rounded-xl shadow-[0_0_20px_rgba(10,132,255,0.3)] transition-all active:scale-95"
              >
                Next Question <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive palette sidebar */}
        <div className="lg:col-span-4 bg-white/[0.01] border border-white/5 rounded-3xl p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
                <Award className="text-primary animate-pulse" size={16} />
                Question Palette
              </h3>
              <p className="text-[10px] text-white/30 font-bold uppercase tracking-wider mt-1">Status audit board</p>
            </div>

            {/* Matrix list */}
            <div className="grid grid-cols-5 gap-2.5 max-h-[280px] overflow-y-auto custom-scrollbar p-1">
              {test.questions.map((q, idx) => {
                const isCurrent = idx === currentIndex
                const isAnswered = answers[q.id] !== undefined
                
                let cellStyle = 'bg-white/[0.01] text-white/30 border-white/5'
                if (isAnswered) {
                  cellStyle = 'bg-success/20 text-success border-success/30 hover:bg-success/30'
                }
                if (isCurrent) {
                  cellStyle = 'bg-primary/20 text-primary border-primary ring-2 ring-primary ring-offset-2 ring-offset-black'
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      setDirection(idx > currentIndex ? 1 : -1)
                      setCurrentIndex(idx)
                    }}
                    className={`h-11 rounded-xl flex items-center justify-center border text-xs font-black transition-all ${cellStyle}`}
                  >
                    {idx + 1}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Legend and Overview stats */}
          <div className="space-y-4 border-t border-white/5 pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                <p className="text-[10px] text-white/30 font-bold uppercase">Answered</p>
                <p className="text-lg font-black text-success mt-0.5">{answeredCount}</p>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                <p className="text-[10px] text-white/30 font-bold uppercase">Remaining</p>
                <p className="text-lg font-black text-white/60 mt-0.5">{totalQuestions - answeredCount}</p>
              </div>
            </div>

            <div className="space-y-2 text-[10px] text-white/30 uppercase tracking-widest font-black">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded bg-success/20 border border-success/30"></span>
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded bg-primary/20 border border-primary"></span>
                <span>Currently Viewing</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded bg-white/[0.01] border border-white/5"></span>
                <span>Not Visited / Skipped</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
