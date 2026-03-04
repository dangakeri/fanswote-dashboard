import { useState, useRef, useEffect } from "react";
import {
  Search, ChevronLeft, ChevronRight, Loader2, ChevronDown,
} from "lucide-react";
import { useUsers, useUpdateRole } from "../hooks/useUsers";
import { useToast } from "../context/ToastContext";
import { usersData as mockUsers } from "../data/mockData";

const roleColors = {
  user: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10",
  creator: "text-primary bg-primary/5 dark:bg-primary/10",
  admin: "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10",
};

const roles = ["user", "creator", "admin"];

const avatarColors = [
  "bg-blue-500", "bg-violet-500", "bg-pink-500", "bg-emerald-500", "bg-amber-500",
  "bg-cyan-500", "bg-red-500", "bg-indigo-500", "bg-fuchsia-500", "bg-teal-500",
];

function RoleDropdown({ user, onChangeRole, isUpdating }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        disabled={isUpdating}
        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[12px] font-medium border border-border dark:border-d-border text-text-secondary dark:text-d-text-secondary hover:bg-hover dark:hover:bg-d-hover transition-colors disabled:opacity-50"
      >
        {isUpdating ? <Loader2 size={12} className="animate-spin" /> : "Role"}
        <ChevronDown size={12} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 z-20 w-32 bg-surface dark:bg-d-surface rounded-lg border border-border dark:border-d-border shadow-lg overflow-hidden">
          {roles.map((role) => (
            <button
              key={role}
              onClick={() => {
                if (role !== user.role) onChangeRole(user.id, role);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-[12px] font-medium capitalize transition-colors ${
                role === user.role
                  ? "bg-primary/5 dark:bg-primary/10 text-primary"
                  : "text-text-secondary dark:text-d-text-secondary hover:bg-hover dark:hover:bg-d-hover"
              }`}
            >
              {role}
              {role === user.role && <span className="float-right text-[10px] opacity-60">current</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(1);
  const toast = useToast();
  const { data, isLoading } = useUsers({ page, limit: 20 });
  const updateRoleMutation = useUpdateRole();

  const users = data?.users || mockUsers;
  const totalPages = data?.totalPages || 1;
  const total = data?.total || users.length;

  const filtered = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      (user.username && user.username.toLowerCase().includes(search.toLowerCase()));
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleChangeRole = (id, role) => {
    updateRoleMutation.mutate({ id, role }, {
      onSuccess: () => toast.success(`Role updated to ${role}`),
      onError: (err) => toast.error(err.message || "Failed to update role"),
    });
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted dark:text-d-text-muted" />
          <input
            type="text"
            placeholder="Search by name, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg text-sm bg-surface dark:bg-d-surface text-text dark:text-d-text placeholder-text-muted dark:placeholder-d-text-muted border border-border dark:border-d-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
          />
        </div>

        <div className="flex bg-surface dark:bg-d-surface rounded-lg border border-border dark:border-d-border p-0.5">
          {["all", "user", "creator", "admin"].map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all capitalize ${
                roleFilter === role
                  ? "bg-primary text-white"
                  : "text-text-muted dark:text-d-text-muted hover:text-text dark:hover:text-d-text"
              }`}
            >
              {role === "all" ? "All" : role + "s"}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface dark:bg-d-surface rounded-xl border border-border dark:border-d-border overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border dark:border-d-border">
          <h3 className="text-sm font-semibold text-text dark:text-d-text">Users ({filtered.length})</h3>
        </div>

        {isLoading ? (
          <div className="p-16 text-center">
            <Loader2 size={28} className="mx-auto text-primary animate-spin mb-3" />
            <p className="text-sm text-text-muted dark:text-d-text-muted">Loading users...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[11px] text-text-muted dark:text-d-text-muted uppercase tracking-wider border-b border-border dark:border-d-border">
                  <th className="text-left font-medium px-5 py-3">User</th>
                  <th className="text-left font-medium px-5 py-3">Role</th>
                  <th className="text-left font-medium px-5 py-3 hidden sm:table-cell">Provider</th>
                  <th className="text-left font-medium px-5 py-3 hidden md:table-cell">Joined</th>
                  <th className="text-right font-medium px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user, index) => (
                  <tr key={user.id} className="border-t border-border dark:border-d-border hover:bg-hover dark:hover:bg-d-hover transition-colors group">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {user.avatar_url ? (
                          <img src={user.avatar_url} alt={user.name} className="w-9 h-9 rounded-full object-cover shrink-0" />
                        ) : (
                          <div className={`w-9 h-9 rounded-full ${avatarColors[index % avatarColors.length]} text-white text-[11px] font-bold flex items-center justify-center shrink-0`}>
                            {user.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-medium text-text dark:text-d-text text-[13px]">{user.name}</p>
                          <p className="text-[11px] text-text-muted dark:text-d-text-muted">
                            {user.username ? `@${user.username} · ` : ""}{user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium capitalize ${roleColors[user.role] || roleColors.user}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 hidden sm:table-cell">
                      <span className="text-[12px] text-text-secondary dark:text-d-text-secondary capitalize">{user.provider}</span>
                    </td>
                    <td className="px-5 py-3.5 text-text-secondary dark:text-d-text-secondary tabular-nums text-[13px] hidden md:table-cell">
                      {new Date(user.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <RoleDropdown
                        user={user}
                        onChangeRole={handleChangeRole}
                        isUpdating={updateRoleMutation.isPending && updateRoleMutation.variables?.id === user.id}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex items-center justify-between px-5 py-3 border-t border-border dark:border-d-border">
          <p className="text-xs text-text-muted dark:text-d-text-muted">
            Showing <span className="font-medium text-text dark:text-d-text">{filtered.length}</span> of{" "}
            <span className="font-medium text-text dark:text-d-text">{total}</span> users
          </p>
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-md text-text-muted dark:text-d-text-muted hover:bg-hover dark:hover:bg-d-hover transition-colors disabled:opacity-30"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-7 h-7 rounded-md text-xs font-bold flex items-center justify-center transition-colors ${
                    page === p
                      ? "bg-primary text-white"
                      : "text-text-muted dark:text-d-text-muted hover:bg-hover dark:hover:bg-d-hover"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-md text-text-muted dark:text-d-text-muted hover:bg-hover dark:hover:bg-d-hover transition-colors disabled:opacity-30"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
