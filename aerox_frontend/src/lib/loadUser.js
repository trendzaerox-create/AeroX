import api from "./apiClient";
import { getToken } from "./tokenStorage";

export const loadUser = async () => {

  const token = getToken();

  if (!token) return null;

  try {

    const res = await api.get("/api/user/profile");

    return res.data;

  } catch (err) {

    return null;

  }

};