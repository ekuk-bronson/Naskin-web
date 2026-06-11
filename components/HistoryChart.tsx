'use client';

import {
  CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { scoreColor } from '@/lib/riskLevels';
import type { MoleHistoryPoint } from '@/lib/types';

/** Линейный график динамики score — жёсткая сетка, чернильные оси. */
export default function HistoryChart({ history }: { history: MoleHistoryPoint[] }) {
  if (history.length === 0) {
    return (
      <p className="font-label text-[10px] uppercase tracking-wider text-grey text-center py-8">
        Нет данных
      </p>
    );
  }
  const last = history[history.length - 1];

  return (
    <div className="h-44">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={history} margin={{ top: 8, right: 8, bottom: 0, left: -28 }}>
          <CartesianGrid stroke="#DDDAD2" vertical={false} />
          <XAxis
            dataKey="m"
            tick={{ fontSize: 10, fill: '#6E6C66', fontFamily: 'var(--font-label)' }}
            axisLine={{ stroke: '#141412', strokeWidth: 2 }}
            tickLine={false}
          />
          <YAxis
            domain={[0, 10]}
            tick={{ fontSize: 10, fill: '#6E6C66', fontFamily: 'var(--font-label)' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 0,
              border: '2px solid #141412',
              fontSize: 12,
              background: '#fff',
              fontFamily: 'var(--font-label)',
            }}
            labelStyle={{ color: '#6E6C66' }}
            formatter={(v) => [String(v), 'Оценка']}
          />
          <Line
            type="linear"
            dataKey="s"
            stroke={scoreColor(last.s)}
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 0, fill: '#141412' }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
