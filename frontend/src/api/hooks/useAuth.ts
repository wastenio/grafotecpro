// src/api/hooks/useAuth.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthAPI } from "../client";
import { useNavigate } from "react-router-dom";

type User = {
  id: number;
  name: string;
  email: string;
  // adicione aqui outros campos retornados pelo backend
};

// Hook para buscar usuário logado
export const useCurrentUser = () => {
  return useQuery<User>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const user = await AuthAPI.me();
      return user;
    },
    retry: false, // evita loops caso não esteja autenticado
  });
};

// Hook para login
export const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const data = await AuthAPI.login(email, password);
      // salva tokens
      if (data.token) {
        localStorage.setItem("access", data.token);
      } else if (data.access) {
        // caso use JWT padrão com access/refresh
        localStorage.setItem("access", data.access);
        if (data.refresh) {
          localStorage.setItem("refresh", data.refresh);
        }
      }
      return data.user || data;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["currentUser"], user);
      navigate("/"); // redireciona para home ou dashboard
    },
  });
};

// Hook para logout
export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
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
