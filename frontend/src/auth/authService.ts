import api from '../api/api';

export const loginUser = async (email: string, password: string) => {
  const response = await api.post('/users/login/', { email, password });
  localStorage.setItem('access', response.data.access);
  localStorage.setItem('refresh', response.data.refresh);
  return response.data;
};

export const registerUser = async (data: any) => {
  const response = await api.post('/users/register/', data);
  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
};
