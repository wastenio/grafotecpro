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
export interface Quesito {
  id: number;
  analysis: number;
  case: number;
  requester?: number;
  text: string;
  created_at?: string;
  answered_text?: string;
  answered_by_email?: string;
  answered_at?: string;
}

// --- Listar quesitos de uma análise ---
export const getQuesitos = async (analysisId: number): Promise<Quesito[]> => {
  try {
    const response = await api.get(`/analysis/${analysisId}/quesitos/`);
    return response.data.results || response.data; // caso use paginação
  } catch (error: any) {
    console.error("Erro ao listar quesitos:", error.response || error);
    throw error;
  }
};

// --- Detalhe de um quesito ---
export const getQuesitoDetail = async (id: number): Promise<Quesito> => {
  try {
    const response = await api.get(`/quesitos/${id}/`);
    return response.data;
  } catch (error: any) {
    console.error("Erro ao obter detalhe do quesito:", error.response || error);
    throw error;
  }
};

// --- Criar novo quesito (somente staff) ---
export const createQuesito = async (
  analysisId: number,
  data: Partial<Quesito>
): Promise<Quesito> => {
  try {
    const response = await api.post(`/analysis/${analysisId}/quesitos/`, data);
    return response.data;
  } catch (error: any) {
    console.error("Erro ao criar quesito:", error.response || error);
    throw error;
  }
};

// --- Responder/atualizar quesito ---
export const updateQuesito = async (
  quesitoId: number,
  answered_text: string
): Promise<Quesito> => {
  try {
    const response = await api.patch(`/quesitos/${quesitoId}/`, { answered_text });
    return response.data;
  } catch (error: any) {
    console.error("Erro ao atualizar quesito:", error.response || error);
    throw error;
  }
};
