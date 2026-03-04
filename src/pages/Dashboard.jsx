import {
  TrendingUp,
  TrendingDown,
  Users,
  Crown,
  DollarSign,
  CreditCard,
  UserPlus,
  ShieldCheck,
  Flag,
  Banknote,
  Star,
  ArrowUpRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { useTheme } from "../context/ThemeContext";
import {
  useStats,
  useRevenueData,
  useUserGrowth,
  useTopCreators,
  useRecentActivity,
} from "../hooks/useDashboard";
import {
  statsData as mockStats,
  revenueData as mockRevenue,
  userGrowthData as mockUserGrowth,
  topCreators as mockCreators,
  recentActivity as mockActivity,
} from "../data/mockData";

const statIcons = [Users, Crown, DollarSign, CreditCard];

const activityIcons = {
  signup: UserPlus,
  subscription: CreditCard,
  report: Flag,
  payment: Banknote,
  creator: Star,
  kyc: ShieldCheck,
};

const activityColors = {
  signup: "text-blue-500",
  subscription: "text-purple-500",
  report: "text-red-500",
  payment: "text-emerald-500",
  creator: "text-amber-500",
  kyc: "text-cyan-500",
};

function StatsCard({ stat, index }) {
  const Icon = statIcons[index];
  return (
    <div className="bg-surface dark:bg-d-surface rounded-xl px-5 py-4 border border-border dark:border-d-border">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-page dark:bg-d-elevated flex items-center justify-center shrink-0">
          <Icon size={18} className="text-text-muted dark:text-d-text-muted" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-text-muted dark:text-d-text-muted">{stat.label}</p>
          <div className="flex items-baseline gap-2 mt-0.5">
            <p className="text-xl font-bold text-text dark:text-d-text leading-none">{stat.value}</p>
            <span
              className={`text-[11px] font-semibold ${
                stat.up ? "text-emerald-500" : "text-red-500"
              }`}
            >
              {stat.up ? <TrendingUp size={11} className="inline mr-0.5" /> : <TrendingDown size={11} className="inline mr-0.5" />}
              {stat.change}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { data: statsData = mockStats } = useStats();
  const { data: revenueData = mockRevenue } = useRevenueData();
  const { data: userGrowthData = mockUserGrowth } = useUserGrowth();
  const { data: topCreators = mockCreators } = useTopCreators();
  const { data: recentActivity = mockActivity } = useRecentActivity();

  const gridStroke = isDark ? "#313244" : "#f0f0f0";
  const tickFill = isDark ? "#6c7086" : "#9ca3af";
  const tooltipBg = isDark ? "#1e1e2e" : "#ffffff";
  const tooltipBorder = isDark ? "#313244" : "#e5e7eb";
  const tooltipColor = isDark ? "#cdd6f4" : "#111827";

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, i) => (
          <StatsCard key={stat.label} stat={stat} index={i} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-surface dark:bg-d-surface rounded-xl border border-border dark:border-d-border overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border dark:border-d-border">
            <h3 className="text-sm font-semibold text-text dark:text-d-text">Revenue Overview</h3>
            <span className="text-[11px] text-text-muted dark:text-d-text-muted">Last 8 months</span>
          </div>
          <div className="p-5 pt-4">
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffa31a" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#ffa31a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={gridStroke} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" fontSize={11} tickLine={false} axisLine={false} tick={{ fill: tickFill }} />
                <YAxis fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000}k`} tick={{ fill: tickFill }} width={45} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    border: `1px solid ${tooltipBorder}`,
                    borderRadius: "8px",
                    fontSize: "12px",
                    color: tooltipColor,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                  }}
                  formatter={(v) => [`$${v.toLocaleString()}`, "Revenue"]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#ffa31a"
                  fill="url(#revGrad)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: "#ffa31a", stroke: isDark ? "#1e1e2e" : "#fff", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Growth Chart */}
        <div className="bg-surface dark:bg-d-surface rounded-xl border border-border dark:border-d-border overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border dark:border-d-border">
            <h3 className="text-sm font-semibold text-text dark:text-d-text">User Growth</h3>
            <span className="text-[11px] text-text-muted dark:text-d-text-muted">Last 8 months</span>
          </div>
          <div className="p-5 pt-4">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={userGrowthData} barGap={4}>
                <CartesianGrid stroke={gridStroke} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" fontSize={11} tickLine={false} axisLine={false} tick={{ fill: tickFill }} />
                <YAxis fontSize={11} tickLine={false} axisLine={false} tick={{ fill: tickFill }} width={40} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: tooltipBg,
                    border: `1px solid ${tooltipBorder}`,
                    borderRadius: "8px",
                    fontSize: "12px",
                    color: tooltipColor,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                  }}
                />
                <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                <Bar dataKey="users" fill="#ffa31a" radius={[4, 4, 0, 0]} maxBarSize={22} />
                <Bar dataKey="creators" fill={isDark ? "#45475a" : "#e5e7eb"} radius={[4, 4, 0, 0]} maxBarSize={22} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Top Creators */}
        <div className="xl:col-span-2 bg-surface dark:bg-d-surface rounded-xl border border-border dark:border-d-border overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border dark:border-d-border">
            <h3 className="text-sm font-semibold text-text dark:text-d-text">Top Creators</h3>
            <button className="flex items-center gap-1 text-xs text-primary font-medium hover:text-primary-hover transition-colors">
              View all <ArrowUpRight size={12} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[11px] text-text-muted dark:text-d-text-muted uppercase tracking-wider">
                  <th className="text-left font-medium px-5 py-3">Creator</th>
                  <th className="text-left font-medium px-5 py-3 hidden sm:table-cell">Subscribers</th>
                  <th className="text-left font-medium px-5 py-3">Earnings</th>
                  <th className="text-left font-medium px-5 py-3 hidden md:table-cell">Posts</th>
                  <th className="text-left font-medium px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {topCreators.map((c) => (
                  <tr key={c.id} className="border-t border-border dark:border-d-border hover:bg-hover dark:hover:bg-d-hover transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary text-[11px] font-bold flex items-center justify-center shrink-0">
                          {c.avatar}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-text dark:text-d-text text-[13px]">{c.name}</p>
                          <p className="text-[11px] text-text-muted dark:text-d-text-muted">{c.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-text-secondary dark:text-d-text-secondary tabular-nums text-[13px] hidden sm:table-cell">
                      {c.subscribers.toLocaleString()}
                    </td>
                    <td className="px-5 py-3 text-text dark:text-d-text font-semibold tabular-nums text-[13px]">
                      {c.earnings}
                    </td>
                    <td className="px-5 py-3 text-text-secondary dark:text-d-text-secondary tabular-nums text-[13px] hidden md:table-cell">
                      {c.posts}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 text-[11px] font-medium capitalize px-2 py-0.5 rounded-full ${
                          c.status === "verified"
                            ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10"
                            : "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${c.status === "verified" ? "bg-emerald-500" : "bg-amber-500"}`} />
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-surface dark:bg-d-surface rounded-xl border border-border dark:border-d-border overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border dark:border-d-border">
            <h3 className="text-sm font-semibold text-text dark:text-d-text">Recent Activity</h3>
            <button className="flex items-center gap-1 text-xs text-primary font-medium hover:text-primary-hover transition-colors">
              View all <ArrowUpRight size={12} />
            </button>
          </div>
          <div className="divide-y divide-border dark:divide-d-border">
            {recentActivity.map((a) => {
              const Icon = activityIcons[a.type] || UserPlus;
              const color = activityColors[a.type] || "text-primary";
              return (
                <div key={a.id} className="flex items-start gap-3 px-5 py-3.5">
                  <div className="w-8 h-8 rounded-full bg-page dark:bg-d-elevated flex items-center justify-center shrink-0 mt-0.5">
                    <Icon size={14} className={color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-text-secondary dark:text-d-text-secondary leading-snug">{a.message}</p>
                    <p className="text-[11px] text-text-muted dark:text-d-text-muted mt-0.5">
                      {a.user} &middot; {a.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
