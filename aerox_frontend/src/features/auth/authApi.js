import api from "../../lib/apiClient";

export const registerUser = (data) => {
  return api.post("/api/auth/register", data);
};

export const loginUser = (data) => {
  return api.post("/api/auth/login", data);
};