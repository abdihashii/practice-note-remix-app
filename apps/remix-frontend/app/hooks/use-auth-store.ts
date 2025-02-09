import { type User } from "@notes-app/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAccessToken } from "~/lib/auth-utils";

const AUTH_QUERY_KEY = ["auth"] as const;

export function useAuthStore() {
  const queryClient = useQueryClient();

  const { data: auth } = useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: () => ({
      accessToken: getAccessToken(),
      user: queryClient.getQueryData<User>(["user"]),
    }),
    // Don't refetch on window focus since we manage token refresh separately
    refetchOnWindowFocus: false,
  });

  const setAuth = (accessToken: string, user: User) => {
    queryClient.setQueryData(AUTH_QUERY_KEY, { accessToken, user });
    queryClient.setQueryData(["user"], user);
  };

  const clearAuth = () => {
    queryClient.setQueryData(AUTH_QUERY_KEY, { accessToken: null, user: null });
    queryClient.setQueryData(["user"], null);
  };

  return {
    accessToken: auth?.accessToken ?? null,
    user: auth?.user ?? null,
    setAuth,
    clearAuth,
  };
}
