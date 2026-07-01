import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  ShieldCheck,
  LogOut,
  X,
  AlertTriangle,
  Video,
  Flag,
  Gift,
  BarChart3,
  Sticker,
  Megaphone,
  Wallet,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { LogoMark } from "./Logo";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard", section: "Overview" },
  { to: "/analytics", icon: BarChart3, label: "Analytics", section: "Overview" },
  { to: "/users", icon: Users, label: "Users", section: "Management" },
  { to: "/content", icon: FileText, label: "Content", section: "Moderation" },
  { to: "/quickies", icon: Video, label: "Quickies", section: "Moderation" },
  { to: "/kyc", icon: ShieldCheck, label: "KYC", section: "Moderation" },
  { to: "/reports", icon: Flag, label: "Reports", section: "Moderation" },
  { to: "/gifts", icon: Gift, label: "Gifts", section: "Economy" },
  { to: "/stickers", icon: Sticker, label: "Stickers", section: "Economy" },
  { to: "/featured", icon: Megaphone, label: "Featuring", section: "Economy" },
  { to: "/payouts", icon: Wallet, label: "Payouts", section: "Economy" },
];

function groupBySection(items) {
  const map = new Map();
  items.forEach((item) => {
    const s = item.section || "";
    if (!map.has(s)) map.set(s, []);
    map.get(s).push(item);
  });
  return Array.from(map.entries());
}

function LogoutModal({ open, onClose, onConfirm }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface dark:bg-d-surface rounded-2xl border border-border dark:border-d-border shadow-2xl w-full max-w-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-500/10 flex items-center justify-center shrink-0">
            <AlertTriangle size={18} className="text-red-500" />
          </div>
          <div>
            <h3 className="text-[15px] font-semibold text-text dark:text-d-text">Sign out</h3>
            <p className="text-sm text-text-muted dark:text-d-text-muted">End your admin session?</p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-text-secondary dark:text-d-text-secondary border border-border dark:border-d-border hover:bg-hover dark:hover:bg-d-hover transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(false);
    logout();
    navigate("/login", { replace: true });
  };

  const closeMobile = () => setMobileOpen(false);
  const grouped = groupBySection(navItems);

  const sidebar = (
    <div className="flex flex-col h-full">
      {/* Brand header */}
      <div className="flex items-center justify-between h-16 px-5 shrink-0 border-b border-border dark:border-d-border">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-white dark:bg-white shadow-sm ring-1 ring-border dark:ring-white/10">
            <LogoMark size={22} />
          </div>
          <div className="leading-tight">
            <p className="text-[15px] font-bold text-text dark:text-d-text tracking-tight">
              Fanswote
            </p>
            <p className="text-[9.5px] font-semibold text-text-muted dark:text-d-text-muted uppercase tracking-[0.16em] -mt-0.5">
              Admin Console
            </p>
          </div>
        </div>
        <button
          onClick={closeMobile}
          className="p-1.5 rounded-lg text-text-muted dark:text-d-text-muted hover:bg-hover dark:hover:bg-d-hover lg:hidden"
        >
          <X size={18} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-5">
        {grouped.map(([section, items]) => (
          <div key={section}>
            <p className="px-3 pb-1.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-text-muted dark:text-d-text-muted">
              {section}
            </p>
            <div className="flex flex-col gap-0.5">
              {items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  onClick={closeMobile}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 pl-4 pr-3 py-2 rounded-lg text-[13.5px] font-medium transition-colors ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-text-secondary dark:text-d-text-secondary hover:bg-hover dark:hover:bg-d-hover hover:text-text dark:hover:text-d-text"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-r-full bg-primary transition-all ${
                          isActive ? "h-5 opacity-100" : "h-0 opacity-0"
                        }`}
                      />
                      <item.icon size={17} strokeWidth={isActive ? 2.2 : 1.9} className="shrink-0" />
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 pt-3 border-t border-border dark:border-d-border">
        <button
          onClick={() => setShowLogoutModal(true)}
          className="flex items-center gap-3 w-full pl-4 pr-3 py-2 rounded-lg text-[13.5px] font-medium text-text-secondary dark:text-d-text-secondary hover:bg-red-500/10 hover:text-red-500 transition-colors"
        >
          <LogOut size={17} strokeWidth={1.9} className="shrink-0" />
          <span>Sign out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <LogoutModal
        open={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden" onClick={closeMobile} />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen z-50 w-64 bg-surface dark:bg-d-surface border-r border-border dark:border-d-border shadow-xl transition-transform duration-300 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebar}
      </aside>

      {/* Desktop sidebar (full height) */}
      <aside className="fixed top-0 left-0 bottom-0 z-30 hidden lg:flex flex-col w-64 bg-surface dark:bg-d-surface border-r border-border dark:border-d-border">
        {sidebar}
      </aside>
    </>
  );
}
