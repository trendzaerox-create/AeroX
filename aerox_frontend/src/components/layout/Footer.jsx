
"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { HiOutlineMail } from "react-icons/hi";
import {
  clearNewsletterState,
  subscribeNewsletter,
} from "@/features/newsletter/newsletterSlice";

const customerServiceLinks = [
  { label: "My Account", href: "/account" },
  { label: "My Orders", href: "/account/orders" },
  {
    label: "Track Your Order",
    href: "https://www.delhivery.com/",
    external: true,
  },
  { label: "Returns & Exchanges", href: "/returns-exchanges" },
  { label: "Contact Us", href: "/contact" },
];

const trendzWorldLinks = [
  { label: "Corporate Order", href: "/bulk-order" },
  { label: "About Us", href: "/about" },
  { label: "Blog", href: "/blogs" },
  { label: "Our Stores", href: "/bestsellers" },
];

const policyLinks = [
  { label: "Warranty Policy", href: "/warranty-policy" },
  { label: "Return & Exchange Policy", href: "/return-&-exchange-policy" },
  { label: "Refund Policy", href: "/refund-policy" },
  { label: "Shipping Policy", href: "/shipping-policy" },
  
  { label: "Terms & Conditions", href: "/terms-&-conditions" },
  { label: "Cancellation Policy", href: "/cancellation-policy" },

];

const addressInfo = {
  corporateAddress:
    "1, Ho Chi Minh Sarani, Kankaria Estates, Park Street Area, Kolkata, West Bengal 700071, India",
  helpline: "+91 9123315539",
  timing: "10:00am to 6:00pm (Mon-Sat)",
  email: "support@trendzaerox.com",
};

const socialLinks = [
  {
    icon: FaFacebookF,
    href: "https://www.facebook.com/share/18PszxkWi3/",
    label: "Facebook",
  },
  { icon: FaXTwitter, href: "/", label: "X" },
  {
    icon: FaInstagram,
    href: "https://www.instagram.com/trendzaerox?igsh=MXVqY252eHNxZXQzcQ==",
    label: "Instagram",
  },
  {
    icon: FaYoutube,
    href: "https://youtube.com/@trendzaeroxofficial?si=nmbT0NJD-wtqIb8T",
    label: "YouTube",
  },
];

function FooterColumn({ title, links }) {
  return (
    <div className="min-w-0">
      <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-white sm:mb-5">
        {title}
      </h3>

      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.label}>
            {link.external ? (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-[13px] leading-[1.5] text-gray-400 transition-colors duration-200 hover:text-white sm:text-[14px]"
              >
                <span className="border-b border-transparent pb-[1px] transition-all duration-200 hover:border-white/40">
                  {link.label}
                </span>
              </a>
            ) : (
              <Link
                href={link.href}
                className="inline-flex items-center text-[13px] leading-[1.5] text-gray-400 transition-colors duration-200 hover:text-white sm:text-[14px]"
              >
                <span className="border-b border-transparent pb-[1px] transition-all duration-200 hover:border-white/40">
                  {link.label}
                </span>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function AddressColumn() {
  return (
    <div className="min-w-0">
      <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-white sm:mb-5">
        Address
      </h3>

      <div className="space-y-4 text-[13px] leading-[1.6] text-gray-400 sm:text-[14px]">
        <div>
          <span className="mb-1 block font-semibold text-white">
            Corporate Address
          </span>
          <p>{addressInfo.corporateAddress}</p>
        </div>

        <div>
          <span className="mb-1 block font-semibold text-white">
            Helpline Number
          </span>
          <a
            href={`tel:${addressInfo.helpline.replace(/\s/g, "")}`}
            className="border-b border-white/30 transition-colors duration-200 hover:text-white"
          >
            {addressInfo.helpline}
          </a>
        </div>

        <div>
          <span className="mb-1 block font-semibold text-white">
            Operational Timing
          </span>
          <p>{addressInfo.timing}</p>
        </div>

        <div>
          <span className="mb-1 block font-semibold text-white">
            Support Email
          </span>
          <a
            href={`mailto:${addressInfo.email}`}
            className="border-b border-white/30 transition-colors duration-200 hover:text-white"
          >
            {addressInfo.email}
          </a>
        </div>
      </div>
    </div>
  );
}

function NewsletterForm() {
  const dispatch = useDispatch();

  const { loading, success, message, error } = useSelector(
    (state) => state.newsletter
  );

  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) return;

    const result = await dispatch(subscribeNewsletter(email.trim()));

    if (subscribeNewsletter.fulfilled.match(result)) {
      setEmail("");

      setTimeout(() => {
        dispatch(clearNewsletterState());
      }, 4000);
    }
  };

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-[760px] flex-col gap-3 sm:flex-row"
      >
        <div className="relative flex-1">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);

              if (success || error) {
                dispatch(clearNewsletterState());
              }
            }}
            placeholder="Enter your email"
            className="h-[52px] w-full rounded-full border border-white/20 bg-white px-5 pr-12 text-[14px] text-black outline-none transition-all duration-200 placeholder:text-gray-500 focus:border-white"
          />

          <HiOutlineMail className="absolute right-5 top-1/2 -translate-y-1/2 text-[18px] text-gray-500" />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="h-[52px] rounded-full bg-white px-8 text-[12px] font-bold uppercase tracking-[0.18em] text-black transition-all duration-200 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-70 sm:min-w-[165px]"
        >
          {loading ? "Subscribing..." : "Subscribe →"}
        </button>
      </form>

      {success && (
        <p className="mt-3 text-[13px] font-medium text-green-400">
          {message || "Thank you for subscribing to Trendz AeroX."}
        </p>
      )}

      {error && (
        <p className="mt-3 text-[13px] font-medium text-red-400">{error}</p>
      )}
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="relative w-full overflow-hidden border-t border-white/10 bg-black">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.05),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.03),transparent_40%)]" />

      <div className="relative w-full px-4 py-8 sm:px-6 sm:py-10 md:px-8 lg:px-10 xl:px-14 2xl:px-20">
        <div className="grid grid-cols-1 gap-10 border-b border-white/10 pb-8 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-9">
            <div className="mb-3">
              <img
                src="/images/logo/TrendzAeroXLogo.png"
                alt="Trendz AeroX"
                className="h-[52px] w-auto object-contain transition-all duration-500 ease-out group-hover:scale-[1.05] group-hover:opacity-90 sm:h-[56px]"
              />
            </div>

            <div className="mb-10">
              <NewsletterForm />
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 lg:gap-10">
              <FooterColumn
                title="Customer Service"
                links={customerServiceLinks}
              />
              <FooterColumn title="Trendz AeroX" links={trendzWorldLinks} />
              <FooterColumn title="Policies" links={policyLinks} />
            </div>
          </div>

          <div className="lg:col-span-3">
            <AddressColumn />
          </div>
        </div>

        <div className="flex flex-col gap-5 pt-6 sm:gap-6 sm:pt-7">
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {socialLinks.map((item) => {
              const Icon = item.icon;

              return (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5 text-[14px] text-gray-300 transition-all duration-200 hover:border-white hover:bg-white hover:text-black"
                >
                  <Icon />
                </a>
              );
            })}
          </div>

          <p className="text-[12px] font-medium tracking-[0.08em] text-gray-400">
            <Link href="/test" className="transition duration-300 hover:text-white">
              ©
            </Link>{" "}
            2026 — Trendz AeroX
          </p>
        </div>
      </div>
    </footer>
  );
}