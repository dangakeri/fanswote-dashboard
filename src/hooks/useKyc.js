import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import kycService from "../services/kycService";

export function useKycSubmissions(params = {}) {
  return useQuery({
    queryKey: ["kyc", params],
    queryFn: () => kycService.getSubmissions(params),
    select: (data) => data.submissions || [],
  });
}

export function useKycSubmission(id) {
  return useQuery({
    queryKey: ["kyc", id],
    queryFn: () => kycService.getSubmissionById(id),
    enabled: !!id,
  });
}

export function useApproveKyc() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => kycService.approveSubmission(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kyc"] });
    },
  });
}

export function useRejectKyc() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }) => kycService.rejectSubmission(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kyc"] });
    },
  });
}
