"use client";

import Link from "next/link";

export default function ProductCard({ product }) {
  const firstImage = product.images?.[0] || "/placeholder.png";
  const secondImage = product.images?.[1];

  const sellingPrice = Number(product.priceInr || 0);
  const mrp = Number(product.mrpInr || 0);

  const discountPercent =
    mrp > 0 && sellingPrice > 0 && mrp > sellingPrice
      ? Math.round(((mrp - sellingPrice) / mrp) * 100)
      : 0;

  return (
    <Link href={`/product/${product.id}`} className="block h-full">
      <article className="group flex h-full flex-col overflow-hidden rounded-[12px] border border-neutral-200 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_28px_rgba(0,0,0,0.18)] sm:rounded-[14px] sm:shadow-[0_2px_10px_rgba(0,0,0,0.14)]">
        {/* Product Image */}
        <div className="relative flex h-[155px] items-center justify-center overflow-hidden rounded-t-[12px] bg-white sm:h-[215px] sm:rounded-t-[14px] lg:h-[230px] xl:h-[235px]">
          <div className="relative h-full w-full">
            <img
              src={firstImage}
              alt={product.title || "Product image"}
              className="absolute inset-0 h-full w-full object-contain p-1.5 transition-all duration-500 group-hover:scale-[1.04] group-hover:opacity-0 sm:p-2"
            />

            <img
              src={secondImage || firstImage}
              alt={`${product.title || "Product"} second view`}
              className="absolute inset-0 h-full w-full object-contain p-1.5 opacity-0 transition-all duration-500 group-hover:scale-[1.04] group-hover:opacity-100 sm:p-2"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col px-2 pb-2 pt-1.5 sm:px-2.5 sm:pb-2 sm:pt-2">
          <h3 className="line-clamp-1 text-[13px] font-bold leading-4 text-black sm:text-[15px] sm:leading-5">
            {product.title}
          </h3>

          {/* Price */}
          <div className="mt-1 flex flex-wrap items-center gap-1 text-[12px] leading-none sm:mt-1.5 sm:gap-1 sm:text-[13px]">
            {mrp > 0 && (
              <span className="font-medium text-neutral-500 line-through">
                ₹{mrp.toLocaleString("en-IN")}
              </span>
            )}

            <span className="font-bold text-black">
              ₹{sellingPrice.toLocaleString("en-IN")}
            </span>

            {discountPercent > 0 && (
              <span className="font-bold text-green-700">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Offer Row - hidden on mobile */}
          {discountPercent > 0 && (
            <div className="mt-1.5 hidden items-center gap-1 sm:flex">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#c69b2d] text-[9px] text-white">
                %
              </span>

              <span className="line-clamp-1 text-[16px] font-semibold text-green-700">
                Special Offer Available
              </span>
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}