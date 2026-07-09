

"use client";

import Link from "next/link";
import ProductCard from "./ProductCard";

export default function NewArrivalSection({ products = [] }) {
  return (
    <section className="relative overflow-hidden border-t border-neutral-200 bg-[#fafafa]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,0,0,0.03),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(0,0,0,0.04),transparent_36%)]" />

      <div className="relative mx-auto max-w-[1280px] px-4 py-12 sm:px-6 sm:py-14 lg:px-10 lg:py-16">
        <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div className="animate-[fadeUp_0.7s_ease-out]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
              New Arrivals
            </p>

            <h2 className="mt-3 max-w-[720px] text-[28px] font-semibold tracking-[-0.03em] text-[#111111] sm:text-[34px] lg:text-[38px]">
              Fresh styles, just in
            </h2>
          </div>

          <Link
            href="/products"
            className="group hidden items-center text-[12px] font-semibold uppercase tracking-[0.14em] text-[#111111] transition-colors duration-300 hover:text-black sm:inline-flex"
          >
            <span className="relative">
              Shop New
              <span className="absolute -bottom-1 left-0 h-[1px] w-0 bg-black transition-all duration-300 group-hover:w-full" />
            </span>
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="animate-[fadeUp_0.8s_ease-out] rounded-[24px] border border-neutral-200 bg-white px-6 py-14 text-center text-[15px] text-neutral-500 shadow-[0_12px_30px_rgba(0,0,0,0.03)]">
            No products found.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-[fadeUp_0.8s_ease-out]"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: "both",
                  }}
                >
                  <div className="h-full">
                    <ProductCard product={product} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex sm:hidden">
              <Link
                href="/products"
                className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-neutral-300 bg-white px-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#111111] transition-all duration-300 hover:border-neutral-500 hover:bg-neutral-50"
              >
                Shop New
              </Link>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}