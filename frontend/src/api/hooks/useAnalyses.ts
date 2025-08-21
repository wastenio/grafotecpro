// src/api/hooks/useAnalyses.ts

import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

// Função para pegar token
const getAuthHeaders = () => {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Instância Axios com headers de autenticação
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    ...getAuthHeaders(),
  },
});

// --- Interface ---
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

// --- Listar análises de um case específico ---
export const getAnalyses = async (caseId: number): Promise<Analysis[]> => {
  try {
    const response = await api.get<Analysis[]>(`/cases/${caseId}/analyses/`);
    if (Array.isArray(response.data)) {
      return response.data;
    }
    // caso venha um objeto inesperado, retorna array vazio
    return [];
  } catch (error: any) {
    console.error("Erro ao buscar análises:", error.response || error);
    return [];
  }
};

// --- Detalhes de uma análise ---
export const getAnalysisDetail = async (id: number): Promise<Analysis | null> => {
  try {
    const response = await api.get<Analysis>(`/analyses/${id}/`);
    return response.data;
  } catch (error: any) {
    console.error("Erro ao buscar detalhe da análise:", error.response || error);
    return null;
  }
};

// --- Criar nova análise ---
export const createAnalysis = async (data: any): Promise<Analysis> => {
  try {
    const response = await api.post<Analysis>("/analyses/", data); // endpoint ajustado
    return response.data; // sempre retorna Analysis
  } catch (error: any) {
    console.error("Erro ao criar análise:", error.response || error);
    throw error; // lança exceção para o form lidar
  }
};

// --- Atualizar análise ---
export const updateAnalysis = async (id: number, data: Partial<Analysis>): Promise<Analysis | null> => {
  try {
    const response = await api.put<Analysis>(`/analyses/${id}/`, data);
    return response.data;
  } catch (error: any) {
    console.error("Erro ao atualizar análise:", error.response || error);
    return null;
  }
};

// --- Upload de documento ---
export const uploadAnalysisDocument = async (id: number, file: File): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append("document", file);

    const response = await api.post(`/analyses/${id}/upload_document/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        ...getAuthHeaders(),
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Erro ao enviar documento:", error.response || error);
    throw error;
  }
};

// --- Rodar análise AI ---
export const runAIAnalysis = async (id: number): Promise<any> => {
  try {
    const response = await api.post(`/analyses/${id}/run_ai_analysis/`);
    return response.data;
  } catch (error: any) {
    console.error("Erro ao rodar análise AI:", error.response || error);
    throw error;
  }
};

// --- Exportar PDF ---
export const exportAnalysisPDF = async (id: number): Promise<Blob> => {
  try {
    const response = await api.get(`/analyses/${id}/export_pdf/`, { responseType: "blob" });
    return response.data;
  } catch (error: any) {
    console.error("Erro ao exportar PDF:", error.response || error);
    throw error;
  }
};

// --- Exportar DOCX ---
export const exportAnalysisDOCX = async (id: number): Promise<Blob> => {
  try {
    const response = await api.get(`/analyses/${id}/export_docx/`, { responseType: "blob" });
    return response.data;
  } catch (error: any) {
    console.error("Erro ao exportar DOCX:", error.response || error);
    throw error;
  }
};
