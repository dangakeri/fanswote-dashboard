import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import reportService from "../services/reportService";

export function useReports(params = {}) {
  return useQuery({
    queryKey: ["reports", params],
    queryFn: () => reportService.list(params),
    select: (data) => ({
      reports: data.reports || [],
      total: data.total || 0,
      page: data.page || 1,
      limit: data.limit || 20,
      totalPages: data.totalPages || 1,
    }),
  });
}

export function useReport(id) {
  return useQuery({
    queryKey: ["reports", id],
    queryFn: () => reportService.getById(id),
    enabled: !!id,
  });
}

export function useUpdateReportStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, adminNotes }) => reportService.updateStatus(id, status, adminNotes),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reports"] }),
  });
}
