'use server'

import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const messageSchema = z.object({
  text: z.string().min(1, 'Message cannot be empty').max(1000),
  receiverId: z.string().min(1),
})

export async function sendMessage(data: { text: string; receiverId: string }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return { success: false, error: 'Unauthorized' }

  const parsed = messageSchema.safeParse(data)
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message }

  try {
    const message = await prisma.message.create({
      data: {
        text: parsed.data.text,
        senderId: session.user.id,
        receiverId: parsed.data.receiverId,
      },
      include: {
        sender: { select: { id: true, name: true, role: true } },
      },
    })

    revalidatePath('/dashboard')
    return { success: true, message }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function getConversation(otherUserId: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return { success: false, messages: [] }

  const myId = session.user.id

  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: myId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: myId },
        ],
      },
      include: {
        sender: { select: { id: true, name: true, role: true } },
      },
      orderBy: { createdAt: 'asc' },
      take: 100,
    })
    return { success: true, messages }
  } catch (error) {
    return { success: false, messages: [] }
  }
}

export async function getAdminInbox() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || session.user.role !== 'ADMIN') return { success: false, threads: [] }

  try {
    // Get all unique users who messaged admin
    const messages = await prisma.message.findMany({
      where: { receiverId: session.user.id },
      include: { sender: { select: { id: true, name: true, role: true } } },
      orderBy: { createdAt: 'desc' },
    })

    const seen = new Set<string>()
    const threads: typeof messages = []
    for (const m of messages) {
      if (!seen.has(m.senderId)) {
        seen.add(m.senderId)
        threads.push(m)
      }
    }
    return { success: true, threads }
  } catch {
    return { success: false, threads: [] }
  }
}

export async function getAdminId() {
  const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' }, select: { id: true } })
  return admin?.id ?? null
}
