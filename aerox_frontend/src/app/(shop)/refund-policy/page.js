// src/app/(shop)/refund-policy/page.js

export const metadata = {
  title: "Refund Policy | Trendz AeroX",
  description:
    "Read the Trendz AeroX refund policy, including refund eligibility, processing time, cancellations, and non-refundable charges.",
};

const policySections = [
  {
    number: "01",
    title: "Refund Eligibility",
    description:
      "Refunds are processed only after the returned product passes our quality inspection and the return request is approved by Trendz AeroX.",
  },
  {
    number: "02",
    title: "Refund Method",
    description:
      "Once approved, the refund will be initiated to the original payment method used when placing the order.",
  },
  {
    number: "03",
    title: "Processing Time",
    description:
      "Refunds may take 5 to 7 business days after approval, depending on the payment gateway, bank, or card provider.",
  },
  {
    number: "04",
    title: "Order Cancellation",
    description:
      "Prepaid orders cancelled before dispatch will be refunded to the original payment method. Orders already shipped will be handled according to our Return & Exchange Policy.",
  },
];

export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      {/* Hero */}
      <section className="border-b border-black/10">
        <div className="mx-auto max-w-6xl px-6 pb-14 pt-24 sm:px-8 sm:pb-20 sm:pt-32 lg:px-10">
          <div className="max-w-3xl">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500">
              Trendz AeroX Policies
            </p>

            <h1 className="text-4xl font-medium tracking-tight sm:text-5xl lg:text-6xl">
              Refund Policy
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-neutral-600 sm:text-lg">
              Clear information about refund eligibility, processing timelines,
              payment methods, and order cancellations.
            </p>
          </div>
        </div>
      </section>

      {/* Policy content */}
      <section>
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-14 sm:px-8 sm:py-20 lg:grid-cols-[0.65fr_1.35fr] lg:gap-20 lg:px-10">
          {/* Left side */}
          <aside>
            <div className="lg:sticky lg:top-24">
              <p className="text-sm font-medium">Important information</p>

              <p className="mt-4 max-w-sm text-sm leading-7 text-neutral-500">
                Refund approval is subject to product inspection and compliance
                with the return conditions.
              </p>

              <div className="mt-8 inline-flex items-center gap-3 border border-black px-4 py-3">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path
                    d="M12 3V21M7.5 7.5L12 3L16.5 7.5M7.5 16.5L12 21L16.5 16.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <span className="text-xs font-semibold uppercase tracking-[0.16em]">
                  5–7 business days
                </span>
              </div>
            </div>
          </aside>

          {/* Right side */}
          <div>
            <div className="divide-y divide-black/10 border-y border-black/10">
              {policySections.map((section) => (
                <article
                  key={section.number}
                  className="grid gap-4 py-8 sm:grid-cols-[60px_1fr] sm:gap-6"
                >
                  <span className="text-xs font-semibold tracking-[0.15em] text-neutral-400">
                    {section.number}
                  </span>

                  <div>
                    <h2 className="text-xl font-medium tracking-tight">
                      {section.title}
                    </h2>

                    <p className="mt-3 text-sm leading-7 text-neutral-600 sm:text-base">
                      {section.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            {/* Charges */}
            <div className="mt-10 bg-neutral-950 p-7 text-white sm:p-9">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-400">
                Non-refundable charges
              </p>

              <p className="mt-4 text-sm leading-7 text-neutral-300 sm:text-base">
                Shipping charges, COD charges, convenience fees, and handling
                charges may be non-refundable unless the return is caused by an
                error from Trendz AeroX.
              </p>
            </div>

            {/* Rejection conditions */}
            <div className="mt-10 rounded-sm border border-black/10 bg-neutral-50 p-7 sm:p-9">
              <h2 className="text-xl font-medium tracking-tight">
                Refund claim rejection
              </h2>

              <p className="mt-4 text-sm leading-7 text-neutral-600 sm:text-base">
                Trendz AeroX reserves the right to reject a refund claim when
                the returned product is used, damaged, altered, missing
                accessories, or does not match its original order condition.
              </p>
            </div>

            <p className="mt-8 text-xs leading-6 text-neutral-400">
              Refund timelines may vary depending on your bank, card issuer, or
              payment service provider.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}