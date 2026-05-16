'use client'

import { Download, FileText, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { exportToPDF } from '@/lib/pdf-engine'
import { useState } from 'react'

interface DownloadActionsProps {
  studentName: string
  targetId: string
}

export default function DownloadActions({ studentName, targetId }: DownloadActionsProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async (type: 'report' | 'attendance') => {
    setIsExporting(true)
    const filename = `${studentName.replace(/\s+/g, '_')}_${type === 'report' ? 'Report_Card' : 'Attendance_Log'}`
    await exportToPDF(targetId, filename)
    setIsExporting(false)
  }

  return (
    <div className="flex flex-wrap gap-3">
      <Button 
        onClick={() => handleExport('report')}
        disabled={isExporting}
        className="bg-primary/20 border border-primary/30 text-primary hover:bg-primary/30 rounded-full px-6 gap-2"
      >
        <FileText size={16} /> 
        {isExporting ? 'Generating...' : 'Download Report Card'}
      </Button>
      <Button 
        onClick={() => handleExport('attendance')}
        disabled={isExporting}
        className="bg-success/20 border border-success/30 text-success hover:bg-success/30 rounded-full px-6 gap-2"
      >
        <Calendar size={16} /> 
        {isExporting ? 'Generating...' : 'Download Attendance Log'}
      </Button>
    </div>
  )
}
