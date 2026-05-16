'use server'

import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function enrollStudent(batchId: string) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'STUDENT') {
    return { success: false, error: 'Unauthorized' }
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { batchId }
    })
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Database error' }
  }
}
