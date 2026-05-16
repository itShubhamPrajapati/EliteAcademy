import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import CheckoutModal from '@/components/CheckoutModal'
import Link from 'next/link'
import AttendanceHeatmap from '@/components/ui/AttendanceHeatmap'
import ReportCard from '@/components/ui/ReportCard'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Download, PlayCircle, MessageCircle, FileText } from 'lucide-react'
import DownloadActions from '@/components/dashboard/DownloadActions'

export const dynamic = 'force-dynamic'

export default async function StudentDashboard() {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      batch: { include: { materials: true, mockTests: true } },
      testScores: { orderBy: { createdAt: 'desc' } },
      attendances: { orderBy: { date: 'desc' } },
      individualResults: { orderBy: { date: 'desc' } },
    },
  })

  if (!user) return <div className="text-white">User not found.</div>

  if (!user.batch) {
    const allBatches = await prisma.batch.findMany({ select: { id: true, grade: true } })
    return <CheckoutModal batches={allBatches} />
  }

  const presentCount = user.attendances.filter(a => a.status === 'PRESENT').length
  const attendanceRate = user.attendances.length > 0 ? (presentCount / user.attendances.length) * 100 : 0
  const avgScore = user.testScores.length > 0
    ? (user.testScores.reduce((acc, t) => acc + (t.score / t.maxScore), 0) / user.testScores.length) * 100
    : 0

  return (
    <div className="space-y-8 pb-10" id="dashboard-content">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Hey, {user.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-white/40 mt-1 text-lg">Class {user.batch.grade} · EliteAcademy Portal</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <DownloadActions studentName={user.name} targetId="dashboard-content" />
          <Button asChild variant="ghost" className="border border-white/10 rounded-2xl h-12 px-6 gap-2 text-white/70 hover:bg-white/5">
            <Link href="/dashboard/student/messages">
              <MessageCircle size={18} /> Ask a Doubt
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Attendance', value: `${attendanceRate.toFixed(1)}%`, color: '#32D74B', glow: 'rgba(50,215,75,0.15)' },
          { label: 'Avg Score', value: `${avgScore.toFixed(1)}%`, color: '#0A84FF', glow: 'rgba(10,132,255,0.15)' },
          { label: 'Tests Done', value: `${user.testScores.length}`, color: '#FF9F0A', glow: 'rgba(255,159,10,0.15)' },
        ].map(kpi => (
          <Card key={kpi.label} className="relative overflow-hidden group">
            <div className="absolute inset-0 rounded-2xl opacity-50 group-hover:opacity-100 transition-opacity" style={{ background: `radial-gradient(circle at 30% 30%, ${kpi.glow}, transparent 70%)` }} />
            <CardContent className="p-6 relative z-10">
              <p className="text-xs text-white/40 uppercase tracking-widest font-bold mb-2">{kpi.label}</p>
              <p className="text-4xl font-extrabold" style={{ color: kpi.color }}>{kpi.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Study & Tests */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Study Materials */}
            <Card className="h-fit">
              <CardHeader className="border-b border-white/10 pb-4">
                <CardTitle className="text-xl">Study Materials</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-3">
                {user.batch.materials.length === 0 ? (
                  <p className="text-white/20 text-sm py-10 text-center italic">No materials uploaded yet.</p>
                ) : (
                  user.batch.materials.map(m => (
                    <div key={m.id} className="flex items-center justify-between p-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] transition-all group">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <FileText size={18} className="text-primary" />
                        </div>
                        <span className="text-sm font-bold text-white truncate">{m.title}</span>
                      </div>
                      <Button asChild variant="ghost" size="sm" className="shrink-0 text-primary rounded-xl h-10 px-4 text-xs gap-2 border border-primary/20 hover:bg-primary/10">
                        <a href={m.fileUrl} target="_blank" rel="noreferrer"><Download size={14} /> Download</a>
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Mock Tests */}
            <Card className="h-fit">
              <CardHeader className="border-b border-white/10 pb-4">
                <CardTitle className="text-xl">Mock Tests</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-3">
                {user.batch.mockTests.length === 0 ? (
                  <p className="text-white/20 text-sm py-10 text-center italic">No tests assigned currently.</p>
                ) : (
                  user.batch.mockTests.map(t => (
                    <div key={t.id} className="flex items-center justify-between p-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] transition-all group">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center shrink-0">
                          <PlayCircle size={18} className="text-success" />
                        </div>
                        <span className="text-sm font-bold text-white truncate">{t.title}</span>
                      </div>
                      <Button asChild size="sm" className="shrink-0 h-10 px-6 text-xs gap-2 rounded-xl bg-success hover:bg-success/90">
                        <Link href={`/dashboard/student/test/${t.id}`}>Start Test</Link>
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Results Table */}
          <Card>
            <CardHeader className="border-b border-white/10 pb-4">
              <CardTitle className="text-xl">Performance Report</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ReportCard results={user.individualResults} />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Attendance & Scores */}
        <div className="space-y-8">
          <AttendanceHeatmap attendances={user.attendances} />
          
          <Card>
            <CardHeader className="border-b border-white/10 pb-4">
              <CardTitle className="text-xl">Recent Scores</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {user.testScores.length === 0 ? (
                <p className="text-white/20 text-sm py-10 text-center italic">No test history available.</p>
              ) : (
                user.testScores.slice(0, 8).map(t => {
                  const pct = Math.round((t.score / t.maxScore) * 100)
                  return (
                    <div key={t.id} className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-white/80">{t.testName}</span>
                        <span className="font-mono text-white/40">{t.score}/{t.maxScore}</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/5 overflow-hidden border border-white/5">
                        <div 
                          className="h-full rounded-full transition-all duration-1000" 
                          style={{ 
                            width: `${pct}%`, 
                            background: pct >= 80 ? 'linear-gradient(90deg, #32D74B, #62FF83)' : 
                                      pct >= 40 ? 'linear-gradient(90deg, #FF9F0A, #FFD426)' : 
                                      'linear-gradient(90deg, #FF453A, #FF6961)' 
                          }} 
                        />
                      </div>
                    </div>
                  )
                })
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
