import api from "@/lib/apiClient";

const cartApi = {
  getCart: async () => {
    const res = await api.get("/api/cart");
    return res.data;
  },

  addToCart: async (payload) => {
    const res = await api.post("/api/cart/items", payload);
    return res.data;
  },

  updateCartItem: async (itemId, payload) => {
    const res = await api.put(`/api/cart/items/${itemId}`, payload);
    return res.data;
  },

  removeCartItem: async (itemId) => {
    const res = await api.delete(`/api/cart/items/${itemId}`);
    return res.data;
  },

  clearCart: async () => {
    const res = await api.delete("/api/cart/clear");
    return res.data;
  },

  mergeCart: async (payload) => {
    const res = await api.post("/api/cart/merge", payload);
    return res.data;
  }
};

export default cartApi;