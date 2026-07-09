// src/app/(shop)/terms-and-conditions/page.js

import Link from "next/link";

export const metadata = {
  title: "Terms & Conditions | Trendz AeroX",
  description:
    "Read the Terms and Conditions governing the use of the Trendz AeroX website and purchases made through our official channels.",
};

const policies = [
  {
    name: "Shipping Policy",
    href: "/shipping-policy",
  },
  {
    name: "Return & Exchange Policy",
    href: "/return-exchange-policy",
  },
  {
    name: "Refund Policy",
    href: "/refund-policy",
  },
  {
    name: "Warranty Policy",
    href: "/warranty-policy",
  },
  {
    name: "Privacy Policy",
    href: "/privacy-policy",
  },
];

export default function TermsAndConditionsPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      {/* Hero */}
      <section className="border-b border-neutral-200 bg-neutral-950 text-white">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">
            Trendz AeroX
          </p>

          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Terms &amp; Conditions
          </h1>

          <p className="mt-6 max-w-2xl text-sm leading-7 text-neutral-300 sm:text-base">
            Please read these terms carefully before accessing our website or
            purchasing Trendz AeroX products.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[220px_1fr] lg:gap-16">
          {/* Sidebar */}
          <aside className="h-fit border-t border-black pt-5 lg:sticky lg:top-24">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">
              Legal Information
            </p>

            <p className="mt-4 text-sm leading-6 text-neutral-600">
              These terms apply to all visitors and customers using the Trendz
              AeroX website.
            </p>
          </aside>

          {/* Main Terms */}
          <article className="max-w-3xl">
            <div className="space-y-10">
              <PolicySection number="01" title="Acceptance of Terms">
                Welcome to Trendz AeroX. By accessing, browsing or purchasing
                from our website, you agree to follow these Terms &amp;
                Conditions. Trendz AeroX sells electronics, earbuds,
                smartwatches, gift boxes and related accessories through its
                official website and authorized channels.
              </PolicySection>

              <PolicySection number="02" title="Product Information">
                All product images, descriptions, prices, offers and
                availability may change without prior notice. We make reasonable
                efforts to display accurate information; however, minor
                differences in colour, packaging, design or appearance may occur
                because of screen settings, photography lighting or product
                updates.
              </PolicySection>

              <PolicySection number="03" title="Orders and Customer Details">
                Customers must provide complete and accurate personal, billing
                and shipping information while placing an order. Incorrect or
                incomplete details may result in processing or delivery delays.
              </PolicySection>

              <PolicySection number="04" title="Order Cancellation">
                Trendz AeroX reserves the right to cancel or reject orders
                suspected of fraud, incorrect pricing, stock unavailability,
                payment failure, unauthorized activity or misuse of promotional
                offers.
              </PolicySection>

              <PolicySection number="05" title="Applicable Policies">
                All disputes, claims, returns, refunds, cancellations and
                warranty requests will be handled according to the policies
                published on this website. By placing an order, customers also
                agree to the following policies.
              </PolicySection>
            </div>

            {/* Policy Links */}
            <div className="mt-10 border border-neutral-200 bg-neutral-50 p-5 sm:p-7">
              <h2 className="text-lg font-semibold tracking-tight">
                Related Policies
              </h2>

              <div className="mt-5 divide-y divide-neutral-200 border-y border-neutral-200">
                {policies.map((policy) => (
                  <Link
                    key={policy.name}
                    href={policy.href}
                    className="group flex items-center justify-between py-4 text-sm font-medium transition-colors hover:text-neutral-500"
                  >
                    <span>{policy.name}</span>

                    <span
                      aria-hidden="true"
                      className="transition-transform duration-200 group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Agreement Notice */}
            <div className="mt-10 border-l-2 border-black pl-5">
              <p className="text-sm leading-7 text-neutral-600">
                Continuing to use this website or completing a purchase confirms
                that you have read, understood and agreed to these Terms &amp;
                Conditions.
              </p>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}

function PolicySection({ number, title, children }) {
  return (
    <section className="border-b border-neutral-200 pb-10">
      <div className="flex items-start gap-4 sm:gap-6">
        <span className="pt-1 text-xs font-semibold tracking-widest text-neutral-400">
          {number}
        </span>

        <div>
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            {title}
          </h2>

          <p className="mt-4 text-sm leading-7 text-neutral-600 sm:text-[15px]">
            {children}
          </p>
        </div>
      </div>
    </section>
  );
}