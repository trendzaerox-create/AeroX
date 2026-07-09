import api from "@/lib/apiClient";

const bulkOrderApi = {
  createBulkOrderInquiry: async (payload) => {
    const res = await api.post("/api/bulk-orders", payload);
    return res.data;
  },

  fetchAdminBulkOrders: async () => {
    const res = await api.get("/api/admin/bulk-orders");
    return res.data;
  },

  fetchAdminBulkOrderById: async (id) => {
    const res = await api.get(`/api/admin/bulk-orders/${id}`);
    return res.data;
  },

  updateAdminBulkOrderStatus: async (id, payload) => {
    const res = await api.put(`/api/admin/bulk-orders/${id}/status`, payload);
    return res.data;
  },

  deleteAdminBulkOrder: async (id) => {
  const res = await api.delete(`/api/admin/bulk-orders/${id}`);
  return res.data;
  },

};

export default bulkOrderApi;