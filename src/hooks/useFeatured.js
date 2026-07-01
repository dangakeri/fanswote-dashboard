import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import featuredService from "../services/featuredService";

// Best-effort — the admin API doc does not guarantee a campaigns list endpoint.
export function useCampaigns(params = {}) {
  return useQuery({
    queryKey: ["campaigns", params],
    queryFn: () => featuredService.listCampaigns(params),
    select: (data) => (Array.isArray(data) ? data : data?.campaigns || []),
    retry: false,
  });
}

export function useGrantCreator() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ creatorId, payload }) => featuredService.grantCreator(creatorId, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["campaigns"] }),
  });
}

export function useFeaturePost() {
  return useMutation({
    mutationFn: ({ id, budgetTokens }) => featuredService.featurePost(id, budgetTokens),
  });
}

// Moderate a campaign or a creator's active campaign.
export function useCampaignAction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, action }) => {
      if (action === "pause") return featuredService.pauseCampaign(id);
      if (action === "resume") return featuredService.resumeCampaign(id);
      if (action === "cancel") return featuredService.cancelCampaign(id);
      if (action === "cancel-creator") return featuredService.cancelCreator(id);
      throw new Error(`Unknown campaign action: ${action}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["campaigns"] }),
  });
}
