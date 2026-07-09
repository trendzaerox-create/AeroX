"use client";

import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-neutral-200 bg-white">
      
      {/* subtle luxury background glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,0,0,0.03),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(0,0,0,0.04),transparent_40%)]" />

      <div className="relative mx-auto grid max-w-[1280px] grid-cols-1 gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-2 lg:gap-12 lg:px-10 lg:py-16">
        
        {/* LEFT CONTENT */}
        <div className="flex flex-col justify-center animate-[fadeUp_0.8s_ease-out]">
          
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-500 sm:text-xs">
            Trendz Firenze
          </p>

          <h1 className="max-w-[620px] text-[32px] font-semibold leading-[1.08] tracking-[-0.03em] text-[#111111] sm:text-[42px] lg:text-[56px]">
            Luxury that moves with you.
          </h1>

          <p className="mt-5 max-w-[560px] text-[14px] leading-7 text-neutral-600 sm:text-[16px]">
            Elegant handbags inspired by timeless styling, designed for modern
            women who want functionality, confidence, and premium everyday
            fashion.
          </p>

          {/* BUTTONS */}
          <div className="mt-8 flex flex-wrap gap-3">
            
            <Link
              href="/products"
              className="group inline-flex min-h-[48px] items-center justify-center rounded-full bg-[#111111] px-6 text-[13px] font-semibold uppercase tracking-[0.14em] text-white transition-all duration-300 hover:scale-[1.03] hover:bg-black active:scale-[0.97]"
            >
              Shop Collection
            </Link>

            <Link
              href="/categories"
              className="group inline-flex min-h-[48px] items-center justify-center rounded-full border border-neutral-300 bg-white px-6 text-[13px] font-semibold uppercase tracking-[0.14em] text-[#111111] transition-all duration-300 hover:scale-[1.03] hover:border-neutral-500 active:scale-[0.97]"
            >
              Explore Categories
            </Link>

          </div>
        </div>

        {/* RIGHT IMAGES */}
        <div className="grid grid-cols-2 gap-4 sm:gap-5">
          
          {/* MAIN IMAGE */}
          <div className="group overflow-hidden rounded-[24px] bg-[#f6f6f6]">
            <img
              src="/images/8.png"
              alt="Trendz Firenze handbag"
              className="h-[280px] w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110 sm:h-[420px] lg:h-[520px]"
            />
          </div>

          <div className="flex flex-col gap-4 sm:gap-5">
            
            {/* SMALL IMAGE */}
            <div className="group overflow-hidden rounded-[24px] bg-[#f3f3f3]">
              <img
                src="/images/2.png"
                alt="Premium handbag"
                className="h-[132px] w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110 sm:h-[198px] lg:h-[248px]"
              />
            </div>

            {/* TEXT CARD */}
            <div className="flex flex-1 flex-col justify-between rounded-[24px] bg-[#f7f7f7] p-5 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] sm:p-6">
              
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                  New Season
                </p>

                <h3 className="mt-3 text-[22px] font-semibold leading-tight text-[#111111] sm:text-[28px]">
                  Refined essentials for work, travel, and everyday style.
                </h3>
              </div>

              <Link
                href="/products"
                className="group mt-6 inline-flex w-fit items-center text-[13px] font-semibold uppercase tracking-[0.14em] text-[#111111]"
              >
                Discover More
                <span className="ml-1 transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>

            </div>
          </div>
        </div>
      </div>

      {/* ANIMATION KEYFRAMES */}
      <style jsx>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(30px);
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