'use server'

import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { writeFile } from 'fs/promises'
import path from 'path'

export async function uploadIndividualResult(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized' }
  }

  const studentId = formData.get('studentId') as string
  const title = formData.get('title') as string
  const totalMarks = parseInt(formData.get('totalMarks') as string)
  const obtainedMarks = parseInt(formData.get('obtainedMarks') as string)
  const file = formData.get('file') as File | null

  if (!studentId || !title || isNaN(totalMarks) || isNaN(obtainedMarks)) {
    return { success: false, error: 'Missing or invalid fields' }
  }

  try {
    let pdfFileUrl = null

    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const filename = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`
      const filepath = path.join(process.cwd(), 'public', 'uploads', 'results', filename)
      
      // Ensure directory exists (we can rely on public/uploads if already exists, but better to check. Assuming public/uploads exists, we might need public/uploads/results)
      const fs = await import('fs')
      const dir = path.join(process.cwd(), 'public', 'uploads', 'results')
      if (!fs.existsSync(dir)){
          fs.mkdirSync(dir, { recursive: true })
      }

      await writeFile(filepath, buffer)
      pdfFileUrl = `/uploads/results/${filename}`
    }

    const student = await prisma.user.findUnique({ where: { id: studentId }, select: { id: true, parentId: true, name: true } })

    if (!student) {
      return { success: false, error: 'Student not found' }
    }

    await prisma.$transaction(async (tx) => {
      await tx.individualResult.create({
        data: {
          studentId,
          title,
          totalMarks,
          obtainedMarks,
          pdfFileUrl
        }
      })

      const message = `New Result Uploaded for ${student.name}: ${title}. Score: ${obtainedMarks}/${totalMarks}`

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
    })

    return { success: true }
  } catch (error: any) {
    console.error("Upload Result Error:", error)
    return { success: false, error: error.message || "Failed to upload result" }
  }
}
