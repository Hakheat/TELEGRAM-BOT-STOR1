"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bot,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Zap,
  Layers,
  Database,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/use-auth-store";

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await authService.login(username, password);
      const user = await authService.getMe();
      setUser(user);
      router.push("/");
    } catch (err: any) {
      if (err.code === "ERR_NETWORK" || !err.response) {
        setError("Cannot connect to Backend Server (http://localhost:8000). Please make sure backend is running!");
      } else {
        setError(err.response?.data?.detail || "Invalid credentials. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl backdrop-blur-2xl grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
      
      {/* LEFT COLUMN: Clean Login Form Panel */}
      <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between bg-slate-900/95 relative z-10">
        <div>
          {/* Brand Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 shadow-md shadow-blue-500/10">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">Store Manager Bot</h2>
              <span className="text-[11px] font-mono text-blue-400">AUTOMATION CONTROL PANEL</span>
            </div>
          </div>

          {/* Welcome Titles */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              សូមស្វាគមន៍ (Welcome Back)
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
              Please sign in to access your digital inventory & order management system.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 flex items-start gap-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 p-3.5 text-xs text-rose-400 animate-in fade-in duration-200">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          {/* Form Controls */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email / Username</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="adminhakcambodai168@gmail.com"
                  className="pl-10 h-11 bg-slate-950/80 border-slate-800 focus:border-blue-500 text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 pr-10 h-11 bg-slate-950/80 border-slate-800 focus:border-blue-500 text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 text-slate-400">
              <label className="flex items-center gap-2 cursor-pointer hover:text-slate-200 transition-colors">
                <input type="checkbox" defaultChecked className="rounded border-slate-800 bg-slate-950 text-blue-600 focus:ring-blue-500 h-4 w-4" />
                <span>Remember session</span>
              </label>
              <span className="text-blue-400 hover:underline cursor-pointer">Default: adminhakcambodai168@gmail.com / adminhak&168$</span>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 mt-2 text-sm font-semibold gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-600/25 rounded-xl transition-all transform active:scale-[0.99]"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : (
                <>
                  <span>Sign In to Control Panel</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Footer info */}
        <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
          <span>© 2026 Store Manager Bot</span>
          <span className="flex items-center gap-1 text-emerald-400 font-mono">
            <ShieldCheck className="h-3.5 w-3.5" /> AES-256 Encrypted
          </span>
        </div>
      </div>

      {/* RIGHT COLUMN: Vibrant Automation & 3D Bot Illustration Panel */}
      <div className="lg:col-span-6 relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 p-8 sm:p-12 flex flex-col justify-between overflow-hidden text-white min-h-[400px] lg:min-h-full">
        
        {/* Decorative Graphic Waves & Circles */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-tech-grid opacity-20 pointer-events-none" />

        {/* Top Badges */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-3.5 py-1 text-xs font-medium border border-white/15">
            <Zap className="h-3.5 w-3.5 text-cyan-300 animate-pulse" />
            <span>Automated Key Delivery System</span>
          </div>
          <div className="h-3 w-3 rounded-full bg-cyan-400 animate-ping opacity-75" />
        </div>

        {/* 3D Bot / Automation Floating Graphic Illustration */}
        <div className="relative z-10 flex flex-col items-center justify-center py-6">
          <div className="relative w-full max-w-[280px] aspect-square flex items-center justify-center">
            
            {/* Ambient Glowing Aura */}
            <div className="absolute h-48 w-48 rounded-full bg-cyan-400/20 blur-3xl animate-pulse-glow" />

            {/* Top Floating Isometric Block 1 */}
            <div className="absolute -top-2 right-4 flex items-center gap-2 rounded-xl bg-white/15 border border-white/25 px-3 py-2 text-xs font-mono backdrop-blur-md shadow-xl animate-float">
              <Database className="h-4 w-4 text-cyan-300" />
              <span>Vault: 1,420 Keys</span>
            </div>

            {/* Bottom Floating Isometric Block 2 */}
            <div className="absolute -bottom-2 left-2 flex items-center gap-2 rounded-xl bg-white/15 border border-white/25 px-3 py-2 text-xs font-mono backdrop-blur-md shadow-xl animate-float-delayed">
              <Layers className="h-4 w-4 text-amber-300" />
              <span>KHQR Auto Top-up</span>
            </div>

            {/* Center Robot / Automation SVG Avatar */}
            <div className="relative animate-float z-10 flex items-center justify-center">
              <svg
                viewBox="0 0 200 200"
                className="w-48 h-48 drop-shadow-[0_20px_35px_rgba(0,0,0,0.4)]"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Robot Head */}
                <rect x="60" y="40" width="80" height="65" rx="18" fill="url(#botGrad)" stroke="#67e8f9" strokeWidth="2.5" />
                {/* Robot Antennas */}
                <line x1="100" y1="40" x2="100" y2="22" stroke="#67e8f9" strokeWidth="3" strokeLinecap="round" />
                <circle cx="100" cy="18" r="6" fill="#38bdf8" className="animate-pulse" />
                
                {/* Robot Screen Face */}
                <rect x="70" y="52" width="60" height="40" rx="10" fill="#090d16" />
                {/* Robot Eyes */}
                <circle cx="86" cy="72" r="7" fill="#38bdf8" />
                <circle cx="114" cy="72" r="7" fill="#38bdf8" />
                <circle cx="88" cy="70" r="2.5" fill="#ffffff" />
                <circle cx="116" cy="70" r="2.5" fill="#ffffff" />

                {/* Robot Body */}
                <rect x="50" y="112" width="100" height="70" rx="20" fill="url(#botGrad)" stroke="#67e8f9" strokeWidth="2.5" />
                {/* Robot Chest Plate */}
                <rect x="65" y="125" width="70" height="42" rx="8" fill="#090d16" />
                <path d="M75 137L95 137" stroke="#34d399" strokeWidth="3" strokeLinecap="round" />
                <path d="M75 147L115 147" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
                <path d="M75 157L105 157" stroke="#f472b6" strokeWidth="3" strokeLinecap="round" />

                <defs>
                  <linearGradient id="botGrad" x1="50" y1="40" x2="150" y2="180" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#1e40af" />
                    <stop offset="0.5" stopColor="#3b82f6" />
                    <stop offset="1" stopColor="#0284c7" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

          </div>
        </div>

        {/* Bottom Feature Description */}
        <div className="relative z-10 text-center sm:text-left space-y-1">
          <h3 className="text-lg font-bold tracking-wide">Autonomous Store Bot Engine</h3>
          <p className="text-xs text-blue-100/80 leading-relaxed">
            PostgreSQL FOR UPDATE SKIP LOCKED concurrency-safe key allocation & real-time KHQR balance top-up integration.
          </p>
        </div>

      </div>

    </div>
  );
}
