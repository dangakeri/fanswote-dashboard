import { useState } from "react";
import FilterSelect from "../components/FilterSelect";
import {
  Users as UsersIcon,
  Crown,
  ShieldCheck,
  TrendingUp,
  Coins,
  Wallet,
  Megaphone,
  Loader2,
  BarChart3,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  useOverview,
  useRevenue,
  useWithdrawalStats,
  useTopCreators,
  useSignups,
} from "../hooks/useAnalytics";
import Avatar from "../components/Avatar";

const PRIMARY = "#ffa31a";

// Ksh 1 = 10 tokens — prefer the API's *_kes field, fall back to conversion.
const kes = (tokens, provided) =>
  provided != null ? provided : (Number(tokens) || 0) / 10;

const fmt = (n) => (Number(n) || 0).toLocaleString();
const fmtKes = (n) =>
  `Ksh ${(Number(n) || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

const prettySource = (s) =>
  String(s || "other")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

function Kpi({ label, value, sub, icon: Icon, tone = "text-primary bg-primary/10", loading }) {
  return (
    <div className="bg-surface dark:bg-d-surface rounded-2xl border border-border/70 dark:border-d-border/60 shadow-card dark:shadow-none p-5">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-text-muted dark:text-d-text-muted">
          {label}
        </p>
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${tone}`}>
          <Icon size={15} strokeWidth={1.75} />
        </div>
      </div>
      <p className="text-[26px] font-semibold text-text dark:text-d-text tracking-tight tabular-nums mt-2 leading-none">
        {loading ? (
          <span className="inline-block w-16 h-6 rounded bg-page dark:bg-d-elevated animate-pulse align-middle" />
        ) : (
          value
        )}
      </p>
      {sub && <p className="text-[12px] text-text-muted dark:text-d-text-muted mt-2">{sub}</p>}
    </div>
  );
}

function Panel({ title, subtitle, children, right }) {
  return (
    <div className="bg-surface dark:bg-d-surface rounded-2xl border border-border/70 dark:border-d-border/60 shadow-card dark:shadow-none">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border/60 dark:border-d-border/60">
        <div>
          <h2 className="text-[13px] font-semibold text-text dark:text-d-text">{title}</h2>
          {subtitle && (
            <p className="text-[11.5px] text-text-muted dark:text-d-text-muted mt-0.5">{subtitle}</p>
          )}
        </div>
        {right}
      </div>
      {children}
    </div>
  );
}

function ChartTooltip({ active, payload, label, valueLabel }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border dark:border-d-border bg-surface dark:bg-d-surface px-3 py-2 shadow-lg">
      <p className="text-[11px] text-text-muted dark:text-d-text-muted mb-0.5">{label}</p>
      <p className="text-[13px] font-semibold text-text dark:text-d-text tabular-nums">
        {fmt(payload[0].value)} {valueLabel}
      </p>
    </div>
  );
}

export default function Analytics() {
  const [range, setRange] = useState(30);

  const overview = useOverview();
  const revenue = useRevenue(range);
  const withdrawals = useWithdrawalStats();
  const topCreators = useTopCreators(10);
  const signups = useSignups(range);

  const o = overview.data || {};
  const users = o.users || {};
  const rev = o.revenue || {};
  const camps = o.campaigns || {};
  const wd = o.withdrawals || {};

  const signupSeries = (signups.data || []).map((s) => ({
    date: (s.date || s.day || "").slice(5), // MM-DD
    count: Number(s.count ?? s.signups ?? s.total ?? 0),
  }));

  const revenueSeries = (revenue.data || []).map((r) => ({
    source: prettySource(r.source),
    tokens: Number(r.tokens ?? r.total_tokens ?? r.amount_tokens ?? 0),
    kes: kes(r.tokens ?? r.total_tokens ?? r.amount_tokens, r.kes ?? r.total_kes),
  }));

  const withdrawalRows = (withdrawals.data || []).map((w) => ({
    status: w.status || "unknown",
    count: Number(w.count ?? 0),
    grossTokens: Number(w.gross_tokens ?? w.gross ?? 0),
    netTokens: Number(w.net_tokens ?? w.net ?? 0),
    feeTokens: Number(w.fee_tokens ?? w.fees ?? 0),
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between gap-4 flex-wrap border-b border-border/60 dark:border-d-border/60 pb-5">
        <div>
          <h1 className="text-[22px] font-extrabold text-text dark:text-d-text tracking-tight leading-tight">
            Platform Analytics
          </h1>
          <p className="text-[12.5px] text-text-muted dark:text-d-text-muted mt-1">
            Platform-wide KPIs, revenue and growth · token figures convert at Ksh 1 = 10 tokens
          </p>
        </div>
        <FilterSelect
          value={range}
          onChange={setRange}
          align="right"
          options={[
            { value: 7, label: "Last 7 days" },
            { value: 30, label: "Last 30 days" },
            { value: 90, label: "Last 90 days" },
          ]}
        />
      </div>

      {overview.isError ? (
        <div className="bg-surface dark:bg-d-surface rounded-2xl border border-border/70 dark:border-d-border p-12 text-center">
          <BarChart3 size={28} className="mx-auto text-text-muted/30 dark:text-d-text-muted/30 mb-3" />
          <p className="text-sm text-text dark:text-d-text font-medium">Couldn't load analytics</p>
          <p className="text-[12.5px] text-text-muted dark:text-d-text-muted mt-1">
            {overview.error?.message || "The analytics service is unavailable."}
          </p>
        </div>
      ) : (
        <>
          {/* KPI grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Kpi
              label="Total Users"
              value={fmt(users.total)}
              sub={`${fmt(users.new_7d)} new in 7d`}
              icon={UsersIcon}
              tone="text-blue-600 dark:text-blue-400 bg-blue-500/10"
              loading={overview.isLoading}
            />
            <Kpi
              label="Creators"
              value={fmt(users.creators)}
              sub={`${fmt(users.fans)} fans`}
              icon={Crown}
              tone="text-primary bg-primary/10"
              loading={overview.isLoading}
            />
            <Kpi
              label="KYC Verified"
              value={fmt(users.kyc_verified)}
              sub={users.total ? `${Math.round((users.kyc_verified / users.total) * 100)}% of users` : "—"}
              icon={ShieldCheck}
              tone="text-cyan-600 dark:text-cyan-400 bg-cyan-500/10"
              loading={overview.isLoading}
            />
            <Kpi
              label="Active Campaigns"
              value={fmt(camps.active)}
              sub="Featured / boosted"
              icon={Megaphone}
              tone="text-violet-600 dark:text-violet-400 bg-violet-500/10"
              loading={overview.isLoading}
            />
            <Kpi
              label="Platform Revenue"
              value={fmtKes(rev.platform_revenue_kes)}
              sub={`${fmt(rev.platform_revenue_tokens)} tokens`}
              icon={Coins}
              tone="text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
              loading={overview.isLoading}
            />
            <Kpi
              label="Gross Volume"
              value={fmtKes(rev.gross_volume_kes)}
              sub={`${fmt(rev.gross_token_volume)} tokens`}
              icon={TrendingUp}
              tone="text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
              loading={overview.isLoading}
            />
            <Kpi
              label="Pending Withdrawals"
              value={fmt(wd.pending)}
              sub="Awaiting disbursement"
              icon={Wallet}
              tone="text-amber-600 dark:text-amber-400 bg-amber-500/10"
              loading={overview.isLoading}
            />
            <Kpi
              label="Paid Out (net)"
              value={fmtKes(wd.paid_out_net_kes)}
              sub={`${fmt(wd.paid_out_net_tokens)} tokens`}
              icon={Wallet}
              tone="text-text-secondary dark:text-d-text-secondary bg-page dark:bg-d-elevated"
              loading={overview.isLoading}
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Panel title="New signups" subtitle={`Daily new users over the last ${range} days`}>
              <div className="p-4 h-[280px]">
                {signups.isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <Loader2 size={22} className="animate-spin text-primary" />
                  </div>
                ) : signupSeries.length === 0 ? (
                  <EmptyChart label="No signup data" />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={signupSeries} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
                      <defs>
                        <linearGradient id="signupFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={PRIMARY} stopOpacity={0.35} />
                          <stop offset="100%" stopColor={PRIMARY} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-border/50 dark:text-d-border/50" vertical={false} />
                      <XAxis dataKey="date" tick={{ fontSize: 11, fill: "currentColor" }} className="text-text-muted dark:text-d-text-muted" tickLine={false} axisLine={false} minTickGap={20} />
                      <YAxis tick={{ fontSize: 11, fill: "currentColor" }} className="text-text-muted dark:text-d-text-muted" tickLine={false} axisLine={false} allowDecimals={false} width={40} />
                      <Tooltip content={<ChartTooltip valueLabel="signups" />} />
                      <Area type="monotone" dataKey="count" stroke={PRIMARY} strokeWidth={2} fill="url(#signupFill)" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </Panel>

            <Panel title="Revenue by source" subtitle={`Platform earnings over the last ${range} days (tokens)`}>
              <div className="p-4 h-[280px]">
                {revenue.isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <Loader2 size={22} className="animate-spin text-primary" />
                  </div>
                ) : revenueSeries.length === 0 ? (
                  <EmptyChart label="No revenue data" />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueSeries} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-border/50 dark:text-d-border/50" vertical={false} />
                      <XAxis dataKey="source" tick={{ fontSize: 10, fill: "currentColor" }} className="text-text-muted dark:text-d-text-muted" tickLine={false} axisLine={false} interval={0} angle={-12} textAnchor="end" height={48} />
                      <YAxis tick={{ fontSize: 11, fill: "currentColor" }} className="text-text-muted dark:text-d-text-muted" tickLine={false} axisLine={false} width={40} />
                      <Tooltip content={<ChartTooltip valueLabel="tokens" />} cursor={{ fill: "rgba(255,163,26,0.08)" }} />
                      <Bar dataKey="tokens" fill={PRIMARY} radius={[4, 4, 0, 0]} maxBarSize={48} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </Panel>
          </div>

          {/* Top creators + Withdrawals breakdown */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Panel title="Top creators" subtitle="By earnings (tokens received)">
              {topCreators.isLoading ? (
                <div className="p-10 flex justify-center">
                  <Loader2 size={22} className="animate-spin text-primary" />
                </div>
              ) : (topCreators.data || []).length === 0 ? (
                <div className="p-10 text-center text-[13px] text-text-muted dark:text-d-text-muted">
                  No creator earnings yet
                </div>
              ) : (
                <ul className="divide-y divide-border/60 dark:divide-d-border/60">
                  {(topCreators.data || []).map((c, i) => {
                    const earnings = Number(c.earnings_tokens ?? c.earnings ?? c.tokens_received ?? 0);
                    return (
                      <li key={c.id ?? c.creator_id ?? i} className="flex items-center gap-3 px-5 py-3">
                        <span className="w-5 text-[12px] font-semibold tabular-nums text-text-muted dark:text-d-text-muted text-center shrink-0">
                          {i + 1}
                        </span>
                        <Avatar src={c.avatar_url} name={c.name || c.username || `Creator ${c.id ?? ""}`} username={c.username} size={32} />
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-medium text-text dark:text-d-text truncate">
                            {c.name || c.username || `Creator ${c.id ?? ""}`}
                          </p>
                          <p className="text-[11.5px] text-text-muted dark:text-d-text-muted truncate">
                            {fmt(c.followers ?? c.follower_count ?? 0)} followers
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-[13px] font-semibold text-text dark:text-d-text tabular-nums">
                            {fmt(earnings)}
                          </p>
                          <p className="text-[10.5px] text-text-muted dark:text-d-text-muted tabular-nums">
                            {fmtKes(kes(earnings, c.earnings_kes))}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Panel>

            <Panel title="Withdrawals" subtitle="Volume and fees by status (tokens)">
              {withdrawals.isLoading ? (
                <div className="p-10 flex justify-center">
                  <Loader2 size={22} className="animate-spin text-primary" />
                </div>
              ) : withdrawalRows.length === 0 ? (
                <div className="p-10 text-center text-[13px] text-text-muted dark:text-d-text-muted">
                  No withdrawal activity
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-[12.5px]">
                    <thead>
                      <tr className="text-left text-text-muted dark:text-d-text-muted border-b border-border/60 dark:border-d-border/60">
                        <th className="px-5 py-2.5 font-medium">Status</th>
                        <th className="px-3 py-2.5 font-medium text-right">Count</th>
                        <th className="px-3 py-2.5 font-medium text-right">Gross</th>
                        <th className="px-3 py-2.5 font-medium text-right">Fees</th>
                        <th className="px-5 py-2.5 font-medium text-right">Net</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60 dark:divide-d-border/60">
                      {withdrawalRows.map((w) => (
                        <tr key={w.status} className="text-text dark:text-d-text">
                          <td className="px-5 py-2.5 capitalize">{w.status}</td>
                          <td className="px-3 py-2.5 text-right tabular-nums">{fmt(w.count)}</td>
                          <td className="px-3 py-2.5 text-right tabular-nums">{fmt(w.grossTokens)}</td>
                          <td className="px-3 py-2.5 text-right tabular-nums text-text-muted dark:text-d-text-muted">
                            {fmt(w.feeTokens)}
                          </td>
                          <td className="px-5 py-2.5 text-right tabular-nums font-medium">{fmt(w.netTokens)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Panel>
          </div>
        </>
      )}
    </div>
  );
}

function EmptyChart({ label }) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-text-muted dark:text-d-text-muted">
      <BarChart3 size={24} className="opacity-30 mb-2" />
      <p className="text-[12.5px]">{label}</p>
    </div>
  );
}
