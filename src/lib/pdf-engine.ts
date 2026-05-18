'use client'

import jsPDF from 'jspdf'

export function generateReportCardPDF(
  studentName: string,
  batchName: string,
  testScores: any[],
  individualResults: any[]
) {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()

  // Primary Theme Colors (EliteAcademy Blue)
  const primaryColor = [10, 132, 255] // #0A84FF
  const secondaryColor = [142, 142, 147] // Neutral gray
  const darkTextColor = [30, 30, 30] // Soft dark
  const borderLight = [230, 230, 230] // Table border
  
  // 1. BRANDED HEADER & ACCENT BAR
  pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
  pdf.rect(0, 0, pageWidth, 12, 'F') // Top blue solid bar

  // Header Title
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(22)
  pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
  pdf.text('ELITEACADEMY', 20, 28)

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(9)
  pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
  pdf.text('PREMIUM HIGH SCHOOL ACADEMICS & REPORTING', 20, 33)

  // Document Type Header
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(14)
  pdf.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2])
  pdf.text('ACADEMIC REPORT CARD', pageWidth - 20, 28, { align: 'right' })

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(9)
  pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
  pdf.text(`ISSUED: ${new Date().toLocaleDateString()}`, pageWidth - 20, 33, { align: 'right' })

  // Divider Line
  pdf.setDrawColor(borderLight[0], borderLight[1], borderLight[2])
  pdf.setLineWidth(0.5)
  pdf.line(20, 38, pageWidth - 20, 38)

  // 2. STUDENT METADATA PANEL
  pdf.setFillColor(248, 249, 250) // Very light gray card background
  pdf.setDrawColor(borderLight[0], borderLight[1], borderLight[2])
  pdf.rect(20, 44, pageWidth - 40, 26, 'F')
  pdf.rect(20, 44, pageWidth - 40, 26, 'S')

  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(10)
  pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
  pdf.text('STUDENT NAME', 25, 51)
  pdf.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2])
  pdf.setFontSize(12)
  pdf.text(studentName.toUpperCase(), 25, 57)

  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(10)
  pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
  pdf.text('ACADEMIC LEVEL / BATCH', 110, 51)
  pdf.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2])
  pdf.setFontSize(12)
  pdf.text(batchName.toUpperCase(), 110, 57)

  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(10)
  pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
  pdf.text('STATUS', 165, 51)
  pdf.setTextColor(50, 215, 75) // Green success
  pdf.setFontSize(11)
  pdf.text('ACTIVE', 165, 57)

  // 3. PERFORMANCE STATISTICS
  // Calculate average
  const totalTests = (testScores?.length || 0) + (individualResults?.length || 0)
  let sumPercentage = 0
  let completedTests = 0

  testScores?.forEach(t => {
    sumPercentage += (t.score / t.maxScore) * 100
    completedTests++
  })
  individualResults?.forEach(r => {
    sumPercentage += (r.obtainedMarks / r.totalMarks) * 100
    completedTests++
  })

  const avgPerf = completedTests > 0 ? (sumPercentage / completedTests).toFixed(1) : 'N/A'

  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(13)
  pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
  pdf.text('ACADEMIC METRICS SUMMARY', 20, 82)

  // Draw 2 summary columns
  pdf.setFillColor(250, 252, 255)
  pdf.setDrawColor(210, 225, 255)
  pdf.rect(20, 87, 80, 22, 'FD')
  
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(9)
  pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
  pdf.text('OVERALL ACADEMIC AVERAGE', 25, 93)
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(16)
  pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
  pdf.text(`${avgPerf}${avgPerf !== 'N/A' ? '%' : ''}`, 25, 102)

  pdf.setFillColor(250, 252, 255)
  pdf.setDrawColor(210, 225, 255)
  pdf.rect(110, 87, 80, 22, 'FD')

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(9)
  pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
  pdf.text('TOTAL EVALUATIONS COMPLETED', 115, 93)
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(16)
  pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
  pdf.text(`${totalTests} Exams`, 115, 102)

  // 4. MAIN ASSESSMENT RESULTS TABLE
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(13)
  pdf.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2])
  pdf.text('DETAILED ASSESSMENT SCORES', 20, 122)

  // Draw Table Headers
  let currentY = 127
  pdf.setFillColor(240, 242, 245)
  pdf.rect(20, currentY, pageWidth - 40, 9, 'F')
  pdf.setDrawColor(borderLight[0], borderLight[1], borderLight[2])
  pdf.line(20, currentY, pageWidth - 20, currentY)
  pdf.line(20, currentY + 9, pageWidth - 20, currentY + 9)

  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(9)
  pdf.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2])
  pdf.text('TEST NAME / TITLE', 24, currentY + 6)
  pdf.text('DATE', 95, currentY + 6)
  pdf.text('SCORE', 135, currentY + 6)
  pdf.text('PERCENTAGE', 165, currentY + 6)

  currentY += 9
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(9)

  // Merge lists to draw table rows
  const allRows: { name: string; date: string; score: string; percent: number }[] = []
  testScores?.forEach(t => {
    allRows.push({
      name: t.title || t.testName || 'Online Mock MCQ',
      date: new Date(t.createdAt || t.date).toLocaleDateString(),
      score: `${t.score} / ${t.maxScore}`,
      percent: parseFloat(((t.score / t.maxScore) * 100).toFixed(1))
    })
  })
  individualResults?.forEach(r => {
    allRows.push({
      name: r.title,
      date: new Date(r.date || r.createdAt).toLocaleDateString(),
      score: `${r.obtainedMarks} / ${r.totalMarks}`,
      percent: parseFloat(((r.obtainedMarks / r.totalMarks) * 100).toFixed(1))
    })
  })

  if (allRows.length === 0) {
    pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
    pdf.text('No assessment records found.', 25, currentY + 8)
    pdf.line(20, currentY + 12, pageWidth - 20, currentY + 12)
  } else {
    allRows.forEach((row, i) => {
      // Avoid page overflows
      if (currentY > pageHeight - 40) {
        pdf.addPage()
        currentY = 20
        // Draw standard small header on page 2
        pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
        pdf.rect(0, 0, pageWidth, 6, 'F')
        
        pdf.setFont('helvetica', 'bold')
        pdf.setFontSize(10)
        pdf.setTextColor(255, 255, 255)
        pdf.text('ACADEMIC ASSESSMENT DETAILED CONTINUED', 20, 15)
        pdf.line(20, 18, pageWidth - 20, 18)
        currentY = 24
      }

      // Alternating row background colors
      if (i % 2 === 1) {
        pdf.setFillColor(252, 252, 252)
        pdf.rect(20, currentY, pageWidth - 40, 8, 'F')
      }

      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(9)
      pdf.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2])
      
      const displayName = row.name.length > 35 ? row.name.substring(0, 32) + '...' : row.name
      pdf.text(displayName, 24, currentY + 5.5)
      pdf.text(row.date, 95, currentY + 5.5)
      pdf.text(row.score, 135, currentY + 5.5)

      if (row.percent >= 75) {
        pdf.setTextColor(40, 167, 69) // Success green
      } else if (row.percent >= 50) {
        pdf.setTextColor(253, 126, 20) // Warning orange
      } else {
        pdf.setTextColor(220, 53, 69) // Danger red
      }
      pdf.setFont('helvetica', 'bold')
      pdf.text(`${row.percent}%`, 165, currentY + 5.5)

      pdf.setDrawColor(borderLight[0], borderLight[1], borderLight[2])
      pdf.line(20, currentY + 8, pageWidth - 20, currentY + 8)
      currentY += 8
    })
  }

  // 5. SIGNATURE & STAMP BOX
  if (currentY > pageHeight - 65) {
    pdf.addPage()
    currentY = 30
  } else {
    currentY = Math.max(currentY + 20, pageHeight - 55)
  }

  pdf.setDrawColor(220, 220, 220)
  pdf.line(pageWidth - 80, currentY, pageWidth - 25, currentY)
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(9)
  pdf.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2])
  pdf.text('AUTHORIZED SIGNATORY', pageWidth - 52.5, currentY + 5, { align: 'center' })
  pdf.setFont('helvetica', 'normal')
  pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
  pdf.setFontSize(8)
  pdf.text('ELITEACADEMY ACADEMIC OFFICE', pageWidth - 52.5, currentY + 9, { align: 'center' })

  // CONFIRMATION SEAL
  pdf.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2])
  pdf.setLineWidth(0.8)
  pdf.rect(25, currentY - 10, 42, 16, 'S')
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(8)
  pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
  pdf.text('ELITEACADEMY', 46, currentY - 5, { align: 'center' })
  pdf.setFontSize(6)
  pdf.text('OFFICIAL VERIFIED', 46, currentY - 1, { align: 'center' })

  // Footer branding on all pages
  const totalPages = (pdf as any).internal.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(8)
    pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
    pdf.text(`EliteAcademy Enterprise Student Portal · Page ${i} of ${totalPages} · Confirmed Official Record`, 20, pageHeight - 8)
  }

  pdf.save(`${studentName.replace(/\s+/g, '_')}_Academic_Report.pdf`)
}

export function generateAttendancePDF(
  studentName: string,
  batchName: string,
  attendances: any[]
) {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()

  // Green Theme Color Palette for Attendance
  const successColor = [40, 167, 69] // Success green
  const secondaryColor = [142, 142, 147] // Neutral gray
  const darkTextColor = [30, 30, 30]
  const borderLight = [230, 230, 230]

  // Top header green stripe
  pdf.setFillColor(successColor[0], successColor[1], successColor[2])
  pdf.rect(0, 0, pageWidth, 12, 'F')

  // Main title
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(22)
  pdf.setTextColor(successColor[0], successColor[1], successColor[2])
  pdf.text('ELITEACADEMY', 20, 28)

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(9)
  pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
  pdf.text('PREMIUM HIGH SCHOOL ACADEMICS & REPORTING', 20, 33)

  // Doc Header
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(14)
  pdf.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2])
  pdf.text('ATTENDANCE LOG & HISTORY', pageWidth - 20, 28, { align: 'right' })

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(9)
  pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
  pdf.text(`GENERATED: ${new Date().toLocaleDateString()}`, pageWidth - 20, 33, { align: 'right' })

  // Divider Line
  pdf.setDrawColor(borderLight[0], borderLight[1], borderLight[2])
  pdf.setLineWidth(0.5)
  pdf.line(20, 38, pageWidth - 20, 38)

  // Student Details Panel
  pdf.setFillColor(248, 249, 250)
  pdf.rect(20, 44, pageWidth - 40, 26, 'F')
  pdf.rect(20, 44, pageWidth - 40, 26, 'S')

  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(10)
  pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
  pdf.text('STUDENT NAME', 25, 51)
  pdf.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2])
  pdf.setFontSize(12)
  pdf.text(studentName.toUpperCase(), 25, 57)

  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(10)
  pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
  pdf.text('ACADEMIC LEVEL / BATCH', 110, 51)
  pdf.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2])
  pdf.setFontSize(12)
  pdf.text(batchName.toUpperCase(), 110, 57)

  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(10)
  pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
  pdf.text('STATUS', 165, 51)
  pdf.setTextColor(successColor[0], successColor[1], successColor[2])
  pdf.setFontSize(11)
  pdf.text('ACTIVE', 165, 57)

  // Calculations for Attendance summary
  const totalDays = attendances?.length || 0
  const presentDays = attendances?.filter(a => a.status === 'PRESENT').length || 0
  const lateDays = attendances?.filter(a => a.status === 'LATE').length || 0
  const absentDays = attendances?.filter(a => a.status === 'ABSENT').length || 0
  const rate = totalDays > 0 ? ((presentDays + lateDays * 0.5) / totalDays * 100).toFixed(1) : 'N/A'

  // Calculations section title
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(13)
  pdf.setTextColor(successColor[0], successColor[1], successColor[2])
  pdf.text('ATTENDANCE METRICS SUMMARY', 20, 82)

  // Draw 4 Metric cards side by side
  const cardWidth = (pageWidth - 50) / 4
  const metrics = [
    { label: 'ATTENDANCE RATE', value: `${rate}${rate !== 'N/A' ? '%' : ''}` },
    { label: 'PRESENT DAYS', value: `${presentDays} Days` },
    { label: 'LATE DAYS', value: `${lateDays} Days` },
    { label: 'ABSENT DAYS', value: `${absentDays} Days` }
  ]

  metrics.forEach((m, idx) => {
    const x = 20 + idx * (cardWidth + 3)
    pdf.setFillColor(250, 255, 251)
    pdf.setDrawColor(210, 245, 215)
    pdf.rect(x, 87, cardWidth, 22, 'FD')

    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(7)
    pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
    pdf.text(m.label, x + 3, 93)

    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(13)
    pdf.setTextColor(successColor[0], successColor[1], successColor[2])
    pdf.text(m.value, x + 3, 102)
  })

  // Detailed Attendance History List
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(13)
  pdf.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2])
  pdf.text('DETAILED DAILY ATTENDANCE LOG', 20, 122)

  let currentY = 127
  pdf.setFillColor(240, 242, 245)
  pdf.rect(20, currentY, pageWidth - 40, 9, 'F')
  pdf.setDrawColor(borderLight[0], borderLight[1], borderLight[2])
  pdf.line(20, currentY, pageWidth - 20, currentY)
  pdf.line(20, currentY + 9, pageWidth - 20, currentY + 9)

  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(9)
  pdf.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2])
  pdf.text('DATE', 25, currentY + 6)
  pdf.text('STATUS', 85, currentY + 6)
  pdf.text('REMARKS / COMMENTS', 130, currentY + 6)

  currentY += 9
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(9)

  if (totalDays === 0) {
    pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
    pdf.text('No attendance logs found.', 25, currentY + 8)
    pdf.line(20, currentY + 12, pageWidth - 20, currentY + 12)
  } else {
    attendances.forEach((log, i) => {
      if (currentY > pageHeight - 40) {
        pdf.addPage()
        currentY = 20
        pdf.setFillColor(successColor[0], successColor[1], successColor[2])
        pdf.rect(0, 0, pageWidth, 6, 'F')

        pdf.setFont('helvetica', 'bold')
        pdf.setFontSize(10)
        pdf.setTextColor(255, 255, 255)
        pdf.text('ATTENDANCE LOG CONTINUED', 20, 15)
        pdf.line(20, 18, pageWidth - 20, 18)
        currentY = 24
      }

      if (i % 2 === 1) {
        pdf.setFillColor(252, 252, 252)
        pdf.rect(20, currentY, pageWidth - 40, 8, 'F')
      }

      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(9)
      pdf.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2])
      
      pdf.text(new Date(log.date).toLocaleDateString(), 25, currentY + 5.5)

      if (log.status === 'PRESENT') {
        pdf.setTextColor(40, 167, 69)
      } else if (log.status === 'LATE') {
        pdf.setTextColor(253, 126, 20)
      } else {
        pdf.setTextColor(220, 53, 69)
      }
      pdf.setFont('helvetica', 'bold')
      pdf.text(log.status, 85, currentY + 5.5)

      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
      const remarkText = log.remarks || 'Regular daily check-in'
      const displayRemark = remarkText.length > 40 ? remarkText.substring(0, 37) + '...' : remarkText
      pdf.text(displayRemark, 130, currentY + 5.5)

      pdf.setDrawColor(borderLight[0], borderLight[1], borderLight[2])
      pdf.line(20, currentY + 8, pageWidth - 20, currentY + 8)
      currentY += 8
    })
  }

  // Signature Block
  if (currentY > pageHeight - 65) {
    pdf.addPage()
    currentY = 30
  } else {
    currentY = Math.max(currentY + 20, pageHeight - 55)
  }

  pdf.setDrawColor(220, 220, 220)
  pdf.line(pageWidth - 80, currentY, pageWidth - 25, currentY)
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(9)
  pdf.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2])
  pdf.text('AUTHORIZED REGISTRAR', pageWidth - 52.5, currentY + 5, { align: 'center' })
  pdf.setFont('helvetica', 'normal')
  pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
  pdf.setFontSize(8)
  pdf.text('ELITEACADEMY ATTENDANCE BUREAU', pageWidth - 52.5, currentY + 9, { align: 'center' })

  // Stamp Box
  pdf.setDrawColor(successColor[0], successColor[1], successColor[2])
  pdf.setLineWidth(0.8)
  pdf.rect(25, currentY - 10, 42, 16, 'S')
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(8)
  pdf.setTextColor(successColor[0], successColor[1], successColor[2])
  pdf.text('ELITEACADEMY', 46, currentY - 5, { align: 'center' })
  pdf.setFontSize(6)
  pdf.text('ATTENDANCE CERTIFIED', 46, currentY - 1, { align: 'center' })

  const totalPages = (pdf as any).internal.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(8)
    pdf.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2])
    pdf.text(`EliteAcademy Enterprise Student Portal · Page ${i} of ${totalPages} · Confirmed Attendance Ledger`, 20, pageHeight - 8)
  }

  pdf.save(`${studentName.replace(/\s+/g, '_')}_Attendance_Log.pdf`)
}

export function downloadFile(url: string, filename: string) {
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
