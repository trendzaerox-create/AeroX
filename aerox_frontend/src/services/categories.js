import { apiFetch } from "@/lib/api";

export function listCategories() {
  return apiFetch("/api/categories");
}