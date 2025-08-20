import axios from "axios";

// URL base do backend
const API_BASE_URL = "http://localhost:8000/api";

// Cria instância do axios com configuração global
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para incluir o token JWT em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers!["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Listar todos os cases
export const getCases = async () => {
  const response = await api.get("/cases/");
  return response.data;
};

// Obter detalhes de um case
export const getCaseDetail = async (id: number) => {
  const response = await api.get(`/cases/${id}/`);
  return response.data;
};

// Criar novo case
export const createCase = async (data: any) => {
  try {
    const response = await api.post("/cases/", data);
    return response.data;
  } catch (error: any) {
    console.error("Erro ao criar case:", error.response || error);
    throw error;
  }
};
