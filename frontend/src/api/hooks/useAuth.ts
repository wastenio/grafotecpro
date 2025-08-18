// src/api/hooks/useAuth.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UseMutationResult } from "@tanstack/react-query";
import { AuthAPI } from "../client";
import { useNavigate } from "react-router-dom";

// Tipo de usuário
export type User = {
  id: number;
  name: string;
  email: string;
  // outros campos do backend
};

// Hook para buscar usuário logado
export const useCurrentUser = () => {
  return useQuery<User>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const user = await AuthAPI.me();
      return user;
    },
    retry: false,
  });
};

// Payload do login
type LoginPayload = { email: string; password: string };

// Hook para login
export const useLogin = (): UseMutationResult<User, Error, LoginPayload> => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation<User, Error, LoginPayload>({
    mutationFn: async ({ email, password }) => {
      const data = await AuthAPI.login(email, password);
      if (data.token) {
        localStorage.setItem("access", data.token);
      } else if (data.access) {
        localStorage.setItem("access", data.access);
        if (data.refresh) localStorage.setItem("refresh", data.refresh);
      }
      return data.user || data;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["currentUser"], user);
      navigate("/");
    },
  });
};

// Hook para logout
export const useLogout = (): UseMutationResult<void, Error, void> => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation<void, Error, void>({
    mutationFn: async () => {
      try {
        await AuthAPI.logout();
      } catch {
        // backend pode não ter endpoint de logout
      }
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["currentUser"] });
      navigate("/login");
    },
  });
};
