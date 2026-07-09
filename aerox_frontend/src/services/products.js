import { apiFetch } from "@/lib/api";

export function listProducts(categoryId) {
  const q = categoryId ? `?categoryId=${categoryId}` : "";
  return apiFetch(`/api/products${q}`);
}