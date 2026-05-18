import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Sidebar from '@/components/ui/Sidebar'
import CommandPalette from '@/components/layout/CommandPalette'
import NotificationBell from '@/components/ui/NotificationBell'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  const role = session?.user?.role

  return (
    <div className="min-h-screen bg-black flex">
      <CommandPalette />
      <Sidebar role={role} />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Global sticky Glassmorphic Header */}
        <header className="h-20 border-b border-white/5 bg-black/40 backdrop-blur-2xl px-6 md:px-8 flex items-center justify-between shrink-0 z-40">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
              Enterprise v2.0
            </span>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Notification Bell */}
            <div className="relative">
              <NotificationBell />
            </div>

            {/* Profile Avatar Card */}
            <div className="flex items-center gap-3 pl-4 border-l border-white/10">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-white tracking-tight">{session?.user?.name}</p>
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.15em] mt-0.5">{role}</p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 text-sm font-bold uppercase shadow-inner">
                {session?.user?.name?.charAt(0) || 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Scroll Area */}
        <main className="flex-1 overflow-y-auto custom-scrollbar relative">
          {/* Ambient background gradient */}
          <div className="absolute inset-0 -z-10 bg-black pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px]" />
          </div>
          <div className="max-w-7xl mx-auto p-4 md:p-8 pb-28 md:pb-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
