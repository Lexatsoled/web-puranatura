import { useEffect, useState } from 'react';

interface Metrics {
  lcp: MetricData;
  fid: MetricData;
  cls: MetricData;
}

interface MetricData {
  p50: number;
  p75: number;
  p95: number;
  count: number;
}

export default function AdminPerformance() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);

  useEffect(() => {
    fetch('/api/admin/analytics/vitals')
      .then(r => r.json())
      .then(setMetrics);
  }, []);

  if (!metrics) return <div>Loading...</div>;

  return (
    <div className="performance-dashboard">
      <h1>Performance Metrics</h1>
      
      <MetricCard
        name="Largest Contentful Paint (LCP)"
        data={metrics.lcp}
        threshold={{ good: 2500, poor: 4000 }}
        unit="ms"
      />
      
      <MetricCard
        name="First Input Delay (FID)"
        data={metrics.fid}
        threshold={{ good: 100, poor: 300 }}
        unit="ms"
      />
      
      <MetricCard
        name="Cumulative Layout Shift (CLS)"
        data={metrics.cls}
        threshold={{ good: 0.1, poor: 0.25 }}
        unit=""
      />
    </div>
  );
}

interface MetricCardProps {
  name: string;
  data: MetricData;
  threshold: { good: number; poor: number };
  unit: string;
}

function MetricCard({ name, data, threshold, unit }: MetricCardProps) {
  const getRating = (value: number) => {
    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  };

  return (
    <div className="metric-card">
      <h3>{name}</h3>
      <div className={`metric-value ${getRating(data.p75)}`}>
        {data.p75.toFixed(2)}{unit}
        <span className="percentile">P75</span>
      </div>
      <div className="metric-details">
        <span>P50: {data.p50.toFixed(2)}{unit}</span>
        <span>P95: {data.p95.toFixed(2)}{unit}</span>
        <span>Count: {data.count}</span>
      </div>
    </div>
  );
}