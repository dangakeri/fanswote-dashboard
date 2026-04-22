import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import giftService from "../services/giftService";

export function useGifts(params = {}) {
  return useQuery({
    queryKey: ["gifts", params],
    queryFn: () => giftService.list(params),
    select: (data) => data?.gifts || data || [],
  });
}

export function useCreateGift() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => giftService.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["gifts"] }),
  });
}

export function useUpdateGift() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => giftService.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["gifts"] }),
  });
}

export function useToggleGift() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }) => giftService.toggleActive(id, isActive),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["gifts"] }),
  });
}

export function useDeleteGift() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => giftService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["gifts"] }),
  });
}
