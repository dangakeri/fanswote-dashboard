import { useState } from "react";
import {
  Megaphone,
  Crown,
  FileText,
  Loader2,
  Rocket,
  Pause,
  Play,
  Ban,
  Sparkles,
} from "lucide-react";
import {
  useCampaigns,
  useGrantCreator,
  useFeaturePost,
  useCampaignAction,
} from "../hooks/useFeatured";
import { useToast } from "../context/ToastContext";

const fmt = (n) => (Number(n) || 0).toLocaleString();

const campaignStatus = {
  active: { dot: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10", label: "Active" },
  paused: { dot: "bg-amber-500", text: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10", label: "Paused" },
  cancelled: { dot: "bg-gray-500", text: "text-gray-600 dark:text-gray-400", bg: "bg-gray-50 dark:bg-gray-500/10", label: "Cancelled" },
  completed: { dot: "bg-blue-500", text: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10", label: "Completed" },
};

function ActionCard({ icon: Icon, tone, title, desc, children }) {
  return (
    <div className="bg-surface dark:bg-d-surface rounded-2xl border border-border/70 dark:border-d-border/60 shadow-card dark:shadow-none p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${tone}`}>
          <Icon size={17} strokeWidth={1.75} />
        </div>
        <div>
          <h3 className="text-[13px] font-semibold text-text dark:text-d-text">{title}</h3>
          <p className="text-[11.5px] text-text-muted dark:text-d-text-muted">{desc}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function Input({ label, value, onChange, placeholder, type = "text" }) {
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

export default function Featured() {
  const toast = useToast();
  const campaigns = useCampaigns();
  const grant = useGrantCreator();
  const featurePost = useFeaturePost();
  const campaignAction = useCampaignAction();

  const [creatorId, setCreatorId] = useState("");
  const [budget, setBudget] = useState("");
  const [bidCpm, setBidCpm] = useState("");
  const [dailyCap, setDailyCap] = useState("");
  const [audience, setAudience] = useState("");
  const [targetCountry, setTargetCountry] = useState("");
  const [targetCategoryId, setTargetCategoryId] = useState("");
  const [cancelCreatorId, setCancelCreatorId] = useState("");
  const [postId, setPostId] = useState("");
  const [postBudget, setPostBudget] = useState("");

  const handleGrant = () => {
    if (!creatorId.trim() || !budget.trim()) return;
    const payload = { budget_tokens: Number(budget) };
    if (bidCpm.trim()) payload.bid_cpm = Number(bidCpm);
    if (dailyCap.trim()) payload.daily_cap_tokens = Number(dailyCap);
    if (audience.trim()) payload.audience = audience.trim();
    if (targetCountry.trim()) payload.target_country = targetCountry.trim().toUpperCase();
    if (targetCategoryId.trim()) payload.target_category_id = Number(targetCategoryId);

    grant.mutate(
      { creatorId: creatorId.trim(), payload },
      {
        onSuccess: () => {
          toast.success("Creator featured — campaign created");
          setCreatorId("");
          setBudget("");
          setBidCpm("");
          setDailyCap("");
          setAudience("");
          setTargetCountry("");
          setTargetCategoryId("");
        },
        onError: (err) => toast.error(err.message || "Failed to grant feature"),
      }
    );
  };

  const handleCancelCreator = () => {
    if (!cancelCreatorId.trim()) return;
    campaignAction.mutate(
      { id: cancelCreatorId.trim(), action: "cancel-creator" },
      {
        onSuccess: () => {
          toast.success("Active campaign cancelled — unspent budget refunded");
          setCancelCreatorId("");
        },
        onError: (err) => toast.error(err.message || "Failed to cancel campaign"),
      }
    );
  };

  const handleFeaturePost = () => {
    if (!postId.trim() || !postBudget.trim()) return;
    featurePost.mutate(
      { id: postId.trim(), budgetTokens: Number(postBudget) },
      {
        onSuccess: () => {
          toast.success("Post boosted — creator charged");
          setPostId("");
          setPostBudget("");
        },
        onError: (err) => toast.error(err.message || "Failed to boost post"),
      }
    );
  };

  const handleCampaignAction = (id, action) => {
    campaignAction.mutate(
      { id, action },
      {
        onSuccess: () => toast.success(`Campaign ${action === "cancel" ? "cancelled & refunded" : action + "d"}`),
        onError: (err) => toast.error(err.message || "Action failed"),
      }
    );
  };

  const list = campaigns.data || [];

  return (
    <div className="space-y-6">
      <div className="border-b border-border/60 dark:border-d-border/60 pb-5">
        <h1 className="text-[22px] font-extrabold text-text dark:text-d-text tracking-tight leading-tight">
          Featuring &amp; Boosting
        </h1>
        <p className="text-[12.5px] text-text-muted dark:text-d-text-muted mt-1">
          Grant featured campaigns to creators, boost posts, and moderate running ads
        </p>
      </div>

      {/* Action cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ActionCard
          icon={Rocket}
          tone="text-primary bg-primary/10"
          title="Feature a creator"
          desc="Grant a campaign (charges the creator)"
        >
          <div className="space-y-3">
            <Input label="Creator ID" value={creatorId} onChange={setCreatorId} placeholder="e.g. 42" />
            <Input label="Budget (tokens)" value={budget} onChange={setBudget} placeholder="e.g. 5000" type="number" />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Bid CPM" value={bidCpm} onChange={setBidCpm} placeholder="Optional" type="number" />
              <Input label="Daily cap" value={dailyCap} onChange={setDailyCap} placeholder="Optional" type="number" />
            </div>
            <Input label="Audience" value={audience} onChange={setAudience} placeholder="Optional (e.g. all)" />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Country" value={targetCountry} onChange={setTargetCountry} placeholder="e.g. KE" />
              <Input label="Category ID" value={targetCategoryId} onChange={setTargetCategoryId} placeholder="Optional" type="number" />
            </div>
            <button
              onClick={handleGrant}
              disabled={grant.isPending || !creatorId.trim() || !budget.trim()}
              className="w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-medium text-white bg-primary hover:bg-primary-hover shadow-sm shadow-primary/25 transition-colors disabled:opacity-50"
            >
              {grant.isPending ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
              Grant feature
            </button>
          </div>
        </ActionCard>

        <ActionCard
          icon={FileText}
          tone="text-amber-600 dark:text-amber-400 bg-amber-500/10"
          title="Boost a post"
          desc="Feature a single post (charges its creator)"
        >
          <div className="space-y-3">
            <Input label="Post ID" value={postId} onChange={setPostId} placeholder="e.g. 1287" />
            <Input label="Budget (tokens)" value={postBudget} onChange={setPostBudget} placeholder="e.g. 500" type="number" />
            <button
              onClick={handleFeaturePost}
              disabled={featurePost.isPending || !postId.trim() || !postBudget.trim()}
              className="w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-medium text-white bg-amber-600 hover:bg-amber-700 transition-colors disabled:opacity-50"
            >
              {featurePost.isPending ? <Loader2 size={14} className="animate-spin" /> : <Rocket size={14} />}
              Boost post
            </button>
            <p className="text-[11px] text-text-muted dark:text-d-text-muted">
              Tip: you can also boost from a post's row on the Content page.
            </p>
          </div>
        </ActionCard>

        <ActionCard
          icon={Ban}
          tone="text-red-600 dark:text-red-400 bg-red-500/10"
          title="Cancel a creator's campaign"
          desc="Ends the active campaign & refunds unspent"
        >
          <div className="space-y-3">
            <Input label="Creator ID" value={cancelCreatorId} onChange={setCancelCreatorId} placeholder="e.g. 42" />
            <button
              onClick={handleCancelCreator}
              disabled={campaignAction.isPending || !cancelCreatorId.trim()}
              className="w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-medium border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors disabled:opacity-50"
            >
              {campaignAction.isPending ? <Loader2 size={14} className="animate-spin" /> : <Ban size={14} />}
              Cancel & refund
            </button>
          </div>
        </ActionCard>
      </div>

      {/* Campaigns list (best-effort) */}
      <div className="bg-surface dark:bg-d-surface rounded-2xl border border-border/70 dark:border-d-border/60 shadow-card dark:shadow-none">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/60 dark:border-d-border/60">
          <div>
            <h2 className="text-[13px] font-semibold text-text dark:text-d-text">Campaigns</h2>
            <p className="text-[11.5px] text-text-muted dark:text-d-text-muted mt-0.5">
              Moderate running featured campaigns
            </p>
          </div>
        </div>

        {campaigns.isLoading ? (
          <div className="p-12 flex justify-center">
            <Loader2 size={24} className="animate-spin text-primary" />
          </div>
        ) : campaigns.isError ? (
          <div className="px-5 py-10 text-center">
            <Megaphone size={26} className="mx-auto text-text-muted/25 dark:text-d-text-muted/25 mb-3" />
            <p className="text-[13px] text-text dark:text-d-text font-medium">Campaign list unavailable</p>
            <p className="text-[11.5px] text-text-muted dark:text-d-text-muted mt-1 max-w-md mx-auto">
              This backend doesn't expose a campaign list endpoint. Use the moderation actions below by
              entering a campaign ID directly.
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <ManualCampaignAction onAction={handleCampaignAction} pending={campaignAction.isPending} />
            </div>
          </div>
        ) : list.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <Megaphone size={26} className="mx-auto text-text-muted/25 dark:text-d-text-muted/25 mb-3" />
            <p className="text-[13px] text-text-muted dark:text-d-text-muted">No campaigns running</p>
          </div>
        ) : (
          <ul className="divide-y divide-border/60 dark:divide-d-border/60">
            {list.map((c) => {
              const cfg = campaignStatus[c.status] || campaignStatus.active;
              const spent = Number(c.spent_tokens ?? c.spent ?? 0);
              const budgetT = Number(c.budget_tokens ?? c.budget ?? 0);
              return (
                <li key={c.id} className="flex items-center gap-4 px-5 py-4 flex-wrap">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Crown size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-text dark:text-d-text truncate">
                      {c.creator_name || c.creator_username || `Creator #${c.creator_id ?? c.id}`}
                    </p>
                    <p className="text-[11.5px] text-text-muted dark:text-d-text-muted tabular-nums">
                      {fmt(spent)} / {fmt(budgetT)} tokens spent
                    </p>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                    {cfg.label}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {c.status === "paused" ? (
                      <IconBtn label="Resume" icon={Play} onClick={() => handleCampaignAction(c.id, "resume")} />
                    ) : (
                      <IconBtn label="Pause" icon={Pause} onClick={() => handleCampaignAction(c.id, "pause")} />
                    )}
                    <IconBtn label="Cancel" icon={Ban} danger onClick={() => handleCampaignAction(c.id, "cancel")} />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

function IconBtn({ label, icon: Icon, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`p-2 rounded-lg transition-colors ${
        danger
          ? "text-text-muted dark:text-d-text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
          : "text-text-muted dark:text-d-text-muted hover:text-text dark:hover:text-d-text hover:bg-hover dark:hover:bg-d-hover"
      }`}
    >
      <Icon size={15} />
    </button>
  );
}

function ManualCampaignAction({ onAction, pending }) {
  const [id, setId] = useState("");
  return (
    <div className="flex items-center gap-2">
      <input
        value={id}
        onChange={(e) => setId(e.target.value)}
        placeholder="Campaign ID"
        className="w-32 px-3 py-1.5 rounded-lg text-sm bg-page dark:bg-d-elevated text-text dark:text-d-text placeholder-text-muted dark:placeholder-d-text-muted border border-border dark:border-d-border focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
      <button
        onClick={() => id.trim() && onAction(id.trim(), "pause")}
        disabled={pending || !id.trim()}
        className="px-2.5 py-1.5 rounded-lg text-xs font-medium border border-border dark:border-d-border text-text-secondary dark:text-d-text-secondary hover:bg-hover dark:hover:bg-d-hover disabled:opacity-50"
      >
        Pause
      </button>
      <button
        onClick={() => id.trim() && onAction(id.trim(), "resume")}
        disabled={pending || !id.trim()}
        className="px-2.5 py-1.5 rounded-lg text-xs font-medium border border-border dark:border-d-border text-text-secondary dark:text-d-text-secondary hover:bg-hover dark:hover:bg-d-hover disabled:opacity-50"
      >
        Resume
      </button>
      <button
        onClick={() => id.trim() && onAction(id.trim(), "cancel")}
        disabled={pending || !id.trim()}
        className="px-2.5 py-1.5 rounded-lg text-xs font-medium border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 disabled:opacity-50"
      >
        Cancel
      </button>
    </div>
  );
}
