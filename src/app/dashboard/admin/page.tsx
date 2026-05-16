import prisma from '@/lib/prisma'
import { subDays, isSameDay, format } from 'date-fns'
import Link from 'next/link'
import ActivityTimeline from '@/components/admin/ActivityTimeline'
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Users, 
  CalendarCheck, 
  FileText, 
  MessageCircle, 
  PlusCircle, 
  TrendingUp, 
  ChevronRight 
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { BatchPerformanceChart, AttendanceTrendChart } from '@/components/admin/AnalyticsCharts'


import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') redirect('/login')

  const [batches, users, allAttendances, allTestScores] = await Promise.all([
    prisma.batch.findMany({ include: { users: true, materials: true } }),
    prisma.user.findMany({ include: { batch: true } }),
    prisma.attendance.findMany({ orderBy: { date: 'desc' } }),
    prisma.testScore.findMany(),
  ])

  // Batch-wise performance averages
  const batchPerformance = batches.map(b => {
    const batchStudentIds = b.users.map(u => u.id)
    const scores = allTestScores.filter(s => batchStudentIds.includes(s.studentId))
    const avg = scores.length > 0
      ? scores.reduce((acc, s) => acc + (s.score / s.maxScore) * 100, 0) / scores.length
      : 0
    return { batch: `Class ${b.grade}`, avg: parseFloat(avg.toFixed(1)), count: scores.length }
  })

  // Attendance trend — last 14 days
  const last14Days = Array.from({ length: 14 }).map((_, i) => {
    const day = subDays(new Date(), 13 - i)
    const records = allAttendances.filter(a => isSameDay(new Date(a.date), day))
    const present = records.filter(r => r.status === 'PRESENT').length
    const rate = records.length > 0 ? (present / records.length) * 100 : 0
    return { date: format(day, 'MMM d'), rate: parseFloat(rate.toFixed(1)) }
  })

  const studentCount = users.filter(u => u.role === 'STUDENT').length
  const parentCount = users.filter(u => u.role === 'PARENT').length

  const kpis = [
    { label: 'Total Students', value: studentCount, color: '#0A84FF', trend: '+12%', up: true },
    { label: 'Total Parents', value: parentCount, color: '#32D74B', trend: '+4%', up: true },
    { label: 'Active Batches', value: batches.length, color: '#FF9F0A', trend: 'Steady', up: null },
    { label: 'Total Materials', value: batches.reduce((acc, b) => acc + b.materials.length, 0), color: '#BF5AF2', trend: '+8%', up: true },
  ]

  const quickActions = [
    { href: '/dashboard/admin/accounts', label: 'Accounts', icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
    { href: '/dashboard/admin/attendance', label: 'Attendance', icon: CalendarCheck, color: 'text-success', bg: 'bg-success/10' },
    { href: '/dashboard/admin/results', label: 'Results', icon: FileText, color: 'text-warning', bg: 'bg-warning/10' },
    { href: '/dashboard/admin/messages', label: 'Messages', icon: MessageCircle, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  ]

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-4xl font-extrabold tracking-tight text-white">Admin Dashboard</h1>
        <p className="text-white/40 text-lg">Real-time enterprise analytics and command center.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(kpi => (
          <Card key={kpi.label} className="relative overflow-hidden group">
            <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity rounded-2xl" style={{ background: `radial-gradient(circle at top left, ${kpi.color}, transparent 70%)` }} />
            <CardContent className="p-6 relative z-10">
              <div className="flex justify-between items-start mb-4">
                <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">{kpi.label}</p>
                {kpi.trend && (
                  <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    kpi.up === true ? 'bg-success/10 text-success' : 
                    kpi.up === false ? 'bg-destructive/10 text-destructive' :
                    'bg-white/5 text-white/40'
                  }`}>
                    {kpi.up === true && <ArrowUpRight size={10} />}
                    {kpi.up === false && <ArrowDownRight size={10} />}
                    {kpi.trend}
                  </div>
                )}
              </div>
              <p className="text-4xl font-extrabold" style={{ color: kpi.color }}>{kpi.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Analytics column */}
        <div className="xl:col-span-2 space-y-8">
          {/* Quick Action Tiles */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map(action => (
              <Link key={action.href} href={action.href}>
                <Card className="hover:border-white/20 hover:bg-white/[0.06] transition-all cursor-pointer group h-full">
                  <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl ${action.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <action.icon size={24} className={action.color} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-white/60 group-hover:text-white transition-colors">{action.label}</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <Link href="/dashboard/admin/create-test">
            <Card className="border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-all cursor-pointer group">
              <CardContent className="p-6 flex items-center gap-6">
                <div className="w-16 h-16 rounded-[22px] bg-primary flex items-center justify-center shadow-[0_0_30px_rgba(10,132,255,0.4)] group-hover:scale-105 transition-transform">
                  <PlusCircle size={32} className="text-white" />
                </div>
                <div>
                  <p className="font-extrabold text-white text-2xl tracking-tight">Create New Mock Test</p>
                  <p className="text-white/40 text-sm mt-1">Add automated questions and assign to batches instantly.</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="border-b border-white/10 pb-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <TrendingUp size={18} className="text-primary" />
                  Performance Averages
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {batchPerformance.length > 0 ? (
                  <BatchPerformanceChart data={batchPerformance} />
                ) : (
                  <p className="text-white/20 text-sm py-12 text-center italic">No performance data found.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b border-white/10 pb-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <CalendarCheck size={18} className="text-success" />
                  Attendance Flow
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <AttendanceTrendChart data={last14Days} />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Live Sidebar column */}
        <div className="space-y-8">
          <Card className="h-full">
            <CardHeader className="border-b border-white/10 pb-4 flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Live Activity</CardTitle>
              <div className="px-2 py-0.5 rounded bg-primary/20 text-primary text-[10px] font-bold uppercase animate-pulse">Live</div>
            </CardHeader>
            <CardContent className="pt-6">
              <ActivityTimeline />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b border-white/10 pb-4">
              <CardTitle className="text-lg">Recent Enrollments</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {users.filter(u => u.role !== 'ADMIN').slice(0, 5).map(u => (
                <div key={u.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-xs font-bold text-white group-hover:border-primary/40 transition-colors">
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{u.name}</p>
                      <p className="text-[10px] text-white/30 uppercase tracking-widest font-semibold">{u.role}</p>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-white/10 group-hover:text-primary transition-colors" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
