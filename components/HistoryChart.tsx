'use client';

import {
  CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { scoreColor } from '@/lib/riskLevels';
import type { MoleHistoryPoint } from '@/lib/types';

/** Линейный график динамики score — аналог components/LineChart.tsx. */
export default function HistoryChart({ history }: { history: MoleHistoryPoint[] }) {
  if (history.length === 0) {
    return <p className="text-xs text-faint text-center py-8">Нет данных</p>;
  }
  const last = history[history.length - 1];

  return (
    <div className="h-44">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={history} margin={{ top: 8, right: 8, bottom: 0, left: -28 }}>
          <CartesianGrid stroke="#EDE9E3" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="m"
            tick={{ fontSize: 10, fill: '#C5BDB4' }}
            axisLine={{ stroke: '#EDE9E3' }}
            tickLine={false}
          />
          <YAxis
            domain={[0, 10]}
            tick={{ fontSize: 10, fill: '#C5BDB4' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: '1px solid #EDE9E3',
              fontSize: 12,
              background: '#fff',
            }}
            labelStyle={{ color: '#9A9087' }}
            formatter={(v) => [String(v), 'Оценка']}
          />
          <Line
            type="monotone"
            dataKey="s"
            stroke={scoreColor(last.s)}
            strokeWidth={2}
            dot={{ r: 3, strokeWidth: 0, fill: '#8B7355' }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
