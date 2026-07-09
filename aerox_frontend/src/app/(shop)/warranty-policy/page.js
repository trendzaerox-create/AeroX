export const metadata = {
  title: "Warranty Policy | Trendz AeroX",
  description:
    "Read the Trendz AeroX warranty policy for electronics and accessories.",
};

const coveredItems = [
  "Manufacturing defects",
  "Internal technical issues",
  "Functional defects under normal usage",
];

const excludedItems = [
  "Physical or accidental damage",
  "Liquid damage beyond the rated resistance level",
  "Misuse, negligence, or unauthorized repairs",
  "Damage caused by incompatible charging adapters",
  "Normal wear, scratches, and dents",
];

const claimRequirements = [
  "Order ID and purchase invoice",
  "Registered mobile number or email address",
  "Clear photos or videos showing the issue",
];

export default function WarrantyPolicyPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      {/* Hero Section */}
      <section className="flex min-h-[430px] items-end bg-black py-16 text-white md:min-h-[500px] md:py-20">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
          <p className="mb-6 text-xs font-semibold uppercase tracking-[0.22em] text-neutral-400">
            Customer Support
          </p>

          <h1 className="max-w-4xl font-serif text-5xl font-normal leading-[0.95] tracking-[-0.04em] sm:text-7xl lg:text-8xl">
            Warranty Policy
          </h1>

          <p className="mt-8 max-w-2xl text-sm leading-7 text-neutral-300 sm:text-base">
            Trendz AeroX products purchased through our official website are
            covered under a limited brand warranty against eligible
            manufacturing defects.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          {/* Introduction */}
          <div className="grid gap-8 border-b border-neutral-200 pb-14 md:grid-cols-[0.8fr_1.2fr] md:gap-16 md:pb-20">
            <h2 className="max-w-md font-serif text-3xl leading-tight tracking-[-0.03em] sm:text-4xl lg:text-5xl">
              Our warranty commitment
            </h2>

            <p className="max-w-2xl text-sm leading-7 text-neutral-600 sm:text-base sm:leading-8">
              At Trendz AeroX, we are committed to delivering quality
              electronics and accessories designed for everyday use. Warranty
              coverage is subject to the period mentioned on the product page
              or purchase invoice.
            </p>
          </div>

          {/* Policy Cards */}
          <div className="grid border-b border-neutral-200 md:grid-cols-3">
            <PolicyCard
              number="01"
              title="What is covered"
              description="The warranty applies to eligible defects that occur while using the product normally."
              items={coveredItems}
            />

            <PolicyCard
              number="02"
              title="What is not covered"
              description="Damage caused by accidents, improper use, negligence, or external factors is not covered."
              items={excludedItems}
              middle
            />

            <PolicyCard
              number="03"
              title="How to claim"
              description="Contact our support team and provide the required purchase and product details."
              items={claimRequirements}
            />
          </div>

          {/* Resolution */}
          <div className="grid gap-8 border-b border-neutral-200 py-14 md:grid-cols-2 md:items-end md:gap-16 md:py-20">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                Claim resolution
              </p>

              <h2 className="max-w-lg font-serif text-3xl leading-tight tracking-[-0.03em] sm:text-4xl lg:text-5xl">
                Repair, replacement, or suitable support
              </h2>
            </div>

            <p className="max-w-xl text-sm leading-7 text-neutral-600 sm:text-base sm:leading-8">
              After verification, Trendz AeroX may offer a repair, replacement,
              or another suitable resolution depending on the product
              condition and availability.
            </p>
          </div>

          {/* Important Notice */}
          <div className="mt-14 grid gap-4 bg-neutral-100 p-6 sm:p-8 md:grid-cols-[140px_1fr] md:gap-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em]">
              Important
            </p>

            <p className="max-w-3xl text-sm leading-7 text-neutral-600">
              Warranty support is available only for genuine Trendz AeroX
              products purchased through our official website or authorized
              sales channels.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

function PolicyCard({
  number,
  title,
  description,
  items,
  middle = false,
}) {
  return (
    <article
      className={`py-10 md:min-h-[470px] md:py-14 ${
        middle
          ? "border-y border-neutral-200 md:border-x md:border-y-0 md:px-10"
          : "md:px-10 md:first:pl-0 md:last:pr-0"
      }`}
    >
      <p className="mb-8 text-xs font-semibold tracking-[0.18em] text-neutral-400 md:mb-12">
        {number}
      </p>

      <h2 className="font-serif text-2xl tracking-[-0.02em] sm:text-3xl">
        {title}
      </h2>

      <p className="mt-4 text-sm leading-7 text-neutral-600">
        {description}
      </p>

      <ul className="mt-7 space-y-4">
        {items.map((item) => (
          <li
            key={item}
            className="relative pl-5 text-sm leading-6 text-neutral-800"
          >
            <span className="absolute left-0 top-[9px] h-1.5 w-1.5 rounded-full bg-black" />
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}