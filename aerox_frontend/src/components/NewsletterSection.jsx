"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearNewsletterState,
  subscribeNewsletter,
} from "@/features/newsletter/newsletterSlice";

export default function NewsletterSection() {
  const dispatch = useDispatch();
  const { loading, success, message, error } = useSelector(
    (state) => state.newsletter
  );

  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) return;

    const result = await dispatch(subscribeNewsletter(email));

    if (subscribeNewsletter.fulfilled.match(result)) {
      setEmail("");

      setTimeout(() => {
        dispatch(clearNewsletterState());
      }, 4000);
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,0,0,0.03),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(0,0,0,0.04),transparent_36%)]" />

      <div className="relative w-full px-4 py-14 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
        <div className="mx-auto w-full max-w-[920px] text-center">
          <div className="animate-[fadeUp_0.7s_ease-out]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Stay Updated
            </p>

            <h2 className="mt-3 text-[30px] font-semibold tracking-[-0.03em] text-[#111111] sm:text-[38px] lg:text-[42px]">
              Get early access to new arrivals and offers
            </h2>

            <p className="mx-auto mt-4 max-w-[620px] text-[15px] leading-7 text-neutral-600 sm:text-[16px]">
              Subscribe for product launches, styling drops, and special
              promotions from Trendz Firenze.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-8 flex w-full max-w-[620px] animate-[fadeUp_0.9s_ease-out] flex-col gap-3 sm:flex-row sm:items-center"
          >
            <div className="group relative flex-1">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (success || error) {
                    dispatch(clearNewsletterState());
                  }
                }}
                placeholder="Enter your email"
                className="h-[52px] w-full rounded-full border border-neutral-300 bg-white px-5 text-[14px] text-[#111111] outline-none transition-all duration-300 focus:border-neutral-500 focus:shadow-[0_10px_28px_rgba(0,0,0,0.06)]"
              />

              <span className="pointer-events-none absolute inset-y-0 right-5 hidden items-center text-neutral-400 transition-colors duration-300 group-focus-within:text-neutral-700 sm:flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-[16px] w-[16px]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5H4.5a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.918l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.916A2.25 2.25 0 012.25 6.993V6.75"
                  />
                </svg>
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group inline-flex h-[52px] items-center justify-center rounded-full bg-[#111111] px-7 text-[12px] font-semibold uppercase tracking-[0.14em] text-white transition-all duration-300 hover:scale-[1.02] hover:bg-black active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span>{loading ? "Subscribing..." : "Subscribe"}</span>
              {!loading && (
                <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              )}
            </button>
          </form>

          {success && (
            <p className="mt-4 text-[14px] font-medium text-green-700">
              {message}
            </p>
          )}

          {error && (
            <p className="mt-4 text-[14px] font-medium text-red-600">
              {error}
            </p>
          )}
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