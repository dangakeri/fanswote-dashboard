import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sun,
  Moon,
  BarChart3,
  Users,
  ShieldCheck,
  Megaphone,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { LogoMark, LogoWordmark } from "../components/Logo";

const highlights = [
  { icon: BarChart3, label: "Analytics", desc: "Revenue & growth KPIs" },
  { icon: Users, label: "Creators", desc: "Manage & verify" },
  { icon: ShieldCheck, label: "Moderation", desc: "Posts, KYC, reports" },
  { icon: Megaphone, label: "Featuring", desc: "Boosts & payouts" },
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password);
    if (result.success) {
      navigate("/", { replace: true });
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-page dark:bg-d-page">
      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className="fixed top-5 right-5 z-50 p-2.5 rounded-lg bg-surface dark:bg-d-surface border border-border dark:border-d-border text-text-muted dark:text-d-text-muted hover:text-primary shadow-sm transition-colors"
      >
        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[560px] relative overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-linear-to-br from-primary via-[#f59300] to-[#e07d00]" />
        <div className="absolute -top-10 -left-10 w-80 h-80 bg-white/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-black/15 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />

        <div className="relative z-10 flex flex-col justify-between p-11 w-full">
          {/* Logo on a frosted card so the wordmark stays legible */}
          <div className="inline-flex self-start items-center bg-white rounded-2xl px-5 py-3.5 shadow-xl shadow-black/10">
            <LogoWordmark className="h-8" />
          </div>

          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-white/15 text-white/90 text-[11px] font-semibold uppercase tracking-wider mb-5 backdrop-blur-sm">
              Admin Console
            </span>
            <h1 className="text-[34px] leading-[1.15] font-bold text-white mb-4">
              Run the platform with confidence.
            </h1>
            <p className="text-white/75 text-[15px] leading-relaxed mb-8 max-w-sm">
              Analytics, creators, content moderation, featuring and payouts —
              everything in one place.
            </p>

            <div className="grid grid-cols-2 gap-3 max-w-md">
              {highlights.map((h) => {
                const Icon = h.icon;
                return (
                  <div
                    key={h.label}
                    className="flex items-center gap-3 rounded-xl bg-white/10 border border-white/15 px-3.5 py-3 backdrop-blur-sm"
                  >
                    <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                      <Icon size={17} className="text-white" strokeWidth={1.9} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-white leading-tight">{h.label}</p>
                      <p className="text-[11px] text-white/70 leading-tight truncate">{h.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="text-white/50 text-xs">&copy; 2026 Fanswote. All rights reserved.</p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-sm animate-fade-in">
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-9 lg:hidden">
            <LogoMark size={36} className="rounded-xl shadow-md shadow-primary/20" />
            <span className="text-lg font-bold text-text dark:text-d-text tracking-tight">
              Fanswote <span className="text-text-muted dark:text-d-text-muted font-medium">Admin</span>
            </span>
          </div>

          <h2 className="text-[26px] font-bold text-text dark:text-d-text tracking-tight mb-1.5">
            Welcome back
          </h2>
          <p className="text-text-muted dark:text-d-text-muted text-sm mb-8">
            Sign in to your admin dashboard
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2.5 px-3.5 py-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-[13px] font-medium text-text-secondary dark:text-d-text-secondary mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted dark:text-d-text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@fanswote.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm bg-surface dark:bg-d-elevated text-text dark:text-d-text placeholder-text-muted dark:placeholder-d-text-muted border border-border dark:border-d-border focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary/40 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-text-secondary dark:text-d-text-secondary mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted dark:text-d-text-muted" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-10 pr-11 py-2.5 rounded-lg text-sm bg-surface dark:bg-d-elevated text-text dark:text-d-text placeholder-text-muted dark:placeholder-d-text-muted border border-border dark:border-d-border focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary/40 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted dark:text-d-text-muted hover:text-text-secondary dark:hover:text-d-text-secondary transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-3.5 h-3.5 rounded accent-primary cursor-pointer" />
                <span className="text-[13px] text-text-secondary dark:text-d-text-secondary">Remember me</span>
              </label>
              <button type="button" className="text-[13px] text-primary hover:text-primary-hover font-medium transition-colors">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="relative w-full py-2.5 rounded-lg bg-primary text-white font-semibold text-sm shadow-md shadow-primary/25 hover:bg-primary-hover active:shadow-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed group"
            >
              <span className={`flex items-center justify-center gap-2 ${loading ? "opacity-0" : ""}`}>
                Sign in
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </span>
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
              )}
            </button>
          </form>

          <p className="text-center text-[12.5px] text-text-muted dark:text-d-text-muted mt-8">
            Admin access only · Contact your platform owner for an account
          </p>
        </div>
      </div>
    </div>
  );
}
