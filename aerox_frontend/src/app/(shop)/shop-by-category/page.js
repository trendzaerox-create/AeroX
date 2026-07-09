"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/home/ProductCard";

export default function ShopByCategoryPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [categoriesRes, productsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/categories`, {
            cache: "no-store",
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/products`, {
            cache: "no-store",
          }),
        ]);

        if (!categoriesRes.ok) {
          throw new Error("Failed to fetch categories");
        }

        if (!productsRes.ok) {
          throw new Error("Failed to fetch products");
        }

        const categoriesData = await categoriesRes.json();
        const productsData = await productsRes.json();

        const finalCategories = Array.isArray(categoriesData)
          ? categoriesData
          : Array.isArray(categoriesData.categories)
          ? categoriesData.categories
          : Array.isArray(categoriesData.content)
          ? categoriesData.content
          : [];

        const finalProducts = Array.isArray(productsData)
          ? productsData
          : Array.isArray(productsData.products)
          ? productsData.products
          : Array.isArray(productsData.content)
          ? productsData.content
          : [];

        setCategories(finalCategories);
        setProducts(finalProducts);
      } catch (error) {
        console.error("Error loading category/products:", error);
        setCategories([]);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const normalizedCategories = useMemo(() => {
    return categories.map((category) => ({
      id:
        category.id ||
        category.name ||
        category.title ||
        category.slug ||
        Math.random(),
      name: category.name || category.title || category.slug || "Unnamed",
      description:
        category.description ||
        "Curated designs selected for modern everyday luxury.",
    }));
  }, [categories]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "all") return products;

    return products.filter((product) => {
      const categoryValue =
        typeof product.category === "object"
          ? product.category?.name ||
            product.category?.title ||
            product.category?.slug
          : product.category;

      return (
        String(categoryValue).toLowerCase() ===
        String(selectedCategory).toLowerCase()
      );
    });
  }, [products, selectedCategory]);

  const activeCategoryMeta = useMemo(() => {
    if (selectedCategory === "all") {
      return {
        title: "All Collections",
        description:
          "Explore our complete collection of premium handbags, curated for style, function, and elegance.",
      };
    }

    const found = normalizedCategories.find(
      (cat) => cat.name.toLowerCase() === selectedCategory.toLowerCase()
    );

    return {
      title: found?.name || selectedCategory,
      description:
        found?.description ||
        "Discover refined styles designed to elevate your everyday look.",
    };
  }, [normalizedCategories, selectedCategory]);

  if (loading) {
    return (
      <section className="relative overflow-hidden bg-[#fafafa]">
        <div className="mx-auto max-w-[1280px] px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
          <div className="animate-pulse rounded-[28px] border border-neutral-200 bg-white p-8 shadow-[0_18px_60px_rgba(0,0,0,0.04)]">
            <div className="h-3 w-28 rounded-full bg-neutral-200" />
            <div className="mt-4 h-10 w-full max-w-[420px] rounded-xl bg-neutral-200" />
            <div className="mt-3 h-4 w-full max-w-[620px] rounded-xl bg-neutral-100" />

            <div className="mt-10 flex flex-wrap gap-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-11 w-28 rounded-full bg-neutral-200"
                />
              ))}
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-[22px] border border-neutral-200 bg-white"
                >
                  <div className="h-[220px] bg-neutral-100" />
                  <div className="space-y-3 p-4">
                    <div className="h-4 rounded bg-neutral-200" />
                    <div className="h-4 w-3/4 rounded bg-neutral-100" />
                    <div className="h-4 w-1/2 rounded bg-neutral-200" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
  <section className="relative overflow-hidden bg-[#fafafa]">
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,0,0,0.04),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(0,0,0,0.05),transparent_34%)]" />

    <div className="relative mx-auto max-w-[1280px] px-4 py-12 sm:px-6 sm:py-14 lg:px-10 lg:py-16">
      
      {/* HERO SECTION */}
      <div className="animate-[fadeUp_0.6s_ease-out]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-500">
          Shop By Category
        </p>

        <h1 className="mt-4 max-w-[760px] text-[30px] font-semibold tracking-[-0.04em] text-[#111111] sm:text-[38px] lg:text-[48px]">
          Explore our luxury collection by category
        </h1>

        <p className="mt-4 max-w-[700px] text-[14px] leading-7 text-neutral-600 sm:text-[15px]">
          Browse premium handbags by style and discover pieces designed
          for elegance, utility, and modern everyday fashion.
        </p>
      </div>

      {/* CATEGORY BUTTONS */}
      <div className="mt-10 animate-[fadeUp_0.75s_ease-out]">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`rounded-full border px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] transition-all duration-300 ${
              selectedCategory === "all"
                ? "border-black bg-black text-white shadow-[0_10px_24px_rgba(0,0,0,0.15)]"
                : "border-neutral-300 bg-white text-neutral-900 hover:-translate-y-[1px] hover:border-neutral-500 hover:bg-neutral-50"
            }`}
          >
            All
          </button>

          {normalizedCategories.map((category, index) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.name)}
              className={`rounded-full border px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] transition-all duration-300 ${
                selectedCategory === category.name
                  ? "border-black bg-black text-white shadow-[0_10px_24px_rgba(0,0,0,0.15)]"
                  : "border-neutral-300 bg-white text-neutral-900 hover:-translate-y-[1px] hover:border-neutral-500 hover:bg-neutral-50"
              }`}
              style={{
                animationDelay: `${index * 60}ms`,
                animationFillMode: "both",
              }}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* CATEGORY INFO */}
      <div className="mt-8 rounded-[20px] border border-neutral-200 bg-white px-5 py-5 sm:px-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
          {selectedCategory === "all" ? "Featured Overview" : "Selected Category"}
        </p>

        <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-[24px] font-semibold tracking-[-0.03em] text-[#111111]">
              {activeCategoryMeta.title}
            </h2>

            <p className="mt-2 max-w-[760px] text-[14px] leading-7 text-neutral-600">
              {activeCategoryMeta.description}
            </p>
          </div>

          <div className="text-[12px] font-medium text-neutral-500">
            {filteredProducts.length} product
            {filteredProducts.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {/* PRODUCTS GRID */}
      <div className="mt-10">
        {filteredProducts.length === 0 ? (
          <div className="rounded-[24px] border border-neutral-200 bg-[#fafafa] px-6 py-16 text-center shadow-[0_12px_30px_rgba(0,0,0,0.03)]">
            <p className="text-[18px] font-semibold text-[#111111]">
              No products found
            </p>
            <p className="mt-2 text-[14px] text-neutral-500">
              Try another category to explore more styles.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-[fadeUp_0.8s_ease-out]"
                style={{
                  animationDelay: `${index * 90}ms`,
                  animationFillMode: "both",
                }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>

    <style jsx>{`
      @keyframes fadeUp {
        from {
          opacity: 0;
          transform: translateY(26px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `}</style>
  </section>
);}