import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import payoutService from "../services/payoutService";

// --- Banks ---
export function useBanks() {
  return useQuery({
    queryKey: ["payout-banks"],
    queryFn: () => payoutService.listBanks(),
    select: (data) => (Array.isArray(data) ? data : data?.banks || []),
  });
}

export function useCreateBank() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => payoutService.createBank(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["payout-banks"] }),
  });
}

export function useUpdateBank() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ code, payload }) => payoutService.updateBank(code, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["payout-banks"] }),
  });
}

export function useDeleteBank() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (code) => payoutService.deleteBank(code),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["payout-banks"] }),
  });
}

// --- Withdrawals ---
export function useWithdrawals(params = {}) {
  return useQuery({
    queryKey: ["withdrawals", params],
    queryFn: () => payoutService.listWithdrawals(params),
    select: (data) => ({
      withdrawals: Array.isArray(data) ? data : data?.withdrawals || [],
      total: data?.total ?? (Array.isArray(data) ? data.length : 0),
    }),
  });
}

export function useWithdrawalAction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, action, payload }) => {
      if (action === "process") return payoutService.processWithdrawal(id);
      if (action === "complete") return payoutService.completeWithdrawal(id, payload);
      if (action === "reject") return payoutService.rejectWithdrawal(id, payload);
      throw new Error(`Unknown withdrawal action: ${action}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["withdrawals"] });
      qc.invalidateQueries({ queryKey: ["analytics"] });
    },
  });
}
