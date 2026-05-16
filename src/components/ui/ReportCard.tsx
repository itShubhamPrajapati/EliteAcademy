'use client'

import { motion } from 'framer-motion'
import { FileText, Download } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'

type Result = {
  id: string
  title: string
  totalMarks: number
  obtainedMarks: number
  pdfFileUrl: string | null
  date: Date
}

export default function ReportCard({ results }: { results: Result[] }) {
  if (results.length === 0) {
    return (
      <div className="bg-card border border-border p-8 rounded-2xl text-center text-muted-foreground py-12">
        No manual test results uploaded yet.
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Date</TableHead>
            <TableHead>Test Title</TableHead>
            <TableHead className="text-center">Score</TableHead>
            <TableHead className="text-center">Percentage</TableHead>
            <TableHead className="text-right">Scanned Paper</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((r, i) => {
            const percentage = Math.round((r.obtainedMarks / r.totalMarks) * 100)
            return (
              <TableRow 
                key={r.id} 
                className="hover:bg-muted/30 transition-colors"
              >
                <TableCell className="text-sm text-muted-foreground">{new Date(r.date).toLocaleDateString()}</TableCell>
                <TableCell className="font-semibold">{r.title}</TableCell>
                <TableCell className="text-center font-bold">
                  <span className={percentage >= 40 ? 'text-primary' : 'text-destructive'}>
                    {r.obtainedMarks}
                  </span> / {r.totalMarks}
                </TableCell>
                <TableCell className="text-center">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${percentage >= 80 ? 'bg-primary/20 text-primary' : percentage >= 40 ? 'bg-warning/20 text-warning' : 'bg-destructive/20 text-destructive'}`}>
                    {percentage}%
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  {r.pdfFileUrl ? (
                    <a href={r.pdfFileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-end gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
                      <Download size={16} /> Download
                    </a>
                  ) : (
                    <span className="text-xs text-muted-foreground flex items-center justify-end gap-1.5"><FileText size={16} className="opacity-50"/> N/A</span>
                  )}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
