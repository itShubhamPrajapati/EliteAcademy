'use client'

import { motion } from 'framer-motion'
import { 
  format, 
  isSameDay, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth 
} from 'date-fns'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Calendar } from 'lucide-react'

type Attendance = {
  id: string
  date: Date
  status: string
  remarks: string | null
}

export default function AttendanceHeatmap({ attendances }: { attendances: Attendance[] }) {
  const today = new Date()
  
  // Get days of the current month, padded to full weeks starting on Monday
  const monthStart = startOfMonth(today)
  const monthEnd = endOfMonth(today)
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })
  
  const daysInGrid = eachDayOfInterval({ start: gridStart, end: gridEnd })

  const getRecord = (date: Date) => {
    return attendances.find(a => isSameDay(new Date(a.date), date))
  }

  // Calculate statistics
  const totalCount = attendances.length
  const presentCount = attendances.filter(a => a.status === 'PRESENT').length
  const lateCount = attendances.filter(a => a.status === 'LATE').length
  const absentCount = attendances.filter(a => a.status === 'ABSENT').length
  
  // Overall standing: Present gives 1.0, Late gives 0.5
  const scorePercentage = totalCount === 0 
    ? 0 
    : Math.round(((presentCount + lateCount * 0.5) / totalCount) * 100)

  // SVG Circular progress configurations
  const radius = 50
  const stroke = 8
  const normalizedRadius = radius - stroke * 2
  const circumference = normalizedRadius * 2 * Math.PI
  const strokeDashoffset = circumference - (scorePercentage / 100) * circumference

  return (
    <Card className="border-white/5 bg-white/[0.01] overflow-hidden">
      <CardHeader className="border-b border-white/10 pb-4 bg-white/[0.01]">
        <CardTitle className="text-xl flex items-center gap-2 text-white">
          <Calendar className="text-primary" size={20} />
          Academic Attendance Hub
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* LEFT COLUMN: Premium SVG Circular Loader */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-4">Overall Standing</h4>
            <div className="relative flex items-center justify-center w-36 h-36">
              <svg className="w-full h-full transform -rotate-90">
                {/* Track circle */}
                <circle
                  className="text-white/[0.03] stroke-current"
                  strokeWidth={stroke}
                  fill="transparent"
                  r={normalizedRadius}
                  cx={radius * 1.4}
                  cy={radius * 1.4}
                  style={{ transform: 'scale(1.4)', transformOrigin: 'center' }}
                />
                {/* Progress Circle with Glow */}
                <motion.circle
                  className="stroke-current text-primary"
                  strokeWidth={stroke}
                  strokeDasharray={circumference + ' ' + circumference}
                  style={{ 
                    strokeDashoffset, 
                    transform: 'scale(1.4)', 
                    transformOrigin: 'center',
                    filter: 'drop-shadow(0 0 6px rgba(10, 132, 255, 0.4))'
                  }}
                  strokeLinecap="round"
                  fill="transparent"
                  r={normalizedRadius}
                  cx={radius * 1.4}
                  cy={radius * 1.4}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                />
              </svg>
              {/* Central Text */}
              <div className="absolute text-center">
                <span className="text-3xl font-black text-white tracking-tight">{scorePercentage}%</span>
                <p className="text-[9px] font-bold text-white/40 uppercase tracking-wider mt-0.5">Attendance</p>
              </div>
            </div>

            {/* Attendance Counts Strip */}
            <div className="grid grid-cols-3 gap-3 w-full mt-6 text-center">
              <div className="p-2 rounded-xl bg-white/[0.01] border border-white/5">
                <p className="text-[10px] text-white/30 font-bold uppercase tracking-wider">Pres</p>
                <p className="text-sm font-black text-success mt-0.5">{presentCount}</p>
              </div>
              <div className="p-2 rounded-xl bg-white/[0.01] border border-white/5">
                <p className="text-[10px] text-white/30 font-bold uppercase tracking-wider">Late</p>
                <p className="text-sm font-black text-warning mt-0.5">{lateCount}</p>
              </div>
              <div className="p-2 rounded-xl bg-white/[0.01] border border-white/5">
                <p className="text-[10px] text-white/30 font-bold uppercase tracking-wider">Abs</p>
                <p className="text-sm font-black text-destructive mt-0.5">{absentCount}</p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Monthly Calendar Grid */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-white tracking-tight">
                {format(today, 'MMMM yyyy')}
              </h3>
              <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                Active Term
              </div>
            </div>

            {/* Weekdays row */}
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-white/30 uppercase tracking-widest pb-1 border-b border-white/5">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(w => (
                <div key={w}>{w}</div>
              ))}
            </div>

            {/* Calendar Days Matrix */}
            <div className="grid grid-cols-7 gap-2">
              {daysInGrid.map((day, idx) => {
                const isCurrentMonth = isSameMonth(day, today)
                const record = getRecord(day)
                const status = record ? record.status : 'NONE'
                const isToday = isSameDay(day, today)

                let cellStyle = 'bg-white/[0.01] text-white/20 border-white/[0.02]'
                let tooltipText = `${format(day, 'MMMM d')}: No Record`

                if (isCurrentMonth) {
                  if (status === 'PRESENT') {
                    cellStyle = 'bg-success/20 text-success border-success/30 hover:bg-success/30 hover:shadow-[0_0_12px_rgba(50,215,75,0.2)]'
                    tooltipText = `${format(day, 'MMMM d')}: Present (${record?.remarks || 'On Time'})`
                  } else if (status === 'ABSENT') {
                    cellStyle = 'bg-destructive/20 text-destructive border-destructive/30 hover:bg-destructive/30 hover:shadow-[0_0_12px_rgba(255,69,58,0.2)]'
                    tooltipText = `${format(day, 'MMMM d')}: Absent (${record?.remarks || 'Excused'})`
                  } else if (status === 'LATE') {
                    cellStyle = 'bg-warning/20 text-warning border-warning/30 hover:bg-warning/30 hover:shadow-[0_0_12px_rgba(255,159,10,0.2)]'
                    tooltipText = `${format(day, 'MMMM d')}: Late (${record?.remarks || 'Delayed'})`
                  } else {
                    cellStyle = 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10 hover:text-white'
                  }
                }

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.005 }}
                    title={tooltipText}
                    className={`h-11 rounded-xl flex flex-col items-center justify-center border text-xs font-bold transition-all duration-300 relative cursor-help ${cellStyle} ${
                      isToday ? 'ring-2 ring-primary ring-offset-2 ring-offset-black' : ''
                    } ${!isCurrentMonth ? 'opacity-20' : ''}`}
                  >
                    <span>{format(day, 'd')}</span>
                    {isToday && (
                      <span className="w-1.5 h-1.5 bg-primary rounded-full absolute bottom-1 shadow-[0_0_4px_#0A84FF]"></span>
                    )}
                  </motion.div>
                )
              })}
            </div>

            {/* Elegant Legend underneath */}
            <div className="flex flex-wrap gap-4 pt-4 border-t border-white/5 text-[10px] font-bold text-white/40 uppercase tracking-widest justify-center sm:justify-start">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-md bg-success/20 border border-success/30"></span> Present
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-md bg-warning/20 border border-warning/30"></span> Late (0.5x)
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-md bg-destructive/20 border border-destructive/30"></span> Absent
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-md bg-white/5 border border-white/10"></span> Scheduled
              </div>
            </div>

          </div>
          
        </div>
      </CardContent>
    </Card>
  )
}
