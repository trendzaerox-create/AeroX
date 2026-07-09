
import apiClient from "@/lib/apiClient";

export const placeOrderApi = async (payload) => {
  const res = await apiClient.post("/api/orders", payload);
  return res.data;
};

export const fetchMyOrdersApi = async () => {
  const res = await apiClient.get("/api/orders");
  return res.data;
};

export const fetchMyOrderByIdApi = async (id) => {
  const res = await apiClient.get(`/api/orders/${id}`);
  return res.data;
};

export const fetchAdminOrdersApi = async () => {
  const res = await apiClient.get("/api/admin/orders");
  return res.data;
};

export const updateAdminOrderStatusApi = async ({
  id,
  status,
}) => {
  const res = await apiClient.put(
    `/api/admin/orders/${id}/status`,
    {
      status,
    }
  );

  return res.data;
};

export const updateAdminOrderShipmentApi = async ({
  id,
  courierName,
  trackingId,
  trackingUrl,
}) => {
  const res = await apiClient.put(
    `/api/admin/orders/${id}/shipment`,
    {
      courierName: courierName?.trim(),
      trackingId: trackingId?.trim(),
      trackingUrl: trackingUrl?.trim() || null,
    }
  );

  return res.data;
};