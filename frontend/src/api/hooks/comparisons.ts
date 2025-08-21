// src/api/hooks/useComparisons.ts
import axios from "axios";

// Base URL da API
const API_BASE_URL = "http://localhost:8000/api";

// Função para pegar token
const getAuthHeaders = () => {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Instância Axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...getAuthHeaders(),
  },
});

// --- Interface ---
export interface Comparison {
  id: number;
  analysis: number;
  title?: string;
  description?: string;
  status?: string;
  similarity_score?: number | null;
  automatic_result?: string | null;
  pattern_name?: string | null;
  document_name?: string | null;
  created_at?: string;
  updated_at?: string;
}

// --- Listar comparações de uma análise ---
export const getComparisons = async (analysisId: number): Promise<Comparison[]> => {
  try {
    const response = await api.get(`/analysis/${analysisId}/comparisons/`);
    return response.data.results || response.data;
  } catch (error: any) {
    console.error("Erro ao buscar comparações:", error.response || error);
    throw error;
  }
};

// --- Criar nova comparação ---
export const createComparison = async (analysisId: number, data: any): Promise<Comparison> => {
  try {
    const response = await api.post(`/analysis/${analysisId}/comparisons/`, data);
    return response.data;
  } catch (error: any) {
    console.error("Erro ao criar comparação:", error.response || error);
    throw error;
  }
};

// --- Detalhes de uma comparação ---
export const getComparisonDetail = async (id: number): Promise<Comparison> => {
  try {
    const response = await api.get(`/comparisons/${id}/`);
    return response.data;
  } catch (error: any) {
    console.error("Erro ao buscar detalhe da comparação:", error.response || error);
    throw error;
  }
};
