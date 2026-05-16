import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { UserDataTable } from '@/components/admin/UserDataTable'
import AccountManagementClient from '@/components/admin/AccountManagementClient'

export default async function AdminAccountsPage() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') redirect('/login')

  const batches = await prisma.batch.findMany({ select: { id: true, grade: true } })
  const users = await prisma.user.findMany({
    include: { 
      batch: { select: { grade: true } }, 
      parent: { select: { name: true } } 
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-8">
      <AccountManagementClient batches={batches} />
      <div className="bg-white/[0.02] border border-white/5 rounded-[32px] p-8">
        <UserDataTable data={users} />
      </div>
    </div>
  )
}
