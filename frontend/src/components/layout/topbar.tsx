"use client";

import React from "react";
import { Search, Bell, Moon } from "lucide-react";
import { UserNav } from "./user-nav";
import { Input } from "@/components/ui/input";

export const Topbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-6 text-slate-100">
      {/* Search Input */}
      <div className="relative w-72">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
        <Input
          placeholder="🔍 Search orders, keys, users..."
          className="pl-9 bg-slate-900/60 border-slate-800 focus:border-blue-500"
        />
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-4">
        {/* Dark mode indicator badge */}
        <div className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs text-slate-400">
          <Moon className="h-3.5 w-3.5 text-blue-400" />
          <span>Dark Mode</span>
        </div>

        {/* Notifications */}
        <button className="relative rounded-lg border border-slate-800 bg-slate-900 p-2 text-slate-400 hover:text-slate-100 hover:border-slate-700 transition-colors">
          <Bell className="h-4 w-4" />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
            3
          </span>
        </button>

        {/* User Navigation Dropdown */}
        <UserNav />
      </div>
    </header>
  );
};
