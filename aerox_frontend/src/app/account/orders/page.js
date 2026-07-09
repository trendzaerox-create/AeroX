"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { fetchMyOrders } from "@/features/orders/orderSlice";
import { fetchMyGiftSetOrders } from "@/features/giftSet/giftSetSlice";

import { FaGift, FaShoppingBag, FaArrowRight } from "react-icons/fa";



function formatOrderDate(dateValue) {
  if (!dateValue) return "Recently placed";

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "Recently placed";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatPrice(amount) {
  return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
}

function getStatusClasses(status) {
  const value = String(status || "").toUpperCase();

  if (["DELIVERED", "COMPLETED"].includes(value)) {
    return "border-green-200 bg-green-50 text-green-700";
  }

  if (["SHIPPED", "OUT_FOR_DELIVERY"].includes(value)) {
    return "border-blue-200 bg-blue-50 text-blue-700";
  }

  if (["PROCESSING", "PENDING", "CONFIRMED"].includes(value)) {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  if (["CANCELLED", "FAILED"].includes(value)) {
    return "border-red-200 bg-red-50 text-red-700";
  }

  return "border-gray-200 bg-gray-50 text-gray-700";
}

function normalizeStatus(status) {
  if (!status) return "Pending";

  return String(status)
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function MyOrdersPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { orders: normalOrders = [], loading: normalLoading } = useSelector(
    (state) => state.orders
  );

  const { orders: giftOrders = [], loading: giftLoading } = useSelector(
    (state) => state.giftSet
  );

  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    dispatch(fetchMyOrders());
    dispatch(fetchMyGiftSetOrders());
  }, [dispatch]);

  const allOrders = useMemo(() => {
    const normal = normalOrders.map((o) => ({
      ...o,
      type: "NORMAL",
      date: o.createdAt,
    }));

    const gift = giftOrders.map((o) => ({
      ...o,
      type: "GIFT",
      date: o.createdAt,
    }));

    return [...normal, ...gift].sort(
      (a, b) => new Date(b.date || 0) - new Date(a.date || 0)
    );
  }, [normalOrders, giftOrders]);

  const filteredOrders = useMemo(() => {
    if (filter === "PRODUCTS") {
      return allOrders.filter((o) => o.type === "NORMAL");
    }

    if (filter === "GIFT") {
      return allOrders.filter((o) => o.type === "GIFT");
    }

    return allOrders;
  }, [filter, allOrders]);

  const loading = normalLoading || giftLoading;

  const handleOpen = (order) => {
    if (order.type === "GIFT") {
      router.push(`/account/giftset-orders/${order.id}`);
    } else {
      router.push(`/account/orders/${order.id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf8f4]">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6 rounded-[28px] border border-[#ece5da] bg-white p-6 shadow-[0_10px_35px_rgba(17,17,17,0.05)]">
            <div className="h-4 w-24 animate-pulse rounded bg-[#f2eee8]" />
            <div className="mt-4 h-10 w-56 animate-pulse rounded bg-[#f2eee8]" />
            <div className="mt-3 h-4 w-80 animate-pulse rounded bg-[#f2eee8]" />
          </div>

          <div className="mb-6 flex gap-2">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-10 w-28 animate-pulse rounded-full bg-white shadow-sm"
              />
            ))}
          </div>

          <div className="space-y-5">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="rounded-[28px] border border-[#ece5da] bg-white p-6 shadow-[0_10px_35px_rgba(17,17,17,0.05)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-3">
                    <div className="h-4 w-16 animate-pulse rounded bg-[#f2eee8]" />
                    <div className="h-6 w-28 animate-pulse rounded bg-[#f2eee8]" />
                    <div className="h-4 w-36 animate-pulse rounded bg-[#f2eee8]" />
                  </div>
                  <div className="h-8 w-24 animate-pulse rounded-full bg-[#f2eee8]" />
                </div>

                <div className="mt-6 space-y-3">
                  <div className="h-4 w-40 animate-pulse rounded bg-[#f2eee8]" />
                  <div className="h-14 w-full animate-pulse rounded-2xl bg-[#f7f4ef]" />
                  <div className="h-14 w-full animate-pulse rounded-2xl bg-[#f7f4ef]" />
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div className="h-6 w-24 animate-pulse rounded bg-[#f2eee8]" />
                  <div className="h-5 w-28 animate-pulse rounded bg-[#f2eee8]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!filteredOrders.length) {
    return (
      <div className="min-h-screen bg-[#faf8f4]">
        <div className="mx-auto flex max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="w-full rounded-[32px] border border-[#ece5da] bg-white px-6 py-14 text-center shadow-[0_12px_40px_rgba(17,17,17,0.06)] sm:px-10">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#f7f3ed] text-[#6f5a3d]">
  <FaShoppingBag size={28} />
</div>

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.28em] text-[#9a866a]">
              Order History
            </p>

            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-[#1b1b1b] sm:text-3xl">
              No orders found
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#6b7280]">
              Once a customer places a product order or gift set order, it will
              appear here in a clean unified order history.
            </p>

            <button
              onClick={() => router.push("/products")}
              className="mt-8 inline-flex items-center justify-center rounded-full bg-[#111111] px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f4]">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-[32px] border border-[#ece5da] bg-white/95 p-6 shadow-[0_12px_40px_rgba(17,17,17,0.06)] backdrop-blur sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9a866a]">
            Account
          </p>

          <div className="mt-3 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-[-0.03em] text-[#171717] sm:text-4xl">
                My Orders
              </h1>
              <p className="mt-2 text-sm leading-6 text-[#6b7280]">
                View all product orders and gift set orders in one elegant order
                history.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {["ALL", "PRODUCTS", "GIFT"].map((f) => {
                const isActive = filter === f;

                return (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`rounded-full px-4 py-2.5 text-sm font-medium transition ${
                      isActive
                        ? "bg-[#111111] text-white shadow-[0_8px_20px_rgba(17,17,17,0.16)]"
                        : "border border-[#e7dfd3] bg-white text-[#4b5563] hover:bg-[#faf6f1]"
                    }`}
                  >
                    {f === "ALL"
                      ? "All Orders"
                      : f === "PRODUCTS"
                      ? "Products"
                      : "Gift Sets"}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-5">
          {filteredOrders.map((order) => {
            const isGift = order.type === "GIFT";
            const previewItems = order.items?.slice(0, 2) || [];
            const moreItems =
              (order.items?.length || 0) > 2 ? order.items.length - 2 : 0;

            return (
              <div
                key={`${order.type}-${order.id}`}
                onClick={() => handleOpen(order)}
                className="group cursor-pointer overflow-hidden rounded-[28px] border border-[#ece5da] bg-white shadow-[0_10px_35px_rgba(17,17,17,0.05)] transition duration-300 hover:-translate-y-[1px] hover:shadow-[0_18px_50px_rgba(17,17,17,0.10)]"
              >
                <div className="border-b border-[#f1ebe2] px-5 py-4 sm:px-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9a866a]">
                        Order
                      </p>
                      <h3 className="mt-1 text-lg font-semibold tracking-[-0.02em] text-[#1b1b1b]">
                        #{order.id}
                      </h3>
                      <p className="mt-1 text-sm text-[#6b7280]">
                        Placed on {formatOrderDate(order.date)}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex rounded-full border px-3.5 py-1.5 text-xs font-medium ${getStatusClasses(
                          order.status
                        )}`}
                      >
                        {normalizeStatus(order.status)}
                      </span>

                      <span className="inline-flex items-center gap-2 rounded-full bg-[#f7f3ed] px-3.5 py-1.5 text-xs font-medium text-[#6f5a3d]">
  {isGift ? (
    <>
      <FaGift className="text-[12px]" />
      Gift Set Order
    </>
  ) : (
    <>
      <FaShoppingBag className="text-[12px]" />
      Product Order
    </>
  )}
</span>
                    </div>
                  </div>
                </div>

                <div className="px-5 py-5 sm:px-6">
                  {isGift ? (
                    <div className="space-y-4">
                      <div className="rounded-2xl border border-[#f0e8dc] bg-[#fcfaf7] p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9a866a]">
                          Box Selection
                        </p>
                        <p className="mt-1 text-sm font-medium text-[#1f1f1f]">
                          {order.giftBoxName || "Gift Box"}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-[#fafafa] p-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-medium text-[#1f1f1f]">
                            Included Items
                          </p>
                          <p className="text-sm text-[#6b7280]">
                            {order.items?.length || 0} item
                            {(order.items?.length || 0) !== 1 ? "s" : ""}
                          </p>
                        </div>

                        {order.discountPercent > 0 && (
                          <p className="mt-2 text-sm font-medium text-[#9a6a00]">
                            {order.discountPercent}% OFF applied
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {previewItems.length > 0 ? (
                        previewItems.map((item, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between rounded-2xl bg-[#fafafa] px-4 py-3"
                          >
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-[#1f1f1f]">
                                {item.productTitle || "Product"}
                              </p>
                              <p className="mt-1 text-xs text-[#6b7280]">
                                Quantity: {item.quantity || 1}
                              </p>
                            </div>

                            <p className="ml-3 text-sm font-medium text-[#111111]">
                              {formatPrice(
                                item.lineTotal ||
                                  item.lineTotalInr ||
                                  item.unitPrice ||
                                  item.unitPriceInr ||
                                  0
                              )}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="rounded-2xl bg-[#fafafa] px-4 py-3 text-sm text-[#6b7280]">
                          Product summary not available
                        </div>
                      )}

                      {moreItems > 0 && (
                        <p className="text-sm text-[#6b7280]">
                          +{moreItems} more item{moreItems > 1 ? "s" : ""}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-[#f1ebe2] px-5 py-4 sm:px-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9a866a]">
                      Total
                    </p>
                    <p className="mt-1 text-lg font-semibold text-[#111111]">
                      {formatPrice(order.totalAmountInr || order.finalTotalInr || 0)}
                    </p>
                  </div>

                  <span className="inline-flex items-center gap-2 rounded-full border border-[#e5ddd1] bg-white px-4 py-2 text-sm font-medium text-[#1f1f1f] transition group-hover:bg-[#faf6f1]">
                    View Details
                   <FaArrowRight className="transition group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}