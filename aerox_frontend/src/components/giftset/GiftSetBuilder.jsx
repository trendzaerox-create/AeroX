// "use client";

// import { useEffect, useMemo, useRef, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   addGiftSetCartItem,
//   addGuestGiftSetItem,
//   clearGiftSetCart,
//   clearGiftSetError,
//   clearGuestGiftSetCart,
//   fetchGiftSetCart,
//   loadGuestGiftSetCart,
//   removeGiftSetCartItem,
//   removeGuestGiftSetItem,
//   syncGuestGiftSetCart,
// } from "@/features/giftSet/giftSetSlice";
// import { fetchActiveGiftBoxes } from "@/features/giftBoxes/giftBoxSlice";
// import SelectedGiftSetItems from "./SelectedGiftSetItems";
// import GiftSetSummary from "./GiftSetSummary";
// import getImageUrl from "@/lib/getImageUrl";

// function getProductImage(product) {
//   const rawImage =
//     Array.isArray(product?.images) && product.images.length > 0
//       ? product.images[0]
//       : null;

//   return rawImage ? getImageUrl(rawImage) : "/images/placeholder.png";
// }

// function getGiftBoxImage(box) {
//   return box?.imagePath ? getImageUrl(box.imagePath) : "/images/placeholder.png";
// }

// export default function GiftSetBuilder({ products = [] }) {
//   const dispatch = useDispatch();

//   const selectedItemsSectionRef = useRef(null);
//   const giftBoxSectionRef = useRef(null);
//   const shouldScrollToSelectedItemsRef = useRef(false);

//   const { token, initialized: authInitialized } = useSelector(
//     (state) => state.auth
//   );

//   const {
//     publicGiftBoxes = [],
//     loading: giftBoxLoading,
//     error: giftBoxError,
//   } = useSelector((state) => state.giftBoxes);

//   const { summary, loading, error } = useSelector((state) => state.giftSet);

//   const [activeProduct, setActiveProduct] = useState(null);
//   const [addingProductId, setAddingProductId] = useState(null);

//   useEffect(() => {
//     dispatch(fetchActiveGiftBoxes());
//   }, [dispatch]);

//   useEffect(() => {
//     if (!authInitialized) return;

//     if (!token) {
//       dispatch(clearGiftSetError());
//       dispatch(loadGuestGiftSetCart());
//       return;
//     }

//     dispatch(syncGuestGiftSetCart()).finally(() => {
//       dispatch(fetchGiftSetCart());
//     });
//   }, [dispatch, token, authInitialized]);

//   const selectedItems = summary?.items || [];

//   const selectedIds = useMemo(() => {
//     return new Set(selectedItems.map((item) => item.productId));
//   }, [selectedItems]);

//   const enrichedSelectedItems = useMemo(() => {
//     return selectedItems.map((item, index) => {
//       const matchedProduct = products.find((p) => p.id === item.productId);

//       return {
//         ...item,
//         guestItemKey:
//           item.guestItemKey || `${item.productId}-${item.giftBoxId}-${index}`,
//         productImageUrl:
//           item?.productImageUrl || matchedProduct?.images?.[0] || null,
//         productImages:
//           Array.isArray(item?.productImages) && item.productImages.length > 0
//             ? item.productImages
//             : matchedProduct?.images || [],
//       };
//     });
//   }, [selectedItems, products]);

//   useEffect(() => {
//     if (!activeProduct) return;

//     if (selectedIds.has(activeProduct.id)) {
//       setActiveProduct(null);
//     }
//   }, [selectedIds, activeProduct]);

//   // After clicking "Add to Your Gift Set"
//   // This scrolls to "Choose a gift box" section.
//   useEffect(() => {
//     if (!activeProduct) return;

//     const timer = setTimeout(() => {
//       const section = giftBoxSectionRef.current;

//       if (!section) return;

//       const giftBoxExtraDown = 220;

//       const targetPosition =
//         section.getBoundingClientRect().top + window.scrollY + giftBoxExtraDown;

//       const maxScroll =
//         document.documentElement.scrollHeight - window.innerHeight;

//       window.scrollTo({
//         top: Math.min(targetPosition, maxScroll),
//         behavior: "smooth",
//       });
//     }, 300);

//     return () => clearTimeout(timer);
//   }, [activeProduct]);

//   // After clicking "Choose This Box"
//   // This scrolls back to "Your Selected Items" section.
//   useEffect(() => {
//     if (!shouldScrollToSelectedItemsRef.current) return;

//     const timer = setTimeout(() => {
//       const section = selectedItemsSectionRef.current;

//       if (!section) return;

//       const selectedItemsExtraDown = 120;

//       const targetPosition =
//         section.getBoundingClientRect().top +
//         window.scrollY +
//         selectedItemsExtraDown;

//       const maxScroll =
//         document.documentElement.scrollHeight - window.innerHeight;

//       window.scrollTo({
//         top: Math.min(targetPosition, maxScroll),
//         behavior: "smooth",
//       });

//       shouldScrollToSelectedItemsRef.current = false;
//     }, 350);

//     return () => clearTimeout(timer);
//   }, [selectedItems.length]);

//   const handlePickProduct = (product) => {
//     const alreadyAdded = selectedIds.has(product.id);
//     const maxReached = !alreadyAdded && selectedItems.length >= 5;

//     if (alreadyAdded || maxReached) return;

//     setActiveProduct(product);
//   };

//   const handleAddWithGiftBox = async (product, giftBoxId) => {
//     const selectedBox = publicGiftBoxes.find((box) => box.id === giftBoxId);

//     if (!selectedBox) return;

//     shouldScrollToSelectedItemsRef.current = true;

//     // Close gift box section immediately after choosing box.
//     setActiveProduct(null);

//     if (!token) {
//       dispatch(
//         addGuestGiftSetItem({
//           productId: product.id,
//           productTitle: product.title,
//           productPriceInr: product.priceInr,
//           productImagePath: product.images?.[0] || null,
//           giftBoxId: selectedBox.id,
//           giftBoxName: selectedBox.name,
//           giftBoxPriceInr: selectedBox.priceInr,
//           giftBoxImagePath: selectedBox.imagePath,
//           lineTotalInr: (product.priceInr || 0) + (selectedBox.priceInr || 0),
//         })
//       );

//       return;
//     }

//     try {
//       setAddingProductId(product.id);

//       await dispatch(
//         addGiftSetCartItem({
//           productId: product.id,
//           giftBoxId: Number(giftBoxId),
//         })
//       ).unwrap();
//     } catch (error) {
//       shouldScrollToSelectedItemsRef.current = false;

//       // If add failed, open gift box section again.
//       setActiveProduct(product);

//       console.error("Failed to add gift set item", error);
//     } finally {
//       setAddingProductId(null);
//     }
//   };

//   const handleRemove = (itemKey) => {
//     if (token) {
//       dispatch(removeGiftSetCartItem(itemKey));
//       return;
//     }

//     dispatch(removeGuestGiftSetItem(itemKey));
//   };

//   const handleClear = () => {
//     if (token) {
//       dispatch(clearGiftSetCart());
//       return;
//     }

//     dispatch(clearGuestGiftSetCart());
//   };

//   const visibleError = token ? error : null;
//   const totalSelected = selectedItems.length;
//   const maxReached = totalSelected >= 5;

//   return (
//     <section className="relative overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#fafafa_38%,#ffffff_100%)] text-[#1a1a1a]">
//       <div className="pointer-events-none absolute inset-0">
//         <div className="absolute left-[-120px] top-[-120px] h-[280px] w-[280px] rounded-full bg-black/[0.03] blur-3xl" />
//         <div className="absolute bottom-[-100px] right-[-80px] h-[260px] w-[260px] rounded-full bg-black/[0.04] blur-3xl" />
//       </div>

//       <div className="relative mx-auto max-w-[1440px] px-4 pb-44 pt-6 md:px-6 lg:px-10 lg:pb-52 lg:pt-8">
//         <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_390px] xl:items-start">
//           <div className="space-y-8">
//             <div
//               ref={selectedItemsSectionRef}
//               className="overflow-hidden rounded-[34px] border border-[#e9e9e9] bg-[linear-gradient(135deg,#ffffff_0%,#fcfcfc_38%,#f7f7f7_100%)] shadow-[0_20px_60px_rgba(0,0,0,0.05)]"
//             >
//               <div className="border-b border-[#efefef] px-5 py-5 md:px-7 md:py-6">
//                 <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
//                   <div className="max-w-2xl">
//                     <div className="inline-flex items-center rounded-full border border-[#e8e8e8] bg-white px-4 py-2 text-[11px] font-medium uppercase tracking-[0.24em] text-[#666] shadow-sm">
//                       Premium Gift Set Builder
//                     </div>

//                     <h1 className="mt-4 text-2xl font-semibold tracking-[0.01em] text-[#111] md:text-3xl">
//                       Curate a premium gift set with your favorite picks
//                     </h1>

//                     <p className="mt-3 max-w-2xl text-sm leading-7 text-[#666] md:text-[15px]">
//                       Select up to 5 products, pair each with a gift box, and
//                       create a polished gifting experience with luxury styling
//                       and gift-ready presentation.
//                     </p>
//                   </div>

//                   <div className="w-full overflow-x-auto pb-1">
//                     <div className="grid min-w-[360px] grid-cols-3 gap-4">
//                       <div className="min-h-[96px] rounded-[24px] border border-[#ececec] bg-white px-5 py-5 text-center shadow-sm">
//                         <p className="whitespace-nowrap text-[11px] uppercase tracking-[0.14em] text-[#8a8a8a]">
//                           Selected
//                         </p>

//                         <p className="mt-3 text-2xl font-semibold text-[#111]">
//                           {totalSelected}
//                         </p>
//                       </div>

//                       <div className="min-h-[96px] rounded-[24px] border border-[#ececec] bg-white px-5 py-5 text-center shadow-sm">
//                         <p className="whitespace-nowrap text-[11px] uppercase tracking-[0.14em] text-[#8a8a8a]">
//                           Limit
//                         </p>

//                         <p className="mt-3 text-2xl font-semibold text-[#111]">
//                           5
//                         </p>
//                       </div>

//                       <div className="min-h-[96px] rounded-[24px] border border-[#ececec] bg-white px-5 py-5 text-center shadow-sm">
//                         <p className="whitespace-nowrap text-[11px] uppercase tracking-[0.14em] text-[#8a8a8a]">
//                           Status
//                         </p>

//                         <p className="mt-3 text-sm font-semibold leading-5 text-[#111]">
//                           {maxReached ? "Maximum Reached" : "Building"}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="px-5 py-5 md:px-7 md:py-6">
//                 <div className="flex flex-col gap-4 rounded-[28px] border border-[#ececec] bg-white p-4 shadow-[0_10px_30px_rgba(0,0,0,0.03)] md:flex-row md:items-center md:justify-between md:p-5">
//                   <div>
//                     <p className="text-[11px] uppercase tracking-[0.24em] text-[#8a8a8a]">
//                       Gift Set Progress
//                     </p>

//                     <h2 className="mt-2 text-lg font-semibold text-[#111]">
//                       Your Selected Items
//                     </h2>

//                     <p className="mt-1 text-sm leading-6 text-[#666]">
//                       {totalSelected}/5 products selected for your curated gift
//                       set.
//                     </p>
//                   </div>

//                   {authInitialized && !token ? (
//                     <div className="inline-flex rounded-full border border-[#e5e5e5] bg-[#fafafa] px-4 py-2 text-sm text-[#555]">
//                       Explore freely now. Login is only needed at checkout.
//                     </div>
//                   ) : (
//                     <div className="inline-flex rounded-full border border-[#e5e5e5] bg-[#fafafa] px-4 py-2 text-sm text-[#555]">
//                       Gift-ready selections with premium packaging
//                     </div>
//                   )}
//                 </div>

//                 <div className="mt-5">
//                   {authInitialized ? (
//                     <SelectedGiftSetItems
//                       items={enrichedSelectedItems}
//                       onRemove={handleRemove}
//                     />
//                   ) : (
//                     <div className="rounded-[26px] border border-[#ececec] bg-white px-5 py-8 text-sm text-[#666] shadow-sm">
//                       Loading your gift set...
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             <div className="flex flex-col gap-4 rounded-[30px] border border-[#ebebeb] bg-white p-5 shadow-[0_16px_45px_rgba(0,0,0,0.04)] md:flex-row md:items-end md:justify-between md:p-6">
//               <div>
//                 <div className="inline-flex items-center rounded-full border border-[#ececec] bg-[#fafafa] px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-[#777]">
//                   Step 1
//                 </div>

//                 <h2 className="mt-4 text-2xl font-semibold tracking-[0.01em] text-[#111]">
//                   Pick your style
//                 </h2>

//                 <p className="mt-2 max-w-2xl text-sm leading-7 text-[#666]">
//                   Choose the products you want to include in your premium gift
//                   set. Each selected product will then be paired with a gift
//                   box.
//                 </p>
//               </div>

//               {maxReached && (
//                 <div className="inline-flex rounded-full border border-[#dfdfdf] bg-[#fafafa] px-4 py-2 text-sm font-medium text-[#555]">
//                   Maximum 5 products selected
//                 </div>
//               )}
//             </div>

//             <div>
//               {products.length === 0 ? (
//                 <div className="rounded-[28px] border border-dashed border-[#dadada] bg-white px-6 py-14 text-center text-sm text-[#666] shadow-sm">
//                   No products available right now.
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
//                   {products.map((product) => {
//                     const selected = selectedIds.has(product.id);
//                     const disabled = !selected && selectedItems.length >= 5;
//                     const isActive = activeProduct?.id === product.id;

//                     return (
//                       <div
//                         key={product.id}
//                         className={`group flex h-full flex-col overflow-hidden rounded-[30px] border bg-[linear-gradient(180deg,#ffffff_0%,#fcfcfc_100%)] shadow-[0_14px_35px_rgba(0,0,0,0.04)] transition duration-300 ${
//                           isActive
//                             ? "border-black shadow-[0_22px_50px_rgba(0,0,0,0.09)]"
//                             : "border-[#ececec] hover:-translate-y-[3px] hover:shadow-[0_22px_50px_rgba(0,0,0,0.07)]"
//                         }`}
//                       >
//                         <div className="relative shrink-0 overflow-hidden border-b border-[#f1f1f1] bg-[linear-gradient(180deg,#ffffff_0%,#f5f5f5_100%)]">
//                           <div className="absolute left-4 top-4 z-10 inline-flex rounded-full border border-white/80 bg-white/90 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[#555] shadow-sm backdrop-blur">
//                             {selected
//                               ? "Added"
//                               : isActive
//                               ? "Selected"
//                               : "Gift Pick"}
//                           </div>

//                           <div className="aspect-[4/5] overflow-hidden">
//                             <img
//                               src={getProductImage(product)}
//                               alt={product.title}
//                               className="h-full w-full object-contain p-6 transition duration-500 group-hover:scale-[1.03]"
//                             />
//                           </div>
//                         </div>

//                         <div className="flex min-w-0 flex-1 flex-col px-5 pb-5 pt-4">
//                           <h3 className="min-h-[82px] whitespace-normal break-words text-[15px] font-semibold uppercase leading-[1.35] tracking-[0.03em] text-[#111]">
//                             {product.title}
//                           </h3>

//                           <div className="mt-auto flex items-center justify-between gap-3 pt-4">
//                             <p className="shrink-0 text-lg font-semibold tracking-tight text-[#111]">
//                               ₹{product.priceInr}
//                             </p>

//                             <span className="shrink-0 rounded-full border border-[#ececec] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[#666]">
//                               Premium
//                             </span>
//                           </div>

//                           <div className="mt-5">
//                             <button
//                               type="button"
//                               onClick={() => handlePickProduct(product)}
//                               disabled={
//                                 selected || disabled || giftBoxLoading || loading
//                               }
//                               className={`inline-flex w-full items-center justify-center rounded-full border px-4 py-3.5 text-sm font-medium transition duration-300 ${
//                                 selected
//                                   ? "cursor-not-allowed border-[#dddddd] bg-[#f4f4f4] text-[#9a9a9a]"
//                                   : isActive
//                                   ? "border-black bg-black text-white shadow-[0_12px_30px_rgba(0,0,0,0.14)]"
//                                   : "border-black bg-white text-black hover:bg-black hover:text-white"
//                               } disabled:cursor-not-allowed disabled:opacity-60`}
//                             >
//                               {selected
//                                 ? "Already Added"
//                                 : isActive
//                                 ? "Selected"
//                                 : "Add to Your Gift Set"}
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>

//             {activeProduct && (
//               <div
//                 ref={giftBoxSectionRef}
//                 className="mb-40 overflow-hidden rounded-[34px] border border-[#e9e9e9] bg-[linear-gradient(180deg,#ffffff_0%,#fbfbfb_100%)] shadow-[0_18px_50px_rgba(0,0,0,0.05)]"
//               >
//                 <div className="border-b border-[#efefef] px-5 py-5 md:px-7 md:py-6">
//                   <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
//                     <div>
//                       <div className="inline-flex items-center rounded-full border border-[#ececec] bg-[#fafafa] px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-[#777]">
//                         Step 2
//                       </div>

//                       <h3 className="mt-4 text-2xl font-semibold text-[#111]">
//                         Choose a gift box
//                       </h3>

//                       <p className="mt-2 max-w-2xl text-sm leading-7 text-[#666]">
//                         Select a gift box for{" "}
//                         <span className="font-semibold text-[#111]">
//                           {activeProduct.title}
//                         </span>
//                         . After adding it, you can continue with your next
//                         selection.
//                       </p>
//                     </div>

//                     <div className="inline-flex rounded-full border border-[#e5e5e5] bg-white px-4 py-2 text-sm font-medium text-[#555] shadow-sm">
//                       Product selected successfully
//                     </div>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 gap-6 p-5 md:p-7 xl:grid-cols-[350px_minmax(0,1fr)]">
//                   <div className="overflow-hidden rounded-[28px] border border-[#ebebeb] bg-white shadow-[0_14px_35px_rgba(0,0,0,0.04)]">
//                     <div className="border-b border-[#f0f0f0] bg-[linear-gradient(180deg,#ffffff_0%,#f4f4f4_100%)]">
//                       <div className="aspect-[4/5] overflow-hidden">
//                         <img
//                           src={getProductImage(activeProduct)}
//                           alt={activeProduct.title}
//                           className="h-full w-full object-contain p-6"
//                         />
//                       </div>
//                     </div>

//                     <div className="px-5 pb-5 pt-4">
//                       <p className="text-[11px] uppercase tracking-[0.24em] text-[#8a8a8a]">
//                         Selected Product
//                       </p>

//                       <h3 className="mt-2 min-h-[68px] whitespace-normal break-words text-[17px] font-semibold uppercase leading-[1.35] tracking-[0.03em] text-[#111]">
//                         {activeProduct.title}
//                       </h3>

//                       <div className="mt-4 flex items-center justify-between gap-3">
//                         <p className="shrink-0 text-xl font-semibold tracking-tight text-[#111]">
//                           ₹{activeProduct.priceInr}
//                         </p>

//                         <span className="shrink-0 rounded-full border border-[#ececec] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[#666]">
//                           Ready to pair
//                         </span>
//                       </div>

//                       <button
//                         type="button"
//                         onClick={() => setActiveProduct(null)}
//                         className="mt-5 inline-flex w-full items-center justify-center rounded-full border border-[#d8d8d8] bg-white px-4 py-3.5 text-sm font-medium text-[#222] transition duration-300 hover:border-black hover:bg-black hover:text-white"
//                       >
//                         Cancel Selection
//                       </button>
//                     </div>
//                   </div>

//                   <div>
//                     {giftBoxLoading ? (
//                       <div className="rounded-[28px] border border-[#ececec] bg-white px-5 py-10 text-sm text-[#666] shadow-sm">
//                         Loading gift boxes...
//                       </div>
//                     ) : publicGiftBoxes.length === 0 ? (
//                       <div className="rounded-[28px] border border-[#ececec] bg-white px-5 py-10 text-sm text-[#666] shadow-sm">
//                         No gift boxes available right now.
//                       </div>
//                     ) : (
//                       <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 2xl:grid-cols-3">
//                         {publicGiftBoxes.map((box) => (
//                           <button
//                             key={box.id}
//                             type="button"
//                             onClick={() =>
//                               handleAddWithGiftBox(activeProduct, box.id)
//                             }
//                             disabled={
//                               loading || addingProductId === activeProduct.id
//                             }
//                             className="group overflow-hidden rounded-[28px] border border-[#e8e8e8] bg-white text-left shadow-[0_12px_30px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-[3px] hover:shadow-[0_20px_45px_rgba(0,0,0,0.08)] disabled:cursor-not-allowed disabled:opacity-60"
//                           >
//                             <div className="relative border-b border-[#f0f0f0] bg-[linear-gradient(180deg,#ffffff_0%,#f3f3f3_100%)]">
//                               <div className="absolute left-4 top-4 z-10 rounded-full border border-white/80 bg-white/90 px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-[#555] shadow-sm">
//                                 Gift Box
//                               </div>

//                               <div className="aspect-[4/3] overflow-hidden">
//                                 <img
//                                   src={getGiftBoxImage(box)}
//                                   alt={box.name}
//                                   className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
//                                 />
//                               </div>
//                             </div>

//                             <div className="p-5">
//                               <h4 className="text-base font-semibold uppercase tracking-[0.03em] text-[#111]">
//                                 {box.name}
//                               </h4>

//                               <div className="mt-3 flex items-center justify-between gap-3">
//                                 <p className="text-lg font-semibold tracking-tight text-[#111]">
//                                   ₹{box.priceInr}
//                                 </p>

//                                 <span className="rounded-full border border-[#ececec] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[#666]">
//                                   Luxury Wrap
//                                 </span>
//                               </div>

//                               <div className="mt-5 inline-flex w-full items-center justify-center rounded-full border border-black px-4 py-3 text-sm font-medium text-black transition duration-300 group-hover:bg-black group-hover:text-white">
//                                 {addingProductId === activeProduct.id
//                                   ? "Adding..."
//                                   : "Choose This Box"}
//                               </div>
//                             </div>
//                           </button>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             )}

//             {(visibleError || giftBoxError) && (
//               <div className="rounded-[24px] border border-red-200 bg-[linear-gradient(180deg,#fff5f5_0%,#fff0f0_100%)] px-5 py-4 text-sm text-red-700 shadow-sm">
//                 {visibleError || giftBoxError}
//               </div>
//             )}
//           </div>

//           <div className="xl:sticky xl:top-24">
//             <GiftSetSummary
//               summary={summary}
//               loading={loading || giftBoxLoading}
//               onClear={handleClear}
//               showCheckoutLink
//               mode="builder"
//             />
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }








"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addGiftSetCartItem,
  addGuestGiftSetItem,
  clearGiftSetCart,
  clearGiftSetError,
  clearGuestGiftSetCart,
  fetchGiftSetCart,
  loadGuestGiftSetCart,
  removeGiftSetCartItem,
  removeGuestGiftSetItem,
  syncGuestGiftSetCart,
} from "@/features/giftSet/giftSetSlice";
import { fetchActiveGiftBoxes } from "@/features/giftBoxes/giftBoxSlice";
import SelectedGiftSetItems from "./SelectedGiftSetItems";
import GiftSetSummary from "./GiftSetSummary";
import getImageUrl from "@/lib/getImageUrl";
import StarRating from "@/components/StarRating";



function getProductImage(product) {
  const rawImage =
    Array.isArray(product?.images) && product.images.length > 0
      ? product.images[0]
      : null;

  return rawImage ? getImageUrl(rawImage) : "/images/placeholder.png";
}

function getGiftBoxImage(box) {
  return box?.imagePath ? getImageUrl(box.imagePath) : "/images/placeholder.png";
}

export default function GiftSetBuilder({ products = [] }) {
  const dispatch = useDispatch();

  const selectedItemsSectionRef = useRef(null);
  const giftBoxSectionRef = useRef(null);
  const shouldScrollToSelectedItemsRef = useRef(false);

  const { token, initialized: authInitialized } = useSelector(
    (state) => state.auth
  );

  const {
    publicGiftBoxes = [],
    loading: giftBoxLoading,
    error: giftBoxError,
  } = useSelector((state) => state.giftBoxes);

  const { summary, loading, error } = useSelector((state) => state.giftSet);

  const [activeProduct, setActiveProduct] = useState(null);
  const [addingProductId, setAddingProductId] = useState(null);

  useEffect(() => {
    dispatch(fetchActiveGiftBoxes());
  }, [dispatch]);

  useEffect(() => {
    if (!authInitialized) return;

    if (!token) {
      dispatch(clearGiftSetError());
      dispatch(loadGuestGiftSetCart());
      return;
    }

    dispatch(syncGuestGiftSetCart()).finally(() => {
      dispatch(fetchGiftSetCart());
    });
  }, [dispatch, token, authInitialized]);

  const selectedItems = summary?.items || [];

  const selectedIds = useMemo(() => {
    return new Set(selectedItems.map((item) => item.productId));
  }, [selectedItems]);

  const enrichedSelectedItems = useMemo(() => {
    return selectedItems.map((item, index) => {
      const matchedProduct = products.find((p) => p.id === item.productId);

      return {
        ...item,
        guestItemKey:
          item.guestItemKey || `${item.productId}-${item.giftBoxId}-${index}`,
        productImageUrl:
          item?.productImageUrl || matchedProduct?.images?.[0] || null,
        productImages:
          Array.isArray(item?.productImages) && item.productImages.length > 0
            ? item.productImages
            : matchedProduct?.images || [],
      };
    });
  }, [selectedItems, products]);

  useEffect(() => {
    if (!activeProduct) return;

    if (selectedIds.has(activeProduct.id)) {
      setActiveProduct(null);
    }
  }, [selectedIds, activeProduct]);

  // After clicking "Add to Your Gift Set"
  // This scrolls to "Choose a gift box" section.
  useEffect(() => {
    if (!activeProduct) return;

    const timer = setTimeout(() => {
      const section = giftBoxSectionRef.current;

      if (!section) return;

      const giftBoxExtraDown = 220;

      const targetPosition =
        section.getBoundingClientRect().top + window.scrollY + giftBoxExtraDown;

      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;

      window.scrollTo({
        top: Math.min(targetPosition, maxScroll),
        behavior: "smooth",
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [activeProduct]);

  // After clicking "Choose This Box"
  // This scrolls back to "Your Selected Items" section.
  useEffect(() => {
    if (!shouldScrollToSelectedItemsRef.current) return;

    const timer = setTimeout(() => {
      const section = selectedItemsSectionRef.current;

      if (!section) return;

      const selectedItemsExtraDown = 120;

      const targetPosition =
        section.getBoundingClientRect().top +
        window.scrollY +
        selectedItemsExtraDown;

      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;

      window.scrollTo({
        top: Math.min(targetPosition, maxScroll),
        behavior: "smooth",
      });

      shouldScrollToSelectedItemsRef.current = false;
    }, 350);

    return () => clearTimeout(timer);
  }, [selectedItems.length]);

  const handlePickProduct = (product) => {
    const alreadyAdded = selectedIds.has(product.id);
    const maxReached = !alreadyAdded && selectedItems.length >= 5;

    if (alreadyAdded || maxReached) return;

    setActiveProduct(product);
  };

  const handleAddWithGiftBox = async (product, giftBoxId) => {
    const selectedBox = publicGiftBoxes.find((box) => box.id === giftBoxId);

    if (!selectedBox) return;

    shouldScrollToSelectedItemsRef.current = true;

    // Close gift box section immediately after choosing box.
    setActiveProduct(null);

    if (!token) {
      dispatch(
        addGuestGiftSetItem({
          productId: product.id,
          productTitle: product.title,
          productPriceInr: product.priceInr,
          productImagePath: product.images?.[0] || null,
          giftBoxId: selectedBox.id,
          giftBoxName: selectedBox.name,
          giftBoxPriceInr: selectedBox.priceInr,
          giftBoxImagePath: selectedBox.imagePath,
          lineTotalInr: (product.priceInr || 0) + (selectedBox.priceInr || 0),
        })
      );

      return;
    }

    try {
      setAddingProductId(product.id);

      await dispatch(
        addGiftSetCartItem({
          productId: product.id,
          giftBoxId: Number(giftBoxId),
        })
      ).unwrap();
    } catch (error) {
      shouldScrollToSelectedItemsRef.current = false;

      // If add failed, open gift box section again.
      setActiveProduct(product);

      console.error("Failed to add gift set item", error);
    } finally {
      setAddingProductId(null);
    }
  };

  const handleRemove = (itemKey) => {
    if (token) {
      dispatch(removeGiftSetCartItem(itemKey));
      return;
    }

    dispatch(removeGuestGiftSetItem(itemKey));
  };

  const handleClear = () => {
    if (token) {
      dispatch(clearGiftSetCart());
      return;
    }

    dispatch(clearGuestGiftSetCart());
  };

  const visibleError = token ? error : null;
  const totalSelected = selectedItems.length;
  const maxReached = totalSelected >= 5;

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#fafafa_38%,#ffffff_100%)] text-[#1a1a1a]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-120px] top-[-120px] h-[280px] w-[280px] rounded-full bg-black/[0.03] blur-3xl" />
        <div className="absolute bottom-[-100px] right-[-80px] h-[260px] w-[260px] rounded-full bg-black/[0.04] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[1440px] px-4 pb-44 pt-6 md:px-6 lg:px-10 lg:pb-52 lg:pt-8">
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_390px] xl:items-start">
          <div className="space-y-8">
            <div
              ref={selectedItemsSectionRef}
              className="overflow-hidden rounded-[34px] border border-[#e9e9e9] bg-[linear-gradient(135deg,#ffffff_0%,#fcfcfc_38%,#f7f7f7_100%)] shadow-[0_20px_60px_rgba(0,0,0,0.05)]"
            >
              <div className="border-b border-[#efefef] px-5 py-5 md:px-7 md:py-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="max-w-2xl">
                    <div className="inline-flex items-center rounded-full border border-[#e8e8e8] bg-white px-4 py-2 text-[11px] font-medium uppercase tracking-[0.24em] text-[#666] shadow-sm">
                      Premium Gift Set Builder
                    </div>

                    <h1 className="mt-4 text-2xl font-semibold tracking-[0.01em] text-[#111] md:text-3xl">
                      Curate a premium gift set with your favorite picks
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-7 text-[#666] md:text-[15px]">
                      Select up to 5 products, pair each with a gift box, and
                      create a polished gifting experience with luxury styling
                      and gift-ready presentation.
                    </p>
                  </div>

                  <div className="w-full overflow-x-auto pb-1">
                    <div className="grid min-w-[360px] grid-cols-3 gap-4">
                      <div className="min-h-[96px] rounded-[24px] border border-[#ececec] bg-white px-5 py-5 text-center shadow-sm">
                        <p className="whitespace-nowrap text-[11px] uppercase tracking-[0.14em] text-[#8a8a8a]">
                          Selected
                        </p>

                        <p className="mt-3 text-2xl font-semibold text-[#111]">
                          {totalSelected}
                        </p>
                      </div>

                      <div className="min-h-[96px] rounded-[24px] border border-[#ececec] bg-white px-5 py-5 text-center shadow-sm">
                        <p className="whitespace-nowrap text-[11px] uppercase tracking-[0.14em] text-[#8a8a8a]">
                          Limit
                        </p>

                        <p className="mt-3 text-2xl font-semibold text-[#111]">
                          5
                        </p>
                      </div>

                      <div className="min-h-[96px] rounded-[24px] border border-[#ececec] bg-white px-5 py-5 text-center shadow-sm">
                        <p className="whitespace-nowrap text-[11px] uppercase tracking-[0.14em] text-[#8a8a8a]">
                          Status
                        </p>

                        <p className="mt-3 text-sm font-semibold leading-5 text-[#111]">
                          {maxReached ? "Maximum Reached" : "Building"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-5 py-5 md:px-7 md:py-6">
                <div className="flex flex-col gap-4 rounded-[28px] border border-[#ececec] bg-white p-4 shadow-[0_10px_30px_rgba(0,0,0,0.03)] md:flex-row md:items-center md:justify-between md:p-5">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.24em] text-[#8a8a8a]">
                      Gift Set Progress
                    </p>

                    <h2 className="mt-2 text-lg font-semibold text-[#111]">
                      Your Selected Items
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-[#666]">
                      {totalSelected}/5 products selected for your curated gift
                      set.
                    </p>
                  </div>

                  {authInitialized && !token ? (
                    <div className="inline-flex rounded-full border border-[#e5e5e5] bg-[#fafafa] px-4 py-2 text-sm text-[#555]">
                      Explore freely now. Login is only needed at checkout.
                    </div>
                  ) : (
                    <div className="inline-flex rounded-full border border-[#e5e5e5] bg-[#fafafa] px-4 py-2 text-sm text-[#555]">
                      Gift-ready selections with premium packaging
                    </div>
                  )}
                </div>

                <div className="mt-5">
                  {authInitialized ? (
                    <SelectedGiftSetItems
                      items={enrichedSelectedItems}
                      onRemove={handleRemove}
                    />
                  ) : (
                    <div className="rounded-[26px] border border-[#ececec] bg-white px-5 py-8 text-sm text-[#666] shadow-sm">
                      Loading your gift set...
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 rounded-[30px] border border-[#ebebeb] bg-white p-5 shadow-[0_16px_45px_rgba(0,0,0,0.04)] md:flex-row md:items-end md:justify-between md:p-6">
              <div>
                <div className="inline-flex items-center rounded-full border border-[#ececec] bg-[#fafafa] px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-[#777]">
                  Step 1
                </div>

                <h2 className="mt-4 text-2xl font-semibold tracking-[0.01em] text-[#111]">
                  Pick your style
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-7 text-[#666]">
                  Choose the products you want to include in your premium gift
                  set. Each selected product will then be paired with a gift
                  box.
                </p>
              </div>

              {maxReached && (
                <div className="inline-flex rounded-full border border-[#dfdfdf] bg-[#fafafa] px-4 py-2 text-sm font-medium text-[#555]">
                  Maximum 5 products selected
                </div>
              )}
            </div>

            <div>
              {products.length === 0 ? (
                <div className="rounded-[28px] border border-dashed border-[#dadada] bg-white px-6 py-14 text-center text-sm text-[#666] shadow-sm">
                  No products available right now.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                  {products.map((product) => {
  const selected = selectedIds.has(product.id);
  const disabled = !selected && selectedItems.length >= 5;
  const isActive = activeProduct?.id === product.id;

  const firstImage = product.images?.[0];
  const secondImage = product.images?.[1];

  const reviewCount = Number(
    product.reviewCount ?? product.reviewsCount ?? product.totalReviews ?? 0
  );

  const avgRating = Number(
    product.averageRating ?? product.avgRating ?? product.rating ?? 0
  );

  const sellingPrice = Number(product.priceInr || 0);
  const mrp = Number(product.mrpInr || 0);

  const discountPercent =
    mrp > 0 && sellingPrice > 0 && mrp > sellingPrice
      ? Math.round(((mrp - sellingPrice) / mrp) * 100)
      : 0;

  const offerPrice = sellingPrice;

  return (
    <div
      key={product.id}
      className={`group flex h-full flex-col overflow-hidden rounded-[10px] border bg-white shadow-[0_2px_8px_rgba(0,0,0,0.10)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_24px_rgba(0,0,0,0.16)] sm:rounded-[14px] ${
        isActive ? "border-black" : "border-neutral-200"
      }`}
    >
      {/* Product Image */}
      <div className="relative w-full overflow-hidden rounded-t-[10px] bg-white sm:rounded-t-[14px]">
        <div className="relative aspect-square w-full">
          <div className="absolute left-1.5 top-1.5 z-20 rounded-full bg-white/95 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-black shadow-[0_3px_10px_rgba(0,0,0,0.16)] sm:left-2 sm:top-2 sm:text-[10px]">
            {selected ? "Added" : isActive ? "Selected" : "Gift Pick"}
          </div>

          {firstImage ? (
            <div className="relative h-full w-full overflow-hidden">
              <img
                src={getImageUrl(firstImage)}
                alt={product.title || "Product image"}
                className="absolute inset-0 h-full w-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:opacity-0"
              />

              <img
                src={getImageUrl(secondImage || firstImage)}
                alt={`${product.title || "Product"} second view`}
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
      <div className="flex min-w-0 flex-1 flex-col px-2 pb-2 pt-1 sm:px-2.5 sm:pb-2.5 sm:pt-1.5">
        <div className="flex items-center gap-1">
          <StarRating value={avgRating} size="11px" />

          <span className="text-[10px] font-medium text-neutral-600">
            ({reviewCount})
          </span>
        </div>

        <h3
          title={product.title}
          className="mt-1 truncate text-[12.5px] font-bold uppercase leading-4 text-black sm:text-[15px] sm:leading-5"
        >
          {product.title}
        </h3>

        <div className="mt-1 flex flex-wrap items-center gap-1 text-[11.5px] leading-none sm:text-[13px]">
          {mrp > 0 && mrp > sellingPrice && (
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

        <div className="mt-1.5 flex items-center gap-1.5">
          <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-[#c69b2d] text-[8px] font-bold text-white sm:text-[9px]">
            %
          </span>

          <span className="truncate text-[12px] font-semibold text-green-700 sm:text-[17px]">
            Offer Price ₹{offerPrice.toLocaleString("en-IN")}
          </span>
        </div>

        <button
          type="button"
          onClick={() => handlePickProduct(product)}
          disabled={selected || disabled || giftBoxLoading || loading}
          className={`mt-3 inline-flex w-full items-center justify-center rounded-full border px-3 py-2.5 text-[12px] font-bold transition duration-300 sm:px-4 sm:py-3 sm:text-sm ${
            selected
              ? "cursor-not-allowed border-[#dddddd] bg-[#f4f4f4] text-[#9a9a9a]"
              : isActive
              ? "border-black bg-black text-white shadow-[0_12px_30px_rgba(0,0,0,0.14)]"
              : "border-black bg-white text-black hover:bg-black hover:text-white"
          } disabled:cursor-not-allowed disabled:opacity-60`}
        >
          {selected
            ? "Already Added"
            : isActive
            ? "Selected"
            : "Add to Gift Set"}
        </button>
      </div>
    </div>
  );
})}
                </div>
              )}
            </div>

            {activeProduct && (
              <div
                ref={giftBoxSectionRef}
                className="mb-40 overflow-hidden rounded-[34px] border border-[#e9e9e9] bg-[linear-gradient(180deg,#ffffff_0%,#fbfbfb_100%)] shadow-[0_18px_50px_rgba(0,0,0,0.05)]"
              >
                <div className="border-b border-[#efefef] px-5 py-5 md:px-7 md:py-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                      <div className="inline-flex items-center rounded-full border border-[#ececec] bg-[#fafafa] px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-[#777]">
                        Step 2
                      </div>

                      <h3 className="mt-4 text-2xl font-semibold text-[#111]">
                        Choose a gift box
                      </h3>

                      <p className="mt-2 max-w-2xl text-sm leading-7 text-[#666]">
                        Select a gift box for{" "}
                        <span className="font-semibold text-[#111]">
                          {activeProduct.title}
                        </span>
                        . After adding it, you can continue with your next
                        selection.
                      </p>
                    </div>

                    <div className="inline-flex rounded-full border border-[#e5e5e5] bg-white px-4 py-2 text-sm font-medium text-[#555] shadow-sm">
                      Product selected successfully
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 p-5 md:p-7 xl:grid-cols-[350px_minmax(0,1fr)]">
                  <div className="overflow-hidden rounded-[28px] border border-[#ebebeb] bg-white shadow-[0_14px_35px_rgba(0,0,0,0.04)]">
                    <div className="border-b border-[#f0f0f0] bg-[linear-gradient(180deg,#ffffff_0%,#f4f4f4_100%)]">
                      <div className="aspect-[4/5] overflow-hidden">
                        <img
                          src={getProductImage(activeProduct)}
                          alt={activeProduct.title}
                          className="h-full w-full object-contain p-6"
                        />
                      </div>
                    </div>

                    <div className="px-5 pb-5 pt-4">
                      <p className="text-[11px] uppercase tracking-[0.24em] text-[#8a8a8a]">
                        Selected Product
                      </p>
<h3
  title={activeProduct.title}
  className="mt-2 min-w-0 truncate text-[17px] font-semibold uppercase leading-[1.35] tracking-[0.03em] text-[#111]"
>
  {activeProduct.title}
</h3>

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <p className="shrink-0 text-xl font-semibold tracking-tight text-[#111]">
                          ₹{activeProduct.priceInr}
                        </p>

                        <span className="shrink-0 rounded-full border border-[#ececec] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[#666]">
                          Ready to pair
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setActiveProduct(null)}
                        className="mt-5 inline-flex w-full items-center justify-center rounded-full border border-[#d8d8d8] bg-white px-4 py-3.5 text-sm font-medium text-[#222] transition duration-300 hover:border-black hover:bg-black hover:text-white"
                      >
                        Cancel Selection
                      </button>
                    </div>
                  </div>

                  <div>
                    {giftBoxLoading ? (
                      <div className="rounded-[28px] border border-[#ececec] bg-white px-5 py-10 text-sm text-[#666] shadow-sm">
                        Loading gift boxes...
                      </div>
                    ) : publicGiftBoxes.length === 0 ? (
                      <div className="rounded-[28px] border border-[#ececec] bg-white px-5 py-10 text-sm text-[#666] shadow-sm">
                        No gift boxes available right now.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 2xl:grid-cols-3">
                        {publicGiftBoxes.map((box) => (
                          <button
                            key={box.id}
                            type="button"
                            onClick={() =>
                              handleAddWithGiftBox(activeProduct, box.id)
                            }
                            disabled={
                              loading || addingProductId === activeProduct.id
                            }
                            className="group overflow-hidden rounded-[28px] border border-[#e8e8e8] bg-white text-left shadow-[0_12px_30px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-[3px] hover:shadow-[0_20px_45px_rgba(0,0,0,0.08)] disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <div className="relative border-b border-[#f0f0f0] bg-[linear-gradient(180deg,#ffffff_0%,#f3f3f3_100%)]">
                              <div className="absolute left-4 top-4 z-10 rounded-full border border-white/80 bg-white/90 px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-[#555] shadow-sm">
                                Gift Box
                              </div>

                              <div className="aspect-[4/3] overflow-hidden">
                                <img
                                  src={getGiftBoxImage(box)}
                                  alt={box.name}
                                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                                />
                              </div>
                            </div>

                            <div className="p-5">
                              <h4 className="text-base font-semibold uppercase tracking-[0.03em] text-[#111]">
                                {box.name}
                              </h4>

                              <div className="mt-3 flex items-center justify-between gap-3">
                                <p className="text-lg font-semibold tracking-tight text-[#111]">
                                  ₹{box.priceInr}
                                </p>

                                <span className="rounded-full border border-[#ececec] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[#666]">
                                  Luxury Wrap
                                </span>
                              </div>

                              <div className="mt-5 inline-flex w-full items-center justify-center rounded-full border border-black px-4 py-3 text-sm font-medium text-black transition duration-300 group-hover:bg-black group-hover:text-white">
                                {addingProductId === activeProduct.id
                                  ? "Adding..."
                                  : "Choose This Box"}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {(visibleError || giftBoxError) && (
              <div className="rounded-[24px] border border-red-200 bg-[linear-gradient(180deg,#fff5f5_0%,#fff0f0_100%)] px-5 py-4 text-sm text-red-700 shadow-sm">
                {visibleError || giftBoxError}
              </div>
            )}
          </div>

          <div className="xl:sticky xl:top-24">
            <GiftSetSummary
              summary={summary}
              loading={loading || giftBoxLoading}
              onClear={handleClear}
              showCheckoutLink
              mode="builder"
            />
          </div>
        </div>
      </div>
    </section>
  );
}