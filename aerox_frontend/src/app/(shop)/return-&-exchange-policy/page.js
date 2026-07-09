export const metadata = {
  title: "Return & Exchange Policy | Trendz AeroX",
  description:
    "Return and exchange policy for Trendz AeroX earbuds and smartwatches.",
};

const exclusions = [
  "Physical or accidental damage",
  "Liquid damage",
  "Misuse or improper charging",
  "Normal wear and tear",
  "Missing accessories or packaging",
];

export default function ReturnExchangePolicyPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <section className="bg-black px-5 py-20 text-white sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs uppercase tracking-[0.25em] text-white/50">
            Trendz AeroX Support
          </p>

          <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-6xl">
            Return & Exchange Policy
          </h1>

          <p className="mt-6 max-w-2xl leading-7 text-white/60">
            Eligible return or exchange requests must be raised within 7 days
            of delivery.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-black/40">
              Eligibility
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight">
              When a return is accepted
            </h2>

            <p className="mt-5 leading-7 text-black/60">
              Returns or exchanges are accepted only for products that are
              defective, damaged during delivery, incorrect, or different from
              what was ordered.
            </p>

            <p className="mt-4 leading-7 text-black/60">
              The product must be unused and returned with its original box,
              accessories, invoice, tags, manuals, and packaging.
            </p>

            <p className="mt-4 leading-7 text-black/60">
              An unboxing video and clear product photos are recommended for
              faster verification.
            </p>
          </div>

          <div className="border border-black/10 bg-[#f7f7f5] p-7 sm:p-9">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-black/40">
              Not eligible
            </p>

            <div className="mt-6 space-y-4">
              {exclusions.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 border-b border-black/10 pb-4 text-sm font-medium"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-black/20">
                    ×
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-black px-5 py-14 text-white sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-semibold">Earbuds & Wearables</h2>

          <p className="mt-4 max-w-3xl leading-7 text-white/60">
            Used earbuds and wearable products may not be accepted for hygiene
            reasons unless a verified manufacturing defect is found.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-16 text-center sm:px-8">
        <h2 className="text-3xl font-semibold tracking-tight">
          Inspection & Resolution
        </h2>

        <p className="mt-5 leading-7 text-black/60">
          Once the returned product is received and inspected, Trendz AeroX may
          approve an exchange, replacement, or refund as applicable.
        </p>

        <a
          href="/contact-us"
          className="mt-8 inline-flex bg-black px-7 py-3 text-sm font-semibold text-white transition hover:bg-black/80"
        >
          Contact Support
        </a>
      </section>
    </main>
  );
}