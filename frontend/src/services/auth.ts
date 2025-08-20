import api from "axios";

const API_BASE_URL = "http://localhost:8000/api";

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post(`${API_BASE_URL}/users/login/`, {
      email,
      password,
    });

    // Salva tokens no localStorage
    localStorage.setItem("accessToken", response.data.access);
    localStorage.setItem("refreshToken", response.data.refresh);

    return response.data;
  } catch (error: any) {
    console.error("Erro no login:", error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};
