"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchProduct } from "@/features/products/productSlice";
import {
  clearBulkOrderSubmitState,
  createBulkOrderInquiry,
} from "@/features/bulkOrders/bulkOrderSlice";
import getImageUrl from "@/lib/getImageUrl";

export default function BulkOrderInquiryPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const productId = searchParams.get("productId");

  const { product, loading: productLoading } = useSelector(
    (state) => state.products
  );

  const {
    submitting,
    submitSuccess,
    error: submitError,
  } = useSelector((state) => state.bulkOrders);

  const [form, setForm] = useState({
    customerName: "",
    email: "",
    phone: "",
    companyName: "",
    quantity: 1,
    message: "",
  });

  const validProductId = useMemo(() => {
    return productId && !Number.isNaN(Number(productId)) ? Number(productId) : null;
  }, [productId]);

  useEffect(() => {
    dispatch(clearBulkOrderSubmitState());

    if (validProductId) {
      dispatch(fetchProduct(validProductId));
    }
  }, [dispatch, validProductId]);

  useEffect(() => {
    if (submitSuccess) {
      setForm({
        customerName: "",
        email: "",
        phone: "",
        companyName: "",
        quantity: 1,
        message: "",
      });

      const timer = setTimeout(() => {
        router.push("/bulk-order");
      }, 1200);

      return () => clearTimeout(timer);
    }
  }, [submitSuccess, router]);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Number(value) : value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!validProductId) return;

    dispatch(
      createBulkOrderInquiry({
        productId: validProductId,
        customerName: form.customerName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        companyName: form.companyName.trim(),
        quantity: Number(form.quantity),
        message: form.message.trim(),
      })
    );
  }

  const firstImage = product?.images?.[0];

  if (!validProductId) {
    return (
      <section className="min-h-screen bg-[#fafafa]">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-[28px] border border-neutral-200 bg-white px-6 py-14 text-center">
            <h1 className="text-[28px] font-semibold tracking-[-0.03em] text-[#111111]">
              Invalid Product
            </h1>
            <p className="mt-3 text-[15px] text-neutral-600">
              Please select a valid product before submitting a bulk inquiry.
            </p>
            <Link
              href="/bulk-order"
              className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-full bg-[#111111] px-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-white"
            >
              Back to Bulk Orders
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#fafafa]">
      <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 sm:py-12 lg:px-10 lg:py-14">
        <div className="mb-8">
          <Link
            href="/bulk-order"
            className="inline-flex items-center text-[12px] font-semibold uppercase tracking-[0.14em] text-neutral-600 transition-colors duration-300 hover:text-[#111111]"
          >
            ← Back to Bulk Order Products
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.05fr]">
          <div className="overflow-hidden rounded-[28px] border border-neutral-200 bg-white shadow-[0_18px_50px_rgba(0,0,0,0.04)]">
            {productLoading ? (
              <div className="flex min-h-[520px] items-center justify-center text-[15px] text-neutral-500">
                Loading selected product...
              </div>
            ) : !product ? (
              <div className="flex min-h-[520px] flex-col items-center justify-center px-6 text-center">
                <h2 className="text-[26px] font-semibold tracking-[-0.03em] text-[#111111]">
                  Product not found
                </h2>
                <p className="mt-3 max-w-[420px] text-[15px] leading-7 text-neutral-600">
                  The selected product could not be loaded. Please go back and try again.
                </p>
                <Link
                  href="/bulk-order"
                  className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-full bg-[#111111] px-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-white"
                >
                  Back to Bulk Orders
                </Link>
              </div>
            ) : (
              <>
                <div className="overflow-hidden bg-[#f5f5f5]">
                  {firstImage ? (
                    <img
                      src={getImageUrl(firstImage)}
                      alt={product.title}
                      className="h-[380px] w-full object-cover sm:h-[460px] lg:h-[560px]"
                    />
                  ) : (
                    <div className="flex h-[380px] items-center justify-center text-[14px] text-neutral-500 sm:h-[460px] lg:h-[560px]">
                      No Image
                    </div>
                  )}
                </div>

                <div className="p-5 sm:p-7">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                    Selected Product
                  </p>

                  <h1 className="mt-3 text-[28px] font-semibold tracking-[-0.03em] text-[#111111] sm:text-[34px]">
                    {product.title}
                  </h1>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <p className="text-[26px] font-semibold tracking-[-0.03em] text-[#111111]">
                      ₹{product.priceInr}
                    </p>

                    <span
                      className={`text-right text-[11px] font-semibold uppercase tracking-[0.1em] ${
                        product.stock === 0
                          ? "text-red-600"
                          : product.stock <= 5
                          ? "text-amber-600"
                          : "text-green-700"
                      }`}
                    >
                      {product.stock === 0
                        ? "Out of Stock"
                        : product.stock <= 5
                        ? `${product.stock} Left`
                        : "In Stock"}
                    </span>
                  </div>

                  <p className="mt-4 text-[15px] leading-7 text-neutral-600">
                    {product.description || "Premium product available for bulk inquiry."}
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="rounded-[28px] border border-neutral-200 bg-white p-5 shadow-[0_18px_50px_rgba(0,0,0,0.04)] sm:p-7">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Bulk Inquiry Form
            </p>

            <h2 className="mt-3 text-[30px] font-semibold tracking-[-0.04em] text-[#111111]">
              Share your requirement
            </h2>

            <p className="mt-3 text-[15px] leading-7 text-neutral-600">
              Fill in the details below and your request will be sent directly to admin.
            </p>

            {submitError ? (
              <div className="mt-5 rounded-[20px] border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-700">
                {submitError}
              </div>
            ) : null}

            {submitSuccess ? (
              <div className="mt-5 rounded-[20px] border border-green-200 bg-green-50 px-4 py-3 text-[14px] text-green-700">
                Your bulk inquiry has been sent successfully.
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.12em] text-neutral-600">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={form.customerName}
                    onChange={handleChange}
                    required
                    className="h-[52px] w-full rounded-[18px] border border-neutral-300 bg-white px-4 text-[14px] text-[#111111] outline-none transition-all duration-300 focus:border-neutral-500"
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.12em] text-neutral-600">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="h-[52px] w-full rounded-[18px] border border-neutral-300 bg-white px-4 text-[14px] text-[#111111] outline-none transition-all duration-300 focus:border-neutral-500"
                    placeholder="Enter email address"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.12em] text-neutral-600">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    className="h-[52px] w-full rounded-[18px] border border-neutral-300 bg-white px-4 text-[14px] text-[#111111] outline-none transition-all duration-300 focus:border-neutral-500"
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.12em] text-neutral-600">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={form.companyName}
                    onChange={handleChange}
                    className="h-[52px] w-full rounded-[18px] border border-neutral-300 bg-white px-4 text-[14px] text-[#111111] outline-none transition-all duration-300 focus:border-neutral-500"
                    placeholder="Enter company name"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.12em] text-neutral-600">
                  Quantity Required
                </label>
                <input
                  type="number"
                  name="quantity"
                  min="1"
                  value={form.quantity}
                  onChange={handleChange}
                  required
                  className="h-[52px] w-full rounded-[18px] border border-neutral-300 bg-white px-4 text-[14px] text-[#111111] outline-none transition-all duration-300 focus:border-neutral-500"
                  placeholder="Enter quantity"
                />
              </div>

              <div>
                <label className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.12em] text-neutral-600">
                  Message
                </label>
                <textarea
                  name="message"
                  rows={6}
                  value={form.message}
                  onChange={handleChange}
                  className="w-full rounded-[18px] border border-neutral-300 bg-white px-4 py-4 text-[14px] text-[#111111] outline-none transition-all duration-300 focus:border-neutral-500"
                  placeholder="Write your requirement"
                />
              </div>

              <button
                type="submit"
                disabled={submitting || productLoading || !product}
                className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-[#111111] px-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-all duration-300 hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Sending Inquiry..." : "Send Bulk Order Inquiry"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}