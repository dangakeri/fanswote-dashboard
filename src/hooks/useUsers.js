import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import userService from "../services/userService";

export function useUsers(params = {}) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => userService.getUsers(params),
    select: (data) => ({
      users: data.users || [],
      total: data.total || 0,
      page: data.page || 1,
      limit: data.limit || 20,
      totalPages: data.totalPages || 1,
    }),
  });
}

export function useUpdateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, role }) => userService.updateRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
