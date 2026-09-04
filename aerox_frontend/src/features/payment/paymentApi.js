// import apiClient from "@/lib/apiClient";

// export const createRazorpayOrderApi = async (payload) => {
//   const res = await apiClient.post("/api/payments/razorpay/create-order", payload);
//   return res.data;
// };

// export const verifyRazorpayPaymentApi = async (payload) => {
//   const res = await apiClient.post("/api/payments/razorpay/verify", payload);
//   return res.data;
// };












import apiClient from "@/lib/apiClient";

// Existing authenticated Standard Checkout APIs - left unchanged.
export const createRazorpayOrderApi = async (payload) => {
  const res = await apiClient.post("/api/payments/razorpay/create-order", payload);
  return res.data;
};

export const verifyRazorpayPaymentApi = async (payload) => {
  const res = await apiClient.post("/api/payments/razorpay/verify", payload);
  return res.data;
};

// New public guest Magic Checkout APIs.
export const createMagicCheckoutOrderApi = async (payload) => {
  const res = await apiClient.post(
    "/api/payments/razorpay/magic/create-order",
    payload,
  );
  return res.data;
};

export const verifyMagicCheckoutPaymentApi = async (payload) => {
  const res = await apiClient.post(
    "/api/payments/razorpay/magic/verify",
    payload,
  );
  return res.data;
};
