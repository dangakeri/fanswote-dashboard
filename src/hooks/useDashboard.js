import { useQuery } from "@tanstack/react-query";
import dashboardService from "../services/dashboardService";

export function useStats() {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: () => dashboardService.getStats(),
  });
}

export function useRevenueData() {
  return useQuery({
    queryKey: ["dashboard", "revenue"],
    queryFn: () => dashboardService.getRevenueData(),
  });
}

export function useUserGrowth() {
  return useQuery({
    queryKey: ["dashboard", "user-growth"],
    queryFn: () => dashboardService.getUserGrowth(),
  });
}

export function useTopCreators() {
  return useQuery({
    queryKey: ["dashboard", "top-creators"],
    queryFn: () => dashboardService.getTopCreators(),
  });
}

export function useRecentActivity() {
  return useQuery({
    queryKey: ["dashboard", "recent-activity"],
    queryFn: () => dashboardService.getRecentActivity(),
  });
}
