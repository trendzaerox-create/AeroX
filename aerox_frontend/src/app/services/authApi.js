import apiClient from "../../lib/apiClient";

export const registerUser = (data) => {
  return apiClient.post("/api/auth/register", data);
};

export const loginUser = (data) => {
  return apiClient.post("/api/auth/login", data);
};