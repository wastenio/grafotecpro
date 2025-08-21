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
export interface Comment {
  id: number;
  case: number;
  analysis?: number;
  parent?: number;
  author: number;
  author_name?: string;
  author_email?: string;
  text: string;
  created_at?: string;
  updated_at?: string;
  replies?: Comment[];
}

// --- Listar comentários ---
interface GetCommentsParams {
  caseId?: number;
  analysisId?: number;
  rootOnly?: boolean;
}

export const getComments = async (params?: GetCommentsParams): Promise<Comment[]> => {
  try {
    const queryParams: Record<string, any> = {};
    if (params?.caseId) queryParams.case = params.caseId;
    if (params?.analysisId) queryParams.analysis = params.analysisId;
    if (params?.rootOnly) queryParams.root_only = params.rootOnly ? "1" : "0";

    const response = await api.get("/comments/", { params: queryParams });
    return response.data.results || response.data;
  } catch (error: any) {
    console.error("Erro ao listar comentários:", error.response || error);
    throw error;
  }
};

// --- Criar novo comentário ---
interface CreateCommentPayload {
  case: number;
  analysis?: number;
  parent?: number;
  text: string;
}

export const createComment = async (data: CreateCommentPayload): Promise<Comment> => {
  try {
    const response = await api.post("/comments/", data);
    return response.data;
  } catch (error: any) {
    console.error("Erro ao criar comentário:", error.response || error);
    throw error;
  }
};

// --- Atualizar comentário ---
export const updateComment = async (id: number, text: string): Promise<Comment> => {
  try {
    const response = await api.put(`/comments/${id}/`, { text });
    return response.data;
  } catch (error: any) {
    console.error("Erro ao atualizar comentário:", error.response || error);
    throw error;
  }
};

// --- Deletar comentário ---
export const deleteComment = async (id: number): Promise<void> => {
  try {
    await api.delete(`/comments/${id}/`);
  } catch (error: any) {
    console.error("Erro ao deletar comentário:", error.response || error);
    throw error;
  }
};
