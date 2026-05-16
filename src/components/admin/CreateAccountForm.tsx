'use client'

import { useState } from 'react'
import { createAccount, AccountFormValues } from '@/actions/admin/accounts'
import { useRouter } from 'next/navigation'
import { UserPlus } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input, Select } from '@/components/ui/Input'

export default function CreateAccountForm({
  batches,
  parents,
}: {
  batches: { id: string; grade: string }[]
  parents: { id: string; name: string; email: string }[]
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState<AccountFormValues>({
    name: '',
    email: '',
    role: 'STUDENT',
    batchId: batches.length > 0 ? batches[0].id : '',
    parentId: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    const res = await createAccount(formData)
    if (res.success) {
      setSuccess('Account created successfully! Default password: password123')
      setFormData({ ...formData, name: '', email: '' })
      router.refresh()
    } else {
      setError(res.error || 'Failed to create account')
    }
    setLoading(false)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-3 border-b border-white/10">
        <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center">
          <UserPlus className="text-primary" size={18} />
        </div>
        <CardTitle>Create New Account</CardTitle>
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
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-white/40">Full Name</label>
              <Input
                required
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Arjun Kumar"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-white/40">Email</label>
              <Input
                required
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="student@eliteacademy.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-white/40">Role</label>
              <Select
                value={formData.role}
                onChange={e => setFormData({ ...formData, role: e.target.value as 'STUDENT' | 'PARENT' })}
              >
                <option value="STUDENT">Student</option>
                <option value="PARENT">Parent</option>
              </Select>
            </div>

            {formData.role === 'STUDENT' && (
              <>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-white/40">Batch</label>
                  <Select
                    value={formData.batchId}
                    onChange={e => setFormData({ ...formData, batchId: e.target.value })}
                  >
                    <option value="">No Batch</option>
                    {batches.map(b => (
                      <option key={b.id} value={b.id}>Class {b.grade}</option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-white/40">Link Parent (Optional)</label>
                  <Select
                    value={formData.parentId}
                    onChange={e => setFormData({ ...formData, parentId: e.target.value })}
                  >
                    <option value="">No Parent Linked</option>
                    {parents.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.email})</option>
                    ))}
                  </Select>
                </div>
              </>
            )}
          </div>

          <Button disabled={loading} type="submit" className="w-full sm:w-auto px-10">
            {loading ? 'Creating…' : 'Create Account'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
