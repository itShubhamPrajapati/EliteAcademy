'use client'

import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'

// Glassmorphic custom tooltip
const GlassTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-black/80 backdrop-blur-2xl border border-white/10 rounded-2xl px-4 py-3 shadow-2xl">
      <p className="text-xs text-white/50 mb-2 font-medium uppercase tracking-wider">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-white/60">{p.name}:</span>
          <span className="text-white font-bold">{typeof p.value === 'number' ? p.value.toFixed(1) : p.value}</span>
        </div>
      ))}
    </div>
  )
}

export function BatchPerformanceChart({ data }: { data: { batch: string; avg: number; count: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} barSize={32} margin={{ top: 4, right: 4, left: -24, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis dataKey="batch" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis domain={[0, 100]} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
        <Tooltip content={<GlassTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
        <Bar dataKey="avg" name="Avg Score %" fill="#0A84FF" radius={8}
          background={{ fill: 'rgba(255,255,255,0.02)', radius: 8 }}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function AttendanceTrendChart({ data }: { data: { date: string; rate: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 4, right: 4, left: -24, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis domain={[0, 100]} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
        <Tooltip content={<GlassTooltip />} />
        <Line
          type="monotone" dataKey="rate" name="Attendance %" stroke="#32D74B"
          strokeWidth={2.5} dot={{ fill: '#32D74B', r: 4, strokeWidth: 0 }}
          activeDot={{ r: 6, fill: '#32D74B', strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
