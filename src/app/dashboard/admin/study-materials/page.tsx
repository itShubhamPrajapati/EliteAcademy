import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import StudyMaterialHub from '@/components/admin/StudyMaterialHub'
import { BookOpen } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminStudyMaterialsPage() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') redirect('/login')

  const [batches, materials] = await Promise.all([
    prisma.batch.findMany({
      select: {
        id: true,
        grade: true
      },
      orderBy: {
        grade: 'asc'
      }
    }),
    prisma.studyMaterial.findMany({
      include: {
        batch: {
          select: {
            grade: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  ])

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
          <BookOpen className="text-primary" size={36} />
          Study Materials Hub
        </h1>
        <p className="text-white/40 text-lg">Upload and distribute course documents, PDFs, and learning assets to academic tiers.</p>
      </div>

      <StudyMaterialHub batches={batches} initialMaterials={materials} />
    </div>
  )
}
