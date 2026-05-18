import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import SplitPaneResultEntry from '@/components/admin/SplitPaneResultEntry'
import ResultHistoryTable from '@/components/admin/ResultHistoryTable'

export const dynamic = 'force-dynamic'

export default async function AdminResultsPage() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') redirect('/login')

  const [batches, recentResults] = await Promise.all([
    prisma.batch.findMany({
      include: {
        users: {
          where: { role: 'STUDENT' },
          select: { id: true, name: true, email: true },
          orderBy: { name: 'asc' },
        }
      }
    }),
    prisma.individualResult.findMany({
      include: { 
        student: { 
          select: { 
            name: true, 
            batch: { select: { grade: true } } 
          } 
        } 
      },
      orderBy: { date: 'desc' },
      take: 25, // increase history slightly for better search ability
    })
  ])

  return (
    <div className="space-y-10 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold tracking-tight text-white">Results Engine</h1>
          <p className="text-white/40 text-lg">Industrial-speed data entry and distribution.</p>
        </div>
      </div>

      {/* Split Pane Interface */}
      <SplitPaneResultEntry batches={batches} />

      {/* Interactive Global Upload History */}
      <ResultHistoryTable initialResults={recentResults as any} />
    </div>
  )
}
