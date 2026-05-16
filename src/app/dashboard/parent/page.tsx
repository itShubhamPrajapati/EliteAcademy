import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import AttendanceHeatmap from '@/components/ui/AttendanceHeatmap'
import ReportCard from '@/components/ui/ReportCard'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { GraduationCap, User } from 'lucide-react'
import DownloadActions from '@/components/dashboard/DownloadActions'

export const dynamic = 'force-dynamic'

export default async function ParentDashboard() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'PARENT') redirect('/login')

  const parent = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      children: {
        include: {
          batch: { select: { grade: true } },
          attendances: { orderBy: { date: 'desc' } },
          individualResults: { orderBy: { date: 'desc' } },
        },
      },
    },
  })

  const children = parent?.children || []

  return (
    <div className="space-y-8 pb-12">
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-white">Parent Portal</h1>
        <p className="text-white/40 text-lg">Monitor your child's academic journey and growth trends.</p>
      </div>

      {children.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-20 text-center border-dashed border-white/10 bg-white/[0.01]">
          <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mb-6">
            <GraduationCap size={40} className="text-white/20" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">No Students Linked</h2>
          <p className="text-white/40 max-w-sm">Your account hasn't been linked to any students yet. Please contact the EliteAcademy support desk.</p>
        </Card>
      ) : (
        <div className="space-y-12">
          {children.map(child => (
            <div key={child.id} id={`child-report-${child.id}`} className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-[24px] bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-2xl shadow-lg shadow-primary/10">
                    {child.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">{child.name}</h2>
                    <div className="flex items-center gap-2 text-white/40 font-medium">
                      <GraduationCap size={14} />
                      Class {child.batch?.grade} · Enrollment Active
                    </div>
                  </div>
                </div>
                <DownloadActions studentName={child.name} targetId={`child-report-${child.id}`} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <AttendanceHeatmap attendances={child.attendances} />
                </div>
                <div className="lg:col-span-2">
                  <ReportCard results={child.individualResults} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
