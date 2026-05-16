import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getAdminInbox } from '@/actions/shared/messages'
import prisma from '@/lib/prisma'
import AdminMessageHub from './AdminMessageHub'

export default async function AdminMessagesPage() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') redirect('/login')

  const { threads } = await getAdminInbox()

  // Get all students and parents for initiating new conversations
  const contacts = await prisma.user.findMany({
    where: { role: { in: ['STUDENT', 'PARENT'] } },
    select: { id: true, name: true, role: true },
    orderBy: { name: 'asc' },
  })

  return (
    <AdminMessageHub
      adminId={session.user.id}
      adminName={session.user.name ?? 'Admin'}
      threads={threads as any}
      contacts={contacts}
    />
  )
}
