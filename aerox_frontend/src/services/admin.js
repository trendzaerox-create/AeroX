import { apiFetch } from "@/lib/api";

export function adminCreateCategory(token, name) {
  return apiFetch("/api/admin/categories", {
    method: "POST",
    token,
    body: JSON.stringify({ name }),
  });
}

export function adminCreateProduct(token, payload) {
  return apiFetch("/api/admin/products", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}