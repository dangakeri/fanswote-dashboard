import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Flame, Mail, Lock, Eye, EyeOff, ArrowRight, Sun, Moon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

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
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-5 right-5 z-50 p-2.5 rounded-lg bg-surface dark:bg-d-surface border border-border dark:border-d-border text-text-muted dark:text-d-text-muted hover:text-primary shadow-sm transition-colors"
      >
        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[560px] relative overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-linear-to-br from-primary via-[#ff8c00] to-[#ff6b00]" />
        <div className="absolute top-16 left-16 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-16 right-16 w-80 h-80 bg-black/10 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative z-10 flex flex-col justify-between p-10 w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Flame size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-white">Fanswote</span>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-white leading-snug mb-3">
              Manage your platform with confidence
            </h1>
            <p className="text-white/70 text-base leading-relaxed mb-8">
              Access analytics, manage creators, moderate content, and oversee
              your platform from one dashboard.
            </p>
            <div className="flex flex-wrap gap-2">
              {["Analytics", "Users", "Content", "KYC"].map((f) => (
                <span
                  key={f}
                  className="px-3.5 py-1.5 rounded-full bg-white/15 text-white/90 text-xs font-medium"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>

          <p className="text-white/40 text-xs">
            &copy; 2026 Fanswote. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm animate-fade-in">
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/25">
              <Flame size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold text-text dark:text-d-text">
              Fanswote
            </span>
          </div>

          <h2 className="text-2xl font-bold text-text dark:text-d-text mb-1">
            Welcome back
          </h2>
          <p className="text-text-muted dark:text-d-text-muted text-sm mb-8">
            Sign in to your admin dashboard
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2.5 px-3.5 py-3 rounded-lg bg-red-500/10 border border-red-500/20 animate-scale-in">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-text-secondary dark:text-d-text-secondary mb-1.5">
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
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm bg-surface dark:bg-d-elevated text-text dark:text-d-text placeholder-text-muted dark:placeholder-d-text-muted border border-border dark:border-d-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary dark:text-d-text-secondary mb-1.5">
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
                  className="w-full pl-10 pr-11 py-2.5 rounded-lg text-sm bg-surface dark:bg-d-elevated text-text dark:text-d-text placeholder-text-muted dark:placeholder-d-text-muted border border-border dark:border-d-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted dark:text-d-text-muted hover:text-text-secondary dark:hover:text-d-text-secondary transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-3.5 h-3.5 rounded accent-primary cursor-pointer" />
                <span className="text-sm text-text-secondary dark:text-d-text-secondary">Remember me</span>
              </label>
              <button type="button" className="text-sm text-primary hover:text-primary-hover font-medium transition-colors">
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

        </div>
      </div>
    </div>
  );
}
