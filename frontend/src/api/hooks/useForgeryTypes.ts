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
export interface ForgeryType {
  id: number;
  name: string;
  description?: string;
  example_image?: string;
  owner?: number;
}

// --- Listar tipos de falsificação ---
export const getForgeryTypes = async (): Promise<ForgeryType[]> => {
  try {
    const response = await api.get("/forgery-types/");
    return response.data.results || response.data;
  } catch (error: any) {
    console.error("Erro ao listar tipos de falsificação:", error.response || error);
    throw error;
  }
};

// --- Criar novo tipo ---
interface CreateForgeryTypePayload {
  name: string;
  description?: string;
  example_image?: string;
}

export const createForgeryType = async (data: CreateForgeryTypePayload): Promise<ForgeryType> => {
  try {
    const response = await api.post("/forgery-types/", data);
    return response.data;
  } catch (error: any) {
    console.error("Erro ao criar tipo de falsificação:", error.response || error);
    throw error;
  }
};

// --- Detalhes de um tipo ---
export const getForgeryTypeDetail = async (id: number): Promise<ForgeryType> => {
  try {
    const response = await api.get(`/forgery-types/${id}/`);
    return response.data;
  } catch (error: any) {
    console.error("Erro ao obter detalhe do tipo de falsificação:", error.response || error);
    throw error;
  }
};
