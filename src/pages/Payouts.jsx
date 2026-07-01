import { useState } from "react";
import FilterSelect from "../components/FilterSelect";
import {
  Wallet,
  Landmark,
  Loader2,
  CheckCircle,
  XCircle,
  PlayCircle,
  Plus,
  Trash2,
  Search,
  X,
} from "lucide-react";
import {
  useWithdrawals,
  useWithdrawalAction,
  useBanks,
  useCreateBank,
  useUpdateBank,
  useDeleteBank,
} from "../hooks/usePayouts";
import { useToast } from "../context/ToastContext";
import Avatar from "../components/Avatar";

const fmt = (n) => (Number(n) || 0).toLocaleString();
const fmtKes = (n) =>
  `Ksh ${(Number(n) || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
const kes = (tokens, provided) =>
  provided != null ? provided : (Number(tokens) || 0) / 10;

// destination is an object, e.g. { type: "mpesa", phone: "2547…" } or bank details
function formatDestination(d) {
  if (!d) return "";
  if (typeof d === "string") return d;
  if (d.type === "mpesa" || d.phone) return `M-Pesa · ${d.phone || ""}`.trim();
  const parts = [
    d.bank_name || d.bank_code || d.bank,
    d.account_number || d.account,
    d.account_name,
  ].filter(Boolean);
  return parts.length ? parts.join(" · ") : d.type || "";
}

const statusConfig = {
  pending: { dot: "bg-amber-500", text: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10", label: "Pending" },
  processing: { dot: "bg-blue-500", text: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10", label: "Processing" },
  completed: { dot: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10", label: "Completed" },
  rejected: { dot: "bg-red-500", text: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-500/10", label: "Rejected" },
};

// ---------- Withdrawals tab ----------
function WithdrawalRow({ w, onAction, pending }) {
  const cfg = statusConfig[w.status] || statusConfig.pending;
  const amountTokens = w.amount_tokens ?? w.amount ?? w.tokens ?? 0;
  const netTokens = w.net_tokens ?? w.net ?? amountTokens;
  const dest = formatDestination(w.destination);
  const displayName = w.username || w.user_name || w.name || `User #${w.user_id ?? ""}`;

  return (
    <div className="bg-surface dark:bg-d-surface rounded-2xl border border-border/70 dark:border-d-border p-4">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar src={w.avatar_url} name={displayName} username={w.username} size={38} />
          <div className="min-w-0">
            <p className="text-[13px] font-medium text-text dark:text-d-text truncate">
              {displayName}
            </p>
            <p className="text-[11.5px] text-text-muted dark:text-d-text-muted truncate">
              {dest || "No destination on file"}
            </p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[15px] font-semibold text-text dark:text-d-text tabular-nums leading-none">
            {fmtKes(kes(netTokens, w.net_kes))}
          </p>
          <p className="text-[11px] text-text-muted dark:text-d-text-muted tabular-nums mt-1">
            {fmt(netTokens)} tokens net · {fmt(amountTokens)} gross
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-border/60 dark:border-d-border/60 flex-wrap">
        <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
          {cfg.label}
        </span>

        <div className="flex items-center gap-2">
          {w.status === "pending" && (
            <button
              onClick={() => onAction({ id: w.id, action: "process" })}
              disabled={pending}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border dark:border-d-border text-text-secondary dark:text-d-text-secondary text-[12.5px] font-medium hover:bg-hover dark:hover:bg-d-hover transition-colors disabled:opacity-50"
            >
              {pending ? <Loader2 size={13} className="animate-spin" /> : <PlayCircle size={13} />}
              Process
            </button>
          )}
          {(w.status === "pending" || w.status === "processing") && (
            <>
              <button
                onClick={() => onAction({ id: w.id, action: "complete", needsInput: "complete" })}
                disabled={pending}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-[12.5px] font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                <CheckCircle size={13} />
                Complete
              </button>
              <button
                onClick={() => onAction({ id: w.id, action: "reject", needsInput: "reject" })}
                disabled={pending}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-[12.5px] font-medium hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors disabled:opacity-50"
              >
                <XCircle size={13} />
                Reject
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Prompt modal for complete (reference/note) and reject (note)
function ActionModal({ open, mode, onClose, onConfirm, pending }) {
  const [reference, setReference] = useState("");
  const [note, setNote] = useState("");
  if (!open) return null;
  const isComplete = mode === "complete";

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-surface dark:bg-d-surface rounded-2xl border border-border/70 dark:border-d-border shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[15px] font-semibold text-text dark:text-d-text">
            {isComplete ? "Complete withdrawal" : "Reject withdrawal"}
          </h3>
          <button onClick={onClose} className="p-1 rounded-md text-text-muted dark:text-d-text-muted hover:bg-hover dark:hover:bg-d-hover">
            <X size={16} />
          </button>
        </div>
        <p className="text-[12.5px] text-text-muted dark:text-d-text-muted mb-4">
          {isComplete
            ? "Confirm the money has been sent. This books platform earnings and cannot be undone."
            : "Rejecting refunds the tokens to the creator's wallet."}
        </p>

        {isComplete && (
          <div className="mb-3">
            <label className="block text-[11px] uppercase tracking-wider text-text-muted dark:text-d-text-muted font-medium mb-1.5">
              Reference
            </label>
            <input
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Bank / M-Pesa reference"
              className="w-full px-3 py-2 rounded-lg text-sm bg-page dark:bg-d-elevated text-text dark:text-d-text placeholder-text-muted dark:placeholder-d-text-muted border border-border dark:border-d-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
            />
          </div>
        )}
        <div className="mb-5">
          <label className="block text-[11px] uppercase tracking-wider text-text-muted dark:text-d-text-muted font-medium mb-1.5">
            Note {isComplete && <span className="normal-case tracking-normal opacity-60">(optional)</span>}
          </label>
          <textarea
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={isComplete ? "Internal note…" : "Reason shown to the creator…"}
            className="w-full px-3 py-2 rounded-lg text-sm bg-page dark:bg-d-elevated text-text dark:text-d-text placeholder-text-muted dark:placeholder-d-text-muted border border-border dark:border-d-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 resize-none transition-all"
          />
        </div>

        <div className="flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium text-text-secondary dark:text-d-text-secondary border border-border dark:border-d-border hover:bg-hover dark:hover:bg-d-hover transition-colors">
            Cancel
          </button>
          <button
            onClick={() => onConfirm(isComplete ? { reference: reference || undefined, note: note || undefined } : { note: note || undefined })}
            disabled={pending}
            className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors disabled:opacity-50 flex items-center gap-1.5 ${
              isComplete ? "bg-emerald-600 hover:bg-emerald-700" : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {pending && <Loader2 size={14} className="animate-spin" />}
            {isComplete ? "Mark sent" : "Reject & refund"}
          </button>
        </div>
      </div>
    </div>
  );
}

function WithdrawalsTab() {
  const [statusFilter, setStatusFilter] = useState("pending");
  const [modal, setModal] = useState(null); // { id, mode }
  const toast = useToast();

  const params = statusFilter === "all" ? {} : { status: statusFilter };
  const { data, isLoading } = useWithdrawals(params);
  const action = useWithdrawalAction();
  const withdrawals = data?.withdrawals || [];

  const handleAction = ({ id, action: act, needsInput }) => {
    if (needsInput) {
      setModal({ id, mode: needsInput });
      return;
    }
    action.mutate(
      { id, action: act },
      {
        onSuccess: () => toast.success(`Withdrawal moved to ${act === "process" ? "processing" : act}`),
        onError: (err) => toast.error(err.message || "Action failed"),
      }
    );
  };

  const confirmModal = (payload) => {
    action.mutate(
      { id: modal.id, action: modal.mode, payload },
      {
        onSuccess: () => {
          toast.success(modal.mode === "complete" ? "Withdrawal completed" : "Withdrawal rejected & refunded");
          setModal(null);
        },
        onError: (err) => toast.error(err.message || "Action failed"),
      }
    );
  };

  return (
    <div className="space-y-4">
      <ActionModal
        open={!!modal}
        mode={modal?.mode}
        onClose={() => setModal(null)}
        onConfirm={confirmModal}
        pending={action.isPending}
      />

      <FilterSelect
        label="Status"
        value={statusFilter}
        onChange={setStatusFilter}
        options={[
          { value: "pending", label: "Pending" },
          { value: "processing", label: "Processing" },
          { value: "completed", label: "Completed" },
          { value: "rejected", label: "Rejected" },
          { value: "all", label: "All statuses" },
        ]}
      />

      {isLoading ? (
        <div className="bg-surface dark:bg-d-surface rounded-2xl border border-border/70 dark:border-d-border p-16 text-center">
          <Loader2 size={26} className="mx-auto text-primary animate-spin mb-3" />
          <p className="text-sm text-text-muted dark:text-d-text-muted">Loading withdrawals…</p>
        </div>
      ) : withdrawals.length === 0 ? (
        <div className="bg-surface dark:bg-d-surface rounded-2xl border border-border/70 dark:border-d-border p-16 text-center">
          <Wallet size={26} className="mx-auto text-text-muted/20 dark:text-d-text-muted/20 mb-3" />
          <p className="text-sm text-text-muted dark:text-d-text-muted">No {statusFilter === "all" ? "" : statusFilter} withdrawals</p>
        </div>
      ) : (
        <div className="space-y-3">
          {withdrawals.map((w) => (
            <WithdrawalRow
              key={w.id}
              w={w}
              onAction={handleAction}
              pending={action.isPending && action.variables?.id === w.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ---------- Banks tab ----------
function BankModal({ open, onClose, onSave, pending }) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-surface dark:bg-d-surface rounded-2xl border border-border/70 dark:border-d-border shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[15px] font-semibold text-text dark:text-d-text">Add bank</h3>
          <button onClick={onClose} className="p-1 rounded-md text-text-muted dark:text-d-text-muted hover:bg-hover dark:hover:bg-d-hover">
            <X size={16} />
          </button>
        </div>
        <div className="space-y-3">
          <Field label="Code" value={code} onChange={setCode} placeholder="e.g. 01" />
          <Field label="Name" value={name} onChange={setName} placeholder="Bank name" />
          <Field label="Sort order" value={sortOrder} onChange={setSortOrder} placeholder="Optional" type="number" />
        </div>
        <div className="flex items-center justify-end gap-2 mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium text-text-secondary dark:text-d-text-secondary border border-border dark:border-d-border hover:bg-hover dark:hover:bg-d-hover transition-colors">
            Cancel
          </button>
          <button
            onClick={() =>
              onSave({
                code: code.trim(),
                name: name.trim(),
                ...(sortOrder !== "" ? { sort_order: Number(sortOrder) } : {}),
              })
            }
            disabled={pending || !code.trim() || !name.trim()}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary-hover shadow-sm shadow-primary/25 transition-colors disabled:opacity-50 flex items-center gap-1.5"
          >
            {pending && <Loader2 size={14} className="animate-spin" />}
            Add bank
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <label className="block text-[11px] uppercase tracking-wider text-text-muted dark:text-d-text-muted font-medium mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg text-sm bg-page dark:bg-d-elevated text-text dark:text-d-text placeholder-text-muted dark:placeholder-d-text-muted border border-border dark:border-d-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
      />
    </div>
  );
}

function BanksTab() {
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const toast = useToast();

  const { data: banks = [], isLoading } = useBanks();
  const create = useCreateBank();
  const update = useUpdateBank();
  const remove = useDeleteBank();

  const filtered = banks.filter(
    (b) =>
      (b.name || "").toLowerCase().includes(search.toLowerCase()) ||
      String(b.code || "").includes(search)
  );

  const handleCreate = (payload) => {
    create.mutate(payload, {
      onSuccess: () => {
        toast.success("Bank added");
        setShowAdd(false);
      },
      onError: (err) => toast.error(err.message || "Failed to add bank"),
    });
  };

  const toggleActive = (bank) => {
    update.mutate(
      { code: bank.code, payload: { is_active: !(bank.is_active ?? true) } },
      {
        onSuccess: () => toast.success(`Bank ${bank.is_active ?? true ? "disabled" : "enabled"}`),
        onError: (err) => toast.error(err.message || "Failed to update bank"),
      }
    );
  };

  const handleDelete = (bank) => {
    if (!window.confirm(`Delete ${bank.name}? This removes it from the payout bank list.`)) return;
    remove.mutate(bank.code, {
      onSuccess: () => toast.success("Bank removed"),
      onError: (err) => toast.error(err.message || "Failed to delete bank"),
    });
  };

  return (
    <div className="space-y-4">
      <BankModal open={showAdd} onClose={() => setShowAdd(false)} onSave={handleCreate} pending={create.isPending} />

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted dark:text-d-text-muted" />
          <input
            type="text"
            placeholder="Search banks…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg text-sm bg-surface dark:bg-d-surface text-text dark:text-d-text placeholder-text-muted dark:placeholder-d-text-muted border border-border dark:border-d-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
          />
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-medium text-white bg-primary hover:bg-primary-hover shadow-sm shadow-primary/25 transition-colors"
        >
          <Plus size={15} />
          Add bank
        </button>
      </div>

      <div className="bg-surface dark:bg-d-surface rounded-2xl border border-border/70 dark:border-d-border overflow-hidden shadow-card dark:shadow-none">
        {isLoading ? (
          <div className="p-16 text-center">
            <Loader2 size={26} className="mx-auto text-primary animate-spin mb-3" />
            <p className="text-sm text-text-muted dark:text-d-text-muted">Loading banks…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center">
            <Landmark size={26} className="mx-auto text-text-muted/20 dark:text-d-text-muted/20 mb-3" />
            <p className="text-sm text-text-muted dark:text-d-text-muted">No banks found</p>
          </div>
        ) : (
          <ul className="divide-y divide-border/60 dark:divide-d-border/60">
            {filtered.map((bank) => {
              const active = bank.is_active ?? true;
              return (
                <li key={bank.code} className="flex items-center gap-3 px-5 py-3.5">
                  <div className="w-9 h-9 rounded-lg bg-page dark:bg-d-elevated flex items-center justify-center shrink-0">
                    <Landmark size={16} className="text-text-muted dark:text-d-text-muted" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-text dark:text-d-text truncate">{bank.name}</p>
                    <p className="text-[11.5px] text-text-muted dark:text-d-text-muted tabular-nums">
                      Code {bank.code}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleActive(bank)}
                    className={`text-[11px] font-medium px-2.5 py-1 rounded-full transition-colors ${
                      active
                        ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-gray-100 dark:bg-gray-500/10 text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {active ? "Active" : "Inactive"}
                  </button>
                  <button
                    onClick={() => handleDelete(bank)}
                    className="p-2 rounded-lg text-text-muted dark:text-d-text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                    aria-label="Delete bank"
                  >
                    <Trash2 size={15} />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function Payouts() {
  const [tab, setTab] = useState("withdrawals");

  return (
    <div className="space-y-6">
      <div className="border-b border-border/60 dark:border-d-border/60 pb-5">
        <h1 className="text-[22px] font-extrabold text-text dark:text-d-text tracking-tight leading-tight">
          Payouts
        </h1>
        <p className="text-[12.5px] text-text-muted dark:text-d-text-muted mt-1">
          Process creator withdrawals and manage the payout bank list · fees: VAT 16% + processing 2% + platform 22%
        </p>
      </div>

      <div className="flex items-center gap-6 border-b border-border dark:border-d-border">
        {[
          { key: "withdrawals", label: "Withdrawals", icon: Wallet },
          { key: "banks", label: "Banks", icon: Landmark },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`relative flex items-center gap-2 px-1 py-3 -mb-px border-b-2 text-[13.5px] font-semibold transition-colors ${
              tab === t.key
                ? "border-primary text-primary"
                : "border-transparent text-text-muted dark:text-d-text-muted hover:text-text dark:hover:text-d-text"
            }`}
          >
            <t.icon size={16} />
            {t.label}
          </button>
        ))}
      </div>

      {tab === "withdrawals" ? <WithdrawalsTab /> : <BanksTab />}
    </div>
  );
}
