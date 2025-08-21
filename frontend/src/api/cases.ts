// src/api/cases.ts
import api from "./axios"; // usa a instância única e corrigida de axios

// --- Documentos de um case ---
export interface Document {
  id: number;
  name: string;
  url: string;
}

// --- Tipagem do Case ---
export interface Case {
  id: number;
  title: string;
  description?: string;
  owner?: number;
  status: string;
  created_at: string;
  updated_at?: string;
  documents?: Document[];       // adicionado
  final_report?: string | null; // adicionado
}

// --- Listar todos os cases ---
export const getCases = async (): Promise<Case[]> => {
  const response = await api.get("/cases/");
  return response.data.results; // <-- retorna o array diretamente
};

// --- Detalhes de um case ---
export const getCaseDetail = async (id: number): Promise<Case> => {
  const response = await api.get(`/cases/${id}/`);
  return response.data;
};

// --- Criar novo case ---
export const createCase = async (data: Partial<Case>): Promise<Case> => {
  const response = await api.post("/cases/", data);
  return response.data;
};

// --- Atualizar case ---
export const updateCase = async (id: number, data: Partial<Case>): Promise<Case> => {
  const response = await api.put(`/cases/${id}/`, data);
  return response.data;
};
