"use client";

import React from "react";
import { DollarSign, PackageCheck, AlertTriangle, Users } from "lucide-react";
import { MetricCard } from "@/components/features/analytics/metric-card";
import { LiveFeed } from "@/components/features/analytics/live-feed";
import { useLiveAnalytics } from "@/hooks/use-websocket";
import { formatCurrency } from "@/lib/utils";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const sampleChartData = [
  { name: "00:00", revenue: 120, sales: 8 },
  { name: "04:00", revenue: 210, sales: 14 },
  { name: "08:00", revenue: 450, sales: 30 },
  { name: "12:00", revenue: 890, sales: 62 },
  { name: "16:00", revenue: 1120, sales: 78 },
  { name: "20:00", revenue: 1245, sales: 84 },
  { name: "24:00", revenue: 1420, sales: 96 },
];

export default function DashboardPage() {
  const { data, loading } = useLiveAnalytics(4000);

  const todayRevenue = data?.today_revenue ?? 0.0;
  const soldToday = data?.sold_today ?? 0;
  const lowStock = data?.low_stock_alerts ?? 0;
  const totalUsers = data?.total_users ?? 0;
  const liveFeed = data?.live_feed ?? [];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">📊 Executive Analytics</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time performance metrics and live automated bot activity feed.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            System Live & Connected
          </span>
        </div>
      </div>

      {/* 📊 Quick Stats Bar */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Today Revenue"
          value={formatCurrency(todayRevenue)}
          subtitle="All automated sales today"
          icon={DollarSign}
          variant="blue"
          loading={loading}
        />
        <MetricCard
          title="Sold Today"
          value={`${soldToday} Items`}
          subtitle="Successfully delivered keys"
          icon={PackageCheck}
          variant="emerald"
          loading={loading}
        />
        <MetricCard
          title="Low Stock Warning"
          value={`${lowStock} Products`}
          subtitle="Items with stock <= 5"
          icon={AlertTriangle}
          variant="amber"
          loading={loading}
        />
        <MetricCard
          title="Total Bot Users"
          value={totalUsers.toLocaleString()}
          subtitle="Registered Telegram customers"
          icon={Users}
          variant="purple"
          loading={loading}
        />
      </div>

      {/* Main Analytics Grid: Chart + Live Feed */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Revenue & Sales Chart */}
        <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-100">📈 Revenue & Sales Analytics</h3>
              <p className="text-[11px] text-slate-400">24-hour volume trend</p>
            </div>
            <div className="flex gap-1 text-[11px]">
              <button className="px-2.5 py-1 rounded-md bg-blue-600/20 text-blue-400 border border-blue-500/30 font-medium">
                Daily
              </button>
              <button className="px-2.5 py-1 rounded-md text-slate-400 hover:bg-slate-800">Weekly</button>
              <button className="px-2.5 py-1 rounded-md text-slate-400 hover:bg-slate-800">Monthly</button>
            </div>
          </div>

          <div className="h-[280px] w-full pt-2">
            {loading ? (
              <div className="h-full w-full rounded-lg bg-slate-950/40 animate-pulse flex items-center justify-center border border-slate-800/40">
                <div className="space-y-4 w-5/6">
                  <div className="h-4 w-1/4 rounded bg-slate-800" />
                  <div className="h-28 rounded bg-slate-800/30 relative overflow-hidden flex items-end">
                    {/* Simulated bar chart/wave using skeletons */}
                    <div className="w-full flex items-end justify-between px-4 h-full pt-6">
                      <div className="w-[10%] bg-slate-800/50 rounded-t h-[20%]" />
                      <div className="w-[10%] bg-slate-800/50 rounded-t h-[40%]" />
                      <div className="w-[10%] bg-slate-800/50 rounded-t h-[35%]" />
                      <div className="w-[10%] bg-slate-800/50 rounded-t h-[65%]" />
                      <div className="w-[10%] bg-slate-800/50 rounded-t h-[50%]" />
                      <div className="w-[10%] bg-slate-800/50 rounded-t h-[80%]" />
                      <div className="w-[10%] bg-slate-800/50 rounded-t h-[95%]" />
                    </div>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-600 font-mono">
                    <div>00:00</div>
                    <div>08:00</div>
                    <div>16:00</div>
                    <div>24:00</div>
                  </div>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sampleChartData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="name" stroke="#6b7280" fontSize={11} />
                  <YAxis stroke="#6b7280" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#1e293b",
                      borderRadius: "0.5rem",
                      fontSize: "12px",
                      color: "#f8fafc",
                    }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* ⚡ Live Bot Orders Feed */}
        <div className="lg:col-span-1">
          <LiveFeed feedItems={liveFeed} loading={loading} />
        </div>
      </div>
    </div>
  );
}
