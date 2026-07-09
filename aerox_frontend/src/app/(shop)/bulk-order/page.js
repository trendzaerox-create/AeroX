"use client";

import { useEffect, useMemo, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { fetchProducts } from "@/features/products/productSlice";
import getImageUrl from "@/lib/getImageUrl";

function getProductImage(product) {
  const firstImage = product?.images?.[0];

  if (!firstImage) return "/placeholder.png";

  if (typeof firstImage === "string") {
    return getImageUrl(firstImage);
  }

  if (typeof firstImage === "object" && firstImage?.imageUrl) {
    return getImageUrl(firstImage.imageUrl);
  }

  return "/placeholder.png";
}

function getCategoryName(product) {
  if (typeof product?.category === "string") return product.category;
  if (product?.category?.name) return product.category.name;
  return "Uncategorized";
}

export default function BulkOrderPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { items: products, loading, error } = useSelector(
    (state) => state.products
  );

  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    let ignore = false;

    async function fetchCategories() {
      try {
        setLoadingCategories(true);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE || ""}/api/categories`,
          { cache: "no-store" }
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
    if (!categoryId) return products || [];

    const selectedId = Number(categoryId);

    const selectedCategory = categories.find(
      (c) => Number(c.id) === selectedId
    );

    return (products || []).filter((product) => {
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
  }, [products, categoryId, categories]);

  function goToInquiry(productId) {
    router.push(`/bulk-order/inquiry?productId=${productId}`);
  }

  function handleCardKeyDown(e, productId) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      goToInquiry(productId);
    }
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,0,0,0.03),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(0,0,0,0.04),transparent_34%)]" />

      <div className="relative mx-auto max-w-[1280px] px-4 py-10 sm:px-6 sm:py-12 lg:px-10 lg:py-14">
        <div className="overflow-hidden rounded-[30px] border border-neutral-200 bg-[#faf9f7] shadow-[0_18px_50px_rgba(0,0,0,0.05)]">
          <div className="grid gap-8 px-5 py-8 sm:px-8 sm:py-10 lg:grid-cols-[1.3fr_0.7fr] lg:px-10 lg:py-12">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-500">
                Bulk Orders
              </p>

              <h1 className="mt-3 max-w-[760px] text-[30px] font-semibold tracking-[-0.04em] text-[#111111] sm:text-[40px] lg:text-[50px]">
                Select a product and send your bulk order inquiry
              </h1>

              <p className="mt-4 max-w-[700px] text-[14px] leading-7 text-neutral-600 sm:text-[15px]">
                Perfect for corporate gifting, events, resellers, retail supply,
                boutiques, and business requirements.
              </p>
            </div>

            <div className="rounded-[26px] border border-neutral-200 bg-white p-5 shadow-[0_12px_30px_rgba(0,0,0,0.04)] sm:p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                How it works
              </p>

              <div className="mt-5 space-y-4">
                <div className="rounded-[20px] bg-[#f7f7f7] p-4">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#111111]">
                    Step 1
                  </p>
                  <p className="mt-2 text-[14px] leading-6 text-neutral-600">
                    Choose the product you want in bulk.
                  </p>
                </div>

                <div className="rounded-[20px] bg-[#f7f7f7] p-4">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#111111]">
                    Step 2
                  </p>
                  <p className="mt-2 text-[14px] leading-6 text-neutral-600">
                    Fill the inquiry form with quantity and business details.
                  </p>
                </div>

                <div className="rounded-[20px] bg-[#f7f7f7] p-4">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#111111]">
                    Step 3
                  </p>
                  <p className="mt-2 text-[14px] leading-6 text-neutral-600">
                    Admin receives your request with the selected product.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Product Collection
            </p>
            <h2 className="mt-3 text-[26px] font-semibold tracking-[-0.03em] text-[#111111] sm:text-[34px]">
              Choose product for inquiry
            </h2>
          </div>

          <div className="relative w-full sm:w-[280px]">
            <select
              value={categoryId}
              onChange={(e) =>
                setCategoryId(e.target.value ? Number(e.target.value) : "")
              }
              className="h-[52px] w-full appearance-none rounded-full border border-neutral-300 bg-white pl-5 pr-12 text-[14px] text-[#111111] outline-none transition-all duration-300 focus:border-neutral-500"
            >
              <option value="">
                {loadingCategories ? "Loading..." : "All Categories"}
              </option>

              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-neutral-500">
              <FiChevronDown size={16} />
            </span>
          </div>
        </div>

        {loading ? (
          <div className="mt-8 rounded-[24px] border border-neutral-200 bg-[#fafafa] px-6 py-14 text-center text-[15px] text-neutral-500">
            Loading products...
          </div>
        ) : error ? (
          <div className="mt-8 rounded-[24px] border border-red-200 bg-red-50 px-6 py-14 text-center text-[15px] text-red-600">
            {error}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="mt-8 rounded-[24px] border border-neutral-200 bg-[#fafafa] px-6 py-14 text-center text-[15px] text-neutral-500">
            No products found.
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-[fadeUp_0.8s_ease-out]"
                style={{
                  animationDelay: `${index * 80}ms`,
                  animationFillMode: "both",
                }}
              >
                <article
                  role="button"
                  tabIndex={0}
                  onClick={() => goToInquiry(product.id)}
                  onKeyDown={(e) => handleCardKeyDown(e, product.id)}
                  className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-[22px] border border-neutral-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,0.08)] focus:outline-none focus:ring-2 focus:ring-black/20"
                >
                  <div className="relative overflow-hidden bg-[#f5f5f5]">
                    <img
                      src={getProductImage(product)}
                      alt={product.title}
                      className="h-[220px] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] sm:h-[250px] lg:h-[270px]"
                    />

                    <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#111111] shadow-sm sm:left-4 sm:top-4 sm:text-[10px]">
                      Trendz Firenze
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-4 sm:p-5">
                    <h3 className="line-clamp-2 min-h-[48px] text-[16px] font-semibold leading-6 text-[#111111] sm:min-h-[52px] sm:text-[17px]">
                      {product.title}
                    </h3>

                    <div className="mt-3.5 flex items-end justify-between gap-3">
                      <p className="text-[22px] font-semibold tracking-[-0.02em] text-[#111111] sm:text-[24px]">
                        ₹{product.priceInr}
                      </p>

                      
                    </div>

                    <p className="mt-2.5 text-[12px] text-neutral-500">
                      Category: {getCategoryName(product)}
                    </p>

                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          goToInquiry(product.id);
                        }}
                        className="inline-flex min-h-[44px] w-full items-center justify-center rounded-full border border-neutral-300 bg-white px-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#111111] transition-all duration-300 hover:border-black hover:bg-black hover:text-white"
                      >
                        Request Bulk Order
                      </button>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
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