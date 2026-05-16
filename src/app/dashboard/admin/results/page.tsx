import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import UploadResultForm from '@/components/admin/UploadResultForm'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { Download, FileText, Calendar as CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/Button'

import SplitPaneResultEntry from '@/components/admin/SplitPaneResultEntry'

export default async function AdminResultsPage() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') redirect('/login')

  const batches = await prisma.batch.findMany({
    include: {
      users: {
        where: { role: 'STUDENT' },
        select: { id: true, name: true, email: true },
        orderBy: { name: 'asc' },
      }
    }
  })

  const recentResults = await prisma.individualResult.findMany({
    include: { student: { select: { name: true, batch: { select: { grade: true } } } } },
    orderBy: { date: 'desc' },
    take: 15,
  })

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold tracking-tight text-white">Results Engine</h1>
          <p className="text-white/40 text-lg">Industrial-speed data entry and distribution.</p>
        </div>
      </div>

      <SplitPaneResultEntry batches={batches} />

      {/* Recent History */}
      <Card>
        <CardHeader className="border-b border-white/10 flex flex-row items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <FileText className="text-primary" size={20} />
            Global Upload History
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-white/[0.02]">
              <TableRow className="border-white/5">
                <TableHead>Student</TableHead>
                <TableHead>Test Title</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentResults.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-48 text-center text-white/20 italic">
                    No results have been uploaded yet.
                  </TableCell>
                </TableRow>
              ) : (
                recentResults.map(res => (
                  <TableRow key={res.id} className="border-white/5 hover:bg-white/[0.02]">
                    <TableCell>
                      <div className="font-bold text-white">{res.student.name}</div>
                      <div className="text-[10px] text-white/40 uppercase tracking-widest">Class {res.student.batch?.grade}</div>
                    </TableCell>
                    <TableCell className="text-white/70">{res.title}</TableCell>
                    <TableCell>
                      <span className={`font-mono font-bold ${
                        (res.obtainedMarks / res.totalMarks) >= 0.8 ? 'text-success' :
                        (res.obtainedMarks / res.totalMarks) >= 0.4 ? 'text-warning' : 'text-destructive'
                      }`}>
                        {res.obtainedMarks}/{res.totalMarks}
                      </span>
                    </TableCell>
                    <TableCell className="text-white/40 text-xs">
                      {new Date(res.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {res.pdfFileUrl ? (
                        <Button asChild variant="outline" size="sm" className="text-primary h-8 px-3 gap-2 border-primary/20 bg-primary/5 hover:bg-primary/20">
                          <a href={res.pdfFileUrl} target="_blank" rel="noreferrer">
                            <Download size={14} /> Paper
                          </a>
                        </Button>
                      ) : (
                        <span className="text-[10px] text-white/20 uppercase tracking-widest font-bold">Manual</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
