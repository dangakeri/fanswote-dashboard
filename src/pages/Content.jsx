import { useState } from "react";
import {
  Search,
  Image,
  Video,
  FileText,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Eye,
  Lock,
  Globe,
  DollarSign,
} from "lucide-react";
import { usePosts, useApprovePost, useRejectPost } from "../hooks/useContent";
import { useToast } from "../context/ToastContext";

const typeIcons = { photo: Image, video: Video, text: FileText };

const statusStyles = {
  published: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10",
  pending: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10",
  rejected: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10",
  draft: "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-500/10",
  scheduled: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10",
};

const visibilityIcons = {
  public: Globe,
  subscribers_only: Lock,
  ppv: DollarSign,
};

const visibilityLabels = {
  public: "Public",
  subscribers_only: "Subscribers",
  ppv: "PPV",
};

const API_BASE = "https://api.fanswote.com";

export default function ContentPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [typeFilter, setTypeFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [rejectModal, setRejectModal] = useState({ open: false, postId: null });
  const [rejectReason, setRejectReason] = useState("");

  const toast = useToast();

  const params = { page, limit: 20 };
  if (statusFilter !== "all") params.status = statusFilter;

  const { data, isLoading } = usePosts(params);
  const { posts = [], total = 0, totalPages = 1 } = data || {};

  const approvePost = useApprovePost();
  const rejectPost = useRejectPost();

  const filtered = posts.filter((post) => {
    const matchesSearch =
      (post.caption || "").toLowerCase().includes(search.toLowerCase()) ||
      (post.creator_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (post.creator_username || "").toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || post.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleApprove = (id) => {
    setActionLoadingId(id);
    approvePost.mutate(id, {
      onSuccess: () => {
        toast.success("Post approved successfully");
        setActionLoadingId(null);
      },
      onError: (err) => {
        toast.error(err.message || "Failed to approve post");
        setActionLoadingId(null);
      },
    });
  };

  const handleRejectSubmit = () => {
    if (!rejectReason.trim()) return;
    setActionLoadingId(rejectModal.postId);
    rejectPost.mutate(
      { id: rejectModal.postId, reason: rejectReason },
      {
        onSuccess: () => {
          toast.success("Post rejected");
          setRejectModal({ open: false, postId: null });
          setRejectReason("");
          setActionLoadingId(null);
        },
        onError: (err) => {
          toast.error(err.message || "Failed to reject post");
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
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg text-sm bg-surface dark:bg-d-surface text-text dark:text-d-text placeholder-text-muted dark:placeholder-d-text-muted border border-border dark:border-d-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {/* Type filter */}
          <div className="flex bg-surface dark:bg-d-surface rounded-lg border border-border dark:border-d-border p-0.5">
            {["all", "photo", "video", "text"].map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all capitalize ${
                  typeFilter === type
                    ? "bg-primary text-white"
                    : "text-text-muted dark:text-d-text-muted hover:text-text dark:hover:text-d-text"
                }`}
              >
                {type === "all" ? "All" : type === "photo" ? "Photos" : type === "video" ? "Videos" : "Text"}
              </button>
            ))}
          </div>
          {/* Status filter */}
          <div className="flex bg-surface dark:bg-d-surface rounded-lg border border-border dark:border-d-border p-0.5">
            {["all", "pending", "published", "rejected", "draft", "scheduled"].map((s) => (
              <button
                key={s}
                onClick={() => {
                  setStatusFilter(s);
                  setPage(1);
                }}
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

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-primary" />
        </div>
      )}

      {/* Empty */}
      {!isLoading && filtered.length === 0 && (
        <div className="text-center py-20">
          <FileText size={40} strokeWidth={1} className="mx-auto text-text-muted/30 dark:text-d-text-muted/30 mb-3" />
          <p className="text-sm text-text-muted dark:text-d-text-muted">No posts found</p>
        </div>
      )}

      {/* Grid */}
      {!isLoading && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((post) => {
            const TypeIcon = typeIcons[post.type] || FileText;
            const VisIcon = visibilityIcons[post.visibility] || Globe;
            const isActioning = actionLoadingId === post.id;

            return (
              <div
                key={post.id}
                className="bg-surface dark:bg-d-surface rounded-xl border border-border dark:border-d-border overflow-hidden group hover:border-primary/30 transition-colors"
              >
                {/* Preview area */}
                <div className="h-40 bg-page dark:bg-d-elevated flex items-center justify-center relative">
                  <TypeIcon size={32} strokeWidth={1.2} className="text-text-muted/20 dark:text-d-text-muted/20" />
                  <span
                    className={`absolute top-3 left-3 text-[10px] px-2.5 py-0.5 rounded-full font-medium capitalize ${statusStyles[post.status]}`}
                  >
                    {post.status}
                  </span>
                  <div className="absolute top-3 right-3 flex items-center gap-1 text-[10px] text-text-muted dark:text-d-text-muted bg-surface/80 dark:bg-d-surface/80 backdrop-blur-sm px-2 py-0.5 rounded-full">
                    <VisIcon size={10} />
                    <span>{visibilityLabels[post.visibility] || post.visibility}</span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <p className="text-[13px] text-text dark:text-d-text line-clamp-2 min-h-[2.6em]">
                    {post.caption || <span className="italic text-text-muted dark:text-d-text-muted">No caption</span>}
                  </p>

                  {/* Creator */}
                  <div className="flex items-center gap-2 mt-3">
                    {post.creator_avatar ? (
                      <img
                        src={`${API_BASE}${post.creator_avatar}`}
                        alt=""
                        className="w-5 h-5 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-[9px] font-bold text-primary">
                          {(post.creator_name || "?")[0].toUpperCase()}
                        </span>
                      </div>
                    )}
                    <span className="text-[11px] text-text-muted dark:text-d-text-muted truncate">
                      {post.creator_name || "Unknown"}{" "}
                      {post.creator_username && (
                        <span className="text-text-muted/60 dark:text-d-text-muted/60">@{post.creator_username}</span>
                      )}
                    </span>
                  </div>

                  {/* Rejection reason */}
                  {post.status === "rejected" && post.rejection_reason && (
                    <p className="text-[11px] text-red-500 dark:text-red-400 mt-2 line-clamp-1">
                      Reason: {post.rejection_reason}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-border dark:border-d-border">
                    <span className="flex items-center gap-1.5 text-[11px] text-text-muted dark:text-d-text-muted capitalize">
                      <TypeIcon size={12} />
                      {post.type}
                    </span>

                    {post.status === "pending" && (
                      <div className="flex items-center gap-1">
                        {isActioning ? (
                          <Loader2 size={14} className="animate-spin text-primary" />
                        ) : (
                          <>
                            <button
                              onClick={() => handleApprove(post.id)}
                              className="p-1.5 rounded-md text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors"
                              title="Approve"
                            >
                              <CheckCircle size={15} />
                            </button>
                            <button
                              onClick={() => setRejectModal({ open: true, postId: post.id })}
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

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-text-muted dark:text-d-text-muted">
            Showing page <span className="font-medium text-text dark:text-d-text">{page}</span> of{" "}
            <span className="font-medium text-text dark:text-d-text">{totalPages}</span>{" "}
            <span className="text-text-muted/60">({total} posts)</span>
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-1.5 rounded-md text-text-muted dark:text-d-text-muted hover:bg-hover dark:hover:bg-d-hover transition-colors disabled:opacity-30"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-7 h-7 rounded-md text-xs font-bold flex items-center justify-center transition-colors ${
                    page === pageNum
                      ? "bg-primary text-white"
                      : "text-text-muted dark:text-d-text-muted hover:bg-hover dark:hover:bg-d-hover"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
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

      {/* Reject Modal */}
      {rejectModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-surface dark:bg-d-surface rounded-2xl border border-border dark:border-d-border shadow-2xl w-full max-w-md mx-4 p-6">
            <h3 className="text-base font-semibold text-text dark:text-d-text mb-1">Reject Post</h3>
            <p className="text-xs text-text-muted dark:text-d-text-muted mb-4">
              Provide a reason for rejecting this post.
            </p>
            <textarea
              rows={3}
              placeholder="Rejection reason..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm bg-page dark:bg-d-page text-text dark:text-d-text placeholder-text-muted dark:placeholder-d-text-muted border border-border dark:border-d-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 resize-none transition-all"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  setRejectModal({ open: false, postId: null });
                  setRejectReason("");
                }}
                className="px-4 py-2 rounded-lg text-xs font-medium text-text-muted dark:text-d-text-muted hover:bg-hover dark:hover:bg-d-hover transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectSubmit}
                disabled={!rejectReason.trim() || actionLoadingId === rejectModal.postId}
                className="px-4 py-2 rounded-lg text-xs font-medium bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {actionLoadingId === rejectModal.postId && <Loader2 size={12} className="animate-spin" />}
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
