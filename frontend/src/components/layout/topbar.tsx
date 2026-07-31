"use client";

import React, { useState } from "react";
import { Search, Bell, ChevronDown, Sun, Moon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useLanguageStore } from "@/store/use-language-store";
import { useThemeStore } from "@/store/use-theme-store";
import { useCustomColorStore } from "@/store/use-custom-color-store";

function isColorDark(colorHex: string) {
  if (!colorHex) return true;
  const hex = colorHex.replace("#", "");
  if (hex.length !== 6) return true;
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 140;
}

export const Topbar: React.FC = () => {
  const { language, setLanguage, t } = useLanguageStore();
  const { theme, toggleTheme, initTheme } = useThemeStore();
  const { headerBg } = useCustomColorStore();
  const [langOpen, setLangOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
    initTheme();
  }, [initTheme]);

  const isDark = headerBg ? isColorDark(headerBg) : (theme === "dark");

  return (
    <header
      className={cn(
        "sticky top-0 z-20 flex h-20 w-full items-center justify-between border-b px-6 backdrop-blur-md transition-all duration-300",
        isDark ? "border-slate-800 bg-slate-950/85 text-slate-100" : "border-slate-200 bg-white/85 text-slate-100"
      )}
      style={headerBg ? { backgroundColor: headerBg } : undefined}
    >
      {/* Search Input */}
      <div className="relative w-72">
        <Search className={cn("absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4", isDark ? "text-slate-500" : "text-slate-400")} />
        <Input
          placeholder=""
          className={cn(
            "pl-9 h-11 border focus:border-blue-500 font-kantumruy-pro text-xs rounded-xl",
            isDark 
              ? "bg-white/5 border-white/10 text-white placeholder-white/40" 
              : "bg-black/5 border-black/5 text-slate-100 placeholder-slate-400"
          )}
        />
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle Icon Switcher */}
        <button
          onClick={toggleTheme}
          title={!mounted ? "Loading theme..." : theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className={cn(
            "relative flex h-10 w-16 items-center rounded-full border p-1 transition-all duration-300 cursor-pointer active:scale-95",
            isDark 
              ? "border-slate-800 bg-slate-900/80 hover:border-blue-500/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.15)]" 
              : "border-slate-200 bg-slate-100 hover:border-blue-500/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.05)]"
          )}
        >
          {/* Sliding Knob Indicator */}
          <div
            className={cn(
              "absolute h-7 w-7 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 border border-blue-400/50 shadow-md transition-transform duration-300 ease-out flex items-center justify-center z-10",
              theme === "dark" ? "translate-x-7" : "translate-x-0"
            )}
          >
            {theme === "dark" ? (
              <Moon className="h-3.5 w-3.5 text-white drop-shadow" />
            ) : (
              <Sun className="h-3.5 w-3.5 text-amber-200 drop-shadow" />
            )}
          </div>

          {/* Icon Background Indicators */}
          <div className="flex w-full items-center justify-between px-1.5 pointer-events-none">
            <Sun className={cn("h-4 w-4 transition-colors duration-300", theme === "dark" ? "text-slate-600" : "opacity-0")} />
            <Moon className={cn("h-4 w-4 transition-colors duration-300", theme === "dark" ? "opacity-0" : "text-slate-600")} />
          </div>
        </button>

        {/* Language Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setLangOpen(!langOpen)}
            className={cn(
              "flex items-center gap-2 rounded-2xl border px-3 py-1.5 transition-all duration-300 cursor-pointer active:scale-95 shadow-sm",
              isDark 
                ? "border-slate-800 bg-slate-900/80 hover:bg-white/5 hover:border-blue-500/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.15)]" 
                : "border-slate-200 bg-slate-100 hover:bg-slate-55 hover:border-blue-500/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.05)]"
            )}
          >
            <div className="relative h-6 w-6 rounded-full overflow-hidden border border-white/20 shadow-sm flex items-center justify-center flex-shrink-0">
              <img
                src={language === "km" ? "/flags/km.png" : "/flags/en.png"}
                alt={language === "km" ? "Khmer Flag" : "UK Flag"}
                className="h-full w-full object-cover scale-110"
              />
            </div>
            <span className="text-xs font-extrabold uppercase text-slate-200">{language}</span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {langOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setLangOpen(false)} 
              />
              <div className={cn(
                "absolute right-0 mt-2.5 w-40 rounded-2xl border p-1.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200",
                isDark 
                  ? "border-blue-500/30 bg-slate-950/95 text-slate-200" 
                  : "border-slate-200 bg-white/95 text-slate-100"
              )}>
                <button
                  onClick={() => {
                    setLanguage("km");
                    setLangOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold transition-all duration-200 cursor-pointer",
                    language === "km"
                      ? "bg-blue-600/20 text-blue-400 border border-blue-500/40 shadow-sm"
                      : isDark
                        ? "hover:bg-slate-900/80 text-slate-300 hover:text-white"
                        : "hover:bg-slate-50 text-slate-300 hover:text-slate-100"
                  )}
                >
                  <div className="relative h-5 w-5 rounded-full overflow-hidden border border-white/20 flex-shrink-0">
                    <img
                      src="/flags/km.png"
                      alt="Khmer Flag"
                      className="h-full w-full object-cover scale-110"
                    />
                  </div>
                  <span>ភាសាខ្មែរ (KM)</span>
                </button>
                <button
                  onClick={() => {
                    setLanguage("en");
                    setLangOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold transition-all duration-200 mt-1 cursor-pointer",
                    language === "en"
                      ? "bg-blue-600/20 text-blue-400 border border-blue-500/40 shadow-sm"
                      : isDark
                        ? "hover:bg-slate-900/80 text-slate-300 hover:text-white"
                        : "hover:bg-slate-50 text-slate-300 hover:text-slate-100"
                  )}
                >
                  <div className="relative h-5 w-5 rounded-full overflow-hidden border border-white/20 flex-shrink-0">
                    <img
                      src="/flags/en.png"
                      alt="UK Flag"
                      className="h-full w-full object-cover scale-110"
                    />
                  </div>
                  <span>English (EN)</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Notifications */}
        <button
          className={cn(
            "relative rounded-lg border p-2 transition-colors cursor-pointer active:scale-95",
            isDark 
              ? "border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-100 hover:border-slate-700" 
              : "border-slate-200 bg-slate-100 text-slate-300 hover:text-slate-100 hover:border-slate-300"
          )}
        >
          <Bell className="h-4 w-4" />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
            3
          </span>
        </button>
      </div>
    </header>
  );
};
