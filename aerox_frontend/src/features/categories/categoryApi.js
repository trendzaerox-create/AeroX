// import apiClient from "@/lib/apiClient";

// export const getPublicCategoriesApi = async () => {
//   const res = await apiClient.get("/api/categories");
//   return res.data;
// };

// export const getAdminCategoriesApi = async () => {
//   const res = await apiClient.get("/api/admin/categories");
//   return res.data;
// };

// export const getAdminCategoryByIdApi = async (id) => {
//   const res = await apiClient.get(`/api/admin/categories/${id}`);
//   return res.data;
// };

// export const createCategoryApi = async (payload) => {
//   const res = await apiClient.post("/api/admin/categories", payload);
//   return res.data;
// };

// export const updateCategoryApi = async (id, payload) => {
//   const res = await apiClient.put(`/api/admin/categories/${id}`, payload);
//   return res.data;
// };

// export const deleteCategoryApi = async (id) => {
//   await apiClient.delete(`/api/admin/categories/${id}`);
//   return id;
// };








import apiClient from "@/lib/apiClient";

export const getPublicCategoriesApi = async () => {
  const res = await apiClient.get("/api/categories");
  return res.data;
};

export const getAdminCategoriesApi = async () => {
  const res = await apiClient.get("/api/admin/categories");
  return res.data;
};

export const getAdminCategoryByIdApi = async (id) => {
  const res = await apiClient.get(`/api/admin/categories/${id}`);
  return res.data;
};

export const createCategoryApi = async (payload) => {
  const res = await apiClient.post("/api/admin/categories", payload);
  return res.data;
};

export const updateCategoryApi = async (id, payload) => {
  const res = await apiClient.put(`/api/admin/categories/${id}`, payload);
  return res.data;
};

export const deleteCategoryApi = async (id) => {
  await apiClient.delete(`/api/admin/categories/${id}`);
  return id;
};

// Upload multiple category images
export const uploadCategoryImagesApi = async (files) => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("files", file);
  });

  const res = await apiClient.post(
    "/api/admin/categories/upload-images",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  // Supports backend returning: ["url1", "url2"]
  if (Array.isArray(res.data)) {
    return res.data;
  }

  // Supports backend returning: { urls: ["url1", "url2"] }
  if (Array.isArray(res.data?.urls)) {
    return res.data.urls;
  }

  // Supports backend returning: { url: "url1" }
  if (typeof res.data?.url === "string") {
    return [res.data.url];
  }

  return [];
};