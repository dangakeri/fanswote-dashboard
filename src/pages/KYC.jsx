import { useState } from "react";
import {
  Search, ShieldCheck, ShieldX, Clock, CheckCircle, XCircle, Eye,
  FileText, Calendar, ChevronDown, ChevronUp, Hash, User, Mail, X, Loader2,
} from "lucide-react";
import { useKycSubmissions, useApproveKyc, useRejectKyc } from "../hooks/useKyc";
import { useToast } from "../context/ToastContext";
import { kycData as mockKyc } from "../data/mockData";

const API_BASE = "https://api.fanswote.com";

const statusConfig = {
  pending: { dot: "bg-amber-500", text: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10", label: "Pending" },
  approved: { dot: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10", label: "Approved" },
  rejected: { dot: "bg-red-500", text: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-500/10", label: "Rejected" },
};

function Detail({ label, value, icon: Icon }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-page dark:bg-d-elevated flex items-center justify-center shrink-0">
        <Icon size={14} className="text-text-muted dark:text-d-text-muted" />
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-wider text-text-muted dark:text-d-text-muted font-medium">{label}</p>
        <p className="text-[13px] text-text dark:text-d-text font-medium">{value}</p>
      </div>
    </div>
  );
}

function ImageModal({ src, alt, onClose }) {
  if (!src) return null;
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative max-w-2xl w-full max-h-[85vh]">
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 z-10 w-8 h-8 rounded-full bg-surface dark:bg-d-surface border border-border dark:border-d-border flex items-center justify-center shadow-lg hover:bg-hover dark:hover:bg-d-hover transition-colors"
        >
          <X size={16} className="text-text dark:text-d-text" />
        </button>
        <img
          src={src}
          alt={alt}
          className="w-full h-auto max-h-[85vh] object-contain rounded-xl shadow-2xl"
        />
      </div>
    </div>
  );
}

function RejectModal({ open, onClose, onConfirm, isLoading }) {
  const [reason, setReason] = useState("");

  if (!open) return null;

  const handleSubmit = () => {
    if (!reason.trim()) return;
    onConfirm(reason.trim());
    setReason("");
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-surface dark:bg-d-surface rounded-xl border border-border dark:border-d-border shadow-xl w-full max-w-md p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
            <XCircle size={20} className="text-red-500" />
          </div>
          <div>
            <h3 className="font-semibold text-text dark:text-d-text">Reject Submission</h3>
            <p className="text-xs text-text-muted dark:text-d-text-muted">Provide a reason for rejecting this KYC submission</p>
          </div>
        </div>

        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter rejection reason..."
          rows={3}
          className="w-full px-4 py-3 rounded-lg text-sm bg-page dark:bg-d-elevated text-text dark:text-d-text placeholder-text-muted dark:placeholder-d-text-muted border border-border dark:border-d-border focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500/40 transition-all resize-none"
        />

        <div className="flex items-center gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-border dark:border-d-border text-text-secondary dark:text-d-text-secondary text-[13px] font-medium hover:bg-hover dark:hover:bg-d-hover transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!reason.trim() || isLoading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-600 text-white text-[13px] font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading && <Loader2 size={14} className="animate-spin" />}
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}

function KYCCard({ submission, onApprove, onReject, isApproving, isRejecting }) {
  const [expanded, setExpanded] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const config = statusConfig[submission.status] || statusConfig.pending;

  const frontUrl = submission.front_url ? `${API_BASE}${submission.front_url}` : null;
  const backUrl = submission.back_url ? `${API_BASE}${submission.back_url}` : null;

  return (
    <>
      <div className={`bg-surface dark:bg-d-surface rounded-xl border overflow-hidden transition-all ${
        expanded ? "border-primary/30" : "border-border dark:border-d-border"
      }`}>
        <button
          type="button"
          className="flex items-center justify-between w-full px-5 py-4 text-left hover:bg-hover dark:hover:bg-d-hover transition-colors"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 text-primary text-[11px] font-bold flex items-center justify-center shrink-0">
              {submission.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div>
              <p className="font-medium text-text dark:text-d-text text-[13px]">{submission.name}</p>
              <p className="text-[11px] text-text-muted dark:text-d-text-muted">{submission.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-0.5 rounded-full ${config.bg} ${config.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
              {config.label}
            </span>
            <span className="text-[11px] text-text-muted dark:text-d-text-muted hidden sm:block tabular-nums">
              {new Date(submission.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
            <div className={`p-1 rounded-md transition-colors ${expanded ? "text-primary" : "text-text-muted dark:text-d-text-muted"}`}>
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
          </div>
        </button>

        {expanded && (
          <div className="border-t border-border dark:border-d-border px-5 py-5 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Detail label="User ID" value={`#${submission.user_id}`} icon={Hash} />
              <Detail label="Name" value={submission.name} icon={User} />
              <Detail label="Email" value={submission.email} icon={Mail} />
              <Detail label="Submitted" value={new Date(submission.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })} icon={Calendar} />
            </div>

            {/* Document images */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {frontUrl ? (
                <button
                  onClick={() => setPreviewImage({ src: frontUrl, alt: "ID Document (Front)" })}
                  className="group relative h-40 rounded-lg border border-border dark:border-d-border overflow-hidden hover:border-primary/40 transition-all"
                >
                  <img src={frontUrl} alt="ID Front" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                    <Eye size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <span className="absolute bottom-2 left-2 text-[10px] font-medium text-white bg-black/50 px-2 py-0.5 rounded-md">
                    Front
                  </span>
                </button>
              ) : (
                <div className="h-40 rounded-lg bg-page dark:bg-d-elevated border border-dashed border-border dark:border-d-border flex flex-col items-center justify-center gap-1.5">
                  <FileText size={20} strokeWidth={1.2} className="text-text-muted/30 dark:text-d-text-muted/30" />
                  <span className="text-[11px] text-text-muted dark:text-d-text-muted">ID Document (Front)</span>
                </div>
              )}
              {backUrl ? (
                <button
                  onClick={() => setPreviewImage({ src: backUrl, alt: "ID Document (Back)" })}
                  className="group relative h-40 rounded-lg border border-border dark:border-d-border overflow-hidden hover:border-primary/40 transition-all"
                >
                  <img src={backUrl} alt="ID Back" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                    <Eye size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <span className="absolute bottom-2 left-2 text-[10px] font-medium text-white bg-black/50 px-2 py-0.5 rounded-md">
                    Back
                  </span>
                </button>
              ) : (
                <div className="h-40 rounded-lg bg-page dark:bg-d-elevated border border-dashed border-border dark:border-d-border flex flex-col items-center justify-center gap-1.5">
                  <FileText size={20} strokeWidth={1.2} className="text-text-muted/30 dark:text-d-text-muted/30" />
                  <span className="text-[11px] text-text-muted dark:text-d-text-muted">ID Document (Back)</span>
                </div>
              )}
            </div>

            {submission.rejection_reason && (
              <div className="flex items-start gap-3 px-4 py-3 rounded-lg bg-red-50 dark:bg-red-500/5 border border-red-100 dark:border-red-500/15">
                <XCircle size={15} className="text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[11px] font-semibold text-red-700 dark:text-red-400 mb-0.5">Rejection Reason</p>
                  <p className="text-[13px] text-red-600 dark:text-red-300">{submission.rejection_reason}</p>
                </div>
              </div>
            )}

            {submission.status === "pending" && (
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={(e) => { e.stopPropagation(); onApprove(submission.id); }}
                  disabled={isApproving}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 text-white text-[13px] font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
                >
                  {isApproving ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                  Approve
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onReject(submission.id); }}
                  disabled={isRejecting}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-[13px] font-medium hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors disabled:opacity-50"
                >
                  {isRejecting ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
                  Reject
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <ImageModal
        src={previewImage?.src}
        alt={previewImage?.alt}
        onClose={() => setPreviewImage(null)}
      />
    </>
  );
}

export default function KYCPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [rejectTarget, setRejectTarget] = useState(null);
  const toast = useToast();
  const { data: apiSubmissions, isLoading } = useKycSubmissions();
  const approveMutation = useApproveKyc();
  const rejectMutation = useRejectKyc();

  const submissions = apiSubmissions || mockKyc;

  const filtered = submissions.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const counts = {
    pending: submissions.filter((s) => s.status === "pending").length,
    approved: submissions.filter((s) => s.status === "approved").length,
    rejected: submissions.filter((s) => s.status === "rejected").length,
  };

  const handleApprove = (id) => {
    approveMutation.mutate(id, {
      onSuccess: () => toast.success("KYC submission approved"),
      onError: (err) => toast.error(err.message || "Failed to approve submission"),
    });
  };

  const handleReject = (id) => {
    setRejectTarget(id);
  };

  const confirmReject = (reason) => {
    rejectMutation.mutate({ id: rejectTarget, reason }, {
      onSuccess: () => {
        setRejectTarget(null);
        toast.success("KYC submission rejected");
      },
      onError: (err) => toast.error(err.message || "Failed to reject submission"),
    });
  };

  const summaryCards = [
    { label: "Pending Review", count: counts.pending, icon: Clock },
    { label: "Approved", count: counts.approved, icon: ShieldCheck },
    { label: "Rejected", count: counts.rejected, icon: ShieldX },
  ];

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-surface dark:bg-d-surface rounded-xl px-5 py-4 border border-border dark:border-d-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-page dark:bg-d-elevated flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-text-muted dark:text-d-text-muted" />
                </div>
                <div>
                  <p className="text-xs text-text-muted dark:text-d-text-muted">{card.label}</p>
                  <p className="text-xl font-bold text-text dark:text-d-text leading-none mt-0.5">{card.count}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted dark:text-d-text-muted" />
          <input
            type="text"
            placeholder="Search submissions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg text-sm bg-surface dark:bg-d-surface text-text dark:text-d-text placeholder-text-muted dark:placeholder-d-text-muted border border-border dark:border-d-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
          />
        </div>
        <div className="flex bg-surface dark:bg-d-surface rounded-lg border border-border dark:border-d-border p-0.5">
          {["all", "pending", "approved", "rejected"].map((s) => (
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

      {/* Cards */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="bg-surface dark:bg-d-surface rounded-xl border border-border dark:border-d-border p-16 text-center">
            <Loader2 size={28} className="mx-auto text-primary animate-spin mb-3" />
            <p className="text-sm text-text-muted dark:text-d-text-muted">Loading submissions...</p>
          </div>
        ) : filtered.length > 0 ? (
          filtered.map((sub) => (
            <KYCCard
              key={sub.id}
              submission={sub}
              onApprove={handleApprove}
              onReject={handleReject}
              isApproving={approveMutation.isPending && approveMutation.variables === sub.id}
              isRejecting={rejectMutation.isPending && rejectMutation.variables?.id === sub.id}
            />
          ))
        ) : (
          <div className="bg-surface dark:bg-d-surface rounded-xl border border-border dark:border-d-border p-16 text-center">
            <ShieldCheck size={28} className="mx-auto text-text-muted/20 dark:text-d-text-muted/20 mb-3" />
            <p className="text-sm text-text-muted dark:text-d-text-muted">No submissions found</p>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      <RejectModal
        open={!!rejectTarget}
        onClose={() => setRejectTarget(null)}
        onConfirm={confirmReject}
        isLoading={rejectMutation.isPending}
      />
    </div>
  );
}
