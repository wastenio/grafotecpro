// src/api/axios.ts
import axios from "axios";
import { AxiosHeaders } from "axios";

const API_BASE_URL = "http://localhost:8000/api";

// Função para obter headers de autenticação
const getAuthHeaders = (): AxiosHeaders => {
  const token = localStorage.getItem("access_token");
  const headers = new AxiosHeaders({
    "Content-Type": "application/json",
  });
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return headers;
};

// Instância Axios configurada
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: getAuthHeaders(),
  withCredentials: true,
});

// Interceptor para atualizar headers antes de cada requisição
api.interceptors.request.use((config) => {
  config.headers = getAuthHeaders();
  return config;
});

export default api;
