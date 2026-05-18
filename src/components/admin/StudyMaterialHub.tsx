'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { uploadMaterial, deleteMaterial } from '@/actions/admin/upload'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Input, Select } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { 
  FileUp, BookOpen, Trash2, Search, ExternalLink, 
  FileText, CheckCircle2, AlertCircle 
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Batch {
  id: string
  grade: string
}

interface Material {
  id: string
  title: string
  fileUrl: string
  createdAt: Date
  batch: {
    grade: string
  }
}

export default function StudyMaterialHub({ 
  batches, 
  initialMaterials 
}: { 
  batches: Batch[]
  initialMaterials: Material[]
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [uploadStatus, setUploadStatus] = useState<{ success?: boolean; error?: string } | null>(null)
  const [isPending, startTransition] = useTransition()
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  
  const router = useRouter()

  const handleUploadSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setUploadStatus(null)

    const formData = new FormData(e.currentTarget)
    
    startTransition(async () => {
      try {
        const res = await uploadMaterial(formData)
        if (res.success) {
          setUploadStatus({ success: true })
          e.currentTarget.reset()
          router.refresh()
        } else {
          setUploadStatus({ error: res.error || 'Failed to upload study material' })
        }
      } catch (err: any) {
        setUploadStatus({ error: err.message || 'An error occurred' })
      }
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this study material?')) return
    setIsDeleting(id)
    try {
      const res = await deleteMaterial(id)
      if (res.success) {
        router.refresh()
      } else {
        alert(res.error || 'Failed to delete material')
      }
    } catch (err: any) {
      alert(err.message || 'An error occurred')
    } finally {
      setIsDeleting(null)
    }
  }

  const filteredMaterials = initialMaterials.filter(m =>
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.batch.grade.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Form Upload pane */}
      <Card className="lg:col-span-5 border-white/5 bg-white/[0.01]">
        <CardHeader className="border-b border-white/10 pb-4">
          <CardTitle className="text-lg text-white font-bold flex items-center gap-2">
            <FileUp className="text-primary" size={18} />
            Upload New Asset
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleUploadSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/30">Document Title</label>
              <Input 
                name="title" 
                required 
                placeholder="e.g. Class 10 Trigonometry Revision"
                className="bg-white/5 border-white/10"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/30">Target Class Batch</label>
              <Select 
                name="batchId" 
                required 
                className="bg-white/5 border-white/10 text-white select-custom-arrow"
              >
                <option value="" disabled selected className="bg-black">Choose a batch...</option>
                {batches.map(b => (
                  <option key={b.id} value={b.id} className="bg-black text-white">Class {b.grade}</option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/30">Upload Document (PDF / Images)</label>
              <div className="relative group border-2 border-dashed border-white/10 bg-white/[0.01] hover:bg-white/[0.03] hover:border-primary/40 rounded-2xl p-6 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer text-center">
                <FileUp size={32} className="text-white/20 group-hover:text-primary transition-colors mb-3" />
                <span className="text-sm font-bold text-white/60 group-hover:text-white transition-colors">Select a file from your computer</span>
                <span className="text-[10px] text-white/30 mt-1 uppercase tracking-wider">PDF, DOC, PNG, JPG (Max 15MB)</span>
                <input 
                  name="file" 
                  type="file" 
                  required 
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isPending}
              className="w-full h-12 text-sm font-black shadow-[0_0_24px_rgba(10,132,255,0.3)] mt-2"
            >
              {isPending ? 'Uploading & Seeding...' : 'Publish Study Material'}
            </Button>

            <AnimatePresence>
              {uploadStatus?.success && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-4 rounded-xl bg-success/10 border border-success/20 text-success text-xs font-bold flex items-center gap-2"
                >
                  <CheckCircle2 size={16} /> Asset uploaded and distributed successfully!
                </motion.div>
              )}
              {uploadStatus?.error && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold flex items-center gap-2"
                >
                  <AlertCircle size={16} /> {uploadStatus.error}
                </motion.div>
              )}
            </AnimatePresence>

          </form>
        </CardContent>
      </Card>

      {/* List of uploaded Materials */}
      <Card className="lg:col-span-7 border-white/5 bg-white/[0.01]">
        <CardHeader className="border-b border-white/10 pb-4 flex flex-row items-center justify-between flex-wrap gap-4">
          <CardTitle className="text-lg text-white font-bold flex items-center gap-2">
            <BookOpen className="text-primary" size={18} />
            Published Materials History ({filteredMaterials.length})
          </CardTitle>
          <div className="relative w-48 sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
            <input 
              placeholder="Search materials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-1.5 text-xs text-white placeholder-white/20 outline-none focus:border-primary/50 transition-all"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/[0.02] border-b border-white/5 text-[10px] font-bold text-white/30 uppercase tracking-widest">
                  <th className="px-6 py-4">Title / Name</th>
                  <th className="px-6 py-4">Batch</th>
                  <th className="px-6 py-4">Uploaded Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <AnimatePresence>
                  {filteredMaterials.length > 0 ? (
                    filteredMaterials.map((mat) => (
                      <motion.tr 
                        key={mat.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-white/[0.03] transition-colors group"
                      >
                        <td className="px-6 py-4 font-bold text-white flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                            <FileText size={16} />
                          </div>
                          <div>
                            <p className="text-sm font-bold tracking-tight text-white/95">{mat.title}</p>
                            <a 
                              href={mat.fileUrl} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="text-[10px] text-primary hover:underline flex items-center gap-1 mt-0.5"
                            >
                              View File <ExternalLink size={10} />
                            </a>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary uppercase">
                            Class {mat.batch.grade}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs font-semibold text-white/30">
                          {new Date(mat.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            disabled={isDeleting === mat.id}
                            onClick={() => handleDelete(mat.id)}
                            className="p-2 rounded-lg text-white/30 hover:text-destructive hover:bg-destructive/10 transition-colors"
                            title="Delete Material"
                          >
                            <Trash2 size={15} className={isDeleting === mat.id ? 'animate-pulse text-white/20' : ''} />
                          </button>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-white/20 italic text-sm">
                        No study materials found matching search query.
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
