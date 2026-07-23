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
  Bot,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/store/use-sidebar-store";

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  Package,
  Key,
  ShoppingCart,
  Users,
  Megaphone,
};

const navItems = [
  { title: "Dashboard", href: "/", icon: "LayoutDashboard" },
  { title: "Products", href: "/products", icon: "Package" },
  { title: "Stock / Keys", href: "/stock", icon: "Key" },
  { title: "Orders", href: "/orders", icon: "ShoppingCart" },
  { title: "Users", href: "/users", icon: "Users" },
  { title: "Broadcast", href: "/broadcast", icon: "Megaphone" },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { isOpen, toggle } = useSidebarStore();

  return (
    <aside
      className={cn(
        "relative flex flex-col border-r border-slate-800 bg-slate-950 transition-all duration-300 text-slate-200 z-30",
        isOpen ? "w-64" : "w-20"
      )}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400">
            <Bot className="h-6 w-6" />
          </div>
          {isOpen && (
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-wide text-white">Store Manager</span>
              <span className="text-[10px] text-blue-400 font-mono">TG BOT PRO v1.0</span>
            </div>
          )}
        </div>
        <button
          onClick={toggle}
          className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          {isOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 space-y-1.5 p-3">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon] || Package;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm"
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-100"
              )}
            >
              <Icon className={cn("h-5 w-5 flex-shrink-0", isActive ? "text-blue-400" : "text-slate-400")} />
              {isOpen && <span>{item.title}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
