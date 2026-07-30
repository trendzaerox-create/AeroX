import api from "@/lib/apiClient";

const BASE_PATH = "/api/admin/products";

export function getApiErrorMessage(error, fallback = "Request failed") {
  const data = error?.response?.data;

  if (typeof data === "string" && data.trim()) {
    return data.trim();
  }

  if (typeof data?.message === "string" && data.message.trim()) {
    return data.message.trim();
  }

  if (typeof data?.error === "string" && data.error.trim()) {
    return data.error.trim();
  }

  if (typeof error?.message === "string" && error.message.trim()) {
    return error.message.trim();
  }

  return fallback;
}

export async function getAdminProduct(productId) {
  const response = await api.get(`${BASE_PATH}/${productId}`);
  return response.data;
}

/**
 * @param {{
 *   query?: string;
 *   excludeProductId?: number | string | null;
 *   signal?: AbortSignal;
 * }} [options]
 */
export async function searchProductVariantCandidates(options = {}) {
  const { query = "", excludeProductId, signal } = options;
  const params = { q: query.trim() };

  if (excludeProductId !== null && excludeProductId !== undefined) {
    params.excludeProductId = excludeProductId;
  }

  const response = await api.get(`${BASE_PATH}/color-variant/candidates`, {
    params,
    signal,
  });

  return Array.isArray(response.data) ? response.data : [];
}

export async function linkProductColorVariant(productId, payload) {
  const response = await api.patch(
    `${BASE_PATH}/${productId}/color-variant/link`,
    payload,
  );

  return response.data;
}

export async function updateProductColorVariant(productId, payload) {
  const response = await api.patch(
    `${BASE_PATH}/${productId}/color-variant`,
    payload,
  );

  return response.data;
}

export async function removeProductColorVariant(productId) {
  const response = await api.delete(
    `${BASE_PATH}/${productId}/color-variant`,
  );

  return response.data;
}
