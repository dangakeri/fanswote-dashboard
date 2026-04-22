import { useState } from "react";
import {
  Search,
  Flag,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Loader2,
  Calendar,
  User,
  Hash,
} from "lucide-react";
import { useReports, useUpdateReportStatus } from "../hooks/useReports";
import { useToast } from "../context/ToastContext";
import Avatar from "../components/Avatar";

const statusConfig = {
  pending: { dot: "bg-amber-500", text: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10", label: "Pending" },
  reviewed: { dot: "bg-blue-500", text: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10", label: "Reviewed" },
  actioned: { dot: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10", label: "Actioned" },
  dismissed: { dot: "bg-gray-500", text: "text-gray-600 dark:text-gray-400", bg: "bg-gray-50 dark:bg-gray-500/10", label: "Dismissed" },
};

function ReportCard({ report, onUpdate, pendingId }) {
  const [expanded, setExpanded] = useState(false);
  const [notes, setNotes] = useState(report.admin_notes || "");
  const config = statusConfig[report.status] || statusConfig.pending;
  const isPending = pendingId === report.id;

  return (
    <div
      className={`bg-surface dark:bg-d-surface rounded-xl border overflow-hidden transition-all ${
        expanded ? "border-primary/30" : "border-border dark:border-d-border"
      }`}
    >
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full px-5 py-4 text-left hover:bg-hover dark:hover:bg-d-hover transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <Avatar
            src={report.reporter_avatar}
            name={report.reporter_name || `user ${report.reporter_id}`}
            username={report.reporter_username}
            size={36}
          />
          <div className="min-w-0">
            <p className="font-medium text-text dark:text-d-text text-[13px] capitalize truncate">
              <Flag size={11} className="inline mr-1 text-red-500" />
              {report.target_type} #{report.target_id} — {report.reason}
            </p>
            <p className="text-[11px] text-text-muted dark:text-d-text-muted truncate">
              Reported by {report.reporter_name || `user #${report.reporter_id}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-0.5 rounded-full ${config.bg} ${config.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
            {config.label}
          </span>
          <span className="text-[11px] text-text-muted dark:text-d-text-muted hidden sm:block tabular-nums">
            {new Date(report.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
          <div className={`p-1 rounded-md transition-colors ${expanded ? "text-primary" : "text-text-muted dark:text-d-text-muted"}`}>
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-border dark:border-d-border px-5 py-5 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Detail label="Target" value={`${report.target_type} #${report.target_id}`} icon={Hash} />
            <Detail label="Reporter" value={report.reporter_name || `#${report.reporter_id}`} icon={User} />
            <Detail
              label="Submitted"
              value={new Date(report.created_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
              icon={Calendar}
            />
          </div>

          {report.description && (
            <div className="p-3 rounded-lg bg-page dark:bg-d-elevated border border-border dark:border-d-border">
              <p className="text-[11px] uppercase tracking-wider text-text-muted dark:text-d-text-muted font-medium mb-1">
                Description
              </p>
              <p className="text-[13px] text-text dark:text-d-text">{report.description}</p>
            </div>
          )}

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-text-muted dark:text-d-text-muted font-medium mb-1.5">
              Admin notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes for the decision..."
              className="w-full px-3 py-2 rounded-lg text-sm bg-page dark:bg-d-elevated text-text dark:text-d-text placeholder-text-muted dark:placeholder-d-text-muted border border-border dark:border-d-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 resize-none transition-all"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => onUpdate({ id: report.id, status: "reviewed", adminNotes: notes })}
              disabled={isPending}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border dark:border-d-border text-text-secondary dark:text-d-text-secondary text-[13px] font-medium hover:bg-hover dark:hover:bg-d-hover transition-colors disabled:opacity-50"
            >
              {isPending ? <Loader2 size={14} className="animate-spin" /> : <AlertTriangle size={14} />}
              Mark Reviewed
            </button>
            <button
              onClick={() => onUpdate({ id: report.id, status: "actioned", adminNotes: notes })}
              disabled={isPending}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 text-white text-[13px] font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              {isPending ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
              Action
            </button>
            <button
              onClick={() => onUpdate({ id: report.id, status: "dismissed", adminNotes: notes })}
              disabled={isPending}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-[13px] font-medium hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors disabled:opacity-50"
            >
              {isPending ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Detail({ label, value, icon: Icon }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-page dark:bg-d-elevated flex items-center justify-center shrink-0">
        <Icon size={14} className="text-text-muted dark:text-d-text-muted" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wider text-text-muted dark:text-d-text-muted font-medium">{label}</p>
        <p className="text-[13px] text-text dark:text-d-text font-medium truncate">{value}</p>
      </div>
    </div>
  );
}

export default function ReportsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [targetFilter, setTargetFilter] = useState("all");
  const toast = useToast();
  const update = useUpdateReportStatus();

  const params = {};
  if (statusFilter !== "all") params.status = statusFilter;
  if (targetFilter !== "all") params.targetType = targetFilter;

  const { data, isLoading } = useReports(params);
  const reports = data?.reports || [];

  const filtered = reports.filter((r) => {
    const needle = search.toLowerCase();
    return (
      (r.reason || "").toLowerCase().includes(needle) ||
      (r.description || "").toLowerCase().includes(needle) ||
      (r.reporter_name || "").toLowerCase().includes(needle) ||
      String(r.target_id).includes(needle)
    );
  });

  const counts = {
    pending: reports.filter((r) => r.status === "pending").length,
    reviewed: reports.filter((r) => r.status === "reviewed").length,
    actioned: reports.filter((r) => r.status === "actioned").length,
    dismissed: reports.filter((r) => r.status === "dismissed").length,
  };

  const handleUpdate = (payload) => {
    update.mutate(payload, {
      onSuccess: () => toast.success(`Report marked as ${payload.status}`),
      onError: (err) => toast.error(err.message || "Failed to update report"),
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Pending", count: counts.pending, icon: AlertTriangle },
          { label: "Reviewed", count: counts.reviewed, icon: Flag },
          { label: "Actioned", count: counts.actioned, icon: CheckCircle },
          { label: "Dismissed", count: counts.dismissed, icon: XCircle },
        ].map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="bg-surface dark:bg-d-surface rounded-xl px-5 py-4 border border-border dark:border-d-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-page dark:bg-d-elevated flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-text-muted dark:text-d-text-muted" />
                </div>
                <div>
                  <p className="text-xs text-text-muted dark:text-d-text-muted">{c.label}</p>
                  <p className="text-xl font-bold text-text dark:text-d-text leading-none mt-0.5">{c.count}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted dark:text-d-text-muted" />
          <input
            type="text"
            placeholder="Search reports..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg text-sm bg-surface dark:bg-d-surface text-text dark:text-d-text placeholder-text-muted dark:placeholder-d-text-muted border border-border dark:border-d-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex bg-surface dark:bg-d-surface rounded-lg border border-border dark:border-d-border p-0.5">
            {["all", "post", "story", "quickie", "message", "user"].map((t) => (
              <button
                key={t}
                onClick={() => setTargetFilter(t)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all capitalize ${
                  targetFilter === t
                    ? "bg-primary text-white"
                    : "text-text-muted dark:text-d-text-muted hover:text-text dark:hover:text-d-text"
                }`}
              >
                {t === "all" ? "All" : t}
              </button>
            ))}
          </div>
          <div className="flex bg-surface dark:bg-d-surface rounded-lg border border-border dark:border-d-border p-0.5">
            {["all", "pending", "reviewed", "actioned", "dismissed"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all capitalize ${
                  statusFilter === s
                    ? "bg-primary text-white"
                    : "text-text-muted dark:text-d-text-muted hover:text-text dark:hover:text-d-text"
                }`}
              >
                {s === "all" ? "All" : s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <div className="bg-surface dark:bg-d-surface rounded-xl border border-border dark:border-d-border p-16 text-center">
            <Loader2 size={28} className="mx-auto text-primary animate-spin mb-3" />
            <p className="text-sm text-text-muted dark:text-d-text-muted">Loading reports...</p>
          </div>
        ) : filtered.length > 0 ? (
          filtered.map((r) => (
            <ReportCard
              key={r.id}
              report={r}
              onUpdate={handleUpdate}
              pendingId={update.isPending ? update.variables?.id : null}
            />
          ))
        ) : (
          <div className="bg-surface dark:bg-d-surface rounded-xl border border-border dark:border-d-border p-16 text-center">
            <Flag size={28} className="mx-auto text-text-muted/20 dark:text-d-text-muted/20 mb-3" />
            <p className="text-sm text-text-muted dark:text-d-text-muted">No reports found</p>
          </div>
        )}
      </div>
    </div>
  );
}
