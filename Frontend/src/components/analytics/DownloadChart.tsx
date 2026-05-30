// src/components/analytics/DownloadChart.tsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface ChartData {
  fileName: string;
  downloadCount: number;
  uuid: string;
}

interface DownloadChartProps {
  data: ChartData[];
}

const COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1',
];

// Custom tooltip component to avoid type issues with recharts v3
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: '#1E293B',
          border: '1px solid #334155',
          borderRadius: '8px',
          color: '#F1F5F9',
          padding: '8px 12px',
        }}
      >
        <p style={{ margin: 0, fontSize: '13px' }}>{`File: ${label}`}</p>
        <p style={{ margin: '2px 0 0', fontSize: '13px', fontWeight: 500 }}>
          {`${payload[0].value} downloads`}
        </p>
      </div>
    );
  }
  return null;
};

export const DownloadChart = ({ data }: DownloadChartProps) => {
  const formattedData = data.map((item, index) => ({
    ...item,
    shortName: item.fileName.length > 15
      ? item.fileName.substring(0, 12) + '...'
      : item.fileName,
    color: COLORS[index % COLORS.length],
  }));

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-80 text-slate-400">
        No download data available yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={formattedData}
        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis
          dataKey="shortName"
          angle={-45}
          textAnchor="end"
          height={60}
          interval={0}
          tick={{ fontSize: 12, fill: '#94A3B8' }}
        />
        <YAxis allowDecimals={false} tick={{ fill: '#94A3B8' }} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="downloadCount" radius={[4, 4, 0, 0]}>
          {formattedData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};