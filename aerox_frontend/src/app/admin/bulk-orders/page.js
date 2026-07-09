"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdminBulkOrders,
  updateAdminBulkOrderStatus,
  deleteAdminBulkOrder,
} from "@/features/bulkOrders/bulkOrderSlice";
import getImageUrl from "@/lib/getImageUrl";

export default function AdminBulkOrdersPage() {
  const dispatch = useDispatch();

  const { items, loading, error } = useSelector((state) => state.bulkOrders);

  useEffect(() => {
    dispatch(fetchAdminBulkOrders());
  }, [dispatch]);

  function handleStatusChange(id, status) {
    dispatch(updateAdminBulkOrderStatus({ id, status }));
  }

  function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this bulk inquiry?"
    );

    if (!confirmed) return;

    dispatch(deleteAdminBulkOrder(id));
  }

  return (
    <section className="min-h-screen bg-[#f7f7f7]">
      <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-[28px] border border-neutral-200 bg-white p-6 shadow-[0_16px_40px_rgba(0,0,0,0.04)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
            Admin
          </p>
          <h1 className="mt-3 text-[30px] font-semibold tracking-[-0.04em] text-[#111111]">
            Bulk Order Inquiries
          </h1>
          <p className="mt-2 text-[14px] text-neutral-600">
            View all customer bulk order requests with selected product details.
          </p>
        </div>

        {loading ? (
          <div className="rounded-[24px] border border-neutral-200 bg-white px-6 py-14 text-center text-neutral-500">
            Loading inquiries...
          </div>
        ) : error ? (
          <div className="rounded-[24px] border border-red-200 bg-red-50 px-6 py-14 text-center text-red-600">
            {error}
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-[24px] border border-neutral-200 bg-white px-6 py-14 text-center text-neutral-500">
            No bulk inquiries found.
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <article
                key={item.id}
                className="grid gap-4 rounded-[28px] border border-neutral-200 bg-white p-4 shadow-[0_12px_30px_rgba(0,0,0,0.03)] md:grid-cols-[150px_1fr_auto]"
              >
                <div className="overflow-hidden rounded-[22px] bg-[#f5f5f5]">
                  <img
                    src={
                      item.productImageUrl
                        ? getImageUrl(item.productImageUrl)
                        : "/placeholder.png"
                    }
                    alt={item.productTitle}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div>
                  <h2 className="text-[20px] font-semibold text-[#111111]">
                    {item.productTitle}
                  </h2>

                  <p className="mt-1 text-[14px] font-medium text-neutral-600">
                    Product Price: ₹{item.productPriceInr}
                  </p>

                  <div className="mt-4 grid gap-2 text-[14px] text-neutral-700 sm:grid-cols-2">
                    <p>
                      <span className="font-semibold text-[#111111]">Customer:</span>{" "}
                      {item.customerName}
                    </p>
                    <p>
                      <span className="font-semibold text-[#111111]">Email:</span>{" "}
                      {item.email}
                    </p>
                    <p>
                      <span className="font-semibold text-[#111111]">Phone:</span>{" "}
                      {item.phone}
                    </p>
                    <p>
                      <span className="font-semibold text-[#111111]">Company:</span>{" "}
                      {item.companyName || "-"}
                    </p>
                    <p>
                      <span className="font-semibold text-[#111111]">Quantity:</span>{" "}
                      {item.quantity}
                    </p>
                    <p>
                      <span className="font-semibold text-[#111111]">Status:</span>{" "}
                      {item.status}
                    </p>
                  </div>

                  <div className="mt-4 rounded-[18px] bg-[#fafafa] p-4 ring-1 ring-neutral-200">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-neutral-500">
                      Message
                    </p>
                    <p className="mt-2 text-[14px] leading-6 text-neutral-700">
                      {item.message || "No message provided."}
                    </p>
                  </div>

                  <p className="mt-4 text-[12px] text-neutral-500">
                    Submitted: {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleStatusChange(item.id, "NEW")}
                    className="inline-flex min-h-[42px] items-center justify-center rounded-full border border-neutral-300 bg-white px-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#111111] transition-all duration-300 hover:border-black"
                  >
                    Mark New
                  </button>

                  <button
                    onClick={() => handleStatusChange(item.id, "CONTACTED")}
                    className="inline-flex min-h-[42px] items-center justify-center rounded-full border border-neutral-300 bg-white px-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#111111] transition-all duration-300 hover:border-black"
                  >
                    Contacted
                  </button>

                  <button
                    onClick={() => handleStatusChange(item.id, "CLOSED")}
                    className="inline-flex min-h-[42px] items-center justify-center rounded-full border border-neutral-300 bg-white px-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#111111] transition-all duration-300 hover:border-black"
                  >
                    Closed
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="inline-flex min-h-[42px] items-center justify-center rounded-full border border-red-300 bg-red-50 px-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-red-700 transition-all duration-300 hover:bg-red-600 hover:text-white"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}