// "use client";

// import Image from "next/image";
// import { useEffect, useMemo, useState } from "react";
// import { useSearchParams } from "next/navigation";

// import ProductCard from "@/components/ProductCard";
// import api from "@/lib/apiClient";
// import getImageUrl from "@/lib/getImageUrl";

// const END_STATIC_BANNER_URL =
//   "/images/banners/Category/Category-bottom-Banner.webp";

// const PRODUCT_PAGE_SIZE = 50;
// const INITIAL_VISIBLE_PRODUCTS = 16;
// const LOAD_MORE_STEP = 16;
// const OTHER_PRODUCTS_LIMIT = 8;

// function normalizeApiList(data) {
//   if (Array.isArray(data)) return data;
//   if (Array.isArray(data?.content)) return data.content;
//   if (Array.isArray(data?.products)) return data.products;
//   if (Array.isArray(data?.data)) return data.data;
//   return [];
// }

// function normalizeImageList(value) {
//   if (!value) return [];

//   if (Array.isArray(value)) {
//     return value.filter(Boolean);
//   }

//   if (typeof value === "string") {
//     return value
//       .split(",")
//       .map((item) => item.trim())
//       .filter(Boolean);
//   }

//   return [];
// }

// function uniqueImages(images) {
//   return Array.from(
//     new Set(
//       images
//         .filter(Boolean)
//         .map((image) => String(image).trim())
//         .filter(Boolean)
//     )
//   );
// }

// function shouldBypassNextOptimizer(src) {
//   if (!src || typeof src !== "string") {
//     return false;
//   }

//   /*
//    * In Docker local development, the browser can reach
//    * localhost:8080, while the Next.js server inside the
//    * frontend container has a different localhost.
//    */
//   return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\//i.test(
//     src
//   );
// }

// function getDisplayOrder(product) {
//   const value =
//     product?.displayOrder ??
//     product?.display_order;

//   if (
//     value === null ||
//     value === undefined ||
//     value === ""
//   ) {
//     return 999999;
//   }

//   const numberValue = Number(value);

//   return Number.isFinite(numberValue)
//     ? numberValue
//     : 999999;
// }

// function sortProductsByDisplayOrder(
//   items = []
// ) {
//   return [...items].sort((a, b) => {
//     const orderA = getDisplayOrder(a);
//     const orderB = getDisplayOrder(b);

//     if (orderA !== orderB) {
//       return orderA - orderB;
//     }

//     return (
//       Number(a.id || 0) -
//       Number(b.id || 0)
//     );
//   });
// }

// async function fetchAllProducts() {
//   const allProducts = [];
//   const maxPages = 20;

//   for (
//     let page = 0;
//     page < maxPages;
//     page += 1
//   ) {
//     const res = await api.get(
//       `/api/products?page=${page}&size=${PRODUCT_PAGE_SIZE}`
//     );

//     const pageProducts =
//       normalizeApiList(res.data);

//     allProducts.push(...pageProducts);

//     if (
//       pageProducts.length <
//       PRODUCT_PAGE_SIZE
//     ) {
//       break;
//     }
//   }

//   const uniqueProducts = Array.from(
//     new Map(
//       allProducts.map((product) => [
//         String(product.id),
//         product,
//       ])
//     ).values()
//   );

//   return sortProductsByDisplayOrder(
//     uniqueProducts
//   );
// }

// function BannerCarousel({
//   images = [],
//   alt = "Category banner",
//   type = "banner",
// }) {
//   const [activeIndex, setActiveIndex] =
//     useState(0);

//   const validImages = useMemo(
//     () =>
//       uniqueImages(
//         normalizeImageList(images)
//       ),
//     [images]
//   );

//   const imageKey = useMemo(
//     () => validImages.join("|"),
//     [validImages]
//   );

//   const isThin = type === "thin";

//   useEffect(() => {
//     if (validImages.length <= 1) {
//       return undefined;
//     }

//     const interval = setInterval(() => {
//       setActiveIndex(
//         (previousIndex) =>
//           (previousIndex + 1) %
//           validImages.length
//       );
//     }, 3500);

//     return () =>
//       clearInterval(interval);
//   }, [validImages.length]);

//   useEffect(() => {
//     setActiveIndex(0);
//   }, [imageKey]);

//   if (validImages.length === 0) {
//     return null;
//   }

//   const activeRawImage =
//     validImages[activeIndex] ||
//     validImages[0];

//   const activeImage =
//     getImageUrl(activeRawImage);

//   const bypassOptimizer =
//     shouldBypassNextOptimizer(
//       activeImage
//     );

//   return (
//     <section
//       className={`w-full bg-gradient-to-b from-[#f6f6f6] via-white to-[#f5f5f5] px-2 py-2 sm:px-5 sm:py-3 lg:px-7 lg:py-4 ${
//         isThin ? "mt-10" : "mb-8"
//       }`}
//     >
//       <div className="w-full max-w-none">
//         <div
//           className={`relative w-full overflow-hidden rounded-[18px] bg-white shadow-[0_18px_45px_rgba(0,0,0,0.16)] ${
//             isThin
//               ? "h-[140px] sm:h-[190px] lg:h-[260px]"
//               : "aspect-[4/5] md:aspect-[16/5]"
//           }`}
//         >
//           {/*
//            * Render only the active banner.
//            * Hidden opacity-zero banners are not kept in the DOM,
//            * so they cannot all download during the first load.
//            */}
//           <Image
//             key={`${activeImage}-${activeIndex}`}
//             src={activeImage}
//             alt={`${alt} ${activeIndex + 1}`}
//             fill
//             unoptimized={bypassOptimizer}
//             loading={
//               isThin ? "lazy" : "eager"
//             }
//             decoding="async"
//             quality={75}
//             sizes="100vw"
//             draggable={false}
//             className="object-cover object-center transition-transform duration-[7000ms] ease-out"
//           />

//           {validImages.length > 1 && (
//             <div
//               className={`absolute left-1/2 z-30 flex -translate-x-1/2 items-center gap-[9px] rounded-full bg-black/20 px-3 py-2 backdrop-blur-md ${
//                 isThin
//                   ? "bottom-2"
//                   : "bottom-3"
//               }`}
//             >
//               {validImages.map(
//                 (_, index) => (
//                   <button
//                     key={index}
//                     type="button"
//                     onClick={() =>
//                       setActiveIndex(index)
//                     }
//                     aria-label={`Go to banner ${
//                       index + 1
//                     }`}
//                     className={`h-[9px] rounded-full transition-all duration-300 ${
//                       activeIndex === index
//                         ? "w-[24px] bg-white"
//                         : "w-[9px] bg-white/60 hover:bg-white"
//                     }`}
//                   />
//                 )
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// }

// function StaticBanner({
//   image,
//   alt = "Trendz AeroX banner",
//   className = "",
// }) {
//   return (
//     <section
//       className={`w-full bg-gradient-to-b from-[#f6f6f6] via-white to-[#f5f5f5] px-2 py-2 sm:px-5 sm:py-3 lg:px-7 lg:py-4 ${className}`}
//     >
//       <div className="w-full max-w-none">
//         <div className="relative h-[140px] w-full overflow-hidden rounded-[18px] bg-white shadow-[0_18px_45px_rgba(0,0,0,0.16)] sm:h-[190px] lg:h-[260px]">
//           <Image
//             src={image}
//             alt={alt}
//             fill
//             loading="lazy"
//             decoding="async"
//             quality={75}
//             sizes="100vw"
//             draggable={false}
//             className="object-cover object-center"
//           />
//         </div>
//       </div>
//     </section>
//   );
// }

// export default function ProductsPage() {
//   const searchParams = useSearchParams();
//   const categoryId =
//     searchParams.get("categoryId");

//   const [products, setProducts] =
//     useState([]);

//   const [categories, setCategories] =
//     useState([]);

//   const [loading, setLoading] =
//     useState(true);

//   const [error, setError] =
//     useState("");

//   const [
//     visibleProductCount,
//     setVisibleProductCount,
//   ] = useState(
//     INITIAL_VISIBLE_PRODUCTS
//   );

//   useEffect(() => {
//     let ignore = false;

//     async function loadData() {
//       try {
//         setLoading(true);
//         setError("");

//         const [
//           allProducts,
//           categoriesRes,
//         ] = await Promise.all([
//           fetchAllProducts(),
//           api.get("/api/categories"),
//         ]);

//         const categoryData =
//           normalizeApiList(
//             categoriesRes.data
//           );

//         if (!ignore) {
//           setProducts(allProducts);
//           setCategories(categoryData);
//         }
//       } catch (err) {
//         console.error(
//           "Products page fetch error:",
//           err
//         );

//         if (!ignore) {
//           setError(
//             err.response?.data?.message ||
//               "Failed to fetch products"
//           );

//           setProducts([]);
//           setCategories([]);
//         }
//       } finally {
//         if (!ignore) {
//           setLoading(false);
//         }
//       }
//     }

//     loadData();

//     return () => {
//       ignore = true;
//     };
//   }, []);

//   useEffect(() => {
//     setVisibleProductCount(
//       INITIAL_VISIBLE_PRODUCTS
//     );
//   }, [categoryId]);

//   const selectedCategory =
//     useMemo(() => {
//       if (!categoryId) {
//         return null;
//       }

//       return categories.find(
//         (category) =>
//           Number(category.id) ===
//           Number(categoryId)
//       );
//     }, [categories, categoryId]);

//   const getProductCategoryId = (
//     product
//   ) => {
//     if (product.categoryId) {
//       return Number(
//         product.categoryId
//       );
//     }

//     if (product.category_id) {
//       return Number(
//         product.category_id
//       );
//     }

//     if (product.category?.id) {
//       return Number(
//         product.category.id
//       );
//     }

//     return null;
//   };

//   const getCategoryByProduct = (
//     product
//   ) => {
//     const productCategoryId =
//       getProductCategoryId(product);

//     if (productCategoryId) {
//       const matchedCategory =
//         categories.find(
//           (category) =>
//             Number(category.id) ===
//             Number(
//               productCategoryId
//             )
//         );

//       if (matchedCategory) {
//         return matchedCategory;
//       }
//     }

//     if (
//       typeof product.category ===
//       "string"
//     ) {
//       const matchedCategory =
//         categories.find(
//           (category) =>
//             category.name
//               ?.trim()
//               .toLowerCase() ===
//             product.category
//               .trim()
//               .toLowerCase()
//         );

//       if (matchedCategory) {
//         return matchedCategory;
//       }
//     }

//     if (
//       typeof product.category?.name ===
//       "string"
//     ) {
//       const matchedCategory =
//         categories.find(
//           (category) =>
//             category.name
//               ?.trim()
//               .toLowerCase() ===
//             product.category.name
//               .trim()
//               .toLowerCase()
//         );

//       if (matchedCategory) {
//         return matchedCategory;
//       }
//     }

//     return null;
//   };

//   const getCategoryName = (
//     product
//   ) => {
//     const productCategory =
//       getCategoryByProduct(product);

//     if (productCategory?.name) {
//       return productCategory.name;
//     }

//     if (product.category?.name) {
//       return product.category.name;
//     }

//     if (
//       typeof product.category ===
//       "string"
//     ) {
//       return product.category;
//     }

//     if (selectedCategory?.name) {
//       return selectedCategory.name;
//     }

//     return "Trendz AeroX";
//   };

//   const doesProductBelongToCategory = (
//     product,
//     category
//   ) => {
//     if (!product || !category) {
//       return false;
//     }

//     const productCategoryId =
//       getProductCategoryId(product);

//     if (
//       productCategoryId &&
//       Number(productCategoryId) ===
//         Number(category.id)
//     ) {
//       return true;
//     }

//     if (
//       typeof product.category ===
//         "string" &&
//       product.category
//         .trim()
//         .toLowerCase() ===
//         category.name
//           ?.trim()
//           .toLowerCase()
//     ) {
//       return true;
//     }

//     if (
//       typeof product.category
//         ?.name === "string" &&
//       product.category.name
//         .trim()
//         .toLowerCase() ===
//         category.name
//           ?.trim()
//           .toLowerCase()
//     ) {
//       return true;
//     }

//     return false;
//   };

//   const selectedCategoryProducts =
//     useMemo(() => {
//       if (!categoryId) {
//         return sortProductsByDisplayOrder(
//           products
//         );
//       }

//       if (!selectedCategory) {
//         return [];
//       }

//       const filteredProducts =
//         products.filter((product) =>
//           doesProductBelongToCategory(
//             product,
//             selectedCategory
//           )
//         );

//       return sortProductsByDisplayOrder(
//         filteredProducts
//       );
//     }, [
//       products,
//       categoryId,
//       selectedCategory,
//       categories,
//     ]);

//   const otherCategorySections =
//     useMemo(() => {
//       if (!categoryId) {
//         return [];
//       }

//       return categories
//         .filter(
//           (category) =>
//             Number(category.id) !==
//             Number(categoryId)
//         )
//         .map((category) => {
//           const items =
//             products.filter(
//               (product) =>
//                 doesProductBelongToCategory(
//                   product,
//                   category
//                 )
//             );

//           return {
//             category,
//             items:
//               sortProductsByDisplayOrder(
//                 items
//               ),
//           };
//         })
//         .filter(
//           (section) =>
//             section.items.length > 0
//         );
//     }, [
//       products,
//       categories,
//       categoryId,
//     ]);

//   const otherCategoryProducts =
//     useMemo(() => {
//       return sortProductsByDisplayOrder(
//         otherCategorySections.flatMap(
//           (section) =>
//             section.items
//         )
//       );
//     }, [otherCategorySections]);

//   const visibleSelectedProducts =
//     useMemo(
//       () =>
//         selectedCategoryProducts.slice(
//           0,
//           visibleProductCount
//         ),
//       [
//         selectedCategoryProducts,
//         visibleProductCount,
//       ]
//     );

//   const visibleOtherProducts =
//     useMemo(
//       () =>
//         otherCategoryProducts.slice(
//           0,
//           OTHER_PRODUCTS_LIMIT
//         ),
//       [otherCategoryProducts]
//     );

//   const getBannerImages = (
//     category
//   ) => {
//     if (!category) {
//       return [];
//     }

//     return uniqueImages([
//       ...normalizeImageList(
//         category.bannerImageUrls
//       ),
//       ...normalizeImageList(
//         category.banner_image_urls
//       ),
//       ...normalizeImageList(
//         category.bannerImages
//       ),
//       ...normalizeImageList(
//         category.banner_images
//       ),
//       ...normalizeImageList(
//         category.banners
//       ),
//       ...normalizeImageList(
//         category.bannerImageUrl
//       ),
//       ...normalizeImageList(
//         category.banner_image_url
//       ),
//     ]);
//   };

//   const getThinBannerImages = (
//     category
//   ) => {
//     if (!category) {
//       return [];
//     }

//     return uniqueImages([
//       ...normalizeImageList(
//         category.thinBannerImageUrls
//       ),
//       ...normalizeImageList(
//         category.thin_banner_image_urls
//       ),
//       ...normalizeImageList(
//         category.thinBannerImages
//       ),
//       ...normalizeImageList(
//         category.thin_banner_images
//       ),
//       ...normalizeImageList(
//         category.thinBanners
//       ),
//       ...normalizeImageList(
//         category.thin_banners
//       ),
//       ...normalizeImageList(
//         category.thinBannerImageUrl
//       ),
//       ...normalizeImageList(
//         category.thin_banner_image_url
//       ),
//     ]);
//   };

//   const renderGrid = (items) => (
//     <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
//       {items.map((product) => (
//         <div
//           key={product.id}
//           className="h-full"
//         >
//           <ProductCard
//             product={{
//               ...product,
//               displayOrder:
//                 product.displayOrder ??
//                 product.display_order,
//               displayCategoryName:
//                 getCategoryName(product),
//             }}
//           />
//         </div>
//       ))}
//     </div>
//   );

//   const renderCategoryHeader = (
//     category,
//     count
//   ) => {
//     if (!category) {
//       return null;
//     }

//     const categoryImage =
//       category?.imageUrl
//         ? getImageUrl(
//             category.imageUrl
//           )
//         : null;

//     return (
//       <div className="mb-8 flex items-center gap-4">
//         {categoryImage && (
//           <Image
//             src={categoryImage}
//             alt={
//               category.name ||
//               "Category"
//             }
//             width={64}
//             height={64}
//             unoptimized={shouldBypassNextOptimizer(
//               categoryImage
//             )}
//             loading="lazy"
//             decoding="async"
//             quality={75}
//             className="h-16 w-16 rounded-2xl border border-neutral-200 bg-neutral-100 object-cover"
//           />
//         )}

//         <div>
//           <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
//             Trendz AeroX
//           </p>

//           <h1 className="mt-2 text-[28px] font-semibold tracking-[-0.03em] text-black sm:text-[34px]">
//             {category.name}
//           </h1>

//           <p className="mt-1 text-sm text-neutral-500">
//             {count} products available
//           </p>
//         </div>
//       </div>
//     );
//   };

//   const renderCategoryBanner = (
//     category
//   ) => {
//     const images =
//       getBannerImages(category);

//     if (images.length === 0) {
//       return null;
//     }

//     return (
//       <BannerCarousel
//         images={images}
//         alt={`${
//           category?.name ||
//           "Category"
//         } banner`}
//         type="banner"
//       />
//     );
//   };

//   const renderThinBanner = (
//     category
//   ) => {
//     const images =
//       getThinBannerImages(category);

//     if (images.length === 0) {
//       return null;
//     }

//     return (
//       <BannerCarousel
//         images={images}
//         alt={`${
//           category?.name ||
//           "Category"
//         } thin banner`}
//         type="thin"
//       />
//     );
//   };

//   const hasTopBanner =
//     getBannerImages(
//       selectedCategory
//     ).length > 0;

//   const hasMoreProducts =
//     visibleProductCount <
//     selectedCategoryProducts.length;

//   return (
//     <main className="min-h-screen bg-white pb-0">
//       {renderCategoryBanner(
//         selectedCategory
//       )}

//       <section
//         className={`mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 ${
//           hasTopBanner
//             ? ""
//             : "pt-10"
//         }`}
//       >
//         {selectedCategory ? (
//           renderCategoryHeader(
//             selectedCategory,
//             selectedCategoryProducts.length
//           )
//         ) : (
//           <div className="mb-8">
//             <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
//               Trendz AeroX
//             </p>

//             <h1 className="mt-2 text-[28px] font-semibold tracking-[-0.03em] text-black sm:text-[34px]">
//               Products
//             </h1>

//             <p className="mt-1 text-sm text-neutral-500">
//               {
//                 selectedCategoryProducts.length
//               }{" "}
//               products available
//             </p>
//           </div>
//         )}

//         {loading && (
//           <p className="text-sm text-neutral-500">
//             Loading products...
//           </p>
//         )}

//         {error && (
//           <p className="text-sm text-red-600">
//             {error}
//           </p>
//         )}

//         {!loading &&
//         selectedCategoryProducts.length ===
//           0 ? (
//           <div className="rounded-[24px] border border-neutral-200 bg-[#fafafa] px-6 py-14 text-center text-[15px] text-neutral-500 shadow-[0_12px_30px_rgba(0,0,0,0.03)]">
//             No products found.
//           </div>
//         ) : (
//           !loading &&
//           renderGrid(
//             visibleSelectedProducts
//           )
//         )}

//         {!loading &&
//           hasMoreProducts && (
//             <div className="mt-10 flex justify-center">
//               <button
//                 type="button"
//                 onClick={() =>
//                   setVisibleProductCount(
//                     (currentCount) =>
//                       currentCount +
//                       LOAD_MORE_STEP
//                   )
//                 }
//                 className="rounded-full border border-neutral-300 bg-white px-7 py-3 text-sm font-semibold text-black shadow-sm transition hover:border-black hover:shadow-md"
//               >
//                 Load more products
//               </button>
//             </div>
//           )}
//       </section>

//       {renderThinBanner(
//         selectedCategory
//       )}

//       {!loading &&
//         categoryId &&
//         visibleOtherProducts.length >
//           0 && (
//           <section className="mt-14">
//             <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
//               <div className="mb-6">
//                 <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
//                   More Collection
//                 </p>

//                 <h2 className="mt-3 text-[24px] font-semibold tracking-[-0.03em] text-black sm:text-[30px]">
//                   Other Products You
//                   May Like
//                 </h2>
//               </div>

//               {renderGrid(
//                 visibleOtherProducts
//               )}
//             </div>
//           </section>
//         )}

//       <StaticBanner
//         image={
//           END_STATIC_BANNER_URL
//         }
//         alt="Trendz AeroX end banner"
//         className="mt-14"
//       />
//     </main>
//   );
// }
































































































































"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import ProductCard from "@/components/ProductCard";
import api from "@/lib/apiClient";
import getImageUrl from "@/lib/getImageUrl";

const END_STATIC_BANNER_URL =
  "/images/banners/Category/Category-bottom-Banner.webp";

const PRODUCT_PAGE_SIZE = 50;
const INITIAL_VISIBLE_PRODUCTS = 16;
const LOAD_MORE_STEP = 16;
const OTHER_PRODUCTS_LIMIT = 8;

function normalizeApiList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.products)) return data.products;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

function normalizeImageList(value) {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function uniqueImages(images) {
  return Array.from(
    new Set(
      images
        .filter(Boolean)
        .map((image) => String(image).trim())
        .filter(Boolean)
    )
  );
}

function shouldBypassNextOptimizer(src) {
  if (!src || typeof src !== "string") {
    return false;
  }

  /*
   * In Docker local development, the browser can reach
   * localhost:8080, while the Next.js server inside the
   * frontend container has a different localhost.
   */
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\//i.test(
    src
  );
}

function getDisplayOrder(product) {
  const value =
    product?.displayOrder ??
    product?.display_order;

  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return 999999;
  }

  const numberValue = Number(value);

  return Number.isFinite(numberValue)
    ? numberValue
    : 999999;
}

function sortProductsByDisplayOrder(
  items = []
) {
  return [...items].sort((a, b) => {
    const orderA = getDisplayOrder(a);
    const orderB = getDisplayOrder(b);

    if (orderA !== orderB) {
      return orderA - orderB;
    }

    return (
      Number(a.id || 0) -
      Number(b.id || 0)
    );
  });
}

async function fetchAllProducts() {
  const allProducts = [];
  const maxPages = 20;

  for (
    let page = 0;
    page < maxPages;
    page += 1
  ) {
    const res = await api.get(
      `/api/products?page=${page}&size=${PRODUCT_PAGE_SIZE}`
    );

    const pageProducts =
      normalizeApiList(res.data);

    allProducts.push(...pageProducts);

    if (
      pageProducts.length <
      PRODUCT_PAGE_SIZE
    ) {
      break;
    }
  }

  const uniqueProducts = Array.from(
    new Map(
      allProducts.map((product) => [
        String(product.id),
        product,
      ])
    ).values()
  );

  return sortProductsByDisplayOrder(
    uniqueProducts
  );
}

function BannerCarousel({
  images = [],
  alt = "Category banner",
  type = "banner",
}) {
  const [activeIndex, setActiveIndex] =
    useState(0);

  const validImages = useMemo(
    () =>
      uniqueImages(
        normalizeImageList(images)
      ),
    [images]
  );

  const imageKey = useMemo(
    () => validImages.join("|"),
    [validImages]
  );

  const isThin = type === "thin";

  useEffect(() => {
    if (validImages.length <= 1) {
      return undefined;
    }

    const interval = setInterval(() => {
      setActiveIndex(
        (previousIndex) =>
          (previousIndex + 1) %
          validImages.length
      );
    }, 3500);

    return () =>
      clearInterval(interval);
  }, [validImages.length]);

  useEffect(() => {
    setActiveIndex(0);
  }, [imageKey]);

  if (validImages.length === 0) {
    return null;
  }

  const activeRawImage =
    validImages[activeIndex] ||
    validImages[0];

  const activeImage =
    getImageUrl(activeRawImage);

  const bypassOptimizer =
    shouldBypassNextOptimizer(
      activeImage
    );

  return (
    <section
      className={`w-full bg-gradient-to-b from-[#f6f6f6] via-white to-[#f5f5f5] px-2 py-2 sm:px-5 sm:py-3 lg:px-7 lg:py-4 ${
        isThin ? "mt-10" : "mb-8"
      }`}
    >
      <div className="w-full max-w-none">
        <div
          className={`relative w-full overflow-hidden rounded-[18px] bg-white shadow-[0_18px_45px_rgba(0,0,0,0.16)] ${
            isThin
              ? "h-[140px] sm:h-[190px] lg:h-[260px]"
              : "aspect-[4/5] md:aspect-[16/5]"
          }`}
        >
          {/*
           * Render only the active banner.
           * Hidden opacity-zero banners are not kept in the DOM,
           * so they cannot all download during the first load.
           */}
          <Image
            key={`${activeImage}-${activeIndex}`}
            src={activeImage}
            alt={`${alt} ${activeIndex + 1}`}
            fill
            unoptimized={bypassOptimizer}
            loading={
              isThin ? "lazy" : "eager"
            }
            decoding="async"
            quality={75}
            sizes="100vw"
            draggable={false}
            className="object-cover object-center transition-transform duration-[7000ms] ease-out"
          />

          {validImages.length > 1 && (
            <div
              className={`absolute left-1/2 z-30 flex -translate-x-1/2 items-center gap-[9px] rounded-full bg-black/20 px-3 py-2 backdrop-blur-md ${
                isThin
                  ? "bottom-2"
                  : "bottom-3"
              }`}
            >
              {validImages.map(
                (_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() =>
                      setActiveIndex(index)
                    }
                    aria-label={`Go to banner ${
                      index + 1
                    }`}
                    className={`h-[9px] rounded-full transition-all duration-300 ${
                      activeIndex === index
                        ? "w-[24px] bg-white"
                        : "w-[9px] bg-white/60 hover:bg-white"
                    }`}
                  />
                )
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function StaticBanner({
  image,
  alt = "Trendz AeroX banner",
  className = "",
}) {
  return (
    <section
      className={`w-full bg-gradient-to-b from-[#f6f6f6] via-white to-[#f5f5f5] px-2 py-2 sm:px-5 sm:py-3 lg:px-7 lg:py-4 ${className}`}
    >
      <div className="w-full max-w-none">
        <div className="relative h-[140px] w-full overflow-hidden rounded-[18px] bg-white shadow-[0_18px_45px_rgba(0,0,0,0.16)] sm:h-[190px] lg:h-[260px]">
          <Image
            src={image}
            alt={alt}
            fill
            loading="lazy"
            decoding="async"
            quality={75}
            sizes="100vw"
            draggable={false}
            className="object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
}

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const categoryId =
    searchParams.get("categoryId");

  const [products, setProducts] =
    useState([]);

  const [categories, setCategories] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [
    visibleProductCount,
    setVisibleProductCount,
  ] = useState(
    INITIAL_VISIBLE_PRODUCTS
  );

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const [
          allProducts,
          categoriesRes,
        ] = await Promise.all([
          fetchAllProducts(),
          api.get("/api/categories"),
        ]);

        const categoryData =
          normalizeApiList(
            categoriesRes.data
          );

        if (!ignore) {
          setProducts(allProducts);
          setCategories(categoryData);
        }
      } catch (err) {
        console.error(
          "Products page fetch error:",
          err
        );

        if (!ignore) {
          setError(
            err.response?.data?.message ||
              "Failed to fetch products"
          );

          setProducts([]);
          setCategories([]);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    setVisibleProductCount(
      INITIAL_VISIBLE_PRODUCTS
    );
  }, [categoryId]);

  const selectedCategory =
    useMemo(() => {
      if (!categoryId) {
        return null;
      }

      return categories.find(
        (category) =>
          Number(category.id) ===
          Number(categoryId)
      );
    }, [categories, categoryId]);

  const getProductCategoryId = (
    product
  ) => {
    if (product.categoryId) {
      return Number(
        product.categoryId
      );
    }

    if (product.category_id) {
      return Number(
        product.category_id
      );
    }

    if (product.category?.id) {
      return Number(
        product.category.id
      );
    }

    return null;
  };

  const getCategoryByProduct = (
    product
  ) => {
    const productCategoryId =
      getProductCategoryId(product);

    if (productCategoryId) {
      const matchedCategory =
        categories.find(
          (category) =>
            Number(category.id) ===
            Number(
              productCategoryId
            )
        );

      if (matchedCategory) {
        return matchedCategory;
      }
    }

    if (
      typeof product.category ===
      "string"
    ) {
      const matchedCategory =
        categories.find(
          (category) =>
            category.name
              ?.trim()
              .toLowerCase() ===
            product.category
              .trim()
              .toLowerCase()
        );

      if (matchedCategory) {
        return matchedCategory;
      }
    }

    if (
      typeof product.category?.name ===
      "string"
    ) {
      const matchedCategory =
        categories.find(
          (category) =>
            category.name
              ?.trim()
              .toLowerCase() ===
            product.category.name
              .trim()
              .toLowerCase()
        );

      if (matchedCategory) {
        return matchedCategory;
      }
    }

    return null;
  };

  const getCategoryName = (
    product
  ) => {
    const productCategory =
      getCategoryByProduct(product);

    if (productCategory?.name) {
      return productCategory.name;
    }

    if (product.category?.name) {
      return product.category.name;
    }

    if (
      typeof product.category ===
      "string"
    ) {
      return product.category;
    }

    if (selectedCategory?.name) {
      return selectedCategory.name;
    }

    return "Trendz AeroX";
  };

  const doesProductBelongToCategory = (
    product,
    category
  ) => {
    if (!product || !category) {
      return false;
    }

    const productCategoryId =
      getProductCategoryId(product);

    if (
      productCategoryId &&
      Number(productCategoryId) ===
        Number(category.id)
    ) {
      return true;
    }

    if (
      typeof product.category ===
        "string" &&
      product.category
        .trim()
        .toLowerCase() ===
        category.name
          ?.trim()
          .toLowerCase()
    ) {
      return true;
    }

    if (
      typeof product.category
        ?.name === "string" &&
      product.category.name
        .trim()
        .toLowerCase() ===
        category.name
          ?.trim()
          .toLowerCase()
    ) {
      return true;
    }

    return false;
  };

  const selectedCategoryProducts =
    useMemo(() => {
      if (!categoryId) {
        return sortProductsByDisplayOrder(
          products
        );
      }

      if (!selectedCategory) {
        return [];
      }

      const filteredProducts =
        products.filter((product) =>
          doesProductBelongToCategory(
            product,
            selectedCategory
          )
        );

      return sortProductsByDisplayOrder(
        filteredProducts
      );
    }, [
      products,
      categoryId,
      selectedCategory,
      categories,
    ]);

  const otherCategorySections =
    useMemo(() => {
      if (!categoryId) {
        return [];
      }

      return categories
        .filter(
          (category) =>
            Number(category.id) !==
            Number(categoryId)
        )
        .map((category) => {
          const items =
            products.filter(
              (product) =>
                doesProductBelongToCategory(
                  product,
                  category
                )
            );

          return {
            category,
            items:
              sortProductsByDisplayOrder(
                items
              ),
          };
        })
        .filter(
          (section) =>
            section.items.length > 0
        );
    }, [
      products,
      categories,
      categoryId,
    ]);

  const otherCategoryProducts =
    useMemo(() => {
      return sortProductsByDisplayOrder(
        otherCategorySections.flatMap(
          (section) =>
            section.items
        )
      );
    }, [otherCategorySections]);

  const visibleSelectedProducts =
    useMemo(
      () =>
        selectedCategoryProducts.slice(
          0,
          visibleProductCount
        ),
      [
        selectedCategoryProducts,
        visibleProductCount,
      ]
    );

  const visibleOtherProducts =
    useMemo(
      () =>
        otherCategoryProducts.slice(
          0,
          OTHER_PRODUCTS_LIMIT
        ),
      [otherCategoryProducts]
    );

  const getBannerImages = (
    category
  ) => {
    if (!category) {
      return [];
    }

    return uniqueImages([
      ...normalizeImageList(
        category.bannerImageUrls
      ),
      ...normalizeImageList(
        category.banner_image_urls
      ),
      ...normalizeImageList(
        category.bannerImages
      ),
      ...normalizeImageList(
        category.banner_images
      ),
      ...normalizeImageList(
        category.banners
      ),
      ...normalizeImageList(
        category.bannerImageUrl
      ),
      ...normalizeImageList(
        category.banner_image_url
      ),
    ]);
  };

  const getThinBannerImages = (
    category
  ) => {
    if (!category) {
      return [];
    }

    return uniqueImages([
      ...normalizeImageList(
        category.thinBannerImageUrls
      ),
      ...normalizeImageList(
        category.thin_banner_image_urls
      ),
      ...normalizeImageList(
        category.thinBannerImages
      ),
      ...normalizeImageList(
        category.thin_banner_images
      ),
      ...normalizeImageList(
        category.thinBanners
      ),
      ...normalizeImageList(
        category.thin_banners
      ),
      ...normalizeImageList(
        category.thinBannerImageUrl
      ),
      ...normalizeImageList(
        category.thin_banner_image_url
      ),
    ]);
  };

  const renderGrid = (items) => (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((product) => (
        <div
          key={product.id}
          className="h-full"
        >
          <ProductCard
            product={{
              ...product,
              displayOrder:
                product.displayOrder ??
                product.display_order,
              displayCategoryName:
                getCategoryName(product),
            }}
          />
        </div>
      ))}
    </div>
  );

  const renderCategoryHeader = (
    category,
    count
  ) => {
    if (!category) {
      return null;
    }

    const categoryImage =
      category?.imageUrl
        ? getImageUrl(
            category.imageUrl
          )
        : null;

    return (
      <div className="mb-8 flex items-center gap-4">
        {categoryImage && (
          <Image
            src={categoryImage}
            alt={
              category.name ||
              "Category"
            }
            width={64}
            height={64}
            unoptimized={shouldBypassNextOptimizer(
              categoryImage
            )}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            quality={60}
            sizes="64px"
            className="h-16 w-16 rounded-2xl border border-neutral-200 bg-neutral-100 object-cover"
          />
        )}

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
            Trendz AeroX
          </p>

          <h1 className="mt-2 text-[28px] font-semibold tracking-[-0.03em] text-black sm:text-[34px]">
            {category.name}
          </h1>

          <p className="mt-1 text-sm text-neutral-500">
            {count} products available
          </p>
        </div>
      </div>
    );
  };

  const renderCategoryBanner = (
    category
  ) => {
    const images =
      getBannerImages(category);

    if (images.length === 0) {
      return null;
    }

    return (
      <BannerCarousel
        images={images}
        alt={`${
          category?.name ||
          "Category"
        } banner`}
        type="banner"
      />
    );
  };

  const renderThinBanner = (
    category
  ) => {
    const images =
      getThinBannerImages(category);

    if (images.length === 0) {
      return null;
    }

    return (
      <BannerCarousel
        images={images}
        alt={`${
          category?.name ||
          "Category"
        } thin banner`}
        type="thin"
      />
    );
  };

  const hasTopBanner =
    getBannerImages(
      selectedCategory
    ).length > 0;

  const hasMoreProducts =
    visibleProductCount <
    selectedCategoryProducts.length;

  return (
    <main className="min-h-screen bg-white pb-0">
      {renderCategoryBanner(
        selectedCategory
      )}

      <section
        className={`mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 ${
          hasTopBanner
            ? ""
            : "pt-10"
        }`}
      >
        {selectedCategory ? (
          renderCategoryHeader(
            selectedCategory,
            selectedCategoryProducts.length
          )
        ) : (
          <div className="mb-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Trendz AeroX
            </p>

            <h1 className="mt-2 text-[28px] font-semibold tracking-[-0.03em] text-black sm:text-[34px]">
              Products
            </h1>

            <p className="mt-1 text-sm text-neutral-500">
              {
                selectedCategoryProducts.length
              }{" "}
              products available
            </p>
          </div>
        )}

        {loading && (
          <p className="text-sm text-neutral-500">
            Loading products...
          </p>
        )}

        {error && (
          <p className="text-sm text-red-600">
            {error}
          </p>
        )}

        {!loading &&
        selectedCategoryProducts.length ===
          0 ? (
          <div className="rounded-[24px] border border-neutral-200 bg-[#fafafa] px-6 py-14 text-center text-[15px] text-neutral-500 shadow-[0_12px_30px_rgba(0,0,0,0.03)]">
            No products found.
          </div>
        ) : (
          !loading &&
          renderGrid(
            visibleSelectedProducts
          )
        )}

        {!loading &&
          hasMoreProducts && (
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={() =>
                  setVisibleProductCount(
                    (currentCount) =>
                      currentCount +
                      LOAD_MORE_STEP
                  )
                }
                className="rounded-full border border-neutral-300 bg-white px-7 py-3 text-sm font-semibold text-black shadow-sm transition hover:border-black hover:shadow-md"
              >
                Load more products
              </button>
            </div>
          )}
      </section>

      {renderThinBanner(
        selectedCategory
      )}

      {!loading &&
        categoryId &&
        visibleOtherProducts.length >
          0 && (
          <section className="mt-14">
            <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
              <div className="mb-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                  More Collection
                </p>

                <h2 className="mt-3 text-[24px] font-semibold tracking-[-0.03em] text-black sm:text-[30px]">
                  Other Products You
                  May Like
                </h2>
              </div>

              {renderGrid(
                visibleOtherProducts
              )}
            </div>
          </section>
        )}

      <StaticBanner
        image={
          END_STATIC_BANNER_URL
        }
        alt="Trendz AeroX end banner"
        className="mt-14"
      />
    </main>
  );
}