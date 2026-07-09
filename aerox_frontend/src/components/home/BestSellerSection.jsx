

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FiChevronDown } from "react-icons/fi";
import ProductCard from "./ProductCard";

export default function BestSellerSection({ products = [] }) {
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function fetchCategories() {
      try {
        setLoadingCategories(true);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE || ""}/api/categories`,
          {
            cache: "no-store",
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch categories");
        }

        const data = await res.json();

        const normalized = Array.isArray(data)
          ? data
          : Array.isArray(data?.content)
          ? data.content
          : Array.isArray(data?.data)
          ? data.data
          : [];

        if (!ignore) {
          setCategories(normalized);
        }
      } catch (error) {
        console.error("Category fetch error:", error);

        if (!ignore) {
          setCategories([]);
        }
      } finally {
        if (!ignore) {
          setLoadingCategories(false);
        }
      }
    }

    fetchCategories();

    return () => {
      ignore = true;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const selectedId = categoryId ? Number(categoryId) : null;

    const selectedCategory = selectedId
      ? categories.find((c) => Number(c.id) === selectedId)
      : null;

    const filtered = products.filter((product) => {
      if (!selectedId) return true;

      if (Number(product.categoryId) === selectedId) return true;
      if (Number(product.category?.id) === selectedId) return true;

      if (
        selectedCategory &&
        typeof product.category === "string" &&
        product.category.trim().toLowerCase() ===
          selectedCategory.name.trim().toLowerCase()
      ) {
        return true;
      }

      return false;
    });

    return [...filtered].sort((a, b) => {
      const orderA = Number(a.displayOrder ?? a.display_order ?? 999999);
      const orderB = Number(b.displayOrder ?? b.display_order ?? 999999);

      if (orderA !== orderB) {
        return orderA - orderB;
      }

      return Number(a.id) - Number(b.id);
    });
  }, [products, categoryId, categories]);

  const debugIds = filteredProducts.map((p) => p.id).join(", ");

  return (
    <section className="relative overflow-hidden bg-white">

      
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,0,0,0.03),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(0,0,0,0.04),transparent_34%)]" />

      <div className="relative mx-auto w-full max-w-[1280px] px-4 py-12 sm:px-6 sm:py-14 lg:max-w-full lg:px-3 lg:py-16 xl:px-4 2xl:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div className="animate-[fadeUp_0.7s_ease-out]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Our Collection
            </p>

            <h2 className="mt-3 max-w-[720px] text-[28px] font-semibold tracking-[-0.03em] text-[#111111] sm:text-[34px] lg:text-[38px]">
              Explore all products
            </h2>
          </div>

          <Link
            href="/products"
            className="group hidden items-center text-[12px] font-semibold uppercase tracking-[0.14em] text-[#111111] transition-colors duration-300 hover:text-black sm:inline-flex"
          >
            <span className="relative">
              View All
              <span className="absolute -bottom-1 left-0 h-[1px] w-0 bg-black transition-all duration-300 group-hover:w-full" />
            </span>
          </Link>
        </div>

        <div className="mb-8 sm:mb-10">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="animate-[fadeUp_0.8s_ease-out]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                Shop by Category
              </p>

              <h3 className="mt-3 text-[24px] font-semibold tracking-[-0.03em] text-[#111111] sm:text-[30px]">
                Find your signature style
              </h3>
            </div>

            <div className="relative w-full animate-[fadeUp_0.9s_ease-out] sm:w-[260px]">
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="h-[50px] w-full appearance-none rounded-full border border-neutral-300 bg-white pl-5 pr-12 text-[14px] text-[#111111] outline-none transition-all duration-300 focus:border-neutral-500 focus:shadow-[0_8px_24px_rgba(0,0,0,0.06)]"
              >
                <option value="">
                  {loadingCategories ? "Loading..." : "All Categories"}
                </option>

                {categories.map((c) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.name}
                  </option>
                ))}
              </select>

              <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-neutral-500">
                <FiChevronDown size={16} />
              </span>
            </div>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="animate-[fadeUp_0.8s_ease-out] rounded-[24px] border border-neutral-200 bg-[#fafafa] px-6 py-14 text-center text-[15px] text-neutral-500 shadow-[0_12px_30px_rgba(0,0,0,0.03)]">
            No products found.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-[fadeUp_0.8s_ease-out]"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: "both",
                  }}
                >
                  <div className="h-full">
                    <ProductCard product={product} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex sm:hidden">
              <Link
                href="/products"
                className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-neutral-300 bg-white px-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#111111] transition-all duration-300 hover:border-neutral-500 hover:bg-neutral-50"
              >
                View All
              </Link>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}