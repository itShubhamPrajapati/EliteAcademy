'use client'

import { motion } from 'framer-motion'
import { format, subDays, isSameDay } from 'date-fns'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'

type Attendance = {
  id: string
  date: Date
  status: string
  remarks: string | null
}

export default function AttendanceHeatmap({ attendances }: { attendances: Attendance[] }) {
  // Generate last 30 days
  const today = new Date()
  const days = Array.from({ length: 30 }).map((_, i) => subDays(today, 29 - i)).reverse()

  const getStatus = (date: Date) => {
    const record = attendances.find(a => isSameDay(new Date(a.date), date))
    return record ? record.status : 'NONE'
  }

  const getColor = (status: string) => {
    if (status === 'PRESENT') return 'bg-primary'
    if (status === 'ABSENT') return 'bg-destructive'
    if (status === 'LATE') return 'bg-warning'
    return 'bg-background border border-border'
  }

  const presentCount = attendances.filter(a => a.status === 'PRESENT').length
  const totalCount = attendances.length
  const percentage = totalCount === 0 ? 0 : Math.round((presentCount / totalCount) * 100)

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center pb-2">
        <CardTitle className="text-base font-bold text-foreground">30-Day Attendance</CardTitle>
        <div className="text-xs font-semibold bg-primary/10 text-primary px-2 py-1 rounded-full">{percentage}% Present</div>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-wrap gap-1.5 pt-4">
          {days.map((day, i) => {
            const status = getStatus(day)
            return (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.01 }}
                title={`${format(day, 'MMM d')}: ${status}`}
                className={`w-6 h-6 rounded-[4px] transition-transform hover:scale-110 cursor-pointer ${getColor(status)}`}
              />
            )
          })}
        </div>

        <div className="flex gap-4 mt-6 text-xs font-semibold text-muted-foreground flex-wrap">
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-primary rounded-[2px]"></div> Present</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-destructive rounded-[2px]"></div> Absent</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-warning rounded-[2px]"></div> Late</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-background border border-border rounded-[2px]"></div> None</div>
        </div>
      </CardContent>
    </Card>
  )
}
