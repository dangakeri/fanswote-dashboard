import { useMutation, useQueryClient } from "@tanstack/react-query";
import authService from "../services/authService";

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }) => authService.login(email, password),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return () => {
    authService.logout();
    queryClient.clear();
  };
}
