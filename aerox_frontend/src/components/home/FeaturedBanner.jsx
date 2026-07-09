"use client";

import Link from "next/link";

export default function FeaturedBanner() {
  return (
    <section className="relative overflow-hidden bg-[#f6f6f6]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.55),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(0,0,0,0.04),transparent_36%)]" />

      <div className="relative mx-auto grid max-w-[1280px] grid-cols-1 gap-8 px-4 py-12 sm:px-6 sm:py-14 lg:grid-cols-[1fr_1.1fr] lg:gap-12 lg:px-10 lg:py-16">
        <div className="group animate-[fadeUp_0.8s_ease-out] overflow-hidden rounded-[28px] border border-black/5 bg-white shadow-[0_14px_36px_rgba(0,0,0,0.04)]">
          <img
            src="/images/3.png"
            alt="Featured handbag"
            className="h-[300px] w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105 sm:h-[420px] lg:h-full"
          />
        </div>

        <div className="flex animate-[fadeUp_0.9s_ease-out] flex-col justify-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
            Featured Edit
          </p>

          <h2 className="mt-3 max-w-[520px] text-[30px] font-semibold leading-[1.08] tracking-[-0.03em] text-[#111111] sm:text-[38px] lg:text-[42px]">
            Handbags that transition from office hours to evening style.
          </h2>

          <p className="mt-5 max-w-[560px] text-[15px] leading-7 text-neutral-600 sm:text-[16px]">
            Clean silhouettes, polished details, and spacious interiors make
            these bags ideal for everyday luxury.
          </p>

          <div className="mt-8">
            <Link
              href="/products"
              className="group inline-flex min-h-[48px] items-center justify-center rounded-full bg-[#111111] px-6 text-[13px] font-semibold uppercase tracking-[0.14em] text-white transition-all duration-300 hover:scale-[1.02] hover:bg-black active:scale-[0.98]"
            >
              <span>Shop the Edit</span>
              <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>
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