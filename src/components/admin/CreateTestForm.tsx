'use client'

import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Plus, Trash2, Save } from 'lucide-react'
import { createMockTest } from '@/actions/admin/test'
import { mockTestSchema, MockTestFormValues } from '@/lib/validations/testSchema'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function CreateTestForm({ batches }: { batches: { id: string, grade: string }[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm<MockTestFormValues>({
    resolver: zodResolver(mockTestSchema) as any,
    defaultValues: {
      title: '',
      durationMinutes: 30,
      batchId: batches.length > 0 ? batches[0].id : '',
      questions: [
        { text: '', options: [{ text: '', isCorrect: true }, { text: '', isCorrect: false }, { text: '', isCorrect: false }, { text: '', isCorrect: false }] }
      ]
    }
  })

  const { fields: questions, append: appendQuestion, remove: removeQuestion } = useFieldArray({
    control,
    name: "questions"
  })

  const onSubmit = async (data: MockTestFormValues) => {
    setLoading(true)
    setError('')
    const res = await createMockTest(data)
    if (res.success) {
      router.push('/dashboard/admin')
    } else {
      setError(res.error || 'Failed to create test')
      setLoading(false)
    }
  }

  const setCorrectOption = (qIndex: number, optionIndex: number) => {
    const currentQuestions = watch('questions')
    const options = currentQuestions[qIndex].options.map((o, idx) => ({
      ...o,
      isCorrect: idx === optionIndex
    }))
    setValue(`questions.${qIndex}.options`, options)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl mx-auto pb-24">
      <Card>
        <CardHeader className="border-b border-border pb-4">
          <CardTitle>Create New Mock Test</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {error && <div className="p-3 bg-destructive/20 text-destructive rounded-lg mb-6 text-sm">{error}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-foreground">Test Title</label>
              <Input {...register('title')} placeholder="e.g. Weekly Math Quiz" />
              {errors.title && <p className="text-destructive text-xs mt-1">{errors.title.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-foreground">Target Batch</label>
              <select 
                {...register('batchId')} 
                className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors text-foreground"
              >
                {batches.map(b => (
                  <option key={b.id} value={b.id}>Class {b.grade}</option>
                ))}
              </select>
              {errors.batchId && <p className="text-destructive text-xs mt-1">{errors.batchId.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-foreground">Duration (Minutes)</label>
              <Input type="number" {...register('durationMinutes')} />
              {errors.durationMinutes && <p className="text-destructive text-xs mt-1">{errors.durationMinutes.message}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {questions.map((q, qIndex) => (
          <motion.div key={q.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <Card className="border-l-4 border-l-primary">
              <CardHeader className="flex flex-row justify-between items-start pb-2">
                <CardTitle className="text-lg">Question {qIndex + 1}</CardTitle>
                {questions.length > 1 && (
                  <button type="button" onClick={() => removeQuestion(qIndex)} className="text-destructive hover:bg-destructive/10 p-2 rounded-full transition-colors">
                    <Trash2 size={18} />
                  </button>
                )}
              </CardHeader>
              <CardContent>
                <div className="mb-6 space-y-2">
                  <Input {...register(`questions.${qIndex}.text`)} placeholder="Enter question text here..." />
                  {errors.questions?.[qIndex]?.text && <p className="text-destructive text-xs">{errors.questions[qIndex].text?.message}</p>}
                </div>

                <div className="space-y-3">
                  {watch(`questions.${qIndex}.options`).map((opt, oIndex) => (
                    <div key={oIndex} className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${opt.isCorrect ? 'border-primary bg-primary/10' : 'border-border bg-background'}`}>
                      <button type="button" onClick={() => setCorrectOption(qIndex, oIndex)} className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${opt.isCorrect ? 'border-primary bg-primary' : 'border-border'}`}>
                        {opt.isCorrect && <div className="w-2 h-2 bg-primary-foreground rounded-full" />}
                      </button>
                      <Input {...register(`questions.${qIndex}.options.${oIndex}.text`)} className="flex-1 border-none focus-visible:ring-0 shadow-none bg-transparent" placeholder={`Option ${oIndex + 1}`} />
                    </div>
                  ))}
                </div>
                {errors.questions?.[qIndex]?.options && <p className="text-destructive text-xs mt-2">All options are required and one must be selected as correct.</p>}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="flex gap-6 justify-center">
        <Button type="button" variant="outline" onClick={() => appendQuestion({ text: '', options: [{ text: '', isCorrect: true }, { text: '', isCorrect: false }, { text: '', isCorrect: false }, { text: '', isCorrect: false }] })} className="gap-2 px-8 rounded-full h-12">
          <Plus size={20} /> Add Question
        </Button>
        <Button type="submit" disabled={loading} className="gap-2 px-8 rounded-full h-12">
          <Save size={20} /> {loading ? 'Saving...' : 'Save Mock Test'}
        </Button>
      </div>
    </form>
  )
}
