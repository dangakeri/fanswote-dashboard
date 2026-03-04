import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import contentService from "../services/contentService";

export function usePosts(params = {}) {
  return useQuery({
    queryKey: ["posts", params],
    queryFn: () => contentService.getPosts(params),
    select: (data) => ({
      posts: data.posts || [],
      total: data.total || 0,
      page: data.page || 1,
      limit: data.limit || 20,
      totalPages: data.totalPages || 1,
    }),
  });
}

export function useApprovePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => contentService.approvePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useRejectPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }) => contentService.rejectPost(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}
