/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from "react";
import { store } from "./explorerStore";

export function useDashboardController() {
  const dashboards = store.getState().dashboards;
  const [selectedDashboardId, setSelectedDashboardId] = useState<string>(dashboards[0]?.id || "");
  const [timeframe, setTimeframe] = useState<"7d" | "30d" | "all">("7d");

  const activeDashboard = useMemo(() => {
    return dashboards.find((d) => d.id === selectedDashboardId) || dashboards[0] || null;
  }, [selectedDashboardId, dashboards]);

  // Adjust mock data slightly based on timeframe selector for interactivity!
  const adjustedChartData = useMemo(() => {
    if (!activeDashboard) return [];
    const base = activeDashboard.chartData;
    if (timeframe === "30d") {
      return base.map((d) => ({ ...d, value: Math.round(d.value * 1.25) }));
    }
    if (timeframe === "all") {
      return base.map((d) => ({ ...d, value: Math.round(d.value * 1.8) }));
    }
    return base;
  }, [activeDashboard, timeframe]);

  return {
    dashboards,
    selectedDashboardId,
    setSelectedDashboardId,
    timeframe,
    setTimeframe,
    activeDashboard,
    adjustedChartData,
  };
}
