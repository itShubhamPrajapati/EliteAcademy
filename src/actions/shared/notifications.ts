'use server'

import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function getNotifications() {
  const session = await getServerSession(authOptions)
  if (!session) return { success: false, notifications: [] }

  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 10
    })
    return { success: true, notifications }
  } catch (error) {
    return { success: false, notifications: [] }
  }
}

export async function markNotificationRead(id: string) {
  const session = await getServerSession(authOptions)
  if (!session) return { success: false }

  try {
    await prisma.notification.update({
      where: { id, userId: session.user.id },
      data: { readStatus: true }
    })
    return { success: true }
  } catch (error) {
    return { success: false }
  }
}
