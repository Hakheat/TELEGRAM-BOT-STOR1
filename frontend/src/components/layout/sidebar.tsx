"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Key,
  ShoppingCart,
  Users,
  Megaphone,
  ChevronLeft,
  ChevronRight,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/store/use-sidebar-store";
import { useLanguageStore } from "@/store/use-language-store";
import { UserNav } from "./user-nav";

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  Package,
  Key,
  ShoppingCart,
  Users,
  Megaphone,
  Settings,
};

const navItems = [
  { titleKey: "dashboard", href: "/", icon: "LayoutDashboard" },
  { titleKey: "products", href: "/products", icon: "Package" },
  { titleKey: "stock_keys", href: "/stock", icon: "Key" },
  { titleKey: "orders", href: "/orders", icon: "ShoppingCart" },
  { titleKey: "users", href: "/users", icon: "Users" },
  { titleKey: "broadcast", href: "/broadcast", icon: "Megaphone" },
  { titleKey: "settings", href: "/settings", icon: "Settings" },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { isOpen, toggle } = useSidebarStore();
  const { t } = useLanguageStore();

  return (
    <aside
      className={cn(
        "relative flex flex-col border-r border-slate-800 bg-slate-950 transition-all duration-300 text-slate-200 z-30",
        isOpen ? "w-64" : "w-20"
      )}
    >
      {/* Brand Header */}
      <div className="flex h-20 items-center justify-between px-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400">
            <svg viewBox="0 0 24 24" className="h-5.5 w-5.5 fill-current" fill="currentColor">
              <path d="M20.665 3.717l-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.578.192l-8.533 7.701-.33 4.955c.485 0 .7-.223.971-.483l2.334-2.27 4.857 3.589c.895.493 1.538.24 1.761-.828l3.19-15.027c.326-1.307-.5-1.898-1.36-1.517z" />
            </svg>
          </div>
          {isOpen && (
            <span className="font-bold text-sm tracking-wide text-slate-100">Store Manager</span>
          )}
        </div>
        <button
          onClick={toggle}
          className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors"
        >
          {isOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 space-y-2.5 p-3.5">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon] || Package;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3.5 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-300 ease-out transform active:scale-[0.98]",
                isActive
                  ? "bg-gradient-to-r from-[#071435] via-[#091a45] to-[#071435] text-blue-400 border border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.28)] scale-[1.01]"
                  : "bg-slate-900/40 text-slate-300 border border-slate-800/80 hover:border-blue-500/60 hover:bg-[#071435]/90 hover:text-blue-400 hover:scale-[1.015] hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]"
              )}
            >
              {/* Active Ambient Glow Effect */}
              {isActive && (
                <div className="absolute inset-0 rounded-2xl bg-blue-500/10 blur-sm pointer-events-none" />
              )}

              <Icon
                className={cn(
                  "h-5 w-5 flex-shrink-0 transition-all duration-300 group-hover:scale-110",
                  isActive
                    ? "text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]"
                    : "text-slate-400 group-hover:text-blue-400 group-hover:drop-shadow-[0_0_6px_rgba(96,165,250,0.6)]"
                )}
              />
              {isOpen && (
                <span
                  className={cn(
                    "transition-colors duration-300 tracking-wide",
                    isActive ? "text-blue-400 font-bold" : "group-hover:text-blue-300 font-semibold"
                  )}
                >
                  {t(item.titleKey)}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User profile / UserNav at the bottom */}
      <div className="p-3.5 border-t border-slate-800/80">
        <UserNav />
      </div>
    </aside>
  );
};
