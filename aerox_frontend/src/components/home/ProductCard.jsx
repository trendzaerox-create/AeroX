// "use client";

// import Link from "next/link";
// import { useDispatch, useSelector } from "react-redux";
// import { useRouter } from "next/navigation";

// import StarRating from "@/components/StarRating";
// import getImageUrl from "@/lib/getImageUrl";
// import { getToken } from "@/lib/tokenStorage";
// import { toggleWishlist } from "@/features/wishlist/wishlistSlice";

// export default function ProductCard({ product }) {
//   const dispatch = useDispatch();
//   const router = useRouter();

//   const wishlistItems = useSelector((state) => state.wishlist.items);

//   const firstImage = product.images?.[0];
//   const secondImage = product.images?.[1];

//   const reviewCount = Number(product.reviewCount || 0);
//   const avgRating = Number(product.averageRating || 0);

//   const isWishlisted = wishlistItems.some(
//     (item) => Number(item.productId) === Number(product.id)
//   );

//   const handleWishlistClick = (e) => {
//     e.preventDefault();
//     e.stopPropagation();

//     const token = getToken();

//     if (!token) {
//       router.push("/login");
//       return;
//     }

//     dispatch(toggleWishlist(product.id));
//   };

//   const sellingPrice = Number(product.priceInr || 0);
//   const mrp = Number(product.mrpInr || 0);

//   const discountPercent =
//     mrp > 0 && sellingPrice > 0 && mrp > sellingPrice
//       ? Math.round(((mrp - sellingPrice) / mrp) * 100)
//       : 0;

//   const offerPrice =
//     discountPercent > 0 ? Math.max(sellingPrice - 500, 0) : sellingPrice;

//   return (
//     <Link href={`/product/${product.id}`} className="block sm:h-full">
//       <article className="group flex flex-col overflow-hidden rounded-[10px] border border-neutral-200 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.10)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_24px_rgba(0,0,0,0.16)] sm:h-full sm:rounded-[14px]">
//         {/* Product Image */}
//         <div className="relative w-full overflow-hidden rounded-t-[10px] bg-white sm:rounded-t-[14px]">
//           <div className="relative aspect-square w-full">
//             <button
//               type="button"
//               onClick={handleWishlistClick}
//               className="absolute right-1.5 top-1.5 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-[17px] font-bold shadow-[0_3px_10px_rgba(0,0,0,0.16)] transition hover:scale-105 sm:right-2 sm:top-2 sm:h-8 sm:w-8 sm:text-[19px]"
//               aria-label="Toggle wishlist"
//             >
//               <span className={isWishlisted ? "text-red-500" : "text-black"}>
//                 {isWishlisted ? "♥" : "♡"}
//               </span>
//             </button>

//             {firstImage ? (
//               <div className="relative h-full w-full overflow-hidden">
//                 <img
//                   src={getImageUrl(firstImage)}
//                   alt={product.title}
//                   className="absolute inset-0 h-full w-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:opacity-0"
//                 />

//                 <img
//                   src={getImageUrl(secondImage || firstImage)}
//                   alt={`${product.title} second view`}
//                   className="absolute inset-0 h-full w-full object-cover opacity-0 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
//                 />
//               </div>
//             ) : (
//               <div className="flex h-full w-full items-center justify-center text-xs font-medium text-neutral-500">
//                 No Image
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Product Details */}
//         <div className="flex flex-col px-2 pb-2 pt-1 sm:flex-1 sm:px-2.5 sm:pb-2.5 sm:pt-1.5">
//           <div className="flex items-center gap-1">
//             <StarRating value={avgRating} size="11px" />

//             <span className="text-[10px] font-medium text-neutral-600">
//               ({reviewCount})
//             </span>
//           </div>

//           <h3 className="mt-1 line-clamp-1 text-[12.5px] font-bold leading-4 text-black sm:text-[15px] sm:leading-5">
//             {product.title}
//           </h3>

//           <div className="mt-1 flex flex-wrap items-center gap-1 text-[11.5px] leading-none sm:text-[13px]">
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

//           <div className="mt-1.5 flex items-center gap-1.5">
//             <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#c69b2d] text-[8px] font-bold text-white sm:h-4.5 sm:w-4.5 sm:text-[9px]">
//               %
//             </span>

//             <span className="line-clamp-1 text-[12px] font-semibold text-green-700 sm:text-[17px]">
//               Offer Price ₹{offerPrice.toLocaleString("en-IN")}
//             </span>
//           </div>
//         </div>
//       </article>
//     </Link>
//   );
// }















"use client";

import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import StarRating from "@/components/StarRating";
import getImageUrl from "@/lib/getImageUrl";
import { getToken } from "@/lib/tokenStorage";
import { toggleWishlist } from "@/features/wishlist/wishlistSlice";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const wishlistItems = useSelector((state) => state.wishlist.items);

  const firstImage = product.images?.[0];
  const secondImage = product.images?.[1];

  const reviewCount = Number(product.reviewCount || 0);
  const avgRating = Number(product.averageRating || 0);

  const isWishlisted = wishlistItems.some(
    (item) => Number(item.productId) === Number(product.id)
  );

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const token = getToken();

    if (!token) {
      router.push("/login");
      return;
    }

    dispatch(toggleWishlist(product.id));
  };

  const sellingPrice = Number(product.priceInr || 0);
  const mrp = Number(product.mrpInr || 0);
  const discountInr = Number(product.discountInr || 0);

  // const discountPercent = Number(product.discountPercent || 0);

  const discountPercentageFromdiscountInr =
  mrp > 0 && discountInr > 0
    ? Math.round(((mrp - discountInr) / mrp) * 100)
    : 0;

const discountPercent =
  discountPercentageFromdiscountInr > 0
    ? discountPercentageFromdiscountInr
    : Number(product.discountPercent || 0);
  

  const offerPrice =
    discountPercent > 0 ? Math.max(sellingPrice - 500, 0) : sellingPrice;

  return (
    <Link href={`/product/${product.id}`} className="block sm:h-full">
      <article className="group flex flex-col overflow-hidden rounded-[10px] border border-neutral-200 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.10)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_24px_rgba(0,0,0,0.16)] sm:h-full sm:rounded-[14px]">
        {/* Product Image */}
        <div className="relative w-full overflow-hidden rounded-t-[10px] bg-white sm:rounded-t-[14px]">
          <div className="relative aspect-square w-full">
            <button
              type="button"
              onClick={handleWishlistClick}
              className="absolute right-1.5 top-1.5 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-[17px] font-bold shadow-[0_3px_10px_rgba(0,0,0,0.16)] transition hover:scale-105 sm:right-2 sm:top-2 sm:h-8 sm:w-8 sm:text-[19px]"
              aria-label="Toggle wishlist"
            >
              <span className={isWishlisted ? "text-red-500" : "text-black"}>
                {isWishlisted ? "♥" : "♡"}
              </span>
            </button>

            {firstImage ? (
              <div className="relative h-full w-full overflow-hidden">
                <img
                  src={getImageUrl(firstImage)}
                  alt={product.title}
                  className="absolute inset-0 h-full w-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:opacity-0"
                />

                <img
                  src={getImageUrl(secondImage || firstImage)}
                  alt={`${product.title} second view`}
                  className="absolute inset-0 h-full w-full object-cover opacity-0 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
                />
              </div>
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs font-medium text-neutral-500">
                No Image
              </div>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="flex flex-col px-2 pb-2 pt-1 sm:flex-1 sm:px-2.5 sm:pb-2.5 sm:pt-1.5">
          <div className="flex items-center gap-1">
            <StarRating value={avgRating} size="11px" />

            <span className="text-[10px] font-medium text-neutral-600">
              ({reviewCount})
            </span>
          </div>

          <h3 className="mt-1 line-clamp-1 text-[12.5px] font-bold leading-4 text-black sm:text-[15px] sm:leading-5">
            {product.title}
          </h3>

          <div className="mt-1 flex flex-wrap items-center gap-1 text-[11.5px] leading-none sm:text-[13px]">
            {mrp > 0 && (
              <span className="font-medium text-neutral-500 line-through">
                ₹{mrp.toLocaleString("en-IN")}
              </span>
            )}

            <span className="font-bold text-black">
              ₹{discountInr.toLocaleString("en-IN")}
            </span>

            {discountPercent > 0 && (
              <span className="font-bold text-green-700">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          <div className="mt-1.5 flex items-center gap-1.5">
            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#c69b2d] text-[8px] font-bold text-white sm:h-4.5 sm:w-4.5 sm:text-[9px]">
              %
            </span>

            

            <span className="line-clamp-1 text-[12px] font-semibold text-green-700 sm:text-[17px]">
              Offer Price ₹{sellingPrice.toLocaleString("en-IN")}
            </span>

          </div>

          
        </div>
      </article>
    </Link>
  );
}