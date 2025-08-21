// src/api/axios.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true, // necessário se o backend usar cookies
});

// Interceptor para adicionar Authorization em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token"); // ou "accessToken" se for o nome que você está usando
  if (token && config.headers) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default api;
