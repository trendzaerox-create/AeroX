// src/app/(shop)/shipping-policy/page.js

export const metadata = {
  title: "Shipping Policy | Trendz AeroX",
  description:
    "Read the Trendz AeroX shipping policy, order processing times, delivery estimates and package handling guidelines.",
};

const policySections = [
  {
    number: "01",
    title: "Order Processing",
    content:
      "Orders are generally processed within 24 to 48 business hours after successful order confirmation and payment verification.",
  },
  {
    number: "02",
    title: "Estimated Delivery",
    content:
      "Delivery usually takes 3 to 7 business days, depending on the customer’s location, courier availability, weather conditions, public holidays and other external factors.",
  },
  {
    number: "03",
    title: "Tracking Details",
    content:
      "Once your order has been shipped, the tracking information will be shared through your registered email address or mobile number.",
  },
  {
    number: "04",
    title: "Delivery Information",
    content:
      "Customers must provide a complete address, correct PIN code, active mobile number and email address. Delays caused by incorrect details or customer unavailability are not the responsibility of Trendz AeroX.",
  },
];

export default function ShippingPolicyPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      {/* Header */}
      <header className="border-b border-black/10">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
          <a
            href="/"
            className="text-lg font-bold uppercase tracking-[0.2em] sm:text-xl"
          >
            Trendz AeroX
          </a>

          <a
            href="/"
            className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500 transition hover:text-black"
          >
            Back to store
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-black/10">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1fr_0.7fr] lg:px-12 lg:py-24">
          <div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
              Customer Information
            </p>

            <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Shipping Policy
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-7 text-neutral-600 sm:text-lg sm:leading-8">
              Trendz AeroX delivers products across serviceable locations in
              India through trusted courier partners, with secure processing
              and trackable delivery.
            </p>
          </div>

          <div className="flex items-end lg:justify-end">
            <div className="w-full max-w-sm border border-black bg-black p-6 text-white">
              <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">
                Standard delivery
              </p>

              <p className="mt-3 text-3xl font-semibold">3–7 Days</p>

              <p className="mt-3 text-sm leading-6 text-neutral-300">
                Estimated business days after your order has been processed and
                dispatched.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Policy Content */}
      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">
              Shipping Information
            </p>

            <h2 className="mt-4 max-w-sm text-2xl font-semibold leading-snug sm:text-3xl">
              What you should know before placing an order.
            </h2>
          </div>

          <div className="border-t border-black">
            {policySections.map((section) => (
              <article
                key={section.number}
                className="grid gap-4 border-b border-black/10 py-7 sm:grid-cols-[60px_190px_1fr] sm:gap-6"
              >
                <span className="text-xs font-semibold text-neutral-400">
                  {section.number}
                </span>

                <h3 className="text-base font-semibold">{section.title}</h3>

                <p className="text-sm leading-7 text-neutral-600 sm:text-base">
                  {section.content}
                </p>
              </article>
            ))}
          </div>
        </div>

        {/* Damaged Package Notice */}
        <div className="mt-14 border border-black bg-neutral-50 p-6 sm:p-8 lg:mt-20">
          <div className="grid gap-5 lg:grid-cols-[220px_1fr] lg:gap-10">
            <div>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-black text-sm font-semibold text-white">
                !
              </span>

              <h2 className="mt-5 text-xl font-semibold">Damaged Package</h2>
            </div>

            <div className="flex items-center">
              <p className="max-w-3xl text-sm leading-7 text-neutral-600 sm:text-base">
                If your package appears damaged, opened or tampered with at the
                time of delivery, please refuse the delivery or immediately
                contact our support team with clear photo or video proof.
              </p>
            </div>
          </div>
        </div>

        {/* Support */}
        <div className="mt-10 flex flex-col gap-5 border-t border-black/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Need shipping assistance?</h2>
            <p className="mt-2 text-sm text-neutral-500">
              Our support team can assist you with delivery and tracking
              concerns.
            </p>
          </div>

          <a
            href="/contact"
            className="inline-flex w-fit items-center justify-center bg-black px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-neutral-800"
          >
            Contact Support
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-7 text-xs text-neutral-500 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
          <p>© Trendz AeroX. All rights reserved.</p>
          <p>Secure shipping across serviceable locations in India.</p>
        </div>
      </footer>
    </main>
  );
}