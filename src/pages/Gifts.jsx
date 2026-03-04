import { useState } from "react";
import {
  Search, Gift, Plus, X, Loader2, Image, Type, DollarSign, Zap,
  CheckCircle, XCircle,
} from "lucide-react";
import { useGifts, useCreateGift } from "../hooks/useGifts";
import { useToast } from "../context/ToastContext";

const animationTypes = ["bounce", "shake", "pulse", "spin", "float", "none"];

function CreateGiftModal({ open, onClose }) {
  const [form, setForm] = useState({ name: "", icon_url: "", animation_type: "bounce", price: "" });
  const [error, setError] = useState("");
  const toast = useToast();
  const createMutation = useCreateGift();

  if (!open) return null;

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleSubmit = () => {
    if (!form.name.trim()) return setError("Name is required");
    if (!form.icon_url.trim()) return setError("Icon URL is required");
    if (!form.price || Number(form.price) <= 0) return setError("Price must be greater than 0");

    createMutation.mutate(
      {
        name: form.name.trim(),
        icon_url: form.icon_url.trim(),
        animation_type: form.animation_type,
        price: form.price,
      },
      {
        onSuccess: () => {
          setForm({ name: "", icon_url: "", animation_type: "bounce", price: "" });
          onClose();
          toast.success("Gift created successfully");
        },
        onError: (err) => {
          setError(err.message || "Failed to create gift");
          toast.error(err.message || "Failed to create gift");
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-surface dark:bg-d-surface rounded-xl border border-border dark:border-d-border shadow-xl w-full max-w-md p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Gift size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-text dark:text-d-text">Create Gift</h3>
              <p className="text-xs text-text-muted dark:text-d-text-muted">Add a new virtual gift</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-text-muted dark:text-d-text-muted hover:bg-hover dark:hover:bg-d-hover transition-colors">
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-500/5 border border-red-100 dark:border-red-500/15 text-[13px] text-red-600 dark:text-red-400">
            <XCircle size={14} className="shrink-0" />
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-text-muted dark:text-d-text-muted font-medium mb-1.5">Name</label>
            <div className="relative">
              <Type size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted dark:text-d-text-muted" />
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="e.g. Super Heart"
                className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm bg-page dark:bg-d-elevated text-text dark:text-d-text placeholder-text-muted dark:placeholder-d-text-muted border border-border dark:border-d-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
              />
            </div>
          </div>

          {/* Icon URL */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-text-muted dark:text-d-text-muted font-medium mb-1.5">Icon URL</label>
            <div className="relative">
              <Image size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted dark:text-d-text-muted" />
              <input
                type="url"
                value={form.icon_url}
                onChange={(e) => handleChange("icon_url", e.target.value)}
                placeholder="https://example.com/icon.png"
                className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm bg-page dark:bg-d-elevated text-text dark:text-d-text placeholder-text-muted dark:placeholder-d-text-muted border border-border dark:border-d-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
              />
            </div>
          </div>

          {/* Animation Type */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-text-muted dark:text-d-text-muted font-medium mb-1.5">Animation</label>
            <div className="flex flex-wrap gap-1.5">
              {animationTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => handleChange("animation_type", type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                    form.animation_type === type
                      ? "bg-primary text-white"
                      : "bg-page dark:bg-d-elevated text-text-muted dark:text-d-text-muted border border-border dark:border-d-border hover:text-text dark:hover:text-d-text"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-text-muted dark:text-d-text-muted font-medium mb-1.5">Price (coins)</label>
            <div className="relative">
              <DollarSign size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted dark:text-d-text-muted" />
              <input
                type="number"
                min="1"
                value={form.price}
                onChange={(e) => handleChange("price", e.target.value)}
                placeholder="e.g. 9"
                className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm bg-page dark:bg-d-elevated text-text dark:text-d-text placeholder-text-muted dark:placeholder-d-text-muted border border-border dark:border-d-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 justify-end pt-1">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-border dark:border-d-border text-text-secondary dark:text-d-text-secondary text-[13px] font-medium hover:bg-hover dark:hover:bg-d-hover transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={createMutation.isPending}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-[13px] font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
            Create Gift
          </button>
        </div>
      </div>
    </div>
  );
}

function GiftCard({ gift }) {
  return (
    <div className="bg-surface dark:bg-d-surface rounded-xl border border-border dark:border-d-border p-5 hover:border-primary/30 transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className="w-14 h-14 rounded-xl bg-page dark:bg-d-elevated border border-border dark:border-d-border flex items-center justify-center overflow-hidden">
          {gift.icon_url ? (
            <img src={gift.icon_url} alt={gift.name} className="w-10 h-10 object-contain" />
          ) : (
            <Gift size={24} className="text-text-muted/30 dark:text-d-text-muted/30" />
          )}
        </div>
        <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-0.5 rounded-full ${
          gift.is_active
            ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            : "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${gift.is_active ? "bg-emerald-500" : "bg-red-500"}`} />
          {gift.is_active ? "Active" : "Inactive"}
        </span>
      </div>

      <h3 className="font-semibold text-text dark:text-d-text text-[15px] mb-1">{gift.name}</h3>

      <div className="flex items-center gap-3 text-[12px] text-text-muted dark:text-d-text-muted">
        <span className="flex items-center gap-1">
          <DollarSign size={12} />
          {gift.price} coins
        </span>
        <span className="flex items-center gap-1 capitalize">
          <Zap size={12} />
          {gift.animation_type}
        </span>
      </div>

      <p className="text-[11px] text-text-muted dark:text-d-text-muted mt-3">
        Created {new Date(gift.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
      </p>
    </div>
  );
}

export default function GiftsPage() {
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const { data: giftsData, isLoading } = useGifts();

  const gifts = giftsData || [];

  const filtered = gifts.filter((gift) =>
    gift.name.toLowerCase().includes(search.toLowerCase()),
  );

  const activeCount = gifts.filter((g) => g.is_active).length;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Gifts", count: gifts.length, icon: Gift },
          { label: "Active", count: activeCount, icon: CheckCircle },
          { label: "Inactive", count: gifts.length - activeCount, icon: XCircle },
        ].map((card) => {
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
            placeholder="Search gifts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg text-sm bg-surface dark:bg-d-surface text-text dark:text-d-text placeholder-text-muted dark:placeholder-d-text-muted border border-border dark:border-d-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
          />
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-[13px] font-medium hover:bg-primary-hover transition-colors"
        >
          <Plus size={15} />
          New Gift
        </button>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="bg-surface dark:bg-d-surface rounded-xl border border-border dark:border-d-border p-16 text-center">
          <Loader2 size={28} className="mx-auto text-primary animate-spin mb-3" />
          <p className="text-sm text-text-muted dark:text-d-text-muted">Loading gifts...</p>
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((gift) => (
            <GiftCard key={gift.id} gift={gift} />
          ))}
        </div>
      ) : (
        <div className="bg-surface dark:bg-d-surface rounded-xl border border-border dark:border-d-border p-16 text-center">
          <Gift size={28} className="mx-auto text-text-muted/20 dark:text-d-text-muted/20 mb-3" />
          <p className="text-sm text-text-muted dark:text-d-text-muted">
            {gifts.length === 0 ? "No gifts yet. Create your first gift!" : "No gifts match your search"}
          </p>
        </div>
      )}

      {/* Create Modal */}
      <CreateGiftModal open={showCreate} onClose={() => setShowCreate(false)} />
    </div>
  );
}
