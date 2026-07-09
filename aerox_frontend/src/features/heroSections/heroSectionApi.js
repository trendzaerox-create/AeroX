import apiClient from "@/lib/apiClient";

export const getPublicHeroSectionsApi = async () => {
  const res = await apiClient.get("/api/hero-sections");
  return res.data;
};

export const getAdminHeroSectionsApi = async () => {
  const res = await apiClient.get("/api/admin/hero-sections");
  return res.data;
};

export const getAdminHeroSectionByIdApi = async (id) => {
  const res = await apiClient.get(`/api/admin/hero-sections/${id}`);
  return res.data;
};

export const createHeroSectionApi = async (payload) => {
  const res = await apiClient.post("/api/admin/hero-sections", payload);
  return res.data;
};

export const updateHeroSectionApi = async (id, payload) => {
  const res = await apiClient.put(`/api/admin/hero-sections/${id}`, payload);
  return res.data;
};

export const deleteHeroSectionApi = async (id) => {
  await apiClient.delete(`/api/admin/hero-sections/${id}`);
  return id;
};

export const uploadHeroImageApi = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await apiClient.post("/api/admin/hero-sections/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};