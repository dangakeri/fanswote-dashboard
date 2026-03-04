import { Menu, Moon, Sun, Bell, Search } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

export default function TopBar({ onMenuClick }) {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-20 h-16 flex items-center justify-between gap-4 px-6 lg:px-8 bg-surface dark:bg-d-surface border-b border-border dark:border-d-border">
      <div className="flex items-center gap-3">
        {/* Mobile menu */}
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 rounded-lg text-text-muted dark:text-d-text-muted hover:bg-hover dark:hover:bg-d-hover lg:hidden"
        >
          <Menu size={20} />
        </button>

        {/* Search */}
        <div className="relative hidden sm:block">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted dark:text-d-text-muted" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-9 pr-12 py-2 rounded-lg text-sm bg-page dark:bg-d-elevated text-text dark:text-d-text placeholder-text-muted dark:placeholder-d-text-muted border border-border dark:border-d-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 w-56 lg:w-72 transition-all"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium text-text-muted dark:text-d-text-muted bg-surface dark:bg-d-surface border border-border dark:border-d-border">
            Ctrl K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="relative p-2 rounded-lg text-text-muted dark:text-d-text-muted hover:bg-hover dark:hover:bg-d-hover hover:text-text dark:hover:text-d-text transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-surface dark:ring-d-surface" />
        </button>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-text-muted dark:text-d-text-muted hover:bg-hover dark:hover:bg-d-hover hover:text-text dark:hover:text-d-text transition-colors"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="flex items-center gap-2.5 ml-1 pl-3 border-l border-border dark:border-d-border">
          <div className="w-8 h-8 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
            {user?.avatar || "A"}
          </div>
          <span className="text-sm font-medium text-text dark:text-d-text hidden md:block">
            {user?.name || "Admin"}
          </span>
        </div>
      </div>
    </header>
  );
}
