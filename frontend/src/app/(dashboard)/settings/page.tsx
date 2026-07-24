"use client";

import React, { useState, useEffect } from "react";
import { Bot, Save, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { settingsService } from "@/services/settings.service";

export default function SettingsPage() {
  const [botToken, setBotToken] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await settingsService.getSettings();
        setBotToken(data.bot_token);
      } catch (err: any) {
        setError(err.response?.data?.detail || "Failed to load system settings.");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await settingsService.updateSettings({ bot_token: botToken });
      setSuccess("Settings updated and Telegram bot hot-reloaded successfully!");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">⚙️ System Settings</h1>
          <p className="text-xs text-slate-400 mt-1">Configure bot credentials and server environment.</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg animate-pulse space-y-4">
          <div className="h-4 w-1/4 rounded bg-slate-800" />
          <div className="h-10 w-full rounded bg-slate-800" />
          <div className="h-10 w-28 rounded bg-slate-800" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">⚙️ System Settings</h1>
        <p className="text-xs text-slate-400 mt-1">Configure bot credentials and server environment.</p>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600/10 text-blue-400 border border-blue-500/20">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-100">Telegram Bot Configuration</h2>
            <p className="text-[11px] text-slate-400">Settings related to your active Telegram bot instance</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 p-4 text-xs text-rose-400">
            <AlertCircle className="h-4.5 w-4.5 flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 flex items-start gap-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-xs text-emerald-400">
            <CheckCircle2 className="h-4.5 w-4.5 flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed">{success}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">Telegram Bot Token</label>
            <div className="relative">
              <Input
                type={showToken ? "text" : "password"}
                value={botToken}
                onChange={(e) => setBotToken(e.target.value)}
                placeholder="123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ"
                className="pr-10 h-11 bg-slate-950/80 border-slate-800 focus:border-blue-500 text-sm font-mono"
                required
              />
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-[10px] text-slate-500 leading-normal">
              Obtained from Telegram's <span className="text-blue-400">@BotFather</span>. Keep this token secret.
              Updating this token will dynamically restart the bot connection with the new bot identity.
            </p>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={saving}
              className="h-10 text-xs font-semibold gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-600/10 rounded-lg transition-all"
            >
              {saving ? (
                <>
                  <span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving changes...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save Bot Configuration</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
