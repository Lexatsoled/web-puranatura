import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { SerieTemporal } from '../../data/metricsDashboard';

interface ChartSectionProps {
  serie: SerieTemporal;
}

const ChartSection: React.FC<ChartSectionProps> = ({ serie }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-emerald-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-700">{serie.nombre}</h3>
        {serie.objetivo && (
          <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
            Meta: {serie.objetivo} {serie.unidad}
          </span>
        )}
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={serie.puntos}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0fdf4" />
            <XAxis
              dataKey="label"
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
            />
            <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '0.375rem',
              }}
            />
            <Line
              type="monotone"
              dataKey="valor"
              stroke="#059669"
              strokeWidth={2}
              activeDot={{ r: 6 }}
              dot={{ fill: '#059669', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartSection;
