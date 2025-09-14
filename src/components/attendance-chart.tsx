"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Cell } from "recharts"

const data = [
  { name: "Mon", total: 90 },
  { name: "Tue", total: 0 },
  { name: "Wed", total: 30 },
  { name: "Thu", total: 0 },
  { name: "Fri", total: 85 },
]

export function AttendanceChart() {
  return (
    <ResponsiveContainer width="100%" height={150}>
      <BarChart data={data} barGap={8}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}%`}
          hide={true}
        />
        <Bar dataKey="total" radius={[4, 4, 0, 0]}>
           {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.total > 50 ? "hsl(var(--primary))" : "hsl(var(--accent))"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
