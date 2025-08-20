import api from "axios";

// Base URL já configurada na instância de api
const API_BASE_URL = "http://localhost:8000/api";

// Listar comparações de uma análise
export const getComparisons = async (analysisId: number) => {
  const response = await api.get(`${API_BASE_URL}/analysis/${analysisId}/comparisons/`);
  return response.data.results; // se usar paginado
};

// Criar nova comparação
export const createComparison = async (analysisId: number, data: any) => {
  const response = await api.post(`${API_BASE_URL}/analysis/${analysisId}/comparisons/`, data);
  return response.data;
};

// Detalhes da comparação
export const getComparisonDetail = async (id: number) => {
  const response = await api.get(`${API_BASE_URL}/comparisons/${id}/`);
  return response.data;
};
