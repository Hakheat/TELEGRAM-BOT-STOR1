"use client";

import React, { useState, useEffect } from "react";
import { Bot, Save, Eye, EyeOff, AlertCircle, CheckCircle2, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { settingsService } from "@/services/settings.service";
import { useLanguageStore } from "@/store/use-language-store";
import { useThemeStore } from "@/store/use-theme-store";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const [botToken, setBotToken] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { theme, setTheme } = useThemeStore();

  const { t, language } = useLanguageStore();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await settingsService.getSettings();
        setBotToken(data.bot_token);
      } catch (err: any) {
        const errMsg = err.response?.data?.detail || err.message || t("fail_load");
        setError(errMsg);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [t]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await settingsService.updateSettings({
        bot_token: botToken,
      });
      setSuccess(t("success_save"));
    } catch (err: any) {
      const errMsg = err.response?.data?.detail || err.message || t("fail_save");
      setError(errMsg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl space-y-6 pb-12 font-kantumruy-pro">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-slate-100">System Settings</h1>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Configure bot credentials and server environment.</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 md:p-8 shadow-lg animate-pulse space-y-4">
          <div className="h-4 w-1/4 rounded bg-slate-800" />
          <div className="h-10 w-full rounded bg-slate-800" />
          <div className="h-10 w-28 rounded bg-slate-800" />
        </div>
      </div>
    );
  }

  const isKh = language === "km";

  return (
    <div className="max-w-6xl space-y-8 pb-12 font-kantumruy-pro">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-slate-100">
          {isKh ? "ការកំណត់ប្រព័ន្ធ" : "System Settings"}
        </h1>
        <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
          {isKh ? "គ្រប់គ្រងព័ត៌មាន Bot Telegram និងការកំណត់គណនីទូទាត់ប្រាក់" : "Configure bot credentials and payment settings."}
        </p>
      </div>

      {/* Bot & Payment Configuration Form */}
      <div className="rounded-2xl border border-slate-850 bg-slate-900/60 p-6 md:p-8 shadow-xl backdrop-blur-md space-y-6">
        {error && (
          <div className="flex items-start gap-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 p-4 text-xs text-rose-400">
            <AlertCircle className="h-4.5 w-4.5 flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-start gap-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-xs text-emerald-400">
            <CheckCircle2 className="h-4.5 w-4.5 flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed">{success}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-8">
          {/* Section 1: Bot Credentials */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/20">
                <Bot className="h-4.5 w-4.5" />
              </div>
              <h2 className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                {isKh ? "កំណត់ Bot Telegram" : "Telegram Bot Configuration"}
              </h2>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-700 dark:text-slate-300 block">
                {isKh ? "លេខកូដសម្ងាត់ Bot (Bot Token)" : "Telegram Bot Token"}
              </label>
              <div className="relative">
                <Input
                  type={showToken ? "text" : "password"}
                  value={botToken}
                  onChange={(e) => setBotToken(e.target.value)}
                  placeholder="123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ"
                  className="pr-10 h-11 bg-slate-950/80 border-slate-800 focus:border-blue-500 text-sm font-mono text-gray-900 dark:text-slate-100"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-350 transition-colors"
                >
                  {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-[10px] text-gray-500 dark:text-slate-500 mt-1 pl-1">
                {isKh ? "ទទួលបានពី Telegram @BotFather។ សូមរក្សាទុកវាជាសម្ងាត់។" : "Obtained from @BotFather. Keep this token secret."}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <Button
              type="submit"
              disabled={saving}
              className="h-11 px-8 text-xs font-semibold gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-600/10 rounded-lg transition-all"
            >
              {saving ? (
                <>
                  <span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{isKh ? "កំពុងរក្សាទុក..." : "Saving..."}</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>{isKh ? "រក្សាទុកការកំណត់" : "Save Configuration"}</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
