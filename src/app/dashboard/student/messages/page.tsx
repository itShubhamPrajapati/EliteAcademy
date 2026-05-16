import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getAdminId, getConversation } from '@/actions/shared/messages'
import { Card } from '@/components/ui/Card'
import ChatWindow from '@/components/ChatWindow'
import { MessageCircle } from 'lucide-react'

export default async function StudentMessagesPage() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'STUDENT') redirect('/login')

  const adminId = await getAdminId()
  if (!adminId) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-extrabold text-white">Ask a Doubt</h1>
        <Card className="p-12 flex flex-col items-center text-center">
          <MessageCircle className="text-white/20 mb-4" size={48} />
          <p className="text-white/40">No admin available. Please try again later.</p>
        </Card>
      </div>
    )
  }

  const { messages } = await getConversation(adminId)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Ask a Doubt</h1>
        <p className="text-white/50 mt-1">Chat directly with your teacher</p>
      </div>

      <Card className="h-[70vh] flex flex-col">
        <ChatWindow
          currentUserId={session.user.id}
          currentUserName={session.user.name ?? 'Student'}
          otherUserId={adminId}
          otherUserName="Teacher"
          initialMessages={messages as any[]}
        />
      </Card>
    </div>
  )
}
