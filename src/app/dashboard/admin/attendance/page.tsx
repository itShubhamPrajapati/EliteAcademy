import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import AttendanceGrid from '@/components/admin/AttendanceGrid'
import { Card, CardContent } from '@/components/ui/Card'
import { CalendarX } from 'lucide-react'

export default async function AdminAttendancePage() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') redirect('/login')

  const batches = await prisma.batch.findMany({ select: { id: true, grade: true } })
  const students = await prisma.user.findMany({
    where: { role: 'STUDENT' },
    select: { id: true, name: true, batchId: true },
    orderBy: { name: 'asc' },
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Daily Attendance</h1>
        <p className="text-white/50 mt-1">Mark attendance and sync instantly to Student and Parent portals.</p>
      </div>

      {batches.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <CalendarX size={48} className="text-white/20 mb-4" />
            <p className="text-white/40 font-medium">No batches found. Create a batch first.</p>
          </CardContent>
        </Card>
      ) : (
        <AttendanceGrid batches={batches} students={students} />
      )}
    </div>
  )
}
