'use client'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function PerformanceChart({ data }: { data: any[] }) {
  return (
    <div className="h-48 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="testName" fontSize={10} tick={{ fill: 'var(--color-on-surface-variant)' }} />
          <YAxis fontSize={10} tick={{ fill: 'var(--color-on-surface-variant)' }} />
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--color-surface-container-lowest)', borderRadius: '8px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
          />
          <Line type="monotone" dataKey="percentage" stroke="var(--color-primary)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
