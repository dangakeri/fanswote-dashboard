import { useQuery } from "@tanstack/react-query";
import analyticsService from "../services/analyticsService";

export function useOverview() {
  return useQuery({
    queryKey: ["analytics", "overview"],
    queryFn: () => analyticsService.overview(),
  });
}

// GET /admin/analytics/revenue -> { since_days, total_tokens, total_kes, sources: [...] }
export function useRevenue(sinceDays = 30) {
  return useQuery({
    queryKey: ["analytics", "revenue", sinceDays],
    queryFn: () => analyticsService.revenue(sinceDays),
    select: (data) => (Array.isArray(data) ? data : data?.sources || []),
  });
}

// GET /admin/analytics/withdrawals -> { by_status: [...] }
export function useWithdrawalStats() {
  return useQuery({
    queryKey: ["analytics", "withdrawals"],
    queryFn: () => analyticsService.withdrawals(),
    select: (data) => (Array.isArray(data) ? data : data?.by_status || []),
  });
}

// GET /admin/analytics/top-creators -> { creators: [...] }
export function useTopCreators(limit = 10) {
  return useQuery({
    queryKey: ["analytics", "top-creators", limit],
    queryFn: () => analyticsService.topCreators(limit),
    select: (data) => (Array.isArray(data) ? data : data?.creators || []),
  });
}

// GET /admin/analytics/signups -> { days, points: [{ date, count }] }
export function useSignups(days = 30) {
  return useQuery({
    queryKey: ["analytics", "signups", days],
    queryFn: () => analyticsService.signups(days),
    select: (data) => (Array.isArray(data) ? data : data?.points || []),
  });
}
