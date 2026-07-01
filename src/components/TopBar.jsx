import { Menu, Moon, Sun, Bell, Search, ChevronDown } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import Avatar from "./Avatar";

export default function TopBar({ onMenuClick }) {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <header className="fixed top-0 left-0 lg:left-64 right-0 z-40 h-16 bg-surface/85 dark:bg-d-surface/85 backdrop-blur-xl border-b border-border dark:border-d-border">
      <div className="flex items-center justify-between gap-3 h-full px-4 sm:px-6 lg:px-8">
        {/* Left: mobile menu + search */}
        <div className="flex items-center gap-3 min-w-0 flex-1 max-w-xl">
          <button
            onClick={onMenuClick}
            className="p-2 -ml-2 rounded-lg text-text-secondary dark:text-d-text-secondary hover:bg-hover dark:hover:bg-d-hover lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          <div className="relative w-full max-w-md hidden sm:block">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted dark:text-d-text-muted pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search users, posts, reports…"
              className="w-full h-9.5 pl-9 pr-14 rounded-lg text-[13px] bg-page dark:bg-d-elevated border border-transparent dark:border-transparent text-text dark:text-d-text placeholder-text-muted dark:placeholder-d-text-muted focus:outline-none focus:bg-surface dark:focus:bg-d-surface focus:border-primary/40 focus:ring-2 focus:ring-primary/15 transition-all"
            />
            <kbd className="absolute right-2 top-1/2 -translate-y-1/2 hidden lg:inline-flex items-center gap-0.5 px-1.5 h-5 rounded border border-border dark:border-d-border text-[10px] font-medium text-text-muted dark:text-d-text-muted bg-surface dark:bg-d-surface">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-1">
          <button
            className="relative w-9 h-9 rounded-lg flex items-center justify-center text-text-secondary dark:text-d-text-secondary hover:bg-hover dark:hover:bg-d-hover hover:text-text dark:hover:text-d-text transition-colors"
            aria-label="Notifications"
          >
            <Bell size={18} strokeWidth={1.9} />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full ring-2 ring-surface dark:ring-d-surface" />
          </button>

          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-text-secondary dark:text-d-text-secondary hover:bg-hover dark:hover:bg-d-hover hover:text-text dark:hover:text-d-text transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={18} strokeWidth={1.9} /> : <Moon size={18} strokeWidth={1.9} />}
          </button>

          <div className="w-px h-6 bg-border dark:bg-d-border mx-1.5 hidden sm:block" />

          <button className="flex items-center gap-2 pl-1 pr-2 h-10 rounded-lg hover:bg-hover dark:hover:bg-d-hover transition-colors">
            <Avatar
              src={user?.avatar_url}
              name={user?.name || "Admin"}
              username={user?.username}
              size={30}
            />
            <div className="hidden md:flex flex-col items-start leading-tight">
              <span className="text-[12.5px] font-semibold text-text dark:text-d-text">
                {user?.name || "Admin"}
              </span>
              <span className="text-[10.5px] text-text-muted dark:text-d-text-muted capitalize">
                {user?.role || "admin"}
              </span>
            </div>
            <ChevronDown size={14} className="hidden md:block text-text-muted dark:text-d-text-muted" />
          </button>
        </div>
      </div>
    </header>
  );
}
