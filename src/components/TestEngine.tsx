'use client'

import { useEffect, useState } from 'react'
import { useTestStore } from '@/store/useTestStore'
import { submitTest } from '@/actions/student/test'
import { useRouter } from 'next/navigation'

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

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const secs = s % 60
    return `${m}:${secs < 10 ? '0' : ''}${secs}`
  }

  return (
    <div className="space-y-lg max-w-3xl mx-auto">
      <div className="flex justify-between items-center glass-panel p-md rounded-[24px] sticky top-20 z-10">
        <h1 className="text-xl font-bold text-on-surface">{test.title}</h1>
        <div className={`text-lg font-bold px-4 py-2 rounded-lg ${timeLeft > 0 && timeLeft < 300 ? 'bg-error text-on-error' : 'bg-primary text-on-primary'}`}>
          Time Left: {formatTime(timeLeft)}
        </div>
      </div>

      <div className="space-y-xl">
        {test.questions.map((q, idx) => (
          <div key={q.id} className="glass-panel p-lg rounded-[24px] space-y-md">
            <h2 className="text-lg font-semibold text-on-surface">
              {idx + 1}. {q.text}
            </h2>
            <div className="space-y-sm">
              {q.options.map(opt => (
                <label key={opt.id} className={`flex items-center p-md rounded-lg border cursor-pointer transition-all ${answers[q.id] === opt.id ? 'border-primary bg-primary/10' : 'border-outline-variant hover:border-primary/50'}`}>
                  <input
                    type="radio"
                    name={q.id}
                    value={opt.id}
                    checked={answers[q.id] === opt.id}
                    onChange={() => setAnswer(q.id, opt.id)}
                    className="mr-3 w-4 h-4 text-primary"
                  />
                  <span className="text-on-surface">{opt.text}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full btn-gradient py-md rounded-lg font-bold text-lg disabled:opacity-50 shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-transform"
      >
        {submitting ? 'Submitting...' : 'Submit Test'}
      </button>
    </div>
  )
}
