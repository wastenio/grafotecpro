import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api", // ajuste se seu backend usar outra porta
});

export const login = async (username: string, password: string) => {
  const response = await api.post("/auth/login/", { username, password });
  return response.data;
};
