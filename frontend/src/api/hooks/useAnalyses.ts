import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...getAuthHeaders(),
  },
});

// Listar análises de um case específico
export const getAnalyses = async (caseId: number) => {
  const response = await api.get(`/analysis/?case=${caseId}`);
  return response.data;
};

// Detalhes de uma análise
export const getAnalysisDetail = async (id: number) => {
  const response = await api.get(`/analysis/${id}/`);
  return response.data;
};

// Criar nova análise
export const createAnalysis = async (data: any) => {
  try {
    const response = await api.post("/analysis/", data);
    return response.data;
  } catch (error: any) {
    console.error("Erro ao criar análise:", error.response || error);
    throw error;
  }
};
