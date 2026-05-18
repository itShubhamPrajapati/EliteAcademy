'use client'

import { Download, FileText, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { generateReportCardPDF, generateAttendancePDF } from '@/lib/pdf-engine'
import { useState } from 'react'

interface DownloadActionsProps {
  studentName: string
  batchName?: string
  testScores?: any[]
  individualResults?: any[]
  attendances?: any[]
  targetId?: string
}

export default function DownloadActions({ 
  studentName, 
  batchName = 'Class 9th', 
  testScores = [], 
  individualResults = [], 
  attendances = [],
  targetId 
}: DownloadActionsProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExportReportCard = async () => {
    setIsExporting(true)
    try {
      generateReportCardPDF(studentName, batchName, testScores, individualResults)
    } catch (e) {
      console.error('Error generating report card:', e)
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportAttendance = async () => {
    setIsExporting(true)
    try {
      generateAttendancePDF(studentName, batchName, attendances)
    } catch (e) {
      console.error('Error generating attendance log:', e)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="flex flex-wrap gap-3">
      <Button 
        onClick={handleExportReportCard}
        disabled={isExporting}
        className="bg-primary/20 border border-primary/30 text-primary hover:bg-primary/30 rounded-full px-6 gap-2"
      >
        <FileText size={16} /> 
        {isExporting ? 'Generating...' : 'Download Report Card'}
      </Button>
      <Button 
        onClick={handleExportAttendance}
        disabled={isExporting}
        className="bg-success/20 border border-success/30 text-success hover:bg-success/30 rounded-full px-6 gap-2"
      >
        <Calendar size={16} /> 
        {isExporting ? 'Generating...' : 'Download Attendance Log'}
      </Button>
    </div>
  )
}
