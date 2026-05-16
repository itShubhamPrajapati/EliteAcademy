'use client'

import { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getNotifications, markNotificationRead } from '@/actions/shared/notifications'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'

type Notification = {
  id: string
  message: string
  readStatus: boolean
  createdAt: Date
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  const fetchNotifs = async () => {
    const res = await getNotifications()
    if (res.success && res.notifications) {
      setNotifications(res.notifications)
      setUnreadCount(res.notifications.filter(n => !n.readStatus).length)
    }
  }

  useEffect(() => {
    fetchNotifs()
    const interval = setInterval(fetchNotifs, 30000) // Poll every 30s for the "real-time" feel
    return () => clearInterval(interval)
  }, [])

  const handleMarkRead = async (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, readStatus: true } : n))
    setUnreadCount(prev => Math.max(0, prev - 1))
    await markNotificationRead(id)
  }

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="relative p-2 rounded-full hover:bg-muted transition-colors flex items-center justify-center"
      >
        <Bell size={20} className="text-foreground" />
        {unreadCount > 0 && (
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-0.5 right-0.5 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center rounded-full"
          >
            {unreadCount}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-80 z-50 origin-top-right"
          >
            <Card className="shadow-xl">
              <CardHeader className="p-4 border-b border-border bg-muted/30">
                <CardTitle className="text-sm">Notifications</CardTitle>
              </CardHeader>
              <CardContent className="p-0 max-h-[300px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-sm text-muted-foreground">No notifications.</div>
                ) : (
                  <div className="flex flex-col">
                    {notifications.map(n => (
                      <div 
                        key={n.id} 
                        onClick={() => !n.readStatus && handleMarkRead(n.id)}
                        className={`p-4 text-sm border-b border-border/50 cursor-pointer transition-colors ${!n.readStatus ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-muted/50'}`}
                      >
                        <div className={`mb-1 ${!n.readStatus ? 'font-bold text-foreground' : 'text-muted-foreground'}`}>
                          {n.message}
                        </div>
                        <div className="text-[10px] text-muted-foreground/70">
                          {new Date(n.createdAt).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
