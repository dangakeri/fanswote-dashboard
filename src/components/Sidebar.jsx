import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  ShieldCheck,
  Flame,
  LogOut,
  X,
  AlertTriangle,
  Video,
  Flag,
  Gift,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard", section: "Overview" },
  { to: "/users", icon: Users, label: "Users", section: "Management" },
  { to: "/content", icon: FileText, label: "Content", section: "Moderation" },
  { to: "/quickies", icon: Video, label: "Quickies", section: "Moderation" },
  { to: "/kyc", icon: ShieldCheck, label: "KYC", section: "Moderation" },
  { to: "/reports", icon: Flag, label: "Reports", section: "Moderation" },
  { to: "/gifts", icon: Gift, label: "Gifts", section: "Economy" },
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
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-surface dark:bg-d-surface rounded-xl border border-border dark:border-d-border shadow-xl w-full max-w-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center shrink-0">
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
      {/* Mobile-only compact header */}
      <div className="flex items-center justify-between h-14 px-5 shrink-0 border-b border-border/60 dark:border-d-border/60 lg:hidden">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <Flame size={14} className="text-white" />
          </div>
          <span className="text-[14px] font-semibold text-text dark:text-d-text tracking-tight">
            Fanswote <span className="text-text-muted dark:text-d-text-muted font-normal">Admin</span>
          </span>
        </div>
        <button
          onClick={closeMobile}
          className="p-1.5 rounded-lg text-text-muted dark:text-d-text-muted hover:bg-hover dark:hover:bg-d-hover"
        >
          <X size={18} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 overflow-y-auto space-y-5">
        {grouped.map(([section, items]) => (
          <div key={section}>
            <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-text-muted/70 dark:text-d-text-muted/70">
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
                    `flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] transition-colors ${
                      isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-text-secondary dark:text-d-text-secondary hover:bg-hover/60 dark:hover:bg-d-hover/60 hover:text-text dark:hover:text-d-text"
                    }`
                  }
                >
                  <item.icon size={16} strokeWidth={1.75} className="shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 pt-2 border-t border-border/60 dark:border-d-border/60">
        <button
          onClick={() => setShowLogoutModal(true)}
          className="flex items-center gap-2.5 w-full px-3 py-2 rounded-md text-[13px] text-text-secondary dark:text-d-text-secondary hover:bg-hover/60 dark:hover:bg-d-hover/60 hover:text-red-500 transition-colors"
        >
          <LogOut size={16} strokeWidth={1.75} className="shrink-0" />
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
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={closeMobile}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen z-50 w-60 bg-surface dark:bg-d-surface border-r border-border/60 dark:border-d-border/60 shadow-xl transition-transform duration-300 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebar}
      </aside>

      {/* Desktop sidebar (starts below top bar) */}
      <aside className="fixed top-14 left-0 bottom-0 z-30 hidden lg:flex flex-col w-60 bg-surface dark:bg-d-surface border-r border-border/60 dark:border-d-border/60">
        {sidebar}
      </aside>
    </>
  );
}
