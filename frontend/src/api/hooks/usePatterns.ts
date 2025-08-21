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

// --- Tipagem ---
export interface Pattern {
  id: number;
  owner: number;
  title: string;
  description?: string;
  uploaded_document?: number;
  metadata?: string;
  tags?: string[];
  created_at?: string;
  is_active?: boolean;
}

// --- Listar padrões ---
export const getPatterns = async (): Promise<Pattern[]> => {
  try {
    const response = await api.get("/patterns/");
    return response.data.results || response.data;
  } catch (error: any) {
    console.error("Erro ao listar padrões:", error.response || error);
    throw error;
  }
};

// --- Criar novo padrão ---
interface CreatePatternPayload {
  title: string;
  description?: string;
  uploaded_document?: number;
  metadata?: string;
  tags?: string[];
}

export const createPattern = async (data: CreatePatternPayload): Promise<Pattern> => {
  try {
    const response = await api.post("/patterns/", data);
    return response.data;
  } catch (error: any) {
    console.error("Erro ao criar padrão:", error.response || error);
    throw error;
  }
};

// --- Detalhes de um padrão ---
export const getPatternDetail = async (id: number): Promise<Pattern> => {
  try {
    const response = await api.get(`/patterns/${id}/`);
    return response.data;
  } catch (error: any) {
    console.error("Erro ao obter detalhe do padrão:", error.response || error);
    throw error;
  }
};
