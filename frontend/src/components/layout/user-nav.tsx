"use client";

import React, { useState } from "react";
import { User, LogOut, Shield } from "lucide-react";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/use-auth-store";
import { useSidebarStore } from "@/store/use-sidebar-store";
import { cn } from "@/lib/utils";

export const UserNav: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const { isOpen } = useSidebarStore();

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
        className={cn(
          "flex items-center gap-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-blue-500/40 p-2 transition-all duration-300 w-full hover:shadow-[0_0_12px_rgba(59,130,246,0.15)] group active:scale-[0.98]",
          !isOpen && "justify-center px-2"
        )}
      >
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-600/15 border border-blue-500/30 text-blue-400 group-hover:scale-105 group-hover:bg-blue-600/25 transition-all duration-300">
          <User className="h-4 w-4" />
        </div>
        {isOpen && (
          <div className="flex flex-col text-left overflow-hidden">
            <span className="text-xs font-bold text-slate-200 group-hover:text-blue-300 transition-colors truncate">
              {user?.username || "Admin"}
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold capitalize truncate">
              {user?.role || "Administrator"}
            </span>
          </div>
        )}
      </button>

      {open && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setOpen(false)} 
          />
          <div className={cn(
            "absolute bottom-full mb-3 rounded-2xl border border-blue-500/30 bg-slate-950/95 backdrop-blur-xl p-2 shadow-2xl z-50 text-slate-200 min-w-[12rem] left-0 animate-in fade-in zoom-in-95 duration-200",
            isOpen ? "w-full" : "w-44"
          )}>
            <div className="px-3 py-2 border-b border-slate-800 text-xs text-slate-300 flex items-center gap-2 font-semibold">
              <Shield className="h-3.5 w-3.5 text-blue-400" />
              <span>{user?.username || "Admin"}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold text-rose-400 hover:bg-rose-500/15 hover:text-rose-300 transition-all duration-200 mt-1 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};
