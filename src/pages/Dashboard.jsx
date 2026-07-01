import { Link } from "react-router-dom";
import {
  FileText,
  Video,
  ShieldCheck,
  Flag,
  ArrowRight,
  Clock,
  CheckCircle2,
  Circle,
  Crown,
  Shield,
  UserRound,
  Users,
  Inbox,
} from "lucide-react";
import { useUsers } from "../hooks/useUsers";
import { usePosts } from "../hooks/useContent";
import { useQuickies } from "../hooks/useQuickies";
import { useKycSubmissions } from "../hooks/useKyc";
import { useReports } from "../hooks/useReports";
import Avatar from "../components/Avatar";

function relativeTime(iso) {
  if (!iso) return "";
  const then = new Date(iso).getTime();
  const diff = Date.now() - then;
  const min = Math.floor(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function oldestPending(items, dateKey = "created_at") {
  if (!items || items.length === 0) return null;
  const pending = items.filter((i) => (i.status ?? "pending") === "pending");
  if (pending.length === 0) return null;
  const oldest = pending.reduce((a, b) =>
    new Date(a[dateKey]) < new Date(b[dateKey]) ? a : b
  );
  return oldest[dateKey];
}

function MetricCard({ label, value, sub, loading, icon: Icon, tone = "bg-primary/10 text-primary" }) {
  return (
    <div className="group bg-surface dark:bg-d-surface rounded-2xl border border-border dark:border-d-border shadow-card dark:shadow-none p-5 hover:border-primary/40 hover:shadow-md transition-all">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[12.5px] font-medium text-text-secondary dark:text-d-text-secondary">
          {label}
        </p>
        {Icon && (
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${tone}`}>
            <Icon size={17} strokeWidth={2} />
          </div>
        )}
      </div>
      <p className="text-[30px] font-bold text-text dark:text-d-text tracking-tight tabular-nums mt-3 leading-none">
        {loading ? (
          <span className="inline-block w-16 h-7 rounded bg-page dark:bg-d-elevated animate-pulse align-middle" />
        ) : (
          (value ?? 0).toLocaleString()
        )}
      </p>
      {sub && <p className="text-[12px] text-text-muted dark:text-d-text-muted mt-2">{sub}</p>}
    </div>
  );
}

function QueueRow({ to, icon, name, count, oldestIso, tone, loading }) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-4 px-5 py-4 hover:bg-page/60 dark:hover:bg-d-elevated/40 transition-colors"
    >
      <div className={`w-9 h-9 rounded-lg ${tone} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-text dark:text-d-text">{name}</p>
        <p className="text-[11.5px] text-text-muted dark:text-d-text-muted">
          {loading ? (
            <span className="inline-block w-24 h-2.5 rounded bg-page dark:bg-d-elevated animate-pulse" />
          ) : count === 0 ? (
            "Queue clear"
          ) : (
            <>
              <Clock size={10} className="inline mr-1 -mt-0.5" />
              Oldest waiting {oldestIso ? relativeTime(oldestIso) : "—"}
            </>
          )}
        </p>
      </div>
      <div className="text-right">
        <p className="text-[17px] font-semibold text-text dark:text-d-text tabular-nums leading-none">
          {loading ? "—" : count.toLocaleString()}
        </p>
        <p className="text-[10px] uppercase tracking-wider text-text-muted dark:text-d-text-muted mt-1">
          {count === 0 ? "cleared" : "pending"}
        </p>
      </div>
      <ArrowRight
        size={15}
        className="text-text-muted/40 dark:text-d-text-muted/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0"
      />
    </Link>
  );
}

function RoleBar({ label, count, total, icon, barClass }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between text-[12px] mb-1.5">
        <span className="flex items-center gap-2 text-text-secondary dark:text-d-text-secondary">
          {icon}
          {label}
        </span>
        <span className="tabular-nums font-medium text-text dark:text-d-text">
          {count.toLocaleString()}{" "}
          <span className="text-text-muted dark:text-d-text-muted font-normal">({pct}%)</span>
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-page dark:bg-d-elevated overflow-hidden">
        <div className={`h-full ${barClass}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const users = useUsers({ limit: 100 });
  const pendingPosts = usePosts({ status: "pending", limit: 5 });
  const pendingQuickies = useQuickies({ status: "pending", limit: 5 });
  const kyc = useKycSubmissions();
  const reports = useReports({ status: "pending", limit: 5 });

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const usersList = users.data?.users || [];
  const totalUsers = users.data?.total ?? usersList.length;
  const admins = usersList.filter((u) => u.role === "admin").length;
  const creators = usersList.filter((u) => u.role === "creator").length;
  const regular = usersList.filter((u) => u.role === "user").length;

  const postsCount = pendingPosts.data?.total ?? (pendingPosts.data?.posts || []).length;
  const quickiesCount = pendingQuickies.data?.total ?? (pendingQuickies.data?.quickies || []).length;
  const kycList = kyc.data || [];
  const kycPending = kycList.filter((k) => k.status === "pending").length;
  const reportsCount = reports.data?.total ?? (reports.data?.reports || []).length;

  const totalQueued = postsCount + quickiesCount + kycPending + reportsCount;

  const allRecent = [
    ...(pendingPosts.data?.posts || []).map((p) => ({
      id: `post-${p.id}`,
      type: "post",
      title: p.caption || "Untitled post",
      user: p.creator_name || `User ${p.creator_id || ""}`,
      username: p.creator_username,
      avatar: p.creator_avatar,
      ts: p.created_at,
      href: "/content",
    })),
    ...(pendingQuickies.data?.quickies || []).map((q) => ({
      id: `quickie-${q.id}`,
      type: "quickie",
      title: q.caption || "Untitled quickie",
      user: q.creator_name || `User ${q.creator_id || ""}`,
      username: q.creator_username,
      avatar: q.creator_avatar,
      ts: q.created_at,
      href: "/quickies",
    })),
    ...(reports.data?.reports || []).map((r) => ({
      id: `report-${r.id}`,
      type: "report",
      title: `${
        r.reported_post_id
          ? `Post #${r.reported_post_id}`
          : r.reported_user_id
          ? `User #${r.reported_user_id}`
          : "Content"
      } reported — ${r.reason}`,
      user: r.reporter_name || `User ${r.reporter_id || ""}`,
      username: r.reporter_username,
      avatar: r.reporter_avatar,
      ts: r.created_at,
      href: "/reports",
    })),
    ...kycList
      .filter((k) => k.status === "pending")
      .map((k) => ({
        id: `kyc-${k.id}`,
        type: "kyc",
        title: "Identity verification",
        user: k.name || `User ${k.user_id || ""}`,
        username: k.username,
        avatar: k.avatar_url,
        ts: k.created_at,
        href: "/kyc",
      })),
  ]
    .filter((a) => a.ts)
    .sort((a, b) => new Date(b.ts) - new Date(a.ts))
    .slice(0, 8);

  const typeStyles = {
    post: { label: "Post", class: "text-amber-600 dark:text-amber-400 bg-amber-500/10" },
    quickie: { label: "Quickie", class: "text-violet-600 dark:text-violet-400 bg-violet-500/10" },
    report: { label: "Report", class: "text-red-600 dark:text-red-400 bg-red-500/10" },
    kyc: { label: "KYC", class: "text-cyan-600 dark:text-cyan-400 bg-cyan-500/10" },
  };

  const loadingRecent =
    pendingPosts.isLoading ||
    pendingQuickies.isLoading ||
    kyc.isLoading ||
    reports.isLoading;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[24px] font-bold text-text dark:text-d-text tracking-tight leading-tight">
            Overview
          </h1>
          <p className="text-[13px] text-text-muted dark:text-d-text-muted mt-1 flex items-center gap-2">
            <span>{today}</span>
            <span className="w-1 h-1 rounded-full bg-text-muted/50 dark:bg-d-text-muted/50" />
            <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60 animate-ping" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              All systems normal
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/reports"
            className="px-3.5 py-2 rounded-lg text-[12.5px] font-semibold text-text-secondary dark:text-d-text-secondary bg-surface dark:bg-d-surface border border-border dark:border-d-border hover:bg-hover dark:hover:bg-d-hover transition-colors"
          >
            Review reports
          </Link>
          <Link
            to="/kyc"
            className="px-3.5 py-2 rounded-lg text-[12.5px] font-semibold text-white bg-primary hover:bg-primary-hover shadow-sm shadow-primary/25 transition-colors"
          >
            Review KYC
          </Link>
        </div>
      </div>

      {/* Top metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Users"
          value={totalUsers}
          sub={`${creators.toLocaleString()} creators · ${admins.toLocaleString()} admins`}
          loading={users.isLoading}
          icon={Users}
          tone="bg-primary/10 text-primary"
        />
        <MetricCard
          label="In Moderation Queue"
          value={totalQueued}
          sub={`${postsCount + quickiesCount} content · ${reportsCount} reports · ${kycPending} KYC`}
          loading={loadingRecent}
          icon={Inbox}
          tone="bg-amber-500/10 text-amber-600 dark:text-amber-400"
        />
        <MetricCard
          label="Pending KYC"
          value={kycPending}
          sub={kycPending === 0 ? "Nothing to review" : "Awaiting admin review"}
          loading={kyc.isLoading}
          icon={ShieldCheck}
          tone="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
        />
        <MetricCard
          label="Open Reports"
          value={reportsCount}
          sub={reportsCount === 0 ? "No open reports" : "Requires a decision"}
          loading={reports.isLoading}
          icon={Flag}
          tone="bg-red-500/10 text-red-600 dark:text-red-400"
        />
      </div>

      {/* Moderation queue + Role distribution */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Moderation queue list */}
        <div className="xl:col-span-2 bg-surface dark:bg-d-surface rounded-2xl border border-border/70 dark:border-d-border/60 shadow-card dark:shadow-none">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/60 dark:border-d-border/60">
            <div>
              <h2 className="text-[13px] font-semibold text-text dark:text-d-text">Moderation queues</h2>
              <p className="text-[11.5px] text-text-muted dark:text-d-text-muted mt-0.5">
                Items currently awaiting admin action
              </p>
            </div>
            <span className="text-[11px] text-text-muted dark:text-d-text-muted tabular-nums">
              {totalQueued.toLocaleString()} total
            </span>
          </div>
          <ul className="divide-y divide-border/60 dark:divide-d-border/60">
            <li>
              <QueueRow
                to="/content"
                icon={<FileText size={16} strokeWidth={1.75} />}
                name="Posts"
                count={postsCount}
                oldestIso={oldestPending(pendingPosts.data?.posts)}
                tone="bg-amber-500/10 text-amber-600 dark:text-amber-400"
                loading={pendingPosts.isLoading}
              />
            </li>
            <li>
              <QueueRow
                to="/quickies"
                icon={<Video size={16} strokeWidth={1.75} />}
                name="Quickies"
                count={quickiesCount}
                oldestIso={oldestPending(pendingQuickies.data?.quickies)}
                tone="bg-violet-500/10 text-violet-600 dark:text-violet-400"
                loading={pendingQuickies.isLoading}
              />
            </li>
            <li>
              <QueueRow
                to="/kyc"
                icon={<ShieldCheck size={16} strokeWidth={1.75} />}
                name="KYC submissions"
                count={kycPending}
                oldestIso={oldestPending(kycList)}
                tone="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
                loading={kyc.isLoading}
              />
            </li>
            <li>
              <QueueRow
                to="/reports"
                icon={<Flag size={16} strokeWidth={1.75} />}
                name="Reports"
                count={reportsCount}
                oldestIso={oldestPending(reports.data?.reports)}
                tone="bg-red-500/10 text-red-600 dark:text-red-400"
                loading={reports.isLoading}
              />
            </li>
          </ul>
          <div className="px-5 py-3 border-t border-border/60 dark:border-d-border/60 flex items-center gap-2 text-[11.5px] text-text-muted dark:text-d-text-muted">
            {totalQueued === 0 ? (
              <>
                <CheckCircle2 size={12} className="text-emerald-500" />
                All queues are clear — well done.
              </>
            ) : (
              <>
                <Circle size={10} className="fill-amber-500 text-amber-500" />
                {totalQueued.toLocaleString()} item{totalQueued === 1 ? "" : "s"} await admin action.
              </>
            )}
          </div>
        </div>

        {/* User distribution */}
        <div className="bg-surface dark:bg-d-surface rounded-2xl border border-border/70 dark:border-d-border/60 shadow-card dark:shadow-none">
          <div className="px-5 py-4 border-b border-border/60 dark:border-d-border/60">
            <h2 className="text-[13px] font-semibold text-text dark:text-d-text">User breakdown</h2>
            <p className="text-[11.5px] text-text-muted dark:text-d-text-muted mt-0.5">
              Across {totalUsers.toLocaleString()} accounts
            </p>
          </div>
          <div className="p-5 space-y-4">
            {users.isLoading && totalUsers === 0 ? (
              <>
                {[0, 1, 2].map((i) => (
                  <div key={i} className="space-y-2 animate-pulse">
                    <div className="h-3 rounded bg-page dark:bg-d-elevated w-2/3" />
                    <div className="h-1.5 rounded-full bg-page dark:bg-d-elevated" />
                  </div>
                ))}
              </>
            ) : totalUsers === 0 ? (
              <p className="text-[12.5px] text-text-muted dark:text-d-text-muted">
                No users to show yet.
              </p>
            ) : (
              <>
                <RoleBar
                  label="Admins"
                  count={admins}
                  total={totalUsers}
                  icon={<Shield size={13} strokeWidth={1.75} />}
                  barClass="bg-violet-500"
                />
                <RoleBar
                  label="Creators"
                  count={creators}
                  total={totalUsers}
                  icon={<Crown size={13} strokeWidth={1.75} />}
                  barClass="bg-primary"
                />
                <RoleBar
                  label="Users"
                  count={regular}
                  total={totalUsers}
                  icon={<UserRound size={13} strokeWidth={1.75} />}
                  barClass="bg-blue-500"
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="bg-surface dark:bg-d-surface rounded-2xl border border-border/70 dark:border-d-border/60 shadow-card dark:shadow-none">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/60 dark:border-d-border/60">
          <div>
            <h2 className="text-[13px] font-semibold text-text dark:text-d-text">Recent items requiring review</h2>
            <p className="text-[11.5px] text-text-muted dark:text-d-text-muted mt-0.5">
              Unified feed across all moderation queues
            </p>
          </div>
        </div>

        {loadingRecent && allRecent.length === 0 ? (
          <ul className="divide-y divide-border/60 dark:divide-d-border/60">
            {Array.from({ length: 4 }).map((_, i) => (
              <li key={i} className="flex items-center gap-3 px-5 py-3.5 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-page dark:bg-d-elevated" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 rounded bg-page dark:bg-d-elevated w-3/4" />
                  <div className="h-2.5 rounded bg-page dark:bg-d-elevated w-1/3" />
                </div>
              </li>
            ))}
          </ul>
        ) : allRecent.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <CheckCircle2 size={28} className="mx-auto text-emerald-500 mb-2" />
            <p className="text-[13px] font-medium text-text dark:text-d-text">
              You're all caught up
            </p>
            <p className="text-[11.5px] text-text-muted dark:text-d-text-muted mt-0.5">
              No items across any queue need attention right now.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border/60 dark:divide-d-border/60">
            {allRecent.map((a) => {
              const style = typeStyles[a.type];
              return (
                <li key={a.id}>
                  <Link
                    to={a.href}
                    className="flex items-center gap-3 px-5 py-3.5 hover:bg-page/60 dark:hover:bg-d-elevated/40 transition-colors"
                  >
                    <Avatar src={a.avatar} name={a.user} username={a.username} size={32} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded ${style.class}`}
                        >
                          {style.label}
                        </span>
                        <p className="text-[13px] text-text dark:text-d-text line-clamp-1">
                          {a.title}
                        </p>
                      </div>
                      <p className="text-[11.5px] text-text-muted dark:text-d-text-muted mt-0.5 truncate">
                        {a.user}
                        {a.username && <span className="opacity-60"> · @{a.username}</span>}
                      </p>
                    </div>
                    <span className="text-[11px] text-text-muted dark:text-d-text-muted tabular-nums whitespace-nowrap shrink-0">
                      {relativeTime(a.ts)}
                    </span>
                    <ArrowRight
                      size={14}
                      className="text-text-muted/40 dark:text-d-text-muted/40 shrink-0"
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
