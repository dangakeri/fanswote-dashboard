import { useState } from "react";
import FilterSelect from "../components/FilterSelect";
import {
  Search,
  Video,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Play,
  Heart,
  Eye,
  MessageSquare,
} from "lucide-react";
import { useQuickies, useApproveQuickie, useRejectQuickie } from "../hooks/useQuickies";
import { useToast } from "../context/ToastContext";
import Avatar from "../components/Avatar";

const statusStyles = {
  approved: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10",
  pending: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10",
  rejected: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10",
  draft: "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-500/10",
};

const API_BASE = "https://fanswote.warcare.org.uk";

export default function QuickiesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [page, setPage] = useState(1);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const toast = useToast();
  const params = { page, limit: 20 };
  if (statusFilter !== "all") params.status = statusFilter;

  const { data, isLoading } = useQuickies(params);
  const { quickies = [], total = 0, totalPages = 1 } = data || {};

  const approve = useApproveQuickie();
  const reject = useRejectQuickie();

  const filtered = quickies.filter((q) => {
    const q1 = (q.caption || "").toLowerCase();
    const q2 = (q.creator_name || "").toLowerCase();
    const q3 = (q.creator_username || "").toLowerCase();
    const needle = search.toLowerCase();
    return q1.includes(needle) || q2.includes(needle) || q3.includes(needle);
  });

  const handleApprove = (id) => {
    setActionLoadingId(id);
    approve.mutate(id, {
      onSuccess: () => {
        toast.success("Quickie approved");
        setActionLoadingId(null);
      },
      onError: (err) => {
        toast.error(err.message || "Failed to approve quickie");
        setActionLoadingId(null);
      },
    });
  };

  const handleReject = (id) => {
    const reason = window.prompt("Reason for rejecting this quickie?");
    if (reason === null) return; // cancelled
    setActionLoadingId(id);
    reject.mutate(
      { id, reason: reason.trim() },
      {
        onSuccess: () => {
          toast.success("Quickie rejected");
          setActionLoadingId(null);
        },
        onError: (err) => {
          toast.error(err.message || "Failed to reject quickie");
          setActionLoadingId(null);
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted dark:text-d-text-muted" />
          <input
            type="text"
            placeholder="Search quickies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg text-sm bg-surface dark:bg-d-surface text-text dark:text-d-text placeholder-text-muted dark:placeholder-d-text-muted border border-border dark:border-d-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
          />
        </div>
        <FilterSelect
          label="Status"
          value={statusFilter}
          onChange={(v) => {
            setStatusFilter(v);
            setPage(1);
          }}
          align="right"
          options={[
            { value: "all", label: "All statuses" },
            { value: "pending", label: "Pending" },
            { value: "approved", label: "Approved" },
            { value: "rejected", label: "Rejected" },
          ]}
        />
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-primary" />
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="text-center py-20">
          <Video size={40} strokeWidth={1} className="mx-auto text-text-muted/30 dark:text-d-text-muted/30 mb-3" />
          <p className="text-sm text-text-muted dark:text-d-text-muted">No quickies found</p>
        </div>
      )}

      {!isLoading && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((q) => {
            const isActioning = actionLoadingId === q.id;

            return (
              <div
                key={q.id}
                className="bg-surface dark:bg-d-surface rounded-2xl border border-border/70 dark:border-d-border overflow-hidden shadow-card dark:shadow-none hover:border-primary/30 transition-colors"
              >
                <div className="h-64 bg-page dark:bg-d-elevated flex items-center justify-center relative overflow-hidden">
                  {(() => {
                    const rawVideo =
                      q.video_url_720 ||
                      q.video_url_480 ||
                      q.video_url_360 ||
                      q.video_url ||
                      q.media_url;
                    const videoUrl = rawVideo
                      ? rawVideo.startsWith("http") ? rawVideo : `${API_BASE}${rawVideo}`
                      : null;
                    const rawThumb = q.thumbnail_url;
                    const thumbSrc = rawThumb
                      ? rawThumb.startsWith("http") ? rawThumb : `${API_BASE}${rawThumb}`
                      : null;

                    if (videoUrl) {
                      return (
                        <video
                          src={videoUrl}
                          poster={thumbSrc || undefined}
                          className="w-full h-full object-cover"
                          controls
                          preload="metadata"
                          playsInline
                        />
                      );
                    }
                    if (thumbSrc) {
                      return <img src={thumbSrc} alt="" className="w-full h-full object-cover" />;
                    }
                    return (
                      <div className="flex flex-col items-center gap-2">
                        <Play size={32} strokeWidth={1.2} className="text-text-muted/40 dark:text-d-text-muted/40" />
                        <span className="text-[10px] uppercase tracking-wider text-text-muted/60 dark:text-d-text-muted/60">
                          No video
                        </span>
                      </div>
                    );
                  })()}
                  <span
                    className={`absolute top-3 left-3 text-[10px] px-2.5 py-0.5 rounded-full font-medium capitalize ${
                      statusStyles[q.status] || statusStyles.draft
                    }`}
                  >
                    {q.status || "pending"}
                  </span>
                </div>

                <div className="p-4">
                  <p className="text-[13px] text-text dark:text-d-text line-clamp-2 min-h-[2.6em]">
                    {q.caption || (
                      <span className="italic text-text-muted dark:text-d-text-muted">No caption</span>
                    )}
                  </p>

                  <div className="flex items-center gap-2 mt-3">
                    <Avatar
                      src={q.creator_avatar}
                      name={q.creator_name}
                      username={q.creator_username}
                      size={20}
                    />
                    <span className="text-[11px] text-text-muted dark:text-d-text-muted truncate">
                      {q.creator_name || "Unknown"}{" "}
                      {q.creator_username && (
                        <span className="text-text-muted/60 dark:text-d-text-muted/60">@{q.creator_username}</span>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-border dark:border-d-border">
                    <div className="flex items-center gap-3 text-[11px] text-text-muted dark:text-d-text-muted">
                      <span className="flex items-center gap-1">
                        <Eye size={11} /> {q.view_count || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart size={11} /> {q.like_count || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare size={11} /> {q.comment_count || 0}
                      </span>
                    </div>

                    {q.status === "pending" && (
                      <div className="flex items-center gap-1">
                        {isActioning ? (
                          <Loader2 size={14} className="animate-spin text-primary" />
                        ) : (
                          <>
                            <button
                              onClick={() => handleApprove(q.id)}
                              className="p-1.5 rounded-md text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors"
                              title="Approve"
                            >
                              <CheckCircle size={15} />
                            </button>
                            <button
                              onClick={() => handleReject(q.id)}
                              className="p-1.5 rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                              title="Reject"
                            >
                              <XCircle size={15} />
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!isLoading && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-text-muted dark:text-d-text-muted">
            Showing page <span className="font-medium text-text dark:text-d-text">{page}</span> of{" "}
            <span className="font-medium text-text dark:text-d-text">{totalPages}</span>{" "}
            <span className="text-text-muted/60">({total} quickies)</span>
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-1.5 rounded-md text-text-muted dark:text-d-text-muted hover:bg-hover dark:hover:bg-d-hover transition-colors disabled:opacity-30"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-1.5 rounded-md text-text-muted dark:text-d-text-muted hover:bg-hover dark:hover:bg-d-hover transition-colors disabled:opacity-30"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
