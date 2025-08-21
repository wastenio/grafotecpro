// src/api/cases.ts
import api from "./axios"; // usa a instância única e corrigida de axios

// --- Tipagem opcional ---
export interface Case {
  id: number;
  title: string;
  description?: string;
  owner?: number;
  created_at?: string;
  updated_at?: string;
}

// --- Listar todos os cases ---
export const getCases = async (): Promise<Case[]> => {
  const response = await api.get("/cases/");
  return response.data.results || response.data;
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

// --- Atualizar case (opcional) ---
export const updateCase = async (id: number, data: Partial<Case>): Promise<Case> => {
  const response = await api.put(`/cases/${id}/`, data);
  return response.data;
};
