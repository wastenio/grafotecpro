import api from './axios'; // default export do axios configurado
import axios from "axios";

export const AuthAPI = {
  // Login: retorna token e dados do usuário
  async login(email: string, password: string) {
    const { data } = await axios.post("/auth/login", { email, password });

    // Se a API retornar access e refresh (padrão JWT)
    if (data.access) {
      localStorage.setItem("access", data.access);
    }
    if (data.refresh) {
      localStorage.setItem("refresh", data.refresh);
    }

    // Se retornar também o usuário logado
    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    return data; // { access, refresh, user }
  },

  // Buscar usuário logado
  async me() {
    const { data } = await axios.get("/auth/me");
    return data; // { id, name, email, ... }
  },

  // Logout
  async logout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");

    // Caso backend tenha endpoint de logout
    try {
      await axios.post("/auth/logout");
    } catch {
      // Ignorar erros de logout no backend
    }
  },
};


export const CasesAPI = {
  list: (params?: any) => api.get('/cases/', { params }).then(r => r.data),
  create: (payload: any) => api.post('/cases/', payload).then(r => r.data),
  get: (id: number) => api.get(`/cases/${id}/`).then(r => r.data),
  uploadReport: (caseId: number, file: File) => {
    const form = new FormData();
    form.append('final_report', file);
    return api.post(`/analysis/cases/${caseId}/report/`, form).then(r => r.data);
  },
};

export const AnalysesAPI = {
  listByCase: (caseId: number, params?: any) =>
    api.get(`/analysis/cases/${caseId}/analyses/`, { params }).then(r => r.data),
  create: (caseId: number, payload: any) =>
    api.post(`/analysis/cases/${caseId}/analyses/create/`, payload).then(r => r.data),
  get: (id: number) => api.get(`/analysis/analyses/${id}/`).then(r => r.data),
  list: (params?: any) => api.get(`/analysis/analyses/`, { params }).then(r => r.data),
  exportPdf: (caseId: number) => api.get(`/analysis/cases/${caseId}/report/`, { responseType: 'blob' }),
};

export const QuesitosAPI = {
  listByCase: (caseId: number) => api.get(`/analysis/cases/${caseId}/quesitos/`).then(r => r.data),
  update: (id: number, payload: any) => api.patch(`/analysis/quesitos/${id}/`, payload).then(r => r.data),
};

export const ComparisonsAPI = {
  listByAnalysis: (analysisId: number) =>
    api.get(`/analysis/analyses/${analysisId}/comparisons/`).then(r => r.data),
  create: (analysisId: number, payload: any) =>
    api.post(`/analysis/analyses/${analysisId}/comparisons/`, payload).then(r => r.data),
  detailResult: (comparisonId: number) =>
    api.get(`/analysis/comparisons/${comparisonId}/detail_result/`).then(r => r.data),
};

export const CommentsAPI = {
  list: (params?: any) => api.get(`/analysis/comments/`, { params }).then(r => r.data),
  create: (payload: any) => api.post(`/analysis/comments/`, payload).then(r => r.data),
  update: (id: number, payload: any) => api.patch(`/analysis/comments/${id}/`, payload).then(r => r.data),
  remove: (id: number) => api.delete(`/analysis/comments/${id}/`).then(r => r.data),
};

export const DocumentsAPI = {
  versions: (documentId: number) => api.get(`/analysis/documents/${documentId}/versions/`).then(r => r.data),
  uploadVersion: (documentId: number, file: File, changelog?: string) => {
    const form = new FormData();
    form.append('document', String(documentId));
    form.append('file', file);
    if (changelog) form.append('changelog', changelog);
    return api.post(`/analysis/documents/${documentId}/versions/`, form).then(r => r.data);
  },
  async downloadVersion(versionId: number): Promise<Blob> {
    const response = await api.get(`/documents/versions/${versionId}/download/`, {
      responseType: 'blob', // força retorno como Blob
    });
    return response.data; // pega apenas o Blob
  },
};
