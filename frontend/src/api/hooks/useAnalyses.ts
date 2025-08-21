// src/api/hooks/useAnalyses.ts
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

// -------------------
// Tipos (opcional)
export interface Analysis {
  id: number;
  title: string;
  description: string;
  status: string;
  case: number;
  perito: number;
  observation: string;
  methodology?: string;
  conclusion?: string;
  ai_results?: string;
  document?: string;
  created_at?: string;
  updated_at?: string;
}

// -------------------
// Listar análises de um case específico
export const getAnalyses = async (caseId: number): Promise<Analysis[]> => {
  const response = await api.get(`/analysis/?case=${caseId}`);
  return response.data.results || response.data;
};

// Detalhes de uma análise
export const getAnalysisDetail = async (id: number): Promise<Analysis> => {
  const response = await api.get(`/analysis/${id}/`);
  return response.data;
};

// Criar nova análise
export const createAnalysis = async (data: any): Promise<Analysis> => {
  const response = await api.post("/analysis/", data);
  return response.data;
};

// Atualizar análise
export const updateAnalysis = async (id: number, data: any): Promise<Analysis> => {
  const response = await api.put(`/analysis/${id}/`, data);
  return response.data;
};

// Upload de documento para análise
export const uploadAnalysisDocument = async (id: number, file: File): Promise<any> => {
  const formData = new FormData();
  formData.append("document", file);

  const response = await api.post(`/analysis/${id}/upload_document/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...getAuthHeaders(),
    },
  });
  return response.data;
};

// Rodar análise automática via AI
export const runAIAnalysis = async (id: number): Promise<any> => {
  const response = await api.post(`/analysis/${id}/run_ai_analysis/`);
  return response.data;
};

// Exportar PDF
export const exportAnalysisPDF = async (id: number): Promise<Blob> => {
  const response = await api.get(`/analysis/${id}/export_pdf/`, { responseType: "blob" });
  return response.data;
};

// Exportar DOCX
export const exportAnalysisDOCX = async (id: number): Promise<Blob> => {
  const response = await api.get(`/analysis/${id}/export_docx/`, { responseType: "blob" });
  return response.data;
};
