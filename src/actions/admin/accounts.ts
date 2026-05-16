'use server'

import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function createStudentWithParent(data: {
  studentName: string
  studentEmail: string
  batchId: string
  parentName: string
  parentEmail: string
}) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') throw new Error('Unauthorized')

    const hashedPassword = await bcrypt.hash('password123', 10)

    // Atomic transaction to create both and link them
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create Parent (if not exists, or just create new)
      let parent = await tx.user.findUnique({ where: { email: data.parentEmail } })
      if (!parent) {
        parent = await tx.user.create({
          data: {
            name: data.parentName,
            email: data.parentEmail,
            password: hashedPassword,
            role: 'PARENT',
          }
        })
      }

      // 2. Create Student linked to Parent
      const student = await tx.user.create({
        data: {
          name: data.studentName,
          email: data.studentEmail,
          password: hashedPassword,
          role: 'STUDENT',
          batchId: data.batchId,
          parentId: parent.id,
        }
      })

      return { student, parent }
    })

    revalidatePath('/dashboard/admin/accounts')
    return { success: true, data: result }
  } catch (error: any) {
    console.error("Atomic create error:", error)
    return { success: false, error: error.message }
  }
}

export async function toggleUserStatus(userId: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') throw new Error('Unauthorized')

    const user = await prisma.user.findUnique({ where: { id: userId }, select: { isActive: true } })
    if (!user) throw new Error('User not found')

    await prisma.user.update({
      where: { id: userId },
      data: { isActive: !user.isActive }
    })
    
    revalidatePath('/dashboard/admin/accounts')
    return { success: true, newStatus: !user.isActive }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function resetPassword(userId: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') throw new Error('Unauthorized')

    const hashedPassword = await bcrypt.hash('password123', 10)
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    })
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function searchUsers(query: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') throw new Error('Unauthorized')

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query } },
          { email: { contains: query } },
        ]
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
      take: 10,
    })

    return { success: true, data: users }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function getUser360Data(userId: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') throw new Error('Unauthorized')

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        batch: true,
        parent: true,
        testScores: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        attendance: {
          orderBy: { date: 'desc' },
          take: 10,
        },
      }
    })

    if (!user) throw new Error('User not found')

    return { success: true, data: user }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
