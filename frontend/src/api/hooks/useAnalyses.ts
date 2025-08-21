import axios, { AxiosError } from "axios";

const API_BASE_URL = "http://localhost:8000/api";

// Headers de autenticação
const getAuthHeaders = () => {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...getAuthHeaders(),
  },
});

// --- Tipagem ---
export interface Comparison {
  id: number;
  analysis: number;
  pattern?: number;
  document?: number;
  pattern_version?: number;
  document_version?: number;
  similarity_score?: number;
  automatic_result?: string;
  created_at?: string;
}

// --- Listar comparações de uma análise ---
export const getComparisons = async (analysisId: number, page: number = 1, pageSize: number = 10) => {
  try {
    const response = await api.get(`/analysis/${analysisId}/comparisons/`, {
      params: { page, page_size: pageSize },
    });
    return response.data; // inclui results, count, next, previous
  } catch (error: any) {
    console.error("Erro ao listar comparações:", error.response || error);
    throw error;
  }
};

// --- Detalhes de uma comparação ---
export const getComparisonDetail = async (id: number): Promise<Comparison> => {
  try {
    const response = await api.get(`/comparisons/${id}/`);
    return response.data;
  } catch (error: any) {
    console.error("Erro ao obter detalhe da comparação:", error.response || error);
    throw error;
  }
};

// --- Criar nova comparação ---
export const createComparison = async (
  analysisId: number,
  data: Partial<Comparison>
): Promise<Comparison> => {
  try {
    const response = await api.post(`/analysis/${analysisId}/comparisons/`, data);
    return response.data;
  } catch (error: any) {
    console.error("Erro ao criar comparação:", error.response || error);
    throw error;
  }
};

// --- Upload de versões (pattern/document) para comparação ---
export const uploadComparisonFile = async (
  comparisonId: number,
  file: File,
  type: "pattern" | "document"
): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append(type, file);

    const response = await api.post(`/comparisons/${comparisonId}/upload_${type}/`, formData, {
      headers: { "Content-Type": "multipart/form-data", ...getAuthHeaders() },
    });

    return response.data;
  } catch (error: any) {
    console.error(`Erro ao fazer upload do ${type}:`, error.response || error);
    throw error;
  }
};
