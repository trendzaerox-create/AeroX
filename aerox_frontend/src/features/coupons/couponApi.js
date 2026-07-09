"use client";

import apiClient from "@/lib/apiClient";

export const applyCouponApi = async ({ code, cartTotal }) => {
  const res = await apiClient.post("/api/coupons/apply", {
    code,
    cartTotal,
  });
  return res.data;
};