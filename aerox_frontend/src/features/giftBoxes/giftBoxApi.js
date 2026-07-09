


import apiClient from "@/lib/apiClient";

export const getActiveGiftBoxesApi = async () => {
  const res = await apiClient.get("/api/gift-boxes");
  return res.data;
};

export const getAdminGiftBoxesApi = async () => {
  const res = await apiClient.get("/api/admin/gift-boxes");
  return res.data;
};

export const getAdminGiftBoxByIdApi = async (id) => {
  const res = await apiClient.get(`/api/admin/gift-boxes/${id}`);
  return res.data;
};

export const uploadGiftBoxImageApi = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await apiClient.post("/api/admin/gift-boxes/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const createGiftBoxApi = async (payload) => {
  const res = await apiClient.post("/api/admin/gift-boxes", payload);
  return res.data;
};

export const updateGiftBoxApi = async ({ id, payload }) => {
  const res = await apiClient.put(`/api/admin/gift-boxes/${id}`, payload);
  return res.data;
};

export const updateGiftBoxStatusApi = async ({ id, active }) => {
  const res = await apiClient.put(`/api/admin/gift-boxes/${id}/status`, { active });
  return res.data;
};

export const deleteGiftBoxApi = async (id) => {
  const res = await apiClient.delete(`/api/admin/gift-boxes/${id}`);
  return res.data;
};

export const calculateGiftSetApi = async (payload) => {
  const res = await apiClient.post("/api/giftsets/calculate", payload);
  return res.data;
};