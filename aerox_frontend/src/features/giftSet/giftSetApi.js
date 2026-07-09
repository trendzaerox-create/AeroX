



import api from "@/lib/apiClient";

const giftSetApi = {
  getGiftSetCart: async () => {
    const res = await api.get("/api/giftset-cart");
    return res.data;
  },

  addGiftSetCartItem: async (payload) => {
    const res = await api.post("/api/giftset-cart/items", payload);
    return res.data;
  },

  removeGiftSetCartItem: async (itemId) => {
    const res = await api.delete(`/api/giftset-cart/items/${itemId}`);
    return res.data;
  },

  clearGiftSetCart: async () => {
    const res = await api.delete("/api/giftset-cart/clear");
    return res.data;
  },

  placeGiftSetOrder: async (payload) => {
    const res = await api.post("/api/giftset-checkout", payload);
    return res.data;
  },

  createGiftSetRazorpayOrder: async (payload) => {
    const res = await api.post("/api/giftset-checkout/razorpay/create-order", payload);
    return res.data;
  },

  verifyGiftSetRazorpayPayment: async (payload) => {
    const res = await api.post("/api/giftset-checkout/razorpay/verify", payload);
    return res.data;
  },

  fetchMyGiftSetOrders: async () => {
    const res = await api.get("/api/giftset-checkout/orders");
    return res.data;
  },

  fetchMyGiftSetOrderById: async (id) => {
    const res = await api.get(`/api/giftset-checkout/orders/${id}`);
    return res.data;
  },
};

export default giftSetApi;