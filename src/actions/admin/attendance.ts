'use server'

import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export type AttendanceInput = {
  studentId: string
  status: 'PRESENT' | 'ABSENT' | 'LATE'
  remarks: string
}

export async function submitBulkAttendance(date: Date, records: AttendanceInput[]) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized' }
  }

  try {
    // We use a transaction to ensure all records and notifications are created consistently
    await prisma.$transaction(async (tx) => {
      for (const record of records) {
        // Create Attendance record
        await tx.attendance.create({
          data: {
            date: date,
            status: record.status,
            remarks: record.remarks,
            studentId: record.studentId
          }
        })

        // Fetch student to get parentId
        const student = await tx.user.findUnique({ where: { id: record.studentId }, select: { id: true, parentId: true, name: true } })
        
        if (student) {
          const formattedDate = date.toLocaleDateString()
          const message = `Attendance for ${student.name} on ${formattedDate}: ${record.status}`

          // Notify student
          await tx.notification.create({
            data: {
              userId: student.id,
              message: message
            }
          })

          // Notify parent if linked
          if (student.parentId) {
            await tx.notification.create({
              data: {
                userId: student.parentId,
                message: message
              }
            })
          }
        }
      }
    })

    return { success: true }
  } catch (error: any) {
    console.error("Submit Attendance Error:", error)
    return { success: false, error: error.message || "Failed to submit attendance" }
  }
}
