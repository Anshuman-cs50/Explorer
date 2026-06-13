/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useDashboardController } from "../logic/dashboardLogic";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, BarChart3, Database, Calendar } from "lucide-react";

export function DashboardWorkspace() {
  const d = useDashboardController();

  if (!d.activeDashboard) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-400">
        <BarChart3 className="w-12 h-12 mb-2 animate-bounce" />
        <span>No dashboards loaded.</span>
      </div>
    );
  }

  return (
    <div className="flex h-full gap-6">
      {/* Sidebar Controls */}
      <div className="w-1/4 flex flex-col gap-2 pr-4 border-r border-white/10">
        <span className="text-xs font-semibold uppercase tracking-wider text-white/40 px-2 mb-2">My Dashboards</span>
        {d.dashboards.map((dash) => (
          <button
            key={dash.id}
            onClick={() => d.setSelectedDashboardId(dash.id)}
            className={`flex flex-col gap-1 px-4 py-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
              d.selectedDashboardId === dash.id
                ? "bg-amber-500/20 border-amber-400/40 text-amber-200 shadow-lg"
                : "bg-white/5 border-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            <span className="font-semibold text-sm truncate flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5" /> {dash.title}
            </span>
            <div className="flex justify-between items-end mt-1.5">
              <span className="font-bold text-base text-white">{dash.metric}</span>
              <span className="text-[10px] text-emerald-400 font-bold flex items-center bg-emerald-500/15 px-1.5 py-0.5 rounded">
                {dash.growth}
              </span>
            </div>
          </button>
        ))}

        <span className="text-xs font-semibold uppercase tracking-wider text-white/40 px-2 mt-6 mb-2">Timeframe Filter</span>
        <div className="flex flex-col gap-1">
          {([
            { id: "7d", label: "Past 7 days" },
            { id: "30d", label: "Past 30 days (+25%)" },
            { id: "all", label: "All historic data (+80%)" },
          ] as const).map((t) => (
            <button
              key={t.id}
              onClick={() => d.setTimeframe(t.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs text-left font-medium transition-all cursor-pointer ${
                d.timeframe === t.id
                  ? "bg-white/15 text-white border border-white/10"
                  : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Dashboard Canvas */}
      <div className="flex-1 flex flex-col gap-5 overflow-hidden">
        {/* Metabase Mock Connection Status bar */}
        <div className="flex justify-between items-center bg-white/5 px-6 py-4 rounded-3xl border border-white/5">
          <div>
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-amber-400" /> Metabase API Proxy Active
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Synchronized with dashboard instance <strong className="text-amber-200">#{d.activeDashboard.id}</strong>
            </p>
          </div>
          <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" /> Connection Stable
          </span>
        </div>

        {/* Chart Card */}
        <div className="flex-1 bg-black/25 p-6 rounded-3xl border border-white/10 flex flex-col gap-4 overflow-hidden relative shadow-inner">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Metrics Volume</span>
              <h4 className="text-2xl font-bold text-white flex items-baseline gap-2 mt-0.5">
                {d.activeDashboard.metric}
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-0.5">
                  <TrendingUp className="w-3.5 h-3.5" /> {d.activeDashboard.growth}
                </span>
              </h4>
            </div>
          </div>

          <div className="flex-1 min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={d.adjustedChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.9)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Area type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={2.5} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardWorkspace;
