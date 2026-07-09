
import apiClient from "@/lib/apiClient";

export const fetchAddressesApi = async () => {
  const res = await apiClient.get("/api/addresses");
  return res.data;
};

export const createAddressApi = async (payload) => {
  const res = await apiClient.post("/api/addresses", payload);
  return res.data;
};

export const updateAddressApi = async ({ id, data }) => {
  const res = await apiClient.put(`/api/addresses/${id}`, data);
  return res.data;
};

export const deleteAddressApi = async (id) => {
  await apiClient.delete(`/api/addresses/${id}`);
  return id;
};

export const setDefaultAddressApi = async (id) => {
  const res = await apiClient.put(`/api/addresses/${id}/default`);
  return res.data;
};