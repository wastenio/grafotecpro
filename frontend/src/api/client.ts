import api from './axios';

export const AuthAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/jwt/create/', { email, password }).then(r => r.data),
  me: () => api.get('/auth/me/').then(r => r.data),
};

export const CasesAPI = {
  list: (params?: any) => api.get('/cases/', { params }).then(r => r.data),
  create: (payload: any) => api.post('/cases/', payload).then(r => r.data),
  get: (id: number) => api.get(`/cases/${id}/`).then(r => r.data),
  uploadReport: (caseId: number, file: File) => {
    const form = new FormData();
    form.append('final_report', file);
    return api.post(`/analysis/cases/${caseId}/report/`, form).then(r => r.data);
  }
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
  downloadVersion: (versionId: number) =>
    api.get(`/analysis/documents/versions/${versionId}/download/`, { responseType: 'blob' }),
};
