import Link from "next/link";
import {
  FiRefreshCw,
  FiCheckCircle,
  FiRepeat,
  FiCreditCard,
  FiXCircle,
  FiMail,
  FiArrowRight,
} from "react-icons/fi";

export const metadata = {
  title: "Returns & Exchanges | Trendz Firenze",
  description:
    "Read the Trendz Firenze return and exchange policy, including eligibility, refunds, exchange conditions, and how to request support.",
};

const policySections = [
  {
    icon: FiCheckCircle,
    title: "Eligibility",
    items: [
      "Request must be raised within 7 days of delivery",
      "Product must be unused, unwashed, and in original condition",
      "Original packaging and tags must be intact",
    ],
  },
  {
    icon: FiRepeat,
    title: "Exchange",
    items: [
      "Exchanges are allowed for defective or damaged products",
      "Subject to product availability",
    ],
  },
  {
    icon: FiCreditCard,
    title: "Refunds",
    items: [
      "Refunds will be processed after product inspection",
      "Amount will be credited within 5–7 business days",
    ],
  },
  {
    icon: FiXCircle,
    title: "Non-Returnable Items",
    items: [
      "Used or damaged products",
      "Items without original packaging",
    ],
  },
];

const requestItems = ["Order ID", "Product images", "Reason for return"];

export default function ReturnsExchangesPage() {
  return (
    <main className="bg-white text-[#111111]">
      <section className="mx-auto max-w-[1200px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="animate-[fadeUp_0.7s_ease-out]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7a7a7a]">
              Returns & Exchanges
            </p>

            <h1 className="mt-4 text-4xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-5xl lg:text-6xl">
              Return & exchange policy.
            </h1>

            <div className="mt-8 max-w-2xl space-y-5 text-[15px] leading-8 text-[#555555] sm:text-[16px]">
              <p>
                We want you to love your purchase. If you are not completely
                satisfied, we offer a simple return and exchange process.
              </p>

              <p>
                Please review the policy carefully before raising a request so we
                can assist you as smoothly and quickly as possible.
              </p>
            </div>

            <div className="mt-10 mb-14 flex flex-wrap gap-4 sm:mb-16">
              <a
                href="mailto:support@trendzfirenze.com"
                className="inline-flex items-center justify-center rounded-full bg-[#111111] px-6 py-3 text-[14px] font-medium text-white transition hover:bg-[#222222]"
              >
                Request Support
                <FiArrowRight className="ml-2 text-[16px]" />
              </a>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-[#d9d9d9] px-6 py-3 text-[14px] font-medium text-[#111111] transition hover:bg-[#f8f8f8]"
              >
                Contact Us
              </Link>
            </div>
          </div>

          <div className="mt-6 lg:mt-0 animate-[fadeIn_0.9s_ease-out] rounded-[24px] border border-[#ececec] bg-[#fafafa] p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#111111] text-white">
                <FiRefreshCw className="text-[18px]" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7a7a7a]">
                  Policy Overview
                </p>
                <p className="mt-1 text-[18px] font-semibold text-[#111111]">
                  Simple and transparent support
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {policySections.map((section, index) => {
                const Icon = section.icon;

                return (
                  <div
                    key={section.title}
                    className="animate-[fadeUp_0.7s_ease-out] rounded-2xl border border-[#ededed] bg-white p-5"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#111111] text-white">
                        <Icon className="text-[17px]" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7a7a7a]">
                          {section.title}
                        </p>

                        <ul className="mt-3 space-y-2">
                          {section.items.map((item) => (
                            <li
                              key={item}
                              className="flex items-start gap-2 text-[15px] leading-7 text-[#333333]"
                            >
                              <span className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#111111]" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#efefef] bg-[#fcfcfc]">
        <div className="mx-auto max-w-[1200px] px-5 py-14 sm:px-8 sm:py-16 lg:px-12">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="animate-[fadeUp_0.7s_ease-out]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7a7a7a]">
                How to Request
              </p>
              <h2 className="mt-3 text-[28px] font-semibold tracking-[-0.02em] text-[#111111]">
                Start your return request by email.
              </h2>
              <p className="mt-4 max-w-xl text-[15px] leading-7 text-[#5a5a5a]">
                Email us at{" "}
                <a
                  href="mailto:support@trendzfirenze.com"
                  className="font-medium text-[#111111] underline underline-offset-4"
                >
                  support@trendzfirenze.com
                </a>{" "}
                with the required details so our team can review and guide you
                further.
              </p>
            </div>

            <div className="animate-[fadeIn_0.9s_ease-out] rounded-[24px] border border-[#ececec] bg-white p-6 sm:p-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7a7a7a]">
                Include these details
              </p>

              <div className="mt-5 grid gap-3">
                {requestItems.map((item, index) => (
                  <div
                    key={item}
                    className="animate-[fadeUp_0.7s_ease-out] flex items-center gap-3 rounded-2xl border border-[#ededed] bg-[#fafafa] px-4 py-4"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#111111] text-[12px] font-medium text-white">
                      {index + 1}
                    </span>
                    <p className="text-[15px] text-[#222222]">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes fadeUp {
          0% {
            opacity: 0;
            transform: translateY(24px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </main>
  );
}