import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  ShieldCheck,
  Gift,
  Flame,
  Settings,
  LogOut,
  X,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/users", icon: Users, label: "Users" },
  { to: "/content", icon: FileText, label: "Content" },
  { to: "/kyc", icon: ShieldCheck, label: "KYC" },
  { to: "/gifts", icon: Gift, label: "Gifts" },
];

function LogoutModal({ open, onClose, onConfirm }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-surface dark:bg-d-surface rounded-xl border border-border dark:border-d-border shadow-xl w-full max-w-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center shrink-0">
            <AlertTriangle size={18} className="text-red-500" />
          </div>
          <div>
            <h3 className="text-[15px] font-semibold text-text dark:text-d-text">Logout</h3>
            <p className="text-sm text-text-muted dark:text-d-text-muted">Are you sure you want to logout?</p>
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
            Logout
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

  const sidebar = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 h-16 px-6 shrink-0 border-b border-border dark:border-d-border">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <Flame size={16} className="text-white" />
        </div>
        <span className="text-[15px] font-bold text-primary tracking-tight">
          Fanswote
        </span>
        <button
          onClick={closeMobile}
          className="ml-auto p-1.5 rounded-lg text-text-muted dark:text-d-text-muted hover:bg-hover dark:hover:bg-d-hover lg:hidden"
        >
          <X size={18} />
        </button>
      </div>

      {/* Nav label */}
      <p className="px-6 pt-6 pb-2 text-[11px] font-medium uppercase tracking-wider text-text-muted dark:text-d-text-muted">
        Navigation
      </p>

      {/* Nav items */}
      <nav className="flex-1 px-3 flex flex-col gap-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            onClick={closeMobile}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all relative ${
                isActive
                  ? "text-primary bg-primary/5 dark:bg-primary/10 border-l-[3px] border-primary ml-0 pl-[9px]"
                  : "text-text-secondary dark:text-d-text-secondary hover:bg-hover dark:hover:bg-d-hover hover:text-text dark:hover:text-d-text"
              }`
            }
          >
            <item.icon size={18} className="shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 space-y-0.5">
        <div className="h-px bg-border dark:bg-d-border mx-3 mb-2" />
        <button
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-[13px] font-medium text-text-secondary dark:text-d-text-secondary hover:bg-hover dark:hover:bg-d-hover transition-all"
        >
          <Settings size={18} className="shrink-0" />
          <span>Settings</span>
        </button>
        <button
          onClick={() => setShowLogoutModal(true)}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-[13px] font-medium text-text-secondary dark:text-d-text-secondary hover:bg-hover dark:hover:bg-d-hover hover:text-red-500 transition-all"
        >
          <LogOut size={18} className="shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Logout confirmation modal */}
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
        className={`fixed top-0 left-0 h-screen z-50 w-[240px] bg-surface dark:bg-d-surface border-r border-border dark:border-d-border shadow-xl transition-transform duration-300 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebar}
      </aside>

      {/* Desktop sidebar */}
      <aside className="fixed top-0 left-0 h-screen z-30 hidden lg:flex flex-col w-[240px] bg-surface dark:bg-d-surface border-r border-border dark:border-d-border">
        {sidebar}
      </aside>
    </>
  );
}
