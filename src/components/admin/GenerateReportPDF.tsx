'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { FileDown, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'

type AttendanceRecord = {
  date: Date
  status: string
  remarks: string | null
}

type ResultRecord = {
  title: string
  obtainedMarks: number
  totalMarks: number
  date: Date
}

interface Props {
  studentName: string
  batchGrade: string | null
  attendances: AttendanceRecord[]
  results: ResultRecord[]
}

export default function GenerateReportPDF({ studentName, batchGrade, attendances, results }: Props) {
  const [loading, setLoading] = useState(false)
  const reportRef = useRef<HTMLDivElement>(null)

  const presentCount = attendances.filter(a => a.status === 'PRESENT').length
  const totalClasses = attendances.length
  const attendanceRate = totalClasses > 0 ? ((presentCount / totalClasses) * 100).toFixed(1) : 'N/A'
  const avgScore = results.length > 0
    ? (results.reduce((acc, r) => acc + (r.obtainedMarks / r.totalMarks), 0) / results.length * 100).toFixed(1)
    : 'N/A'

  const handleGeneratePDF = async () => {
    if (!reportRef.current) return
    setLoading(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      const jsPDF = (await import('jspdf')).default
      
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        backgroundColor: '#0d0d0d',
        useCORS: true,
      })
      
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = pageWidth
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      
      let position = 0
      let remaining = imgHeight
      
      while (remaining > 0) {
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        remaining -= pageHeight
        position -= pageHeight
        if (remaining > 0) pdf.addPage()
      }
      
      pdf.save(`${studentName.replace(' ', '_')}_Progress_Report.pdf`)
    } catch (err) {
      console.error('PDF generation error:', err)
    }
    setLoading(false)
  }

  const month = new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })

  return (
    <div className="space-y-4">
      <Button onClick={handleGeneratePDF} disabled={loading} variant="default" className="gap-2">
        {loading ? <Loader2 size={16} className="animate-spin" /> : <FileDown size={16} />}
        {loading ? 'Generating PDF…' : 'Download Progress Report'}
      </Button>

      {/* Off-screen report template — styled for PDF capture */}
      <div
        ref={reportRef}
        style={{
          position: 'fixed', top: '-9999px', left: '-9999px',
          width: '794px', padding: '48px',
          backgroundColor: '#0d0d0d', color: '#ffffff',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div>
            <div style={{ fontSize: '28px', fontWeight: 900, color: '#0A84FF' }}>EliteAcademy</div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>Monthly Progress Report</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>{month}</div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>Generated {new Date().toLocaleDateString('en-IN')}</div>
          </div>
        </div>

        {/* Student Info */}
        <div style={{ marginBottom: '32px', padding: '20px', backgroundColor: 'rgba(10,132,255,0.1)', borderRadius: '12px', border: '1px solid rgba(10,132,255,0.2)' }}>
          <div style={{ fontSize: '22px', fontWeight: 800 }}>{studentName}</div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>Class {batchGrade}</div>
        </div>

        {/* KPI Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '32px' }}>
          {[
            { label: 'Attendance Rate', value: `${attendanceRate}%`, color: '#32D74B' },
            { label: 'Average Score', value: `${avgScore}%`, color: '#0A84FF' },
            { label: 'Tests Taken', value: `${results.length}`, color: '#FF9F0A' },
          ].map(kpi => (
            <div key={kpi.label} style={{ padding: '16px', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>{kpi.label}</div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: kpi.color }}>{kpi.value}</div>
            </div>
          ))}
        </div>

        {/* Results Table */}
        {results.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px', color: 'rgba(255,255,255,0.8)' }}>Test Results</div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                  {['Date', 'Test Title', 'Score', 'Percentage'].map(h => (
                    <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => {
                  const pct = Math.round((r.obtainedMarks / r.totalMarks) * 100)
                  return (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '10px 12px', fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{new Date(r.date).toLocaleDateString('en-IN')}</td>
                      <td style={{ padding: '10px 12px', fontSize: '13px', fontWeight: 600 }}>{r.title}</td>
                      <td style={{ padding: '10px 12px', fontSize: '13px' }}>{r.obtainedMarks}/{r.totalMarks}</td>
                      <td style={{ padding: '10px 12px', fontSize: '13px', fontWeight: 700, color: pct >= 80 ? '#32D74B' : pct >= 40 ? '#FF9F0A' : '#FF453A' }}>{pct}%</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Attendance Summary */}
        <div>
          <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px', color: 'rgba(255,255,255,0.8)' }}>Attendance Summary (Last 30 days)</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '6px' }}>
            {attendances.slice(-30).map((a, i) => (
              <div key={i} title={a.status} style={{
                width: '100%', paddingTop: '100%', borderRadius: '4px',
                backgroundColor: a.status === 'PRESENT' ? '#32D74B' : a.status === 'ABSENT' ? '#FF453A' : a.status === 'LATE' ? '#FF9F0A' : 'rgba(255,255,255,0.1)',
              }} />
            ))}
          </div>
          <div style={{ display: 'flex', gap: '16px', marginTop: '12px', fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>
            {[['#32D74B', 'Present'], ['#FF453A', 'Absent'], ['#FF9F0A', 'Late']].map(([c, l]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: c }} />
                {l}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: '40px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>
          <span>EliteAcademy — Confidential Report</span>
          <span>Generated automatically by EliteAcademy Portal</span>
        </div>
      </div>
    </div>
  )
}
