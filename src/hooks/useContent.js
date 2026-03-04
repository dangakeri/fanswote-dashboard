import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import contentService from "../services/contentService";

export function useContent(params = {}) {
  return useQuery({
    queryKey: ["content", params],
    queryFn: () => contentService.getContent(params),
  });
}

export function useContentById(id) {
  return useQuery({
    queryKey: ["content", id],
    queryFn: () => contentService.getContentById(id),
    enabled: !!id,
  });
}

export function useApproveContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => contentService.approveContent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content"] });
    },
  });
}

export function useRemoveContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => contentService.removeContent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content"] });
    },
  });
}
