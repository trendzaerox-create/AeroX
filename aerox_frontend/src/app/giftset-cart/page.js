"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearGiftSetCart,
  clearGuestGiftSetCart,
  fetchGiftSetCart,
  loadGuestGiftSetCart,
  removeGiftSetCartItem,
  removeGuestGiftSetItem,
  syncGuestGiftSetCart,
} from "@/features/giftSet/giftSetSlice";
import SelectedGiftSetItems from "@/components/giftset/SelectedGiftSetItems";
import GiftSetSummary from "@/components/giftset/GiftSetSummary";
import Link from "next/link";

import { FiGift } from "react-icons/fi";



export default function GiftSetCartPage() {
  const dispatch = useDispatch();

  const { token, initialized: authInitialized } = useSelector((state) => state.auth);
  const { summary, loading, error } = useSelector((state) => state.giftSet);

  useEffect(() => {
    if (!authInitialized) return;

    if (token) {
      dispatch(syncGuestGiftSetCart()).finally(() => {
        dispatch(fetchGiftSetCart());
      });
      return;
    }

    dispatch(loadGuestGiftSetCart());
  }, [dispatch, token, authInitialized]);

  const items = summary?.items || [];
  const isEmpty = items.length === 0;

  const handleRemove = (itemKey) => {
    if (token) {
      dispatch(removeGiftSetCartItem(itemKey));
      return;
    }

    dispatch(removeGuestGiftSetItem(itemKey));
  };

  const handleClear = () => {
    if (token) {
      dispatch(clearGiftSetCart());
      return;
    }

    dispatch(clearGuestGiftSetCart());
  };

  if (!authInitialized) {
    return (
      <div className="min-h-screen overflow-hidden bg-[#f8f6f2]">
        <div className="relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,0,0,0.05),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(120,119,108,0.08),transparent_30%)]" />
          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl animate-pulse rounded-[32px] border border-white/70 bg-white/80 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
              <div className="h-3 w-28 rounded-full bg-gray-200" />
              <div className="mt-5 h-10 w-72 rounded-full bg-gray-200" />
              <div className="mt-4 h-4 w-full rounded-full bg-gray-100" />
              <div className="mt-2 h-4 w-10/12 rounded-full bg-gray-100" />
              <div className="mt-8 grid gap-4">
                <div className="h-28 rounded-[24px] bg-gray-100" />
                <div className="h-28 rounded-[24px] bg-gray-100" />
                <div className="h-28 rounded-[24px] bg-gray-100" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#f8f6f2] text-gray-900">
      <div className="relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(17,24,39,0.06),transparent_24%),radial-gradient(circle_at_top_right,rgba(120,113,108,0.10),transparent_22%),linear-gradient(to_bottom,rgba(255,255,255,0.96),rgba(245,245,244,0.92),rgba(241,245,249,0.88))]" />
        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-white/60 blur-3xl" />
        <div className="absolute right-0 top-24 h-80 w-80 rounded-full bg-stone-200/30 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-slate-200/30 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
          <div className="mb-8 overflow-hidden rounded-[34px] border border-white/70 bg-white/75 shadow-[0_25px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl">
            <div className="relative">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-300/70 to-transparent" />
              <div className="grid gap-6 px-6 py-7 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-center lg:px-10 lg:py-9">
                <div className="animate-[fadeInUp_0.6s_ease-out]">
                  <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-3 py-1.5 shadow-sm">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gray-600">
                      Gift Set Cart
                    </p>
                  </div>

                  <h1 className="mt-4 text-3xl font-bold tracking-[-0.03em] text-gray-950 sm:text-4xl">
                    Review your selected gift bundle
                  </h1>

                  <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600 sm:text-[15px]">
                    Check selected products, remove unwanted items, review your gift
                    set pricing, and continue with a smooth checkout flow.
                  </p>

                  <div className="mt-5 flex flex-wrap items-center gap-3 text-xs font-medium text-gray-500 sm:text-sm">
                    <span className="rounded-full border border-gray-200 bg-white px-3 py-1.5">
                      Premium gifting experience
                    </span>
                    <span className="rounded-full border border-gray-200 bg-white px-3 py-1.5">
                      Real-time cart review
                    </span>
                    <span className="rounded-full border border-gray-200 bg-white px-3 py-1.5">
                      Secure checkout ready
                    </span>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {error ? (
            <div className="mb-6 animate-[fadeInUp_0.45s_ease-out] rounded-[24px] border border-red-200/80 bg-red-50/90 px-5 py-4 shadow-sm backdrop-blur">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600">
                  !
                </div>
                <div>
                  <p className="text-sm font-semibold text-red-700">Something went wrong</p>
                  <p className="mt-1 text-sm text-red-600">{error}</p>
                </div>
              </div>
            </div>
          ) : null}

          <div className="grid gap-8 lg:grid-cols-[1.45fr_0.78fr] lg:items-start">
            <div className="animate-[fadeInUp_0.55s_ease-out]">
              <div className="overflow-hidden rounded-[34px] border border-white/80 bg-white/80 shadow-[0_20px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl">
                <div className="border-b border-gray-100/80 px-5 py-4 sm:px-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Selected Gift Set Items
                      </p>
                      <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                        {isEmpty
                          ? "No products added yet."
                          : `${items.length} item${items.length > 1 ? "s" : ""} currently in your gift set cart.`}
                      </p>
                    </div>

                    {!isEmpty ? (
                      <div className="rounded-full border border-gray-200 bg-stone-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-gray-600">
                        Cart Overview
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="p-4 sm:p-5">
                  {isEmpty ? (
                    <div className="relative overflow-hidden rounded-[28px] border border-dashed border-gray-300 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(248,250,252,0.95))] px-6 py-14 text-center shadow-inner">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.04),transparent_35%)]" />
                      <div className="relative mx-auto max-w-md">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm">
                          <FiGift className="text-[28px] text-gray-700" />
                        </div>

                        <h2 className="mt-5 text-xl font-bold tracking-tight text-gray-900">
                          Your gift set cart is empty
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-gray-600">
                          Start building a premium gift set by selecting products and
                          pairing them with a gift box.
                        </p>

                        <div className="mt-7">
                          <Link
                            href="/giftsets"
                            className="inline-flex items-center justify-center rounded-2xl bg-black px-6 py-3.5 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-900"
                          >
                            Go to Gift Set Builder
                          </Link>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="transition-all duration-300">
                      <SelectedGiftSetItems items={items} onRemove={handleRemove} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="animate-[fadeInUp_0.7s_ease-out]">
              <div className="sticky top-24">
                <div className="overflow-hidden rounded-[34px] border border-white/80 bg-white/70 shadow-[0_20px_70px_rgba(15,23,42,0.10)] backdrop-blur-xl">
                  <div className="border-b border-gray-100/80 px-5 py-4 sm:px-6">
                    <p className="text-sm font-semibold text-gray-900">Order Summary</p>
                    <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                      Review totals and proceed to checkout.
                    </p>
                  </div>

                  <div className="p-3 sm:p-4">
                    <GiftSetSummary
                      summary={summary}
                      loading={loading}
                      onClear={handleClear}
                      showCheckoutLink
                      mode="cart"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(18px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}