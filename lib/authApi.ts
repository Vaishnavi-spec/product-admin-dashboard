import api from "./axios";

export interface LoginData {
  username: string;
  password: string;
}

export const loginUser = async (loginData: LoginData) => {
  const response = await api.post("/auth/login", loginData);

  return response.data;
};