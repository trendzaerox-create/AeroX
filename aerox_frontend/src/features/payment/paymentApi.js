import apiClient from "@/lib/apiClient";

export const createRazorpayOrderApi = async (payload) => {
  const res = await apiClient.post("/api/payments/razorpay/create-order", payload);
  return res.data;
};

export const verifyRazorpayPaymentApi = async (payload) => {
  const res = await apiClient.post("/api/payments/razorpay/verify", payload);
  return res.data;
};