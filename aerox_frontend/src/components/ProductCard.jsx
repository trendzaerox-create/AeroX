// "use client";

// import Link from "next/link";

// export default function ProductCard({ product }) {
//   const firstImage = product.images?.[0] || "/placeholder.png";
//   const secondImage = product.images?.[1];

//   const sellingPrice = Number(product.priceInr || 0);
//   const mrp = Number(product.mrpInr || 0);

//   const discountPercent =
//     mrp > 0 && sellingPrice > 0 && mrp > sellingPrice
//       ? Math.round(((mrp - sellingPrice) / mrp) * 100)
//       : 0;

//   return (
//     <Link href={`/product/${product.id}`} className="block h-full">
//       <article className="group flex h-full flex-col overflow-hidden rounded-[12px] border border-neutral-200 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_28px_rgba(0,0,0,0.18)] sm:rounded-[14px] sm:shadow-[0_2px_10px_rgba(0,0,0,0.14)]">
//         {/* Product Image */}
//         <div className="relative flex h-[155px] items-center justify-center overflow-hidden rounded-t-[12px] bg-white sm:h-[215px] sm:rounded-t-[14px] lg:h-[230px] xl:h-[235px]">
//           <div className="relative h-full w-full">
//             <img
//               src={firstImage}
//               alt={product.title || "Product image"}
//               className="absolute inset-0 h-full w-full object-contain p-1.5 transition-all duration-500 group-hover:scale-[1.04] group-hover:opacity-0 sm:p-2"
//             />

//             <img
//               src={secondImage || firstImage}
//               alt={`${product.title || "Product"} second view`}
//               className="absolute inset-0 h-full w-full object-contain p-1.5 opacity-0 transition-all duration-500 group-hover:scale-[1.04] group-hover:opacity-100 sm:p-2"
//             />
//           </div>
//         </div>

//         {/* Content */}
//         <div className="flex flex-1 flex-col px-2 pb-2 pt-1.5 sm:px-2.5 sm:pb-2 sm:pt-2">
//           <h3 className="line-clamp-1 text-[13px] font-bold leading-4 text-black sm:text-[15px] sm:leading-5">
//             {product.title}
//           </h3>

//           {/* Price */}
//           <div className="mt-1 flex flex-wrap items-center gap-1 text-[12px] leading-none sm:mt-1.5 sm:gap-1 sm:text-[13px]">
//             {mrp > 0 && (
//               <span className="font-medium text-neutral-500 line-through">
//                 ₹{mrp.toLocaleString("en-IN")}
//               </span>
//             )}

//             <span className="font-bold text-black">
//               ₹{sellingPrice.toLocaleString("en-IN")}
//             </span>

//             {discountPercent > 0 && (
//               <span className="font-bold text-green-700">
//                 {discountPercent}% OFF
//               </span>
//             )}
//           </div>

//           {/* Offer Row - hidden on mobile */}
//           {discountPercent > 0 && (
//             <div className="mt-1.5 hidden items-center gap-1 sm:flex">
//               <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#c69b2d] text-[9px] text-white">
//                 %
//               </span>

//               <span className="line-clamp-1 text-[16px] font-semibold text-green-700">
//                 Special Offer Available
//               </span>
//             </div>
//           )}
//         </div>
//       </article>
//     </Link>
//   );
// }



















"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import getImageUrl from "@/lib/getImageUrl";

export default function ProductCard({ product }) {
  /*
   * First image:
   * Loads the lightweight -card.webp thumbnail.
   *
   * Second image:
   * Is not added to the DOM until hover/focus.
   */
  const [loadSecondImage, setLoadSecondImage] =
    useState(false);

  const [showSecondImage, setShowSecondImage] =
    useState(false);

  const [secondImageLoaded, setSecondImageLoaded] =
    useState(false);

  const [firstImageFailed, setFirstImageFailed] =
    useState(false);

  const [secondImageFailed, setSecondImageFailed] =
    useState(false);

  const firstImage = product?.images?.[0];
  const secondImage = product?.images?.[1];

  /*
   * Product cards use generated lightweight thumbnails:
   *
   * image.png
   * becomes
   * image-card.webp
   */
  const firstCardImageUrl = firstImage
    ? getImageUrl(firstImage, {
        card: true,
      })
    : "/placeholder.png";

  const resolvedSecondCardImageUrl = secondImage
    ? getImageUrl(secondImage, {
        card: true,
      })
    : null;

  /*
   * Do not fall back to the original multi-megabyte image.
   * A missing thumbnail shows the placeholder until all
   * product thumbnails have been generated.
   */
  const firstImageUrl = firstImageFailed
    ? "/placeholder.png"
    : firstCardImageUrl;

  /*
   * Prevent loading a duplicate second image.
   */
  const secondImageUrl =
    !secondImageFailed &&
    resolvedSecondCardImageUrl &&
    resolvedSecondCardImageUrl !== firstCardImageUrl
      ? resolvedSecondCardImageUrl
      : null;

  /*
   * Reset image state if React reuses the card for
   * another product.
   */
  useEffect(() => {
    setLoadSecondImage(false);
    setShowSecondImage(false);
    setSecondImageLoaded(false);
    setFirstImageFailed(false);
    setSecondImageFailed(false);
  }, [product?.id]);

  const sellingPrice = Number(
    product?.priceInr || 0
  );

  const mrp = Number(
    product?.mrpInr || 0
  );

  const discountPercent =
    mrp > 0 &&
    sellingPrice > 0 &&
    mrp > sellingPrice
      ? Math.round(
          ((mrp - sellingPrice) / mrp) *
            100
        )
      : 0;

  const requestSecondImage = () => {
    if (
      !secondImageUrl ||
      secondImageFailed
    ) {
      return;
    }

    /*
     * After the first hover, keep the second image
     * mounted so it is not recreated repeatedly.
     */
    setLoadSecondImage(true);
    setShowSecondImage(true);
  };

  const hideSecondImage = () => {
    setShowSecondImage(false);
  };

  const displaySecondImage =
    showSecondImage &&
    secondImageLoaded &&
    !secondImageFailed;

  return (
    <Link
      href={`/product/${product?.id}`}
      className="block h-full"
      onMouseEnter={requestSecondImage}
      onMouseLeave={hideSecondImage}
      onFocus={requestSecondImage}
      onBlur={hideSecondImage}
    >
      <article className="group flex h-full flex-col overflow-hidden rounded-[12px] border border-neutral-200 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_28px_rgba(0,0,0,0.18)] sm:rounded-[14px] sm:shadow-[0_2px_10px_rgba(0,0,0,0.14)]">
        {/* Product image */}
        <div className="relative flex h-[155px] items-center justify-center overflow-hidden rounded-t-[12px] bg-white sm:h-[215px] sm:rounded-t-[14px] lg:h-[230px] xl:h-[235px]">
          <div className="relative h-full w-full overflow-hidden">
            {/* First lightweight card thumbnail */}
            <Image
              src={firstImageUrl}
              alt={
                product?.title ||
                "Product image"
              }
              fill
              unoptimized
              loading="lazy"
              decoding="async"
              sizes="
                (max-width: 640px) 50vw,
                (max-width: 1024px) 33vw,
                280px
              "
              onError={() => {
                if (!firstImageFailed) {
                  setFirstImageFailed(true);
                }
              }}
              className={`object-contain p-1.5 transition-all duration-500 group-hover:scale-[1.04] sm:p-2 ${
                displaySecondImage
                  ? "opacity-0"
                  : "opacity-100"
              }`}
            />

            {/*
             * The second image is requested only after
             * hover or keyboard focus.
             */}
            {secondImageUrl &&
              loadSecondImage &&
              !secondImageFailed && (
                <Image
                  src={secondImageUrl}
                  alt={`${
                    product?.title ||
                    "Product"
                  } second view`}
                  fill
                  unoptimized
                  loading="lazy"
                  decoding="async"
                  sizes="
                    (max-width: 640px) 50vw,
                    (max-width: 1024px) 33vw,
                    280px
                  "
                  onLoad={() => {
                    setSecondImageLoaded(true);
                  }}
                  onError={() => {
                    setSecondImageFailed(true);
                    setSecondImageLoaded(false);
                    setShowSecondImage(false);
                  }}
                  className={`object-contain p-1.5 transition-all duration-500 group-hover:scale-[1.04] sm:p-2 ${
                    displaySecondImage
                      ? "opacity-100"
                      : "pointer-events-none opacity-0"
                  }`}
                />
              )}
          </div>
        </div>

        {/* Product information */}
        <div className="flex flex-1 flex-col px-2 pb-2 pt-1.5 sm:px-2.5 sm:pb-2 sm:pt-2">
          {/* Product title */}
          <h3 className="line-clamp-1 text-[13px] font-bold leading-4 text-black sm:text-[15px] sm:leading-5">
            {product?.title}
          </h3>

          {/* Pricing */}
          <div className="mt-1 flex flex-wrap items-center gap-1 text-[12px] leading-none sm:mt-1.5 sm:text-[13px]">
            {mrp > 0 && (
              <span className="font-medium text-neutral-500 line-through">
                ₹
                {mrp.toLocaleString(
                  "en-IN"
                )}
              </span>
            )}

            <span className="font-bold text-black">
              ₹
              {sellingPrice.toLocaleString(
                "en-IN"
              )}
            </span>

            {discountPercent > 0 && (
              <span className="font-bold text-green-700">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Offer row — hidden on mobile */}
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