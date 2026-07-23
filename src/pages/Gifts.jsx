import { useRef, useState } from "react";
import FilterSelect from "../components/FilterSelect";
import {
  Search,
  Gift,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  X,
  Coins,
  CheckCircle,
  XCircle,
  Upload,
} from "lucide-react";
import {
  useGifts,
  useCreateGift,
  useUpdateGift,
  useToggleGift,
  useDeleteGift,
} from "../hooks/useGifts";
import { useToast } from "../context/ToastContext";

const API_BASE = "https://fanswote.warcare.org.uk";

const resolveIconUrl = (raw) => {
  if (!raw || typeof raw !== "string") return null;
  if (raw.startsWith("http://") || raw.startsWith("https://") || raw.startsWith("data:")) return raw;
  return `${API_BASE}${raw.startsWith("/") ? "" : "/"}${raw}`;
};

function GiftImage({ src, alt, size = 48 }) {
  const [failed, setFailed] = useState(false);
  const url = resolveIconUrl(src);

  if (!url || failed) {
    return (
      <div
        style={{ width: size, height: size }}
        className="rounded-lg bg-page dark:bg-d-elevated border border-border dark:border-d-border flex items-center justify-center shrink-0"
      >
        <Gift size={size * 0.45} className="text-text-muted/40 dark:text-d-text-muted/40" />
      </div>
    );
  }

  return (
    <img
      src={url}
      alt={alt}
      onError={() => setFailed(true)}
      style={{ width: size, height: size }}
      className="rounded-lg object-cover bg-page dark:bg-d-elevated border border-border dark:border-d-border shrink-0"
    />
  );
}

const MAX_ICON_BYTES = 512 * 1024; // 512KB — keep base64 payload small

function GiftFormModal({ open, onClose, initial, onSubmit, isSaving }) {
  const [form, setForm] = useState(() => ({
    name: initial?.name || "",
    price: initial?.price ?? "",
    animation_type: initial?.animation_type || initial?.animationType || "none",
    is_active: initial?.is_active ?? initial?.isActive ?? true,
    icon_url: initial?.icon_url || initial?.iconUrl || "",
  }));
  const [fileError, setFileError] = useState("");
  const fileInputRef = useRef(null);

  if (!open) return null;

  const preview = resolveIconUrl(form.icon_url);

  const handleFilePick = (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-picking the same file
    if (!file) return;
    setFileError("");
    if (!file.type.startsWith("image/")) {
      setFileError("Please choose an image file.");
      return;
    }
    if (file.size > MAX_ICON_BYTES) {
      setFileError("Image is too large (max 512KB).");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setForm((prev) => ({ ...prev, icon_url: reader.result }));
    reader.onerror = () => setFileError("Could not read that file.");
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // API expects a JSON body with icon_url (not a file upload)
    const payload = {
      name: form.name,
      price: Number(form.price),
      animation_type: form.animation_type,
      is_active: form.is_active,
    };
    if (form.icon_url.trim()) payload.icon_url = form.icon_url.trim();
    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-surface dark:bg-d-surface rounded-2xl border border-border/70 dark:border-d-border shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border dark:border-d-border">
          <h3 className="text-[15px] font-semibold text-text dark:text-d-text">
            {initial ? "Edit gift" : "New gift"}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-muted dark:text-d-text-muted hover:bg-hover dark:hover:bg-d-hover"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-5 space-y-4">
          {/* Icon URL */}
          <div className="flex items-center gap-4">
            {preview ? (
              <img
                src={preview}
                alt="preview"
                className="w-16 h-16 rounded-lg object-cover border border-border dark:border-d-border"
              />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-page dark:bg-d-elevated border border-border dark:border-d-border flex items-center justify-center shrink-0">
                <Gift size={22} className="text-text-muted/40 dark:text-d-text-muted/40" />
              </div>
            )}
            <div className="flex-1 space-y-1.5">
              <label className="block text-[11px] uppercase tracking-wider text-text-muted dark:text-d-text-muted font-medium">
                Icon
              </label>
              <input
                type="text"
                value={form.icon_url.startsWith("data:") ? "" : form.icon_url}
                onChange={(e) => setForm({ ...form, icon_url: e.target.value })}
                placeholder={
                  form.icon_url.startsWith("data:")
                    ? "Uploaded image selected"
                    : "/uploads/gifts/rose.png or https://…"
                }
                disabled={form.icon_url.startsWith("data:")}
                className="w-full px-3 py-2 rounded-lg text-sm bg-page dark:bg-d-elevated text-text dark:text-d-text border border-border dark:border-d-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all disabled:opacity-60"
              />
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFilePick}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[12px] font-medium text-text-secondary dark:text-d-text-secondary border border-border dark:border-d-border hover:bg-hover dark:hover:bg-d-hover transition-colors"
                >
                  <Upload size={12} />
                  Choose file
                </button>
                {form.icon_url && (
                  <button
                    type="button"
                    onClick={() => {
                      setForm({ ...form, icon_url: "" });
                      setFileError("");
                    }}
                    className="text-[12px] text-text-muted dark:text-d-text-muted hover:text-red-500 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
              {fileError && (
                <p className="text-[11px] text-red-500">{fileError}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-[11px] uppercase tracking-wider text-text-muted dark:text-d-text-muted font-medium">
                Name
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg text-sm bg-page dark:bg-d-elevated text-text dark:text-d-text border border-border dark:border-d-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
                placeholder="Rose"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[11px] uppercase tracking-wider text-text-muted dark:text-d-text-muted font-medium">
                Price (coins)
              </label>
              <input
                type="number"
                min={0}
                step={1}
                required
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full px-3 py-2 rounded-lg text-sm bg-page dark:bg-d-elevated text-text dark:text-d-text border border-border dark:border-d-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
                placeholder="10"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] uppercase tracking-wider text-text-muted dark:text-d-text-muted font-medium">
              Animation
            </label>
            <select
              value={form.animation_type}
              onChange={(e) => setForm({ ...form, animation_type: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-sm bg-page dark:bg-d-elevated text-text dark:text-d-text border border-border dark:border-d-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
            >
              <option value="none">None</option>
              <option value="float">Float</option>
              <option value="burst">Burst</option>
              <option value="shake">Shake</option>
              <option value="fireworks">Fireworks</option>
            </select>
          </div>

          <label className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg border border-border dark:border-d-border">
            <div>
              <p className="text-[13px] font-medium text-text dark:text-d-text">Active</p>
              <p className="text-[11px] text-text-muted dark:text-d-text-muted">Gift is available to users</p>
            </div>
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
              className="accent-primary w-4 h-4"
            />
          </label>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-border dark:border-d-border text-text-secondary dark:text-d-text-secondary text-[13px] font-medium hover:bg-hover dark:hover:bg-d-hover transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-[13px] font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isSaving && <Loader2 size={14} className="animate-spin" />}
              {initial ? "Save changes" : "Create gift"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ConfirmDeleteModal({ open, name, onClose, onConfirm, isLoading }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-surface dark:bg-d-surface rounded-2xl border border-border/70 dark:border-d-border shadow-xl w-full max-w-sm p-6">
        <h3 className="text-[15px] font-semibold text-text dark:text-d-text">Delete gift?</h3>
        <p className="text-sm text-text-muted dark:text-d-text-muted mt-1">
          {name ? `"${name}" will be removed.` : "This gift will be removed."} This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-border dark:border-d-border text-text-secondary dark:text-d-text-secondary text-[13px] font-medium hover:bg-hover dark:hover:bg-d-hover transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-500 text-white text-[13px] font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            {isLoading && <Loader2 size={14} className="animate-spin" />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function GiftsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const toast = useToast();
  const { data: gifts, isLoading } = useGifts();
  const createMutation = useCreateGift();
  const updateMutation = useUpdateGift();
  const toggleMutation = useToggleGift();
  const deleteMutation = useDeleteGift();

  const list = (gifts || []).filter((g) => {
    const name = (g.name || "").toLowerCase();
    const matchesSearch = name.includes(search.toLowerCase());
    const active = g.is_active ?? g.isActive ?? true;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && active) ||
      (statusFilter === "inactive" && !active);
    return matchesSearch && matchesStatus;
  });

  const counts = {
    total: gifts?.length || 0,
    active: (gifts || []).filter((g) => g.is_active ?? g.isActive ?? true).length,
    inactive: (gifts || []).filter((g) => !(g.is_active ?? g.isActive ?? true)).length,
  };

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (gift) => {
    setEditing(gift);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
  };

  const handleSubmit = (payload) => {
    if (editing) {
      updateMutation.mutate(
        { id: editing.id, payload },
        {
          onSuccess: () => {
            toast.success("Gift updated");
            closeForm();
          },
          onError: (err) => toast.error(err.message || "Failed to update gift"),
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          toast.success("Gift created");
          closeForm();
        },
        onError: (err) => toast.error(err.message || "Failed to create gift"),
      });
    }
  };

  const handleToggle = (gift) => {
    const next = !(gift.is_active ?? gift.isActive ?? true);
    toggleMutation.mutate(
      { id: gift.id, isActive: next },
      {
        onSuccess: () => toast.success(next ? "Gift activated" : "Gift deactivated"),
        onError: (err) => toast.error(err.message || "Failed to update gift"),
      }
    );
  };

  const handleDelete = () => {
    if (!deleting) return;
    deleteMutation.mutate(deleting.id, {
      onSuccess: () => {
        toast.success("Gift deleted");
        setDeleting(null);
      },
      onError: (err) => toast.error(err.message || "Failed to delete gift"),
    });
  };

  const summary = [
    { label: "Total gifts", count: counts.total, icon: Gift },
    { label: "Active", count: counts.active, icon: CheckCircle },
    { label: "Inactive", count: counts.inactive, icon: XCircle },
  ];

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {summary.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-surface dark:bg-d-surface rounded-xl px-5 py-4 border border-border dark:border-d-border"
            >
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
            placeholder="Search gifts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg text-sm bg-surface dark:bg-d-surface text-text dark:text-d-text placeholder-text-muted dark:placeholder-d-text-muted border border-border dark:border-d-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <FilterSelect
            label="Status"
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: "all", label: "All gifts" },
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
            ]}
          />
          <button
            onClick={openCreate}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus size={14} />
            New gift
          </button>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="bg-surface dark:bg-d-surface rounded-2xl border border-border/70 dark:border-d-border p-16 text-center">
          <Loader2 size={28} className="mx-auto text-primary animate-spin mb-3" />
          <p className="text-sm text-text-muted dark:text-d-text-muted">Loading gifts...</p>
        </div>
      ) : list.length === 0 ? (
        <div className="bg-surface dark:bg-d-surface rounded-2xl border border-border/70 dark:border-d-border p-16 text-center">
          <Gift size={28} className="mx-auto text-text-muted/20 dark:text-d-text-muted/20 mb-3" />
          <p className="text-sm text-text-muted dark:text-d-text-muted">No gifts found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((gift) => {
            const active = gift.is_active ?? gift.isActive ?? true;
            const iconRaw = gift.icon_url || gift.iconUrl;
            return (
              <div
                key={gift.id}
                className="bg-surface dark:bg-d-surface rounded-2xl border border-border/70 dark:border-d-border p-4 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <GiftImage src={iconRaw} alt={gift.name} size={56} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-[14px] font-semibold text-text dark:text-d-text truncate">
                        {gift.name || "Untitled"}
                      </p>
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                          active
                            ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-gray-100 dark:bg-gray-500/10 text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${active ? "bg-emerald-500" : "bg-gray-400"}`}
                        />
                        {active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-[12px] text-text-muted dark:text-d-text-muted">
                      <span className="inline-flex items-center gap-1">
                        <Coins size={12} />
                        {gift.price ?? 0}
                      </span>
                      <span className="capitalize">
                        {gift.animation_type || gift.animationType || "none"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border dark:border-d-border">
                  <button
                    onClick={() => handleToggle(gift)}
                    disabled={toggleMutation.isPending && toggleMutation.variables?.id === gift.id}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[12px] font-medium text-text-secondary dark:text-d-text-secondary border border-border dark:border-d-border hover:bg-hover dark:hover:bg-d-hover transition-colors disabled:opacity-50"
                  >
                    {toggleMutation.isPending && toggleMutation.variables?.id === gift.id ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : active ? (
                      <XCircle size={12} />
                    ) : (
                      <CheckCircle size={12} />
                    )}
                    {active ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => openEdit(gift)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[12px] font-medium text-text-secondary dark:text-d-text-secondary border border-border dark:border-d-border hover:bg-hover dark:hover:bg-d-hover transition-colors"
                  >
                    <Pencil size={12} />
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleting(gift)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[12px] font-medium text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors ml-auto"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {formOpen && (
        <GiftFormModal
          open={formOpen}
          onClose={closeForm}
          initial={editing}
          onSubmit={handleSubmit}
          isSaving={isSaving}
        />
      )}

      <ConfirmDeleteModal
        open={!!deleting}
        name={deleting?.name}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
