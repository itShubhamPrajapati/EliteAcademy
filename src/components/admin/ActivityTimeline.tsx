'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, FileUp, UserPlus, Clock, MessageSquare, BookOpen } from 'lucide-react'

const mockActivities = [
  { id: '1', type: 'test', user: 'Shubham', action: 'submitted Science Mock Test', time: '2 mins ago', icon: CheckCircle2, color: 'text-success' },
  { id: '2', type: 'upload', user: 'Master Admin', action: 'uploaded Algebra PDF', time: '15 mins ago', icon: FileUp, color: 'text-primary' },
  { id: '3', type: 'user', user: 'Admin', action: 'added 3 new students to Class 10th', time: '1 hour ago', icon: UserPlus, color: 'text-warning' },
  { id: '4', type: 'attendance', user: 'System', action: 'Attendance marked for morning batch', time: '4 hours ago', icon: BookOpen, color: 'text-purple-400' },
  { id: '5', type: 'message', user: 'Rajesh (Parent)', action: 'sent a doubt inquiry', time: 'Yesterday', icon: MessageSquare, color: 'text-pink-400' },
]

export default function ActivityTimeline() {
  return (
    <div className="space-y-6">
      {mockActivities.map((activity, idx) => (
        <motion.div
          key={activity.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="relative pl-10 pb-6 group last:pb-0"
        >
          {/* Vertical Line */}
          {idx !== mockActivities.length - 1 && (
            <div className="absolute left-[19px] top-8 bottom-0 w-px bg-white/5 group-hover:bg-primary/20 transition-colors" />
          )}
          
          {/* Icon Circle */}
          <div className="absolute left-0 top-0 w-10 h-10 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center group-hover:border-primary/30 group-hover:bg-primary/5 transition-all">
            <activity.icon size={18} className={activity.color} />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">
                {activity.user}
              </p>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/20 uppercase tracking-widest">
                <Clock size={10} /> {activity.time}
              </div>
            </div>
            <p className="text-xs text-white/40 leading-relaxed">
              {activity.action}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
