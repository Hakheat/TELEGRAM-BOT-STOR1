"use client";

import React from "react";
import { DollarSign, PackageCheck, AlertTriangle, Users } from "lucide-react";
import { MetricCard } from "@/components/features/analytics/metric-card";
import { LiveFeed } from "@/components/features/analytics/live-feed";
import { useLiveAnalytics } from "@/hooks/use-websocket";
import { formatCurrency } from "@/lib/utils";
import { useLanguageStore } from "@/store/use-language-store";
import { useThemeStore } from "@/store/use-theme-store";
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
  const { t } = useLanguageStore();
  const { theme } = useThemeStore();

  const todayRevenue = data?.today_revenue ?? 0.0;
  const soldToday = data?.sold_today ?? 0;
  const lowStock = data?.low_stock_alerts ?? 0;
  const totalUsers = data?.total_users ?? 0;
  const liveFeed = data?.live_feed ?? [];

  return (
    <div className="space-y-6">
      {/* 📊 Quick Stats Bar */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title={t("today_revenue")}
          value={formatCurrency(todayRevenue)}
          subtitle={t("all_automated_sales")}
          icon={DollarSign}
          variant="blue"
          loading={loading}
        />
        <MetricCard
          title={t("sold_today")}
          value={`${soldToday} Items`}
          subtitle={t("successfully_delivered")}
          icon={PackageCheck}
          variant="emerald"
          loading={loading}
        />
        <MetricCard
          title={t("low_stock_warning")}
          value={`${lowStock} Products`}
          subtitle={t("items_with_low_stock")}
          icon={AlertTriangle}
          variant="amber"
          loading={loading}
        />
        <MetricCard
          title={t("total_bot_users")}
          value={totalUsers.toLocaleString()}
          subtitle={t("registered_customers")}
          icon={Users}
          variant="purple"
          loading={loading}
        />
      </div>

      {/* Main Analytics Grid: Chart + Live Feed */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Revenue & Sales Chart */}
        <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 font-kantumruy-pro">
            <div>
              <h3 className="text-sm font-semibold text-slate-100">{t("revenue_sales_analytics")}</h3>
              <p className="text-[11px] text-slate-400">{t("hour_volume_trend")}</p>
            </div>
            <div className="flex gap-1 text-[11px]">
              <button className="px-2.5 py-1 rounded-md bg-blue-600/20 text-blue-400 border border-blue-500/30 font-medium">
                {t("daily")}
              </button>
              <button className="px-2.5 py-1 rounded-md text-slate-400 hover:bg-slate-800">{t("weekly")}</button>
              <button className="px-2.5 py-1 rounded-md text-slate-400 hover:bg-slate-800">{t("monthly")}</button>
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
                  <CartesianGrid strokeDasharray="3 3" stroke={theme === "dark" ? "#1f2937" : "#e2e8f0"} />
                  <XAxis dataKey="name" stroke={theme === "dark" ? "#6b7280" : "#475569"} fontSize={11} />
                  <YAxis stroke={theme === "dark" ? "#6b7280" : "#475569"} fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme === "dark" ? "#0f172a" : "#ffffff",
                      borderColor: theme === "dark" ? "#1e293b" : "#e2e8f0",
                      borderRadius: "0.5rem",
                      fontSize: "12px",
                      color: theme === "dark" ? "#f8fafc" : "#0f172a",
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
