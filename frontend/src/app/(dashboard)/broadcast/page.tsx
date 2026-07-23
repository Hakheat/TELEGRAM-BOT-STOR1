"use client";

import React, { useState } from "react";
import { Megaphone, Send, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { userService } from "@/services/user.service";

export default function BroadcastPage() {
  const [messageText, setMessageText] = useState<string>(
    "🎉 <b>ឳកាសពិសេស! (PROMO ANNOUNCEMENT)</b>\n\n" +
      "បញ្ចុះតម្លៃ 20% លើគ្រប់អាខោន <b>CapCut Pro</b> និង <b>Canva Pro</b> ថ្ងៃនេះ!\n" +
      "សូមចូលទៅកាន់ម៉ឺនុយ 🛍️ <b>ផលិតផល</b> ដើម្បីបញ្ជាទិញឥឡូវនេះ!"
  );
  const [sending, setSending] = useState<boolean>(false);
  const [result, setResult] = useState<{
    total_targets: number;
    sent_successfully: number;
    failed_or_blocked: number;
    message: string;
  } | null>(null);

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    if (!confirm("Are you sure you want to broadcast this message to ALL Telegram bot users?")) return;

    setSending(true);
    setResult(null);

    try {
      const res = await userService.sendBroadcast(messageText);
      setResult(res);
    } catch (err: any) {
      alert("Failed to send broadcast.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">📢 Telegram Broadcast Console</h1>
        <p className="text-xs text-slate-400 mt-1">
          Send bulk HTML rich-text announcements, promotions, or system alerts to all registered bot users.
        </p>
      </div>

      <form onSubmit={handleSendBroadcast} className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold text-slate-300">
              Broadcast Message Content (Telegram HTML Supported)
            </label>
            <span className="text-[11px] text-blue-400 font-mono">
              Tags: &lt;b&gt;, &lt;i&gt;, &lt;code&gt;, &lt;a href="..."&gt;
            </span>
          </div>
          <textarea
            rows={8}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 p-4 font-sans text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Live Preview Box */}
        <div className="rounded-lg border border-slate-800 bg-slate-950/80 p-4">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 block mb-2">
            📱 Telegram Chat Preview
          </span>
          <div
            className="text-xs text-slate-200 whitespace-pre-wrap font-sans"
            dangerouslySetInnerHTML={{ __html: messageText }}
          />
        </div>

        {/* Delivery Results Feedback */}
        {result && (
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs text-emerald-400 space-y-1">
            <div className="flex items-center gap-2 font-semibold">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>{result.message}</span>
            </div>
            <p className="text-[11px] text-emerald-300/80">
              Total Targets: {result.total_targets} | Sent: {result.sent_successfully} | Failed/Blocked: {result.failed_or_blocked}
            </p>
          </div>
        )}

        <div className="flex items-center justify-end pt-2">
          <Button
            type="submit"
            variant="primary"
            disabled={sending || !messageText.trim()}
            className="gap-2 h-11 px-6 bg-blue-600 hover:bg-blue-700 font-semibold"
          >
            <Send className="h-4 w-4" />
            {sending ? "Broadcasting to Users..." : "Send Broadcast Now"}
          </Button>
        </div>
      </form>
    </div>
  );
}
