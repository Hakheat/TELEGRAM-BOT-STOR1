"use client";

import React, { useState } from "react";
import { User, LogOut, Shield } from "lucide-react";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/use-auth-store";

export const UserNav: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (e) {
      // ignore
    } finally {
      logout();
      window.location.href = "/login";
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 rounded-full bg-slate-900 border border-slate-800 p-1.5 pr-3 hover:border-slate-700 transition-all"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400">
          <User className="h-4 w-4" />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-xs font-semibold text-slate-100">{user?.username || "Admin"}</span>
          <span className="text-[10px] text-emerald-400 capitalize">{user?.role || "Administrator"}</span>
        </div>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-800 bg-slate-900 p-1.5 shadow-2xl z-50 text-slate-200">
          <div className="px-3 py-2 border-b border-slate-800 text-xs text-slate-400 flex items-center gap-2">
            <Shield className="h-3.5 w-3.5 text-blue-400" />
            <span>Root Admin</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors mt-1"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
};
