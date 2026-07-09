// src/app/(shop)/cancellation-policy/page.js

export const metadata = {
  title: "Cancellation Policy | Trendz AeroX",
  description:
    "Read the Trendz AeroX cancellation policy for order cancellations, prepaid refunds, and seller-initiated cancellations.",
};

export default function CancellationPolicyPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      {/* Header */}
      <header className="border-b border-neutral-200">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5 lg:px-8">
          <a
            href="/"
            className="text-lg font-semibold tracking-[0.16em] text-black"
          >
            TRENDZ AEROX
          </a>

          <a
            href="/"
            className="text-sm font-medium text-neutral-600 transition hover:text-black"
          >
            Back to Home
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-neutral-200 bg-neutral-50">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 lg:px-8 lg:py-20">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-neutral-500">
            Customer Support
          </p>

          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Cancellation Policy
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-neutral-600">
            Important information regarding order cancellations, prepaid
            refunds, and cancellations initiated by Trendz AeroX.
          </p>
        </div>
      </section>

      {/* Policy Content */}
      <section className="mx-auto w-full max-w-6xl px-6 py-14 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[240px_1fr]">
          {/* Sidebar */}
          <aside>
            <div className="border-l-2 border-black pl-5">
              <p className="text-sm font-semibold">Cancellation Policy</p>
              <p className="mt-2 text-sm leading-6 text-neutral-500">
                Applicable to orders placed through the official Trendz AeroX
                website.
              </p>
            </div>
          </aside>

          {/* Main Content */}
          <article className="max-w-3xl">
            <div className="space-y-10">
              <PolicySection number="01" title="Order Cancellation">
                Customers can request order cancellation before the product is
                shipped. Once an order is packed or dispatched, cancellation
                may not be possible. In such cases, the customer may need to
                follow the applicable return process after delivery.
              </PolicySection>

              <PolicySection number="02" title="Prepaid Order Refunds">
                For prepaid orders cancelled before dispatch, the refund will
                be initiated to the original payment method. Refund processing
                may take 5 to 7 business days, depending on the payment
                provider or bank.
              </PolicySection>

              <PolicySection number="03" title="Cancellation by Trendz AeroX">
                Trendz AeroX may cancel an order due to product unavailability,
                payment failure, incorrect pricing, incomplete address, courier
                restrictions, suspected fraud, or technical issues. If payment
                has already been received, the refund will be initiated
                according to the Refund Policy.
              </PolicySection>
            </div>

            {/* Important Note */}
            <div className="mt-12 border border-neutral-300 bg-neutral-50 p-6 sm:p-8">
              <h2 className="text-base font-semibold">Important Note</h2>
              <p className="mt-3 text-sm leading-7 text-neutral-600">
                Submitting a cancellation request does not guarantee immediate
                cancellation. The request will be accepted only if the order
                has not already entered the packing or shipping process.
              </p>
            </div>

            {/* Support */}
            <div className="mt-12 flex flex-col gap-5 border-t border-neutral-200 pt-8 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-semibold">
                  Need help with an order?
                </h2>
                <p className="mt-1 text-sm text-neutral-500">
                  Contact our support team with your order ID.
                </p>
              </div>

              <a
                href="/contact"
                className="inline-flex w-fit items-center justify-center bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
              >
                Contact Support
              </a>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}

function PolicySection({ number, title, children }) {
  return (
    <section className="border-b border-neutral-200 pb-10 last:border-b-0">
      <div className="flex items-start gap-5">
        <span className="pt-1 text-xs font-semibold tracking-widest text-neutral-400">
          {number}
        </span>

        <div>
          <h2 className="text-xl font-semibold tracking-tight">{title}</h2>

          <p className="mt-4 text-base leading-8 text-neutral-600">
            {children}
          </p>
        </div>
      </div>
    </section>
  );
}