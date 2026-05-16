import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Sidebar from '@/components/ui/Sidebar'
import CommandPalette from '@/components/layout/CommandPalette'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  const role = session?.user?.role

  return (
    <div className="min-h-screen bg-black flex">
      <CommandPalette />
      <Sidebar role={role} />
      <main className="flex-1 overflow-y-auto min-h-screen custom-scrollbar">
        {/* Ambient background gradient */}
        <div className="fixed inset-0 -z-10 bg-black">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />
        </div>
        <div className="max-w-7xl mx-auto p-4 md:p-8 pb-28 md:pb-8">
          {children}
        </div>
      </main>
    </div>
  )
}
