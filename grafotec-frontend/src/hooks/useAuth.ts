import { useMutation } from "@tanstack/react-query";
import { login } from "../api/auth";

export const useLogin = () => {
  return useMutation({
    mutationFn: ({ username, password }: { username: string; password: string }) =>
      login(username, password),
    onSuccess: (data) => {
      localStorage.setItem("token", data.token); // salva token do backend
    },
  });
};
