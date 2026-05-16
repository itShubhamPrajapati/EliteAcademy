import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import CreateTestForm from '@/components/admin/CreateTestForm'
import { Card, CardContent } from '@/components/ui/Card'
import { FilePlus } from 'lucide-react'

export default async function CreateTestPage() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') redirect('/login')

  const batches = await prisma.batch.findMany({ select: { id: true, grade: true } })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Test Creator</h1>
        <p className="text-white/50 mt-1">Build dynamic MCQ mock tests and assign them to specific batches.</p>
      </div>

      {batches.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <FilePlus size={48} className="text-white/20 mb-4" />
            <p className="text-white/40 font-medium">Please create a Batch before creating Mock Tests.</p>
          </CardContent>
        </Card>
      ) : (
        <CreateTestForm batches={batches} />
      )}
    </div>
  )
}
