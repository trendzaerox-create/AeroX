import Link from "next/link";
import { FiMail, FiPhone, FiClock, FiArrowRight } from "react-icons/fi";

export const metadata = {
  title: "Contact Us | Trendz Firenze",
  description:
    "Get in touch with Trendz Firenze for customer support, orders, sales, and bulk inquiries.",
};

const contactCards = [
  {
    icon: FiPhone,
    title: "Phone Support",
    value: "+91 91233 15539",
    href: "tel:+919123315539",
  },
  {
    icon: FiMail,
    title: "Customer Support",
    value: "support@trendzfirenze.com",
    href: "mailto:support@trendzfirenze.com",
  },
  {
    icon: FiMail,
    title: "Sales & Bulk Orders",
    value: "sales@trendzfirenze.com",
    href: "mailto:sales@trendzfirenze.com",
  },
  {
    icon: FiClock,
    title: "Working Hours",
    value: "Monday – Saturday: 10:00 AM – 7:00 PM\nSunday: Closed",
  },
];

export default function ContactPage() {
  return (
    <main className="bg-white text-[#111111]">
      <section className="mx-auto max-w-[1200px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="animate-[fadeUp_0.7s_ease-out]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7a7a7a]">
              Contact Us
            </p>

            <h1 className="mt-4 text-4xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-5xl lg:text-6xl">
              Get in touch with us.
            </h1>

            <div className="mt-8 max-w-2xl space-y-5 text-[15px] leading-8 text-[#555555] sm:text-[16px]">
              <p>
                We are here to assist you with any queries, orders, or support.
              </p>

              <p>
                Whether you need help with a purchase, want to ask about product
                details, or have sales and bulk order inquiries, our team is ready
                to support you.
              </p>

              <p>
                We aim to respond to all queries within 24 hours.
              </p>
            </div>

            <div className="mt-10 mb-14 flex flex-wrap gap-4 sm:mb-16">
              <a
                href="mailto:support@trendzfirenze.com"
                className="inline-flex items-center justify-center rounded-full bg-[#111111] px-6 py-3 text-[14px] font-medium text-white transition hover:bg-[#222222]"
              >
                Email Support
                <FiArrowRight className="ml-2 text-[16px]" />
              </a>

              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-full border border-[#d9d9d9] px-6 py-3 text-[14px] font-medium text-[#111111] transition hover:bg-[#f8f8f8]"
              >
                Shop Collection
              </Link>
            </div>
          </div>

          <div className="mt-6 lg:mt-0 animate-[fadeIn_0.9s_ease-out] rounded-[24px] border border-[#ececec] bg-[#fafafa] p-6 sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7a7a7a]">
              Support Information
            </p>

            <div className="mt-6 space-y-4">
              {contactCards.map((item, index) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="animate-[fadeUp_0.7s_ease-out] rounded-2xl border border-[#ededed] bg-white p-5"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#111111] text-white">
                        <Icon className="text-[18px]" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7a7a7a]">
                          {item.title}
                        </p>

                        {item.href ? (
                          <a
                            href={item.href}
                            className="mt-2 block break-words text-[16px] font-medium leading-7 text-[#222222] transition hover:text-black"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="mt-2 whitespace-pre-line text-[16px] leading-7 text-[#222222]">
                            {item.value}
                          </p>
                        )}
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
          <div className="grid gap-8 md:grid-cols-3">
            <div className="animate-[fadeUp_0.7s_ease-out]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7a7a7a]">
                Support
              </p>
              <h2 className="mt-3 text-[22px] font-semibold tracking-[-0.02em]">
                Quick assistance
              </h2>
              <p className="mt-3 text-[15px] leading-7 text-[#5a5a5a]">
                Reach out for help with orders, product questions, delivery
                concerns, and general customer support.
              </p>
            </div>

            <div className="animate-[fadeUp_0.7s_ease-out] [animation-delay:120ms]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7a7a7a]">
                Sales
              </p>
              <h2 className="mt-3 text-[22px] font-semibold tracking-[-0.02em]">
                Bulk order inquiries
              </h2>
              <p className="mt-3 text-[15px] leading-7 text-[#5a5a5a]">
                For collaborations, corporate gifting, or bulk purchase
                discussions, connect with our sales team directly.
              </p>
            </div>

            <div className="animate-[fadeUp_0.7s_ease-out] [animation-delay:240ms]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7a7a7a]">
                Response
              </p>
              <h2 className="mt-3 text-[22px] font-semibold tracking-[-0.02em]">
                Timely communication
              </h2>
              <p className="mt-3 text-[15px] leading-7 text-[#5a5a5a]">
                We aim to respond to all queries within 24 hours during working
                days.
              </p>
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