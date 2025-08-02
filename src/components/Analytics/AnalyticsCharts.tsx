import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

interface AnalyticsChartProps {
  data: any[];
  type: 'line' | 'bar';
  xKey: string;
  yKey: string;
  title: string;
}

export const AnalyticsChart: React.FC<AnalyticsChartProps> = ({
  data,
  type,
  xKey,
  yKey,
  title,
}) => {
  const ChartComponent = type === 'line' ? LineChart : BarChart;
  const DataComponent = type === 'line' ? Line : Bar;

  return (
    <div className="w-full h-96 p-4">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <ResponsiveContainer width="100%" height="100%">
        <ChartComponent
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          <DataComponent
            type="monotone"
            dataKey={yKey}
            stroke="#8884d8"
            fill="#8884d8"
          />
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  );
};

interface AnalyticsDashboardProps {
  pageViews: any[];
  productViews: any[];
  conversions: any[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  pageViews,
  productViews,
  conversions,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      <AnalyticsChart
        data={pageViews}
        type="line"
        xKey="date"
        yKey="views"
        title="Vistas de Página"
      />
      <AnalyticsChart
        data={productViews}
        type="bar"
        xKey="product"
        yKey="views"
        title="Productos Más Vistos"
      />
      <AnalyticsChart
        data={conversions}
        type="line"
        xKey="date"
        yKey="rate"
        title="Tasa de Conversión"
      />
    </div>
  );
};
