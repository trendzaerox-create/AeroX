

"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchActiveBrandShowcases } from "@/features/brandShowcases/brandShowcaseSlice";

const AUTO_SLIDE_MS = 4000;

function getSafeArray(value) {
  return Array.isArray(value) ? value : [];
}

function getProductImages(product) {
  const imageUrls = getSafeArray(product?.imageUrls).filter(Boolean);

  if (imageUrls.length > 0) {
    return imageUrls;
  }

  return [
    product?.imageUrl,
    product?.thumbnailUrl,
    product?.primaryImageUrl,
    product?.featuredImage,
  ].filter(Boolean);
}

function getProductImage(product) {
  return getProductImages(product)[0] || "";
}

function getProductSecondImage(product) {
  return getProductImages(product)[1] || "";
}

export default function BrandShowcaseSection() {
  const dispatch = useDispatch();
  const { publicItems, loadingPublic } = useSelector(
    (state) => state.brandShowcases
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    dispatch(fetchActiveBrandShowcases());
  }, [dispatch]);

  const orderedItems = useMemo(() => {
    const items = getSafeArray(publicItems);

    return [...items].sort((a, b) => {
      const aOrder =
        a?.displayOrder ?? a?.order ?? a?.position ?? a?.sortOrder ?? 9999;
      const bOrder =
        b?.displayOrder ?? b?.order ?? b?.position ?? b?.sortOrder ?? 9999;
      return aOrder - bOrder;
    });
  }, [publicItems]);

  const totalSlides = orderedItems.length;

  useEffect(() => {
    if (totalSlides <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, AUTO_SLIDE_MS);

    return () => clearInterval(timer);
  }, [totalSlides, isPaused]);

  useEffect(() => {
    if (currentIndex > totalSlides - 1) {
      setCurrentIndex(0);
    }
  }, [currentIndex, totalSlides]);

  if (loadingPublic) {
    return (
      <section className="w-full overflow-x-hidden py-4">
        <div className="px-4 sm:px-6 lg:px-3 xl:px-4 2xl:px-8">
          <div className="bg-[#efefef] px-5 py-6 text-sm text-gray-500">
            Loading brand showcase...
          </div>
        </div>
      </section>
    );
  }

  if (!orderedItems.length) {
    return null;
  }

  return (
    <section className="w-full overflow-x-hidden py-4">
      <div className="px-2 sm:px-4 lg:px-3 xl:px-4 2xl:px-8">
        <div
          className="relative w-full overflow-hidden bg-[#efefef] shadow-[0_6px_20px_rgba(0,0,0,0.04)]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onClick={() => setIsPaused(true)}
        >
          <div
            className="flex w-full will-change-transform transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              transform: `translate3d(-${currentIndex * 100}%, 0, 0)`,
            }}
          >
            {orderedItems.map((showcase) => {
              const products = getSafeArray(showcase?.products).slice(0, 4);

              return (
                <div
                  key={showcase.id}
                  className="box-border w-full min-w-full flex-shrink-0 p-2"
                >
                  <div className="flex h-auto w-full flex-col gap-2 sm:h-[420px] sm:flex-row lg:h-[480px]">
                    {/* LEFT MODEL */}
                    <div className="relative w-full min-w-0 overflow-hidden bg-[#e9e9e9] sm:w-1/2">
                      {showcase?.modelImageUrl ? (
                        <img
                          src={showcase.modelImageUrl}
                          alt={showcase?.title || "Brand showcase"}
                          className="block h-[240px] w-full object-cover transition duration-700 hover:scale-[1.04] sm:h-full"
                        />
                      ) : (
                        <div className="flex h-[240px] w-full items-center justify-center text-sm text-gray-400 sm:h-full">
                          No showcase image
                        </div>
                      )}

                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />

                      <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 lg:p-5">
                        <p className="line-clamp-2 text-[16px] font-semibold text-white sm:text-[20px] lg:text-[22px]">
                          {showcase?.title || "Collection"}
                        </p>

                        {showcase?.description && (
                          <p className="mt-1 line-clamp-2 text-[11px] text-white/85 sm:text-[12px]">
                            {showcase.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* RIGHT PRODUCTS */}
                    <div className="flex w-full min-w-0 flex-col bg-[#efefef] sm:w-1/2">
                      {products.length > 0 ? (
                        <div className="grid h-[240px] grid-cols-2 gap-2 sm:h-full">
                          {products.map((product) => {
                            const firstImage = getProductImage(product);
                            const secondImage = getProductSecondImage(product);

                            return (
                              <Link
                                key={product.id}
                                href={`/product/${product.id}`}
                                className="group/card flex min-w-0 flex-col overflow-hidden bg-white transition hover:bg-white"
                              >
                                <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-white">
                                  {firstImage ? (
                                    <>
                                      <img
                                        src={firstImage}
                                        alt={product?.title || "Product image"}
                                        className="block h-full w-full object-contain p-2 transition duration-500 group-hover/card:scale-[1.05] group-hover/card:opacity-0"
                                      />

                                      {secondImage && (
                                        <img
                                          src={secondImage}
                                          alt={product?.title || "Product image"}
                                          className="absolute inset-0 block h-full w-full object-contain p-2 opacity-0 transition duration-500 group-hover/card:scale-[1.05] group-hover/card:opacity-100"
                                        />
                                      )}
                                    </>
                                  ) : (
                                    <div className="text-xs text-gray-400">
                                      No image
                                    </div>
                                  )}
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="flex h-[240px] items-center justify-center text-sm text-gray-400 sm:h-full">
                          No products available
                        </div>
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
  );
}












