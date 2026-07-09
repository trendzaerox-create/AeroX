"use client";

import { useRouter } from "next/navigation";

export default function ShiprocketButton({ orderId }) {
  const router = useRouter();

  if (!orderId) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => router.push(`/admin/orders/${orderId}/shiprocket`)}
      className="inline-flex min-h-10 items-center justify-center rounded-full bg-black px-4 text-sm font-semibold text-white transition hover:opacity-90"
    >
      Create Shiprocket
    </button>
  );
}
