'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Download, FileText, Search, ExternalLink } from 'lucide-react'
import { Input } from '@/components/ui/Input'

interface Result {
  id: string
  title: string
  totalMarks: number
  obtainedMarks: number
  pdfFileUrl: string | null
  date: Date
  student: {
    name: string
    batch: {
      grade: string
    } | null
  }
}

export default function ResultHistoryTable({ initialResults }: { initialResults: Result[] }) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredResults = initialResults.filter(res => 
    res.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (res.student.batch?.grade && res.student.batch.grade.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <Card className="border-white/5 bg-white/[0.01]">
      <CardHeader className="border-b border-white/10 flex flex-row items-center justify-between flex-wrap gap-4 pb-4">
        <CardTitle className="text-xl flex items-center gap-2 text-white">
          <FileText className="text-primary" size={20} />
          Global Upload History ({filteredResults.length})
        </CardTitle>
        <div className="relative w-48 sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
          <Input 
            placeholder="Search student or exam..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border-white/10 pl-9 pr-4 py-1.5 text-xs text-white placeholder-white/20"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0 overflow-hidden">
        <Table>
          <TableHeader className="bg-white/[0.02] border-b border-white/5">
            <TableRow className="border-white/5">
              <TableHead className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Student</TableHead>
              <TableHead className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Test Title</TableHead>
              <TableHead className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Score</TableHead>
              <TableHead className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Date</TableHead>
              <TableHead className="text-right text-white/40 font-bold uppercase tracking-widest text-[10px]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {filteredResults.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-48 text-center text-white/20 italic text-sm">
                    No results have been uploaded yet or matched search criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredResults.map((res) => {
                  const scoreRatio = res.obtainedMarks / res.totalMarks
                  let scoreBadgeStyle = 'text-success'
                  if (scoreRatio < 0.4) scoreBadgeStyle = 'text-destructive'
                  else if (scoreRatio < 0.8) scoreBadgeStyle = 'text-warning'

                  return (
                    <TableRow 
                      key={res.id} 
                      className="border-white/5 hover:bg-white/[0.03] transition-colors group cursor-default"
                    >
                      <TableCell>
                        <div className="font-extrabold text-white tracking-tight group-hover:text-primary transition-colors">{res.student.name}</div>
                        <div className="text-[10px] text-white/30 uppercase tracking-widest mt-0.5">
                          Class {res.student.batch?.grade || 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell className="text-white/70 font-semibold text-sm">{res.title}</TableCell>
                      <TableCell>
                        <span className={`font-mono font-black text-sm ${scoreBadgeStyle}`}>
                          {res.obtainedMarks} / {res.totalMarks}
                        </span>
                      </TableCell>
                      <TableCell className="text-white/30 text-xs font-semibold">
                        {new Date(res.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {res.pdfFileUrl ? (
                          <Button 
                            asChild 
                            variant="outline" 
                            size="sm" 
                            className="text-primary h-8 px-3 gap-2 border-primary/20 bg-primary/5 hover:bg-primary/20 rounded-xl"
                          >
                            <a href={res.pdfFileUrl} target="_blank" rel="noreferrer">
                              <Download size={12} /> Paper
                            </a>
                          </Button>
                        ) : (
                          <span className="text-[10px] text-white/20 uppercase tracking-widest font-black">Manual Input</span>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </AnimatePresence>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
