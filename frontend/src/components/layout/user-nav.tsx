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
          "flex items-center gap-2.5 rounded-xl bg-slate-900/50 hover:bg-slate-900 border border-slate-800/80 p-2 hover:border-slate-700 transition-all w-full",
          !isOpen && "justify-center px-2"
        )}
      >
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-400">
          <User className="h-4 w-4" />
        </div>
        {isOpen && (
          <div className="flex flex-col text-left overflow-hidden">
            <span className="text-xs font-semibold text-slate-200 truncate">{user?.username || "Admin"}</span>
            <span className="text-[10px] text-emerald-400 capitalize truncate">{user?.role || "Administrator"}</span>
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
            "absolute bottom-full mb-2 rounded-xl border border-slate-800 bg-slate-950/95 backdrop-blur-md p-1.5 shadow-2xl z-50 text-slate-200 min-w-[12rem] left-0",
            isOpen ? "w-full" : "w-40"
          )}>
            <div className="px-3 py-2 border-b border-slate-800 text-xs text-slate-400 flex items-center gap-2">
              <Shield className="h-3.5 w-3.5 text-blue-400" />
              <span>{user?.username || "Admin"}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors mt-1"
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
