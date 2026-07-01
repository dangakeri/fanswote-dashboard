import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import stickerService from "../services/stickerService";

export function useStickerPacks() {
  return useQuery({
    queryKey: ["sticker-packs"],
    queryFn: () => stickerService.listPacks(),
    select: (data) => (Array.isArray(data) ? data : data?.packs || []),
  });
}

export function useCreatePack() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => stickerService.createPack(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sticker-packs"] }),
  });
}

export function useDeletePack() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (packId) => stickerService.deletePack(packId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sticker-packs"] }),
  });
}

export function useAddSticker() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ packId, payload }) => stickerService.addSticker(packId, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sticker-packs"] }),
  });
}

export function useDeleteSticker() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => stickerService.deleteSticker(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sticker-packs"] }),
  });
}
