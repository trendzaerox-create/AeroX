import api from "@/lib/apiClient";

export const getProfile = async () => {
  const res = await api.get("/api/user/profile");
  return res.data;
};

export const updateProfile = async (data) => {
  const res = await api.put("/api/user/profile", data);
  return res.data;
};

export const deleteProfile = async () => {
  const res = await api.delete("/api/user/profile");
  return res.data;
};

export const getAllUsers = async () => {
  const res = await api.get("/api/admin/users");
  return res.data;
};

export const getUser = async (id) => {
  const res = await api.get(`/api/admin/users/${id}`);
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await api.delete(`/api/admin/users/${id}`);
  return res.data;
};

export const updateUser = async (id, data) => {
  const res = await api.put(`/api/admin/users/${id}`, data);
  return res.data;
};