"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useState,
} from "react";
import {
  useDispatch,
  useSelector,
} from "react-redux";
import { useRouter } from "next/navigation";

import StarRating from "@/components/StarRating";
import getImageUrl from "@/lib/getImageUrl";
import { getToken } from "@/lib/tokenStorage";
import { toggleWishlist } from "@/features/wishlist/wishlistSlice";

export default function ProductCard({
  product,
}) {
  /*
   * The first image uses a lightweight card WebP.
   *
   * The second image is not rendered until hover
   * or keyboard focus.
   */
  const [
    loadSecondImage,
    setLoadSecondImage,
  ] = useState(false);

  const [
    showSecondImage,
    setShowSecondImage,
  ] = useState(false);

  const [
    secondImageLoaded,
    setSecondImageLoaded,
  ] = useState(false);

  const [
    firstImageFailed,
    setFirstImageFailed,
  ] = useState(false);

  const [
    secondImageFailed,
    setSecondImageFailed,
  ] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const wishlistItems = useSelector(
    (state) =>
      state.wishlist.items || []
  );

  const firstImage =
    product?.images?.[0];

  const secondImage =
    product?.images?.[1];

  /*
   * Use only lightweight -card.webp images
   * inside product cards.
   */
  const firstCardImageUrl = firstImage
    ? getImageUrl(firstImage, {
        card: true,
      })
    : "/placeholder.png";

  const resolvedSecondCardImageUrl =
    secondImage
      ? getImageUrl(secondImage, {
          card: true,
        })
      : null;

  /*
   * Do not request the large original image when
   * a thumbnail is missing.
   *
   * This prevents a missing thumbnail from falling
   * back to a 15 MB PNG.
   */
  const firstImageUrl =
    firstImageFailed
      ? "/placeholder.png"
      : firstCardImageUrl;

  const secondImageUrl =
    !secondImageFailed &&
    resolvedSecondCardImageUrl &&
    resolvedSecondCardImageUrl !==
      firstCardImageUrl
      ? resolvedSecondCardImageUrl
      : null;

  /*
   * Reset image states when React reuses the card
   * for another product.
   */
  useEffect(() => {
    setLoadSecondImage(false);
    setShowSecondImage(false);
    setSecondImageLoaded(false);
    setFirstImageFailed(false);
    setSecondImageFailed(false);
  }, [product?.id]);

  const reviewCount = Number(
    product?.reviewCount || 0
  );

  const avgRating = Number(
    product?.averageRating || 0
  );

  const isWishlisted =
    wishlistItems.some(
      (item) =>
        Number(item.productId) ===
        Number(product?.id)
    );

  const handleWishlistClick = (
    event
  ) => {
    event.preventDefault();
    event.stopPropagation();

    const token = getToken();

    if (!token) {
      router.push("/login");
      return;
    }

    dispatch(
      toggleWishlist(product.id)
    );
  };

  const sellingPrice = Number(
    product?.priceInr || 0
  );

  const mrp = Number(
    product?.mrpInr || 0
  );

  const discountInr = Number(
    product?.discountInr || 0
  );

  const calculatedDiscountPercentage =
    mrp > 0 && discountInr > 0
      ? Math.round(
          ((mrp - discountInr) /
            mrp) *
            100
        )
      : 0;

  const discountPercent =
    calculatedDiscountPercentage > 0
      ? calculatedDiscountPercentage
      : Number(
          product?.discountPercent || 0
        );

  const requestSecondImage = () => {
    if (
      !secondImageUrl ||
      secondImageFailed
    ) {
      return;
    }

    /*
     * Mount the second image after the first hover.
     * Keep it mounted afterwards to prevent repeated
     * recreation.
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
      className="block sm:h-full"
      onMouseEnter={requestSecondImage}
      onMouseLeave={hideSecondImage}
      onFocus={requestSecondImage}
      onBlur={hideSecondImage}
    >
      <article className="group flex flex-col overflow-hidden rounded-[10px] border border-neutral-200 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.10)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_24px_rgba(0,0,0,0.16)] sm:h-full sm:rounded-[14px]">
        {/* Product image */}
        <div className="relative w-full overflow-hidden rounded-t-[10px] bg-white sm:rounded-t-[14px]">
          <div className="relative aspect-square w-full">
            {/* Wishlist button */}
            <button
              type="button"
              onClick={
                handleWishlistClick
              }
              className="absolute right-1.5 top-1.5 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-[17px] font-bold shadow-[0_3px_10px_rgba(0,0,0,0.16)] transition hover:scale-105 sm:right-2 sm:top-2 sm:h-8 sm:w-8 sm:text-[19px]"
              aria-label={
                isWishlisted
                  ? "Remove from wishlist"
                  : "Add to wishlist"
              }
            >
              <span
                className={
                  isWishlisted
                    ? "text-red-500"
                    : "text-black"
                }
              >
                {isWishlisted
                  ? "♥"
                  : "♡"}
              </span>
            </button>

            <div className="relative h-full w-full overflow-hidden">
              {/* First lightweight image */}
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
                  setFirstImageFailed(
                    true
                  );
                }}
                className={`object-cover transition-all duration-500 group-hover:scale-105 ${
                  displaySecondImage
                    ? "opacity-0"
                    : "opacity-100"
                }`}
              />

              {/*
               * Second thumbnail is added to the DOM
               * only after hover/focus.
               */}
              {secondImageUrl &&
                loadSecondImage &&
                !secondImageFailed && (
                  <Image
                    src={
                      secondImageUrl
                    }
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
                      setSecondImageLoaded(
                        true
                      );
                    }}
                    onError={() => {
                      setSecondImageFailed(
                        true
                      );

                      setSecondImageLoaded(
                        false
                      );

                      setShowSecondImage(
                        false
                      );
                    }}
                    className={`object-cover transition-all duration-500 group-hover:scale-105 ${
                      displaySecondImage
                        ? "opacity-100"
                        : "pointer-events-none opacity-0"
                    }`}
                  />
                )}
            </div>
          </div>
        </div>

        {/* Product details */}
        <div className="flex flex-col px-2 pb-2 pt-1 sm:flex-1 sm:px-2.5 sm:pb-2.5 sm:pt-1.5">
          {/* Rating */}
          <div className="flex items-center gap-1">
            <StarRating
              value={avgRating}
              size="11px"
            />

            <span className="text-[10px] font-medium text-neutral-600">
              ({reviewCount})
            </span>
          </div>

          {/* Product title */}
          <h3 className="mt-1 line-clamp-1 text-[12.5px] font-bold leading-4 text-black sm:text-[15px] sm:leading-5">
            {product?.title}
          </h3>

          {/* Pricing */}
          <div className="mt-1 flex flex-wrap items-center gap-1 text-[11.5px] leading-none sm:text-[13px]">
            {mrp > 0 && (
              <span className="font-medium text-neutral-500 line-through">
                ₹
                {mrp.toLocaleString(
                  "en-IN"
                )}
              </span>
            )}

            {discountInr > 0 && (
              <span className="font-bold text-black">
                ₹
                {discountInr.toLocaleString(
                  "en-IN"
                )}
              </span>
            )}

            {discountPercent > 0 && (
              <span className="font-bold text-green-700">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Offer price */}
          <div className="mt-1.5 flex items-center gap-1.5">
            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#c69b2d] text-[8px] font-bold text-white sm:h-[18px] sm:w-[18px] sm:text-[9px]">
              %
            </span>

            <span className="line-clamp-1 text-[12px] font-semibold text-green-700 sm:text-[17px]">
              Offer Price ₹
              {sellingPrice.toLocaleString(
                "en-IN"
              )}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}