import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  variant?: "blue" | "emerald" | "amber" | "purple";
  loading?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "blue",
  loading = false,
}) => {
  const colorStyles = {
    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20",
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20",
    purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-500/20",
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg backdrop-blur-md transition-all hover:border-slate-700">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</span>
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl border", colorStyles[variant])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-3">
        {loading ? (
          <div className="space-y-2">
            <div className="h-7 w-28 rounded bg-slate-800 animate-pulse" />
            {subtitle && <div className="h-4.5 w-40 rounded bg-slate-800/60 animate-pulse" />}
          </div>
        ) : (
          <>
            <h3 className="text-2xl font-bold tracking-tight text-slate-100">{value}</h3>
            {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
          </>
        )}
      </div>
    </div>
  );
};
