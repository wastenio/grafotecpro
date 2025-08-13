import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  withCredentials: false,
});

// Interceptor para injetar o token automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access'); // manter "access" como padrão
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erro 401 e tentar refresh token
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    // Verifica se é erro de autenticação e se já não tentou antes
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      const refresh = localStorage.getItem('refresh');
      if (refresh) {
        try {
          // Faz o refresh do token
          const { data } = await axios.post(
            `${import.meta.env.VITE_API_BASE}/auth/jwt/refresh/`,
            { refresh }
          );

          // Atualiza access token
          localStorage.setItem('access', data.access);
          if (data.refresh) {
            localStorage.setItem('refresh', data.refresh);
          }

          // Repete a requisição original
          original.headers = original.headers || {};
          original.headers.Authorization = `Bearer ${data.access}`;
          return api(original);
        } catch {
          // Falha no refresh -> força logout
        }
      }

      // Remove tokens e redireciona para login
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;
