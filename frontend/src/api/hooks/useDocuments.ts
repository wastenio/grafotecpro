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
export interface DocumentVersion {
  id: number;
  document: number;
  file: string;
  version_number: number;
  uploaded_at?: string;
  uploaded_by?: number;
  changelog?: string;
  file_url?: string;
}

// --- Listar versões de um documento ---
export const getDocumentVersions = async (documentId: number): Promise<DocumentVersion[]> => {
  try {
    const response = await api.get(`/documents/${documentId}/versions/`);
    return response.data.results || response.data; // se a API retornar paginado
  } catch (error: any) {
    console.error("Erro ao listar versões do documento:", error.response || error);
    throw error;
  }
};

// --- Upload de nova versão ---
export const uploadDocumentVersion = async (
  documentId: number,
  file: File,
  changelog?: string
): Promise<DocumentVersion> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    if (changelog) formData.append("changelog", changelog);

    const response = await api.post(
      `/documents/${documentId}/versions/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          ...getAuthHeaders(),
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Erro ao enviar versão do documento:", error.response || error);
    throw error;
  }
};

// --- Download de versão específica ---
export const downloadDocumentVersion = async (versionId: number): Promise<Blob> => {
  try {
    const response = await api.get(`/documents/versions/${versionId}/download/`, {
      responseType: "blob",
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error: any) {
    console.error("Erro ao baixar versão do documento:", error.response || error);
    throw error;
  }
};
