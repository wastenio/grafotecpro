import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthAPI } from "../client";

interface LoginData {
  email: string; // ajuste para 'email' conforme backend
  password: string;
}

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const login = async (data: LoginData) => {
    try {
      setLoading(true);
      setError(null);

      // Usando o AuthAPI do client.ts
      const response = await AuthAPI.login(data.email, data.password);

      setUser(response.user || null); // ajusta de acordo com a resposta do backend
      localStorage.setItem("token", response.token);

      navigate("/cases"); // redireciona após login
    } catch (err: any) {
      setError(err.response?.data?.detail || "Erro no login");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    navigate("/login");
  };

  return {
    user,
    login,
    logout,
    loading,
    error,
  };
}
