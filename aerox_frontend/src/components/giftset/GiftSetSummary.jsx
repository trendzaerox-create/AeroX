


"use client";

import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export default function GiftSetSummary({
  summary,
  loading,
  onClear,
  showCheckoutLink = true,
  mode = "builder",
}) {
  const router = useRouter();
  const token = useSelector((state) => state.auth?.token);

  const safeSummary = summary || {
    items: [],
    totalProducts: 0,
    subtotalInr: 0,
    discountPercent: 0,
    discountAmountInr: 0,
    finalTotalInr: 0,
  };

  const disabled = loading || safeSummary.totalProducts === 0;

  const handlePrimaryAction = () => {
    if (safeSummary.totalProducts === 0) return;

    if (mode === "builder") {
      router.push("/giftset-cart");
      return;
    }

    if (!token) {
      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          "redirectAfterLogin",
          "/checkout?source=giftset"
        );
      }
      router.push("/login?next=%2Fcheckout%3Fsource%3Dgiftset");
      return;
    }

    router.push("/checkout?source=giftset");
  };

  return (
    <div className="sticky top-24 overflow-hidden rounded-[32px] border border-[#e8e8e8] bg-[linear-gradient(180deg,#ffffff_0%,#fafafa_100%)] shadow-[0_18px_55px_rgba(0,0,0,0.06)]">
      <div className="border-b border-[#efefef] bg-[linear-gradient(90deg,#fbfbfb_0%,#ffffff_50%,#fbfbfb_100%)] px-6 py-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-[#8a8a8a]">
              Order Overview
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-[0.01em] text-[#111]">
              Gift Set Summary
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#666]">
              Review your selected products, applied discount, and final payable
              amount.
            </p>
          </div>

          <div className="hidden rounded-full border border-[#ececec] bg-white px-4 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-[#555] shadow-sm sm:inline-flex">
            Premium Checkout
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-2xl border border-[#efefef] bg-white px-4 py-4">
            <span className="text-sm font-medium text-[#555]">Total Products</span>
            <span className="text-base font-semibold text-[#111]">
              {safeSummary.totalProducts}
            </span>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-[#efefef] bg-white px-4 py-4">
            <span className="text-sm font-medium text-[#555]">Subtotal</span>
            <span className="text-base font-semibold text-[#111]">
              ₹{safeSummary.subtotalInr}
            </span>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-green-200 bg-green-50/70 px-4 py-4">
            <div>
              <span className="text-sm font-medium text-green-700">
                Discount Applied
              </span>
              <p className="mt-1 text-xs text-green-600">
                {safeSummary.discountPercent}% gift set savings
              </p>
            </div>
            <span className="text-base font-semibold text-green-700">
              -₹{safeSummary.discountAmountInr}
            </span>
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-[26px] border border-black bg-[linear-gradient(135deg,#111111_0%,#1a1a1a_45%,#000000_100%)] text-white shadow-[0_15px_40px_rgba(0,0,0,0.18)]">
          <div className="px-5 py-5">
            <p className="text-[11px] uppercase tracking-[0.28em] text-white/65">
              Final Total
            </p>
            <div className="mt-2 flex items-end justify-between gap-3">
              <h3 className="text-3xl font-semibold tracking-tight">
                ₹{safeSummary.finalTotalInr}
              </h3>
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/80">
                Inclusive summary
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-white/75">
              A premium bundled total based on your selected products and gift
              box choices.
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <button
            type="button"
            onClick={onClear}
            disabled={disabled}
            className="inline-flex w-full items-center justify-center rounded-full border border-[#d8d8d8] bg-white px-5 py-3.5 text-sm font-medium text-[#222] transition duration-300 hover:border-black hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Processing..." : "Clear Gift Set"}
          </button>

          {showCheckoutLink ? (
            <button
              type="button"
              onClick={handlePrimaryAction}
              disabled={safeSummary.totalProducts === 0}
              className={`inline-flex w-full items-center justify-center rounded-full px-5 py-3.5 text-sm font-medium transition duration-300 ${
                safeSummary.totalProducts === 0
                  ? "cursor-not-allowed border border-[#e3e3e3] bg-[#f1f1f1] text-[#9b9b9b]"
                  : "border border-black bg-black text-white shadow-[0_12px_30px_rgba(0,0,0,0.16)] hover:-translate-y-[1px] hover:bg-[#111]"
              }`}
            >
              {mode === "builder" ? "Review Gift Set" : "Proceed to Checkout"}
            </button>
          ) : null}
        </div>

        <div className="mt-5 rounded-2xl border border-[#ededed] bg-white px-4 py-4">
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#8a8a8a]">
            Purchase Note
          </p>
          <p className="mt-2 text-sm leading-6 text-[#666]">
            You can continue exploring products before checkout. Login is only
            required when proceeding to complete your order.
          </p>
        </div>
      </div>
    </div>
  );
}