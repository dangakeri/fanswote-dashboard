import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import quickieService from "../services/quickieService";

export function useQuickies(params = {}) {
  return useQuery({
    queryKey: ["quickies", params],
    queryFn: () => quickieService.getAll(params),
    select: (data) => ({
      quickies: data.quickies || [],
      total: data.total || 0,
      page: data.page || 1,
      limit: data.limit || 20,
      totalPages: data.totalPages || 1,
    }),
  });
}

export function useApproveQuickie() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => quickieService.approve(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["quickies"] }),
  });
}

export function useRejectQuickie() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => quickieService.reject(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["quickies"] }),
  });
}

export function useDeleteQuickie() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => quickieService.deleteQuickie(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["quickies"] }),
  });
}
