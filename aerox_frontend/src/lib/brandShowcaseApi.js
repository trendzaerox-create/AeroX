import apiClient from "@/lib/apiClient";

export async function getBrandShowcases() {
  const { data } = await apiClient.get("/api/brand-showcases");
  return data;
}

export async function getBrandShowcase(id) {
  const { data } = await apiClient.get(`/api/brand-showcases/${id}`);
  return data;
}

export async function getAdminBrandShowcases() {
  const { data } = await apiClient.get("/api/admin/brand-showcases");
  return data;
}

export async function getAdminBrandShowcase(id) {
  const { data } = await apiClient.get(`/api/admin/brand-showcases/${id}`);
  return data;
}

export async function createBrandShowcase(payload) {
  const { data } = await apiClient.post("/api/admin/brand-showcases", payload);
  return data;
}

export async function updateBrandShowcase(id, payload) {
  const { data } = await apiClient.put(`/api/admin/brand-showcases/${id}`, payload);
  return data;
}

export async function deleteBrandShowcase(id) {
  await apiClient.delete(`/api/admin/brand-showcases/${id}`);
}

export async function getAllProductsForShowcase() {
  const { data } = await apiClient.get("/api/products");
  return data;
}