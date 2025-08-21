// src/services/auth.ts
import api from "../api/axios"; // instância com baseURL e headers já configurados

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post("/users/login/", { email, password });

    // Salva tokens no localStorage (padronizando nomes)
    localStorage.setItem("access_token", response.data.access);
    localStorage.setItem("refresh_token", response.data.refresh);

    return response.data;
  } catch (error: any) {
    console.error("Erro no login:", error.response || error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};
