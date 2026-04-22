import { Menu, Moon, Sun, Bell, Search, Flame, ChevronDown } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import Avatar from "./Avatar";

export default function TopBar({ onMenuClick }) {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-14 bg-surface/90 dark:bg-d-surface/90 backdrop-blur-md">
      <div className="flex items-center h-full">
        {/* Brand (aligned with sidebar width on desktop, hidden on mobile) */}
        <div className="hidden lg:flex items-center gap-2.5 w-60 px-5 shrink-0 h-full">
          <div className="w-7 h-7 rounded-[7px] bg-primary flex items-center justify-center shadow-sm">
            <Flame size={14} className="text-white" strokeWidth={2.25} />
          </div>
          <div className="leading-tight">
            <p className="text-[13px] font-semibold text-text dark:text-d-text tracking-tight">
              Fanswote
            </p>
            <p className="text-[10px] text-text-muted dark:text-d-text-muted uppercase tracking-widest -mt-0.5">
              Admin
            </p>
          </div>
        </div>

        {/* Main actions (right of sidebar on desktop, full-width on mobile) */}
        <div className="flex-1 flex items-center justify-between gap-3 px-4 lg:px-6 h-full">
          {/* Left: mobile menu + search */}
          <div className="flex items-center gap-3 min-w-0 flex-1 max-w-xl">
            <button
              onClick={onMenuClick}
              className="p-2 -ml-2 rounded-lg text-text-muted dark:text-d-text-muted hover:bg-hover dark:hover:bg-d-hover lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>

            <div className="relative w-full max-w-md hidden sm:block">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted dark:text-d-text-muted pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search users, posts, reports…"
                className="w-full h-9 pl-9 pr-14 rounded-lg text-[13px] bg-page dark:bg-d-elevated text-text dark:text-d-text placeholder-text-muted dark:placeholder-d-text-muted focus:outline-none focus:ring-2 focus:ring-primary/25 transition-all"
              />
              <kbd className="absolute right-2 top-1/2 -translate-y-1/2 hidden lg:inline-flex items-center gap-0.5 px-1.5 h-5 rounded text-[10px] font-medium text-text-muted dark:text-d-text-muted bg-surface dark:bg-d-surface">
                ⌘K
              </kbd>
            </div>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-1">
            <button
              className="relative w-9 h-9 rounded-lg flex items-center justify-center text-text-muted dark:text-d-text-muted hover:bg-hover dark:hover:bg-d-hover hover:text-text dark:hover:text-d-text transition-colors"
              aria-label="Notifications"
            >
              <Bell size={16} />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full ring-2 ring-surface dark:ring-d-surface" />
            </button>

            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-text-muted dark:text-d-text-muted hover:bg-hover dark:hover:bg-d-hover hover:text-text dark:hover:text-d-text transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <button className="flex items-center gap-2 pl-1 pr-2 ml-2 h-9 rounded-lg hover:bg-hover dark:hover:bg-d-hover transition-colors">
              <Avatar
                src={user?.avatar_url}
                name={user?.name || "Admin"}
                username={user?.username}
                size={28}
              />
              <div className="hidden md:flex flex-col items-start leading-tight">
                <span className="text-[12px] font-medium text-text dark:text-d-text">
                  {user?.name || "Admin"}
                </span>
                <span className="text-[10px] text-text-muted dark:text-d-text-muted capitalize">
                  {user?.role || "admin"}
                </span>
              </div>
              <ChevronDown
                size={13}
                className="hidden md:block text-text-muted dark:text-d-text-muted"
              />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
