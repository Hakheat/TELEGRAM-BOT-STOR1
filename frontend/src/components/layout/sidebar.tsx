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
  Sun,
  Moon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/store/use-sidebar-store";
import { useLanguageStore } from "@/store/use-language-store";
import { useThemeStore } from "@/store/use-theme-store";
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
  const { theme, toggleTheme, initTheme } = useThemeStore();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    initTheme();
  }, [initTheme]);

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
              {isOpen && <span>{t(item.titleKey)}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User profile / UserNav and Theme Toggle at the bottom */}
      <div className={cn(
        "border-t border-slate-800 p-3 flex gap-2",
        isOpen ? "flex-row items-center justify-between" : "flex-col items-center"
      )}>
        <div className="flex-1 w-full overflow-hidden">
          <UserNav />
        </div>
        <button
          onClick={toggleTheme}
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-slate-900/50 hover:bg-slate-900 border border-slate-800/80 text-slate-400 hover:text-slate-100 transition-all cursor-pointer"
        >
          {!mounted ? (
            <div className="h-4.5 w-4.5 rounded-full bg-slate-800/50 animate-pulse" />
          ) : theme === "dark" ? (
            <Sun className="h-4.5 w-4.5 text-amber-500" />
          ) : (
            <Moon className="h-4.5 w-4.5 text-blue-400" />
          )}
        </button>
      </div>
    </aside>
  );
};
