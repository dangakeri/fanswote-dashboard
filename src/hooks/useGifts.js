import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import giftService from "../services/giftService";

export function useGifts() {
  return useQuery({
    queryKey: ["gifts"],
    queryFn: () => giftService.getGifts(),
    select: (data) => data.gifts || [],
  });
}

export function useCreateGift() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => giftService.createGift(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gifts"] });
    },
  });
}
