"use client";

import React, { useState, useEffect } from "react";
import { Bot, Save, Eye, EyeOff, AlertCircle, CheckCircle2, Sun, Moon, CreditCard, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { settingsService } from "@/services/settings.service";
import { useLanguageStore } from "@/store/use-language-store";
import { useThemeStore } from "@/store/use-theme-store";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const [botToken, setBotToken] = useState("");
  const [khqrMerchantName, setKhqrMerchantName] = useState("");
  const [khqrMerchantCity, setKhqrMerchantCity] = useState("");
  const [khqrAccountNumber, setKhqrAccountNumber] = useState("");
  const [abaAccountName, setAbaAccountName] = useState("");
  const [abaAccountNumber, setAbaAccountNumber] = useState("");
  const [abaQrLink, setAbaQrLink] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingQr, setUploadingQr] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { t } = useLanguageStore();

  const handleQrUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingQr(true);
    setError("");
    setSuccess("");

    try {
      const res = await settingsService.uploadQrCode(file);
      setAbaQrLink(res.qr_link);
      setSuccess("រូបភាព QR Code ត្រូវបានបង្ហោះឡើងជោគជ័យ! (QR Code uploaded successfully)");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to upload QR Code image.");
    } finally {
      setUploadingQr(false);
    }
  };
  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await settingsService.getSettings();
        setBotToken(data.bot_token);
        setKhqrMerchantName(data.khqr_merchant_name);
        setKhqrMerchantCity(data.khqr_merchant_city);
        setKhqrAccountNumber(data.khqr_account_number);
        setAbaAccountName(data.aba_account_name);
        setAbaAccountNumber(data.aba_account_number);
        setAbaQrLink(data.aba_qr_link);
      } catch (err: any) {
        setError(err.response?.data?.detail || t("fail_load"));
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
        khqr_merchant_name: khqrMerchantName,
        khqr_merchant_city: khqrMerchantCity,
        khqr_account_number: khqrAccountNumber,
        aba_account_name: abaAccountName,
        aba_account_number: abaAccountNumber,
        aba_qr_link: abaQrLink,
      });
      setSuccess(t("success_save"));
    } catch (err: any) {
      setError(err.response?.data?.detail || t("fail_save"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 font-kantumruy-pro">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">{t("system_settings")}</h1>
          <p className="text-xs text-slate-400 mt-1">{t("system_settings_desc")}</p>
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
    <div className="space-y-6 max-w-4xl font-kantumruy-pro">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-100">{t("system_settings")}</h1>
        <p className="text-xs text-slate-400 mt-1">{t("system_settings_desc")}</p>
      </div>


      {/* Bot & Payment Configuration Form */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg backdrop-blur-md">
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
          {/* Section 1: Bot Credentials */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600/10 text-blue-400 border border-blue-500/20">
                <Bot className="h-4.5 w-4.5" />
              </div>
              <h2 className="text-sm font-semibold text-slate-100">{t("bot_config")}</h2>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">{t("bot_token")}</label>
              <div className="relative">
                <Input
                  type={showToken ? "text" : "password"}
                  value={botToken}
                  onChange={(e) => setBotToken(e.target.value)}
                  placeholder="123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ"
                  className="pr-10 h-11 bg-slate-950/80 border-slate-800 focus:border-blue-500 text-sm font-mono text-slate-100"
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
                {t("bot_father_desc")}
              </p>
            </div>
          </div>

          {/* Section 2: KHQR / ABA Payments */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CreditCard className="h-4.5 w-4.5" />
              </div>
              <h2 className="text-sm font-semibold text-slate-100">ការកំណត់គណនីទូទាត់ Bakong KHQR / ABA (Payment Settings)</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">ឈ្មោះអាជីវករ (Merchant Name)</label>
                <Input
                  value={khqrMerchantName}
                  onChange={(e) => setKhqrMerchantName(e.target.value)}
                  placeholder="e.g. DIGITAL STORE KH"
                  className="h-11 bg-slate-950/80 border-slate-800 focus:border-blue-500 text-sm text-slate-100"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">ទីក្រុងអាជីវករ (Merchant City)</label>
                <Input
                  value={khqrMerchantCity}
                  onChange={(e) => setKhqrMerchantCity(e.target.value)}
                  placeholder="e.g. PHNOM PENH"
                  className="h-11 bg-slate-950/80 border-slate-800 focus:border-blue-500 text-sm text-slate-100"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">លេខគណនីទូទាត់ / លេខបាគង (Account Number)</label>
              <Input
                value={khqrAccountNumber}
                onChange={(e) => setKhqrAccountNumber(e.target.value)}
                placeholder="e.g. 000111222"
                className="h-11 bg-slate-950/80 border-slate-800 focus:border-blue-500 text-sm font-mono text-slate-100"
                required
              />
              <p className="text-[10px] text-slate-500 leading-normal mt-1">
                សូមបញ្ចូលលេខគណនីបាគង ឬលេខគណនីធនាគារដែលបានភ្ជាប់ជាមួយប្រព័ន្ធបាគងរបស់លោកអ្នកដើម្បីបង្កើត QR Code ស្វ័យប្រវត្តសម្រាប់ការទូទាត់ប្រាក់ពី ABA App ឬ Bakong App ផ្ទាល់។
              </p>
            </div>

            {/* Sub-section: ABA Bank Details */}
            <div className="pt-4 border-t border-slate-850 space-y-4">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">គណនីធនាគារ ABA (ABA Bank Specific Account)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">ABA ឈ្មោះគណនី (Account Name)</label>
                  <Input
                    value={abaAccountName}
                    onChange={(e) => setAbaAccountName(e.target.value)}
                    placeholder="e.g. HAK HAK"
                    className="h-11 bg-slate-950/80 border-slate-800 focus:border-blue-500 text-sm text-slate-100"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">ABA លេខគណនី (Account Number)</label>
                  <Input
                    value={abaAccountNumber}
                    onChange={(e) => setAbaAccountNumber(e.target.value)}
                    placeholder="e.g. 000 111 222"
                    className="h-11 bg-slate-950/80 border-slate-800 focus:border-blue-500 text-sm text-slate-100"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">ABA QR Link / រូបភាព QR Code (Image URL)</label>
                <div className="flex gap-3">
                  <Input
                    value={abaQrLink}
                    onChange={(e) => setAbaQrLink(e.target.value)}
                    placeholder="e.g. /static/aba_qr.png or https://example.com/aba_qr.jpg"
                    className="h-11 flex-1 bg-slate-950/80 border-slate-800 focus:border-blue-500 text-sm text-slate-100"
                    required
                  />
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleQrUpload}
                      disabled={uploadingQr}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="h-11 gap-2 border-slate-700 bg-slate-900 text-xs text-slate-300 hover:bg-slate-800"
                      disabled={uploadingQr}
                    >
                      <Upload className={cn("h-4 w-4 text-blue-400", uploadingQr ? "animate-bounce" : "")} />
                      {uploadingQr ? "Uploading..." : "Upload QR Image"}
                    </Button>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 leading-normal mt-1">
                  សូមបញ្ចូល URL នៃរូបភាព QR Code របស់ ABA Bank ឬចុច <b>"Upload QR Image"</b> ដើម្បីបង្ហោះរូបភាព QR Code ផ្ទាល់ខ្លួនរបស់អ្នក រួចរក្សាទុកក្នុងកូដ (repository) តែម្តង។
                </p>
              </div>
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
                  <span>{t("saving")}</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>{t("save_config")}</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
