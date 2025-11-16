import React, { useEffect, useState } from "react";
import { type PerformanceAlert, DEFAULT_PERFORMANCE_ALERTS } from "@/utils/performance/alerts";
import { usePerformanceAlertHook } from "./usePerformanceAlertHook";

export const PerformanceAlertBanner: React.FC = () => {
  const { getActiveAlerts, clearAlerts } = usePerformanceAlertHook(DEFAULT_PERFORMANCE_ALERTS);
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);

  useEffect(() => {
    const updateAlerts = () => setAlerts(getActiveAlerts());
    updateAlerts();
    const interval = setInterval(updateAlerts, 10000);
    return () => clearInterval(interval);
  }, [getActiveAlerts]);

  if (alerts.length === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[10000] bg-red-600 text-white p-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">??</span>
          <div>
            <h3 className="font-bold">Performance Regression Detected</h3>
            <p className="text-sm opacity-90">
              {`${alerts.length} alert${alerts.length > 1 ? 's' : ''} - Check console for details`}
            </p>
          </div>
        </div>
        <button onClick={clearAlerts} className="px-3 py-1 bg-red-700 hover:bg-red-800 rounded transition-colors">
          Dismiss
        </button>
      </div>
    </div>
  );
};
