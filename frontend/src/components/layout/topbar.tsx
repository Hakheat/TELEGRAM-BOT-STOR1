"use client";
import React, { useState } from "react";
import { Search, Bell, ChevronDown, Sun, Moon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useLanguageStore } from "@/store/use-language-store";
import { useThemeStore } from "@/store/use-theme-store";

export const Topbar: React.FC = () => {
  const { language, setLanguage, t } = useLanguageStore();
  const { theme, toggleTheme, initTheme } = useThemeStore();
  const [langOpen, setLangOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
    initTheme();
  }, [initTheme]);

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-6 text-slate-100">
      {/* Search Input */}
      <div className="relative w-72">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
        <Input
          placeholder={t("search_placeholder")}
          className="pl-9 bg-slate-900/60 border-slate-800 focus:border-blue-500 font-kantumruy-pro text-xs text-slate-100"
        />
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          title={!mounted ? "Loading theme..." : theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-300 hover:text-slate-100 hover:border-slate-700 transition-all cursor-pointer shadow-sm min-w-[7.5rem] justify-center"
        >
          {!mounted ? (
            <div className="h-3.5 w-3.5 rounded-full bg-slate-800/50 animate-pulse" />
          ) : theme === "dark" ? (
            <>
              <Sun className="h-3.5 w-3.5 text-amber-400" />
              <span className="font-medium hidden sm:inline">Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="h-3.5 w-3.5 text-blue-500" />
              <span className="font-medium hidden sm:inline">Dark Mode</span>
            </>
          )}
        </button>

        {/* Language Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-300 hover:text-slate-100 hover:border-slate-700 transition-all cursor-pointer"
          >
            <span className="text-sm leading-none">{language === "km" ? "🇰🇭" : "🇬🇧"}</span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
          </button>

          {langOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setLangOpen(false)} 
              />
              <div className="absolute right-0 mt-2 w-36 rounded-xl border border-slate-800 bg-slate-950/95 backdrop-blur-md p-1 shadow-2xl z-50 text-slate-200">
                <button
                  onClick={() => {
                    setLanguage("km");
                    setLangOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-[11px] font-medium transition-colors",
                    language === "km"
                      ? "bg-blue-600/15 text-blue-400 border border-blue-500/20"
                      : "hover:bg-slate-900 text-slate-400 hover:text-slate-200"
                  )}
                >
                  <span>🇰🇭</span>
                  <span>ភាសាខ្មែរ</span>
                </button>
                <button
                  onClick={() => {
                    setLanguage("en");
                    setLangOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-[11px] font-medium transition-colors mt-0.5",
                    language === "en"
                      ? "bg-blue-600/15 text-blue-400 border border-blue-500/20"
                      : "hover:bg-slate-900 text-slate-400 hover:text-slate-200"
                  )}
                >
                  <span>🇬🇧</span>
                  <span>English</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Notifications */}
        <button className="relative rounded-lg border border-slate-800 bg-slate-900 p-2 text-slate-400 hover:text-slate-100 hover:border-slate-700 transition-colors">
          <Bell className="h-4 w-4" />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
            3
          </span>
        </button>
      </div>
    </header>
  );
};
