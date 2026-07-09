import api from "../../lib/apiClient";

export const getProducts = () => {
  return api.get("/api/products");
};

export const getProduct = (id) => {
  return api.get(`/api/products/${id}`);
};