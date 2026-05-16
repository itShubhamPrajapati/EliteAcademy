'use client'

import { useState } from 'react'
import { uploadIndividualResult } from '@/actions/admin/results'
import { useRouter } from 'next/navigation'
import { FileUp, Award } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input, Select } from '@/components/ui/Input'

export default function UploadResultForm({ students }: { students: { id: string; name: string; email: string }[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    const formData = new FormData(e.currentTarget)
    const res = await uploadIndividualResult(formData)
    if (res.success) {
      setSuccess('Result uploaded! Student has been notified.')
      ;(e.target as HTMLFormElement).reset()
      router.refresh()
    } else {
      setError(res.error || 'Failed to upload result')
    }
    setLoading(false)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-3 border-b border-white/10">
        <div className="w-9 h-9 rounded-xl bg-warning/20 flex items-center justify-center">
          <Award className="text-warning" size={18} />
        </div>
        <CardTitle>Upload Manual Test Result</CardTitle>
      </CardHeader>

      <CardContent className="pt-6">
        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl mb-5 text-sm font-medium">
            {error}
          </div>
        )}
        {success && (
          <div className="p-4 bg-success/10 border border-success/20 text-success rounded-xl mb-5 text-sm font-medium">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2 sm:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-white/40">Select Student</label>
              <Select name="studentId" required>
                <option value="">Choose a student…</option>
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.email})</option>
                ))}
              </Select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-white/40">Test Title</label>
              <Input name="title" required type="text" placeholder="e.g. Unit Test 1 – Algebra" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-white/40">Obtained Marks</label>
              <Input name="obtainedMarks" required type="number" min="0" placeholder="e.g. 38" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-white/40">Total Marks</label>
              <Input name="totalMarks" required type="number" min="1" placeholder="e.g. 50" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-white/40">Scanned Paper PDF (Optional)</label>
              <Input name="file" type="file" accept=".pdf" className="cursor-pointer file:text-primary file:font-semibold" />
            </div>
          </div>

          <Button disabled={loading} type="submit" className="w-full sm:w-auto px-10 gap-2">
            <FileUp size={16} /> {loading ? 'Uploading…' : 'Upload Result'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
