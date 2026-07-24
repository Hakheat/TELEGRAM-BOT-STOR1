"use client";

import React from "react";
import { Activity, ShoppingBag, Clock } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface LiveFeedProps {
  feedItems: Array<{
    order_id: number;
    user: string;
    product_title: string;
    amount: number;
    created_at: string;
  }>;
  loading?: boolean;
}

export const LiveFeed: React.FC<LiveFeedProps> = ({ feedItems, loading = false }) => {
  return (
    <div className="flex flex-col h-full rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Activity className="h-4 w-4 animate-pulse" />
          </div>
          <h3 className="text-sm font-semibold text-slate-100">⚡ Live Bot Orders Activity</h3>
        </div>
        <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
          REAL-TIME
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[340px]">
        {loading ? (
          [1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 animate-pulse text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-slate-800" />
                <div className="space-y-1.5">
                  <div className="h-3 w-16 rounded bg-slate-800" />
                  <div className="h-3.5 w-32 rounded bg-slate-800/60" />
                </div>
              </div>
              <div className="space-y-1.5 flex flex-col items-end">
                <div className="h-3.5 w-10 rounded bg-slate-800" />
                <div className="h-2.5 w-8 rounded bg-slate-800/60" />
              </div>
            </div>
          ))
        ) : feedItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-slate-500 text-xs">
            <Clock className="h-8 w-8 mb-2 opacity-50" />
            <span>No bot order activities recorded yet.</span>
          </div>
        ) : (
          feedItems.map((item) => (
            <div
              key={item.order_id}
              className="flex items-center justify-between p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-all text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600/10 text-blue-400 border border-blue-500/20">
                  <ShoppingBag className="h-4 w-4" />
                </div>
                <div>
                  <span className="font-semibold text-slate-200">{item.user}</span>
                  <p className="text-slate-400 text-[11px]">{item.product_title}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-bold text-emerald-400">{formatCurrency(item.amount)}</span>
                <p className="text-[10px] text-slate-500">#{item.order_id}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
