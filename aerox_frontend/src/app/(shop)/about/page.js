import Link from "next/link";
import { FiArrowRight, FiCheck } from "react-icons/fi";

export const metadata = {
  title: "About Us | Trendz Firenze",
  description:
    "Trendz Firenze is a modern luxury handbag brand inspired by timeless Italian elegance and crafted for everyday sophistication.",
};

const values = [
  "Elegant and minimal design language",
  "Premium materials and refined textures",
  "Functional compartments for real-life usage",
  "Affordable luxury for modern women",
];

export default function AboutPage() {
  return (
    <main className="bg-white text-[#111111]">
      <section className="mx-auto max-w-[1200px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7a7a7a]">
              About Trendz Firenze
            </p>

            <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-5xl lg:text-6xl">
              Modern luxury inspired by timeless Italian elegance.
            </h1>

            <div className="mt-8 max-w-2xl space-y-5 text-[15px] leading-8 text-[#555555] sm:text-[16px]">
              <p>
                Trendz Firenze is a modern luxury handbag brand inspired by
                timeless Italian elegance and crafted for everyday sophistication.
                We believe that a handbag is more than just an accessory it is
                a statement of confidence, style, and individuality.
              </p>

              <p>
                Our collections are designed to blend premium aesthetics with
                practical functionality, ensuring that every piece complements
                your daily lifestyle from work to travel, from casual outings
                to special occasions.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-full bg-[#111111] px-6 py-3 text-[14px] font-medium text-white transition hover:bg-[#222222]"
              >
                Explore Collection
                <FiArrowRight className="ml-2 text-[16px]" />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-[#d9d9d9] px-6 py-3 text-[14px] font-medium text-[#111111] transition hover:bg-[#f8f8f8]"
              >
                Contact Us
              </Link>
            </div>
          </div>

          <div className="rounded-[24px] border border-[#ececec] bg-[#fafafa] p-6 sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7a7a7a]">
              What We Stand For
            </p>

            <div className="mt-6 space-y-3">
              {values.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-[#ededed] bg-white px-4 py-4"
                >
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#111111] text-white">
                    <FiCheck className="text-[13px]" />
                  </span>
                  <p className="text-[14px] leading-6 text-[#333333]">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 border-t border-[#e9e9e9] pt-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7a7a7a]">
                Our Mission
              </p>
              <p className="mt-3 text-[16px] leading-7 text-[#222222]">
                To bring Italian-inspired luxury into everyday life.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#efefef] bg-[#fcfcfc]">
        <div className="mx-auto max-w-[1200px] px-5 py-14 sm:px-8 sm:py-16 lg:px-12">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7a7a7a]">
                Design
              </p>
              <h2 className="mt-3 text-[22px] font-semibold tracking-[-0.02em]">
                Elegant by intention
              </h2>
              <p className="mt-3 text-[15px] leading-7 text-[#5a5a5a]">
                Every detail is designed with a refined and minimal approach that
                feels premium, timeless, and versatile.
              </p>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7a7a7a]">
                Functionality
              </p>
              <h2 className="mt-3 text-[22px] font-semibold tracking-[-0.02em]">
                Made for real life
              </h2>
              <p className="mt-3 text-[15px] leading-7 text-[#5a5a5a]">
                Our handbags are created to support everyday routines with smart
                usability, practical compartments, and effortless styling.
              </p>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7a7a7a]">
                Luxury
              </p>
              <h2 className="mt-3 text-[22px] font-semibold tracking-[-0.02em]">
                Premium, yet accessible
              </h2>
              <p className="mt-3 text-[15px] leading-7 text-[#5a5a5a]">
                We believe modern women deserve handbags that look elevated,
                feel luxurious, and remain accessible for everyday wear.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}