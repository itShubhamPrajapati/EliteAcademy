'use server'
import { promises as fs } from 'fs'
import path from 'path'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function uploadMaterial(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'ADMIN') throw new Error('Unauthorized')

  const file = formData.get('file') as File | null
  const title = formData.get('title') as string
  const batchId = formData.get('batchId') as string

  if (!file || !title || !batchId) {
    return { error: 'Missing required fields' }
  }

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'materials')
  await fs.mkdir(uploadDir, { recursive: true })
  
  const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`
  const filePath = path.join(uploadDir, fileName)
  
  await fs.writeFile(filePath, buffer)

  await prisma.studyMaterial.create({
    data: {
      title,
      fileUrl: `/uploads/materials/${fileName}`,
      batchId
    }
  })

  return { success: true }
}

export async function deleteMaterial(id: string) {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'ADMIN') throw new Error('Unauthorized')

  try {
    const material = await prisma.studyMaterial.findUnique({
      where: { id }
    })

    if (material) {
      try {
        const filePath = path.join(process.cwd(), 'public', material.fileUrl)
        await fs.unlink(filePath)
      } catch (err) {
        console.error('File unlink error:', err)
      }

      await prisma.studyMaterial.delete({
        where: { id }
      })
    }

    return { success: true }
  } catch (error: any) {
    console.error('Delete Material Error:', error)
    return { success: false, error: error.message || 'Failed to delete material' }
  }
}
