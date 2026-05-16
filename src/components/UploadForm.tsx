'use client'

import { useState } from 'react'
import { uploadMaterial } from '@/actions/admin/upload'
import { useRouter } from 'next/navigation'

export default function UploadForm({ batches }: { batches: { id: string, grade: string }[] }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    
    const res = await uploadMaterial(formData)
    if (res?.error) {
      alert(res.error)
    } else {
      const form = e.target as HTMLFormElement
      form.reset()
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-semibold text-on-surface">Material Title</label>
        <input name="title" required className="w-full p-2 border border-outline-variant rounded bg-surface-container-lowest focus:border-primary outline-none" />
      </div>
      <div>
        <label className="text-sm font-semibold text-on-surface">Target Batch</label>
        <select name="batchId" required className="w-full p-2 border border-outline-variant rounded bg-surface-container-lowest focus:border-primary outline-none">
          {batches.map(b => (
            <option key={b.id} value={b.id}>Class {b.grade}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-sm font-semibold text-on-surface">PDF File</label>
        <input name="file" type="file" accept="application/pdf" required className="w-full p-2 border border-outline-variant rounded bg-surface-container-lowest focus:border-primary outline-none" />
      </div>
      <button disabled={loading} type="submit" className="w-full btn-gradient py-2 rounded font-bold disabled:opacity-50">
        {loading ? 'Uploading...' : 'Upload Material'}
      </button>
    </form>
  )
}
