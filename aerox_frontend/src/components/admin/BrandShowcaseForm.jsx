



// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   clearBrandShowcaseState,
//   clearUploadResult,
//   uploadBrandShowcaseModelImage,
// } from "@/features/brandShowcases/brandShowcaseSlice";
// import apiClient from "@/lib/apiClient";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   X,
//   Upload,
//   Check,
//   Image as ImageIcon,
//   Grid3x3,
//   List,
//   Loader2,
//   ChevronDown,
//   Search,
// } from "lucide-react";

// export default function BrandShowcaseForm({
//   initialData = null,
//   onSubmit,
//   submitLabel = "Save Showcase",
// }) {
//   const dispatch = useDispatch();

//   const { uploading, uploadResult, saving, error, successMessage } = useSelector(
//     (state) => state.brandShowcases
//   );

//   const [products, setProducts] = useState([]);
//   const [productsLoading, setProductsLoading] = useState(true);
//   const [viewMode, setViewMode] = useState("grid");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [imagePreviewError, setImagePreviewError] = useState(false);
//   const [showProductSelector, setShowProductSelector] = useState(false);

//   const [form, setForm] = useState({
//     title: initialData?.title || "",
//     subtitle: initialData?.subtitle || "",
//     modelImageUrl: initialData?.modelImageUrl || "",
//     cloudinaryPublicId: initialData?.cloudinaryPublicId || "",
//     displayOrder: initialData?.displayOrder ?? 0,
//     active: initialData?.active ?? true,
//     productIds: initialData?.products?.map((p) => p.id) || [],
//   });

//   useEffect(() => {
//     let mounted = true;

//     async function loadProducts() {
//       try {
//         setProductsLoading(true);
//         const res = await apiClient.get("/api/products");
//         if (!mounted) return;
//         setProducts(res.data || []);
//       } catch (err) {
//         console.error("Failed to load products", err);
//       } finally {
//         if (mounted) setProductsLoading(false);
//       }
//     }

//     loadProducts();

//     return () => {
//       mounted = false;
//       dispatch(clearBrandShowcaseState());
//       dispatch(clearUploadResult());
//     };
//   }, [dispatch]);

//   useEffect(() => {
//     if (uploadResult?.imageUrl) {
//       setForm((prev) => ({
//         ...prev,
//         modelImageUrl: uploadResult.imageUrl,
//         cloudinaryPublicId: uploadResult.cloudinaryPublicId || "",
//       }));
//       setImagePreviewError(false);
//     }
//   }, [uploadResult]);

//   const selectedProducts = useMemo(() => {
//     return products.filter((p) => form.productIds.includes(p.id));
//   }, [products, form.productIds]);

//   const filteredProducts = useMemo(() => {
//     if (!searchTerm.trim()) return products;
//     return products.filter((product) =>
//       product.title.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   }, [products, searchTerm]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;

//     setForm((prev) => ({
//       ...prev,
//       [name]:
//         type === "checkbox"
//           ? checked
//           : name === "displayOrder"
//           ? Number(value)
//           : value,
//     }));
//   };

//   const handleToggleProduct = (productId) => {
//     setForm((prev) => {
//       const exists = prev.productIds.includes(productId);

//       if (exists) {
//         return {
//           ...prev,
//           productIds: prev.productIds.filter((id) => id !== productId),
//         };
//       }

//       return {
//         ...prev,
//         productIds: [...prev.productIds, productId],
//       };
//     });
//   };

//   const handleImageUpload = async (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     dispatch(uploadBrandShowcaseModelImage(file));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const payload = {
//       title: form.title.trim(),
//       subtitle: form.subtitle.trim(),
//       modelImageUrl: form.modelImageUrl.trim(),
//       cloudinaryPublicId: form.cloudinaryPublicId.trim(),
//       displayOrder: Number(form.displayOrder) || 0,
//       active: !!form.active,
//       productIds: form.productIds,
//     };

//     onSubmit(payload);
//   };

//   return (
//     <div className="w-full bg-[#f5f5f7]">
//       <div className="mx-auto w-full max-w-7xl px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 lg:py-10">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.45 }}
//           className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
//         >
//           <form
//             onSubmit={handleSubmit}
//             className="p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6 md:space-y-8"
//           >
//             <AnimatePresence>
//               {(error || successMessage) && (
//                 <motion.div
//                   initial={{ opacity: 0, y: -20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -20 }}
//                   className={`rounded-xl border px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm ${
//                     error
//                       ? "border-red-200 bg-red-50 text-red-600"
//                       : "border-green-200 bg-green-50 text-green-600"
//                   }`}
//                 >
//                   {error || successMessage}
//                 </motion.div>
//               )}
//             </AnimatePresence>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
//               <div>
//                 <label className="mb-2 block text-xs sm:text-sm font-medium text-gray-700">
//                   Title <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   name="title"
//                   value={form.title}
//                   onChange={handleChange}
//                   placeholder="From the Brand"
//                   className="w-full rounded-xl border border-gray-300 bg-white px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="mb-2 block text-xs sm:text-sm font-medium text-gray-700">
//                   Display Order <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="number"
//                   name="displayOrder"
//                   value={form.displayOrder}
//                   onChange={handleChange}
//                   className="w-full rounded-xl border border-gray-300 bg-white px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
//                   required
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="mb-2 block text-xs sm:text-sm font-medium text-gray-700">
//                 Subtitle
//               </label>
//               <textarea
//                 name="subtitle"
//                 value={form.subtitle}
//                 onChange={handleChange}
//                 rows={3}
//                 placeholder="Luxury that moves with you"
//                 className="w-full rounded-xl border border-gray-300 bg-white px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 resize-none"
//               />
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
//               <div>
//                 <label className="mb-2 block text-xs sm:text-sm font-medium text-gray-700">
//                   Upload Model Image
//                 </label>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleImageUpload}
//                   className="hidden"
//                   id="image-upload"
//                 />
//                 <label
//                   htmlFor="image-upload"
//                   className="flex items-center justify-center gap-2 w-full rounded-xl border border-dashed border-gray-300 bg-gray-50 px-3 sm:px-4 py-3 text-xs sm:text-sm text-gray-700 cursor-pointer transition-all duration-300 hover:border-gray-400 hover:bg-gray-100"
//                 >
//                   {uploading ? (
//                     <>
//                       <Loader2 className="w-4 h-4 animate-spin" />
//                       <span>Uploading...</span>
//                     </>
//                   ) : (
//                     <>
//                       <Upload className="w-4 h-4" />
//                       <span>Click to upload</span>
//                     </>
//                   )}
//                 </label>
//               </div>

//               <div className="flex items-center gap-3 md:pt-8">
//                 <input
//                   id="active"
//                   type="checkbox"
//                   name="active"
//                   checked={form.active}
//                   onChange={handleChange}
//                   className="h-4 w-4 rounded border-gray-300"
//                 />
//                 <label
//                   htmlFor="active"
//                   className="text-sm font-medium text-gray-700 cursor-pointer"
//                 >
//                   Active
//                 </label>
//               </div>
//             </div>

//             <div className="space-y-4">
//               <div>
//                 <label className="mb-2 block text-xs sm:text-sm font-medium text-gray-700">
//                   Model Image URL <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   name="modelImageUrl"
//                   value={form.modelImageUrl}
//                   onChange={handleChange}
//                   className="w-full rounded-xl border border-gray-300 bg-white px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 font-mono"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="mb-2 block text-xs sm:text-sm font-medium text-gray-700">
//                   Cloudinary Public ID
//                 </label>
//                 <input
//                   name="cloudinaryPublicId"
//                   value={form.cloudinaryPublicId}
//                   onChange={handleChange}
//                   className="w-full rounded-xl border border-gray-300 bg-white px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 font-mono"
//                 />
//               </div>
//             </div>

//             <AnimatePresence>
//               {form.modelImageUrl && (
//                 <motion.div
//                   initial={{ opacity: 0, scale: 0.98 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   exit={{ opacity: 0, scale: 0.98 }}
//                 >
//                   <p className="mb-2 text-xs sm:text-sm font-medium text-gray-700">
//                     Preview
//                   </p>
//                   <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
//                     {!imagePreviewError ? (
//                       <img
//                         src={form.modelImageUrl}
//                         alt="Model preview"
//                         className="h-[220px] sm:h-[280px] md:h-[340px] w-full object-cover"
//                         onError={() => setImagePreviewError(true)}
//                       />
//                     ) : (
//                       <div className="h-[220px] sm:h-[280px] md:h-[340px] w-full flex items-center justify-center bg-gray-100">
//                         <ImageIcon className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
//                       </div>
//                     )}
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>

//             <div>
//               <button
//                 type="button"
//                 onClick={() => setShowProductSelector(!showProductSelector)}
//                 className="w-full flex items-center justify-between rounded-xl border border-gray-300 bg-white p-3 sm:p-4 transition-all duration-300 hover:bg-gray-50"
//               >
//                 <div className="flex items-center gap-2 sm:gap-3 min-w-0">
//                   <span className="text-sm sm:text-base font-semibold text-gray-900">
//                     Select Products
//                   </span>
//                   <span className="text-xs sm:text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-md whitespace-nowrap">
//                     {form.productIds.length} selected
//                   </span>
//                 </div>
//                 <ChevronDown
//                   className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-500 transition-transform duration-300 ${
//                     showProductSelector ? "rotate-180" : ""
//                   }`}
//                 />
//               </button>

//               <AnimatePresence>
//                 {showProductSelector && (
//                   <motion.div
//                     initial={{ opacity: 0, height: 0 }}
//                     animate={{ opacity: 1, height: "auto" }}
//                     exit={{ opacity: 0, height: 0 }}
//                     transition={{ duration: 0.25 }}
//                     className="mt-3 sm:mt-4"
//                   >
//                     <div className="mb-3 sm:mb-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
//                       <div className="relative flex-1">
//                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//                         <input
//                           type="text"
//                           placeholder="Search products..."
//                           value={searchTerm}
//                           onChange={(e) => setSearchTerm(e.target.value)}
//                           className="w-full rounded-xl border border-gray-300 bg-white pl-9 pr-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
//                         />
//                       </div>

//                       <div className="flex gap-1 bg-gray-100 rounded-xl p-1 self-start">
//                         <button
//                           type="button"
//                           onClick={() => setViewMode("grid")}
//                           className={`p-2 rounded-lg transition-all duration-200 ${
//                             viewMode === "grid"
//                               ? "bg-white text-gray-900 shadow-sm"
//                               : "text-gray-500 hover:text-gray-900"
//                           }`}
//                         >
//                           <Grid3x3 className="w-4 h-4" />
//                         </button>
//                         <button
//                           type="button"
//                           onClick={() => setViewMode("list")}
//                           className={`p-2 rounded-lg transition-all duration-200 ${
//                             viewMode === "list"
//                               ? "bg-white text-gray-900 shadow-sm"
//                               : "text-gray-500 hover:text-gray-900"
//                           }`}
//                         >
//                           <List className="w-4 h-4" />
//                         </button>
//                       </div>
//                     </div>

//                     <div className="rounded-2xl border border-gray-200 bg-white">
//                       {productsLoading ? (
//                         <div className="p-8 text-center">
//                           <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-gray-400" />
//                           <p className="text-sm text-gray-500">Loading products...</p>
//                         </div>
//                       ) : filteredProducts.length === 0 ? (
//                         <div className="p-8 text-center text-sm text-gray-500">
//                           {searchTerm ? "No products match your search." : "No products found."}
//                         </div>
//                       ) : viewMode === "grid" ? (
//                         <div className="p-3 sm:p-4 max-h-[60vh] overflow-y-auto">
//                           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
//                             {filteredProducts.map((product) => {
//                               const checked = form.productIds.includes(product.id);
//                               const imageUrl = product.images?.[0]?.imageUrl || null;

//                               return (
//                                 <button
//                                   type="button"
//                                   key={product.id}
//                                   onClick={() => handleToggleProduct(product.id)}
//                                   className={`group relative overflow-hidden rounded-xl border transition-all duration-300 text-left ${
//                                     checked
//                                       ? "border-gray-900 bg-gray-50 shadow-sm"
//                                       : "border-gray-200 bg-white hover:border-gray-400"
//                                   }`}
//                                 >
//                                   <div className="aspect-[4/3] w-full bg-gray-100 relative overflow-hidden">
//                                     {imageUrl ? (
//                                       <img
//                                         src={imageUrl}
//                                         alt={product.title}
//                                         className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
//                                       />
//                                     ) : (
//                                       <div className="flex h-full items-center justify-center">
//                                         <ImageIcon className="w-8 h-8 text-gray-400" />
//                                       </div>
//                                     )}

//                                     {checked && (
//                                       <div className="absolute top-2 right-2 bg-gray-900 rounded-full p-1">
//                                         <Check className="w-3 h-3 text-white" />
//                                       </div>
//                                     )}
//                                   </div>

//                                   <div className="p-3">
//                                     <p className="line-clamp-2 text-sm font-semibold text-gray-900">
//                                       {product.title}
//                                     </p>
//                                     <p className="mt-1 text-xs text-gray-500">
//                                       ₹{product.priceInr?.toLocaleString()}
//                                     </p>
//                                   </div>
//                                 </button>
//                               );
//                             })}
//                           </div>
//                         </div>
//                       ) : (
//                         <div className="max-h-[60vh] overflow-y-auto divide-y divide-gray-200">
//                           {filteredProducts.map((product) => {
//                             const checked = form.productIds.includes(product.id);
//                             const imageUrl = product.images?.[0]?.imageUrl || null;

//                             return (
//                               <button
//                                 type="button"
//                                 key={product.id}
//                                 onClick={() => handleToggleProduct(product.id)}
//                                 className={`w-full flex items-center gap-3 p-3 sm:p-4 transition-all duration-200 ${
//                                   checked ? "bg-gray-50" : "hover:bg-gray-50"
//                                 }`}
//                               >
//                                 <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
//                                   {imageUrl ? (
//                                     <img
//                                       src={imageUrl}
//                                       alt={product.title}
//                                       className="h-full w-full object-cover"
//                                     />
//                                   ) : (
//                                     <div className="flex h-full items-center justify-center">
//                                       <ImageIcon className="w-4 h-4 text-gray-400" />
//                                     </div>
//                                   )}
//                                 </div>

//                                 <div className="flex-1 text-left min-w-0">
//                                   <p className="text-sm font-medium text-gray-900 truncate">
//                                     {product.title}
//                                   </p>
//                                   <p className="text-xs text-gray-500">
//                                     ₹{product.priceInr?.toLocaleString()}
//                                   </p>
//                                 </div>

//                                 {checked && (
//                                   <div className="w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
//                                     <Check className="w-3 h-3 text-white" />
//                                   </div>
//                                 )}
//                               </button>
//                             );
//                           })}
//                         </div>
//                       )}
//                     </div>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>

//             <AnimatePresence>
//               {selectedProducts.length > 0 && (
//                 <motion.div
//                   initial={{ opacity: 0, y: 16 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: 16 }}
//                 >
//                   <p className="mb-3 text-xs sm:text-sm font-medium text-gray-700">
//                     Selected Products ({selectedProducts.length})
//                   </p>

//                   <div className="space-y-2 max-h-[40vh] overflow-y-auto">
//                     {selectedProducts.map((product, index) => (
//                       <motion.div
//                         key={product.id}
//                         initial={{ opacity: 0, x: -16 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         transition={{ delay: index * 0.04 }}
//                         className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-3 sm:px-4 py-3"
//                       >
//                         <div className="flex items-center gap-3 min-w-0">
//                           <span className="text-xs text-gray-400 font-mono flex-shrink-0">
//                             #{index + 1}
//                           </span>
//                           <div className="min-w-0">
//                             <p className="text-sm font-medium text-gray-900 truncate">
//                               {product.title}
//                             </p>
//                             <p className="text-xs text-gray-500 hidden sm:block">
//                               ID: {product.id}
//                             </p>
//                           </div>
//                         </div>

//                         <button
//                           type="button"
//                           onClick={() => handleToggleProduct(product.id)}
//                           className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-all duration-200 flex-shrink-0"
//                         >
//                           <X className="w-4 h-4" />
//                         </button>
//                       </motion.div>
//                     ))}
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>

//             <div className="flex justify-end pt-2 sm:pt-4">
//               <button
//                 type="submit"
//                 disabled={saving}
//                 className="w-full sm:w-auto rounded-xl bg-gray-900 px-5 sm:px-7 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-black disabled:opacity-60 disabled:cursor-not-allowed"
//               >
//                 <span className="flex items-center justify-center gap-2">
//                   {saving ? (
//                     <>
//                       <Loader2 className="w-4 h-4 animate-spin" />
//                       <span>Saving...</span>
//                     </>
//                   ) : (
//                     submitLabel
//                   )}
//                 </span>
//               </button>
//             </div>
//           </form>
//         </motion.div>
//       </div>
//     </div>
//   );
// }




















"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearBrandShowcaseState,
  clearUploadResult,
  uploadBrandShowcaseModelImage,
} from "@/features/brandShowcases/brandShowcaseSlice";
import apiClient from "@/lib/apiClient";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Upload,
  Check,
  Image as ImageIcon,
  Grid3x3,
  List,
  Loader2,
  ChevronDown,
  Search,
} from "lucide-react";

function getProductImage(product) {
  if (!product) return null;

  if (product.imageUrl) return product.imageUrl;
  if (product.thumbnailUrl) return product.thumbnailUrl;
  if (product.mainImageUrl) return product.mainImageUrl;
  if (product.primaryImageUrl) return product.primaryImageUrl;

  if (Array.isArray(product.imageUrls) && product.imageUrls.length > 0) {
    return product.imageUrls[0];
  }

  if (typeof product.imageUrls === "string") {
    try {
      const parsed = JSON.parse(product.imageUrls);

      if (Array.isArray(parsed) && parsed.length > 0) {
        return typeof parsed[0] === "string"
          ? parsed[0]
          : parsed[0]?.imageUrl ||
              parsed[0]?.url ||
              parsed[0]?.secureUrl ||
              parsed[0]?.src ||
              null;
      }

      return product.imageUrls;
    } catch {
      return product.imageUrls;
    }
  }

  if (Array.isArray(product.images) && product.images.length > 0) {
    const firstImage = product.images[0];

    if (typeof firstImage === "string") return firstImage;

    return (
      firstImage?.imageUrl ||
      firstImage?.url ||
      firstImage?.secureUrl ||
      firstImage?.src ||
      null
    );
  }

  if (typeof product.images === "string") {
    try {
      const parsed = JSON.parse(product.images);

      if (Array.isArray(parsed) && parsed.length > 0) {
        return typeof parsed[0] === "string"
          ? parsed[0]
          : parsed[0]?.imageUrl ||
              parsed[0]?.url ||
              parsed[0]?.secureUrl ||
              parsed[0]?.src ||
              null;
      }

      return product.images;
    } catch {
      return product.images;
    }
  }

  if (Array.isArray(product.productImages) && product.productImages.length > 0) {
    const firstImage = product.productImages[0];

    if (typeof firstImage === "string") return firstImage;

    return (
      firstImage?.imageUrl ||
      firstImage?.url ||
      firstImage?.secureUrl ||
      firstImage?.src ||
      null
    );
  }

  return null;
}

function ProductImageThumb({
  product,
  sizeClass = "h-12 w-12",
  imageClass = "h-full w-full object-cover",
  iconClass = "h-5 w-5",
}) {
  const [hasError, setHasError] = useState(false);
  const imageUrl = getProductImage(product);

  if (!imageUrl || hasError) {
    return (
      <div
        className={`${sizeClass} flex flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100`}
      >
        <ImageIcon className={`${iconClass} text-gray-400`} />
      </div>
    );
  }

  return (
    <div
      className={`${sizeClass} flex-shrink-0 overflow-hidden rounded-lg bg-gray-100`}
    >
      <img
        src={imageUrl}
        alt={product?.title || "Product image"}
        className={imageClass}
        onError={() => setHasError(true)}
      />
    </div>
  );
}

export default function BrandShowcaseForm({
  initialData = null,
  onSubmit,
  submitLabel = "Save Showcase",
}) {
  const dispatch = useDispatch();

  const { uploading, uploadResult, saving, error, successMessage } = useSelector(
    (state) => state.brandShowcases
  );

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [imagePreviewError, setImagePreviewError] = useState(false);
  const [showProductSelector, setShowProductSelector] = useState(false);

  const [form, setForm] = useState({
    title: initialData?.title || "",
    subtitle: initialData?.subtitle || "",
    modelImageUrl: initialData?.modelImageUrl || "",
    cloudinaryPublicId: initialData?.cloudinaryPublicId || "",
    displayOrder: initialData?.displayOrder ?? 0,
    active: initialData?.active ?? true,
    productIds: initialData?.products?.map((p) => Number(p.id)) || [],
  });

  useEffect(() => {
    if (!initialData) return;

    setForm({
      title: initialData?.title || "",
      subtitle: initialData?.subtitle || "",
      modelImageUrl: initialData?.modelImageUrl || "",
      cloudinaryPublicId: initialData?.cloudinaryPublicId || "",
      displayOrder: initialData?.displayOrder ?? 0,
      active: initialData?.active ?? true,
      productIds: initialData?.products?.map((p) => Number(p.id)) || [],
    });

    setImagePreviewError(false);
  }, [initialData]);

  useEffect(() => {
    let mounted = true;

    async function loadProducts() {
      try {
        setProductsLoading(true);

        const res = await apiClient.get("/api/products");
        const data = res.data;

        const normalizedProducts = Array.isArray(data)
          ? data
          : Array.isArray(data?.content)
          ? data.content
          : Array.isArray(data?.data)
          ? data.data
          : [];

        if (mounted) {
          setProducts(normalizedProducts);
        }
      } catch (err) {
        console.error("Failed to load products", err);

        if (mounted) {
          setProducts([]);
        }
      } finally {
        if (mounted) {
          setProductsLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      mounted = false;
      dispatch(clearBrandShowcaseState());
      dispatch(clearUploadResult());
    };
  }, [dispatch]);

  useEffect(() => {
    if (uploadResult?.imageUrl) {
      setForm((prev) => ({
        ...prev,
        modelImageUrl: uploadResult.imageUrl,
        cloudinaryPublicId: uploadResult.cloudinaryPublicId || "",
      }));

      setImagePreviewError(false);
    }
  }, [uploadResult]);

  const selectedProducts = useMemo(() => {
    const productMap = new Map(products.map((p) => [Number(p.id), p]));

    return form.productIds
      .map((id) => productMap.get(Number(id)))
      .filter(Boolean);
  }, [products, form.productIds]);

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return products;

    return products.filter((product) =>
      String(product.title || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "displayOrder"
          ? Number(value)
          : value,
    }));
  };

  const handleToggleProduct = (productId) => {
    const numericProductId = Number(productId);

    setForm((prev) => {
      const exists = prev.productIds.includes(numericProductId);

      if (exists) {
        return {
          ...prev,
          productIds: prev.productIds.filter(
            (id) => Number(id) !== numericProductId
          ),
        };
      }

      return {
        ...prev,
        productIds: [...prev.productIds, numericProductId],
      };
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    dispatch(uploadBrandShowcaseModelImage(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title: form.title.trim(),
      subtitle: form.subtitle.trim(),
      modelImageUrl: form.modelImageUrl.trim(),
      cloudinaryPublicId: form.cloudinaryPublicId.trim(),
      displayOrder: Number(form.displayOrder) || 0,
      active: !!form.active,
      productIds: form.productIds.map((id) => Number(id)),
    };

    onSubmit(payload);
  };

  return (
    <div className="w-full bg-[#f5f5f7]">
      <div className="mx-auto w-full max-w-7xl px-3 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8 lg:py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
        >
          <form
            onSubmit={handleSubmit}
            className="space-y-5 p-4 sm:space-y-6 sm:p-6 md:space-y-8 md:p-8"
          >
            <AnimatePresence>
              {(error || successMessage) && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`rounded-xl border px-3 py-2 text-xs sm:px-4 sm:py-3 sm:text-sm ${
                    error
                      ? "border-red-200 bg-red-50 text-red-600"
                      : "border-green-200 bg-green-50 text-green-600"
                  }`}
                >
                  {error || successMessage}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-medium text-gray-700 sm:text-sm">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="From the Brand"
                  className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition-all duration-300 placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 sm:px-4 sm:py-3 sm:text-base"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium text-gray-700 sm:text-sm">
                  Display Order <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="displayOrder"
                  value={form.displayOrder}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition-all duration-300 placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 sm:px-4 sm:py-3 sm:text-base"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-gray-700 sm:text-sm">
                Subtitle
              </label>
              <textarea
                name="subtitle"
                value={form.subtitle}
                onChange={handleChange}
                rows={3}
                placeholder="Luxury that moves with you"
                className="w-full resize-none rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition-all duration-300 placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 sm:px-4 sm:py-3 sm:text-base"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-medium text-gray-700 sm:text-sm">
                  Upload Model Image
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />

                <label
                  htmlFor="image-upload"
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-3 py-3 text-xs text-gray-700 transition-all duration-300 hover:border-gray-400 hover:bg-gray-100 sm:px-4 sm:text-sm"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      <span>Click to upload</span>
                    </>
                  )}
                </label>
              </div>

              <div className="flex items-center gap-3 md:pt-8">
                <input
                  id="active"
                  type="checkbox"
                  name="active"
                  checked={form.active}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300"
                />

                <label
                  htmlFor="active"
                  className="cursor-pointer text-sm font-medium text-gray-700"
                >
                  Active
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-xs font-medium text-gray-700 sm:text-sm">
                  Model Image URL <span className="text-red-500">*</span>
                </label>

                <input
                  name="modelImageUrl"
                  value={form.modelImageUrl}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 font-mono text-xs text-gray-900 outline-none transition-all duration-300 placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 sm:px-4 sm:py-3 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium text-gray-700 sm:text-sm">
                  Cloudinary Public ID
                </label>

                <input
                  name="cloudinaryPublicId"
                  value={form.cloudinaryPublicId}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 font-mono text-xs text-gray-900 outline-none transition-all duration-300 placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 sm:px-4 sm:py-3 sm:text-sm"
                />
              </div>
            </div>

            <AnimatePresence>
              {form.modelImageUrl && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                >
                  <p className="mb-2 text-xs font-medium text-gray-700 sm:text-sm">
                    Preview
                  </p>

                  <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
                    {!imagePreviewError ? (
                      <img
                        src={form.modelImageUrl}
                        alt="Model preview"
                        className="h-[220px] w-full object-cover sm:h-[280px] md:h-[340px]"
                        onError={() => setImagePreviewError(true)}
                      />
                    ) : (
                      <div className="flex h-[220px] w-full items-center justify-center bg-gray-100 sm:h-[280px] md:h-[340px]">
                        <ImageIcon className="h-10 w-10 text-gray-400 sm:h-12 sm:w-12" />
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <button
                type="button"
                onClick={() => setShowProductSelector(!showProductSelector)}
                className="flex w-full items-center justify-between rounded-xl border border-gray-300 bg-white p-3 transition-all duration-300 hover:bg-gray-50 sm:p-4"
              >
                <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                  <span className="text-sm font-semibold text-gray-900 sm:text-base">
                    Select Products
                  </span>

                  <span className="whitespace-nowrap rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600 sm:text-sm">
                    {form.productIds.length} selected
                  </span>
                </div>

                <ChevronDown
                  className={`h-4 w-4 text-gray-500 transition-transform duration-300 sm:h-5 sm:w-5 ${
                    showProductSelector ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {showProductSelector && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="mt-3 sm:mt-4"
                  >
                    <div className="mb-3 flex flex-col gap-2 sm:mb-4 sm:flex-row sm:gap-3">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                        <input
                          type="text"
                          placeholder="Search products..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full rounded-xl border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                        />
                      </div>

                      <div className="flex self-start rounded-xl bg-gray-100 p-1">
                        <button
                          type="button"
                          onClick={() => setViewMode("grid")}
                          className={`rounded-lg p-2 transition-all duration-200 ${
                            viewMode === "grid"
                              ? "bg-white text-gray-900 shadow-sm"
                              : "text-gray-500 hover:text-gray-900"
                          }`}
                        >
                          <Grid3x3 className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setViewMode("list")}
                          className={`rounded-lg p-2 transition-all duration-200 ${
                            viewMode === "list"
                              ? "bg-white text-gray-900 shadow-sm"
                              : "text-gray-500 hover:text-gray-900"
                          }`}
                        >
                          <List className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white">
                      {productsLoading ? (
                        <div className="p-8 text-center">
                          <Loader2 className="mx-auto mb-2 h-6 w-6 animate-spin text-gray-400" />
                          <p className="text-sm text-gray-500">
                            Loading products...
                          </p>
                        </div>
                      ) : filteredProducts.length === 0 ? (
                        <div className="p-8 text-center text-sm text-gray-500">
                          {searchTerm
                            ? "No products match your search."
                            : "No products found."}
                        </div>
                      ) : viewMode === "grid" ? (
                        <div className="max-h-[60vh] overflow-y-auto p-3 sm:p-4">
                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
                            {filteredProducts.map((product) => {
                              const checked = form.productIds.includes(
                                Number(product.id)
                              );

                              return (
                                <button
                                  type="button"
                                  key={product.id}
                                  onClick={() => handleToggleProduct(product.id)}
                                  className={`group relative overflow-hidden rounded-xl border text-left transition-all duration-300 ${
                                    checked
                                      ? "border-gray-900 bg-gray-50 shadow-sm"
                                      : "border-gray-200 bg-white hover:border-gray-400"
                                  }`}
                                >
                                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                                    <ProductImageThumb
                                      product={product}
                                      sizeClass="h-full w-full"
                                      imageClass="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                      iconClass="h-8 w-8"
                                    />

                                    {checked && (
                                      <div className="absolute right-2 top-2 rounded-full bg-gray-900 p-1">
                                        <Check className="h-3 w-3 text-white" />
                                      </div>
                                    )}
                                  </div>

                                  <div className="p-3">
                                    <p className="line-clamp-2 text-sm font-semibold text-gray-900">
                                      {product.title}
                                    </p>

                                    <p className="mt-1 text-xs text-gray-500">
                                      ₹
                                      {product.priceInr?.toLocaleString?.() ||
                                        product.priceInr ||
                                        0}
                                    </p>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <div className="max-h-[60vh] overflow-y-auto divide-y divide-gray-200">
                          {filteredProducts.map((product) => {
                            const checked = form.productIds.includes(
                              Number(product.id)
                            );

                            return (
                              <button
                                type="button"
                                key={product.id}
                                onClick={() => handleToggleProduct(product.id)}
                                className={`flex w-full items-center gap-3 p-3 transition-all duration-200 sm:p-4 ${
                                  checked ? "bg-gray-50" : "hover:bg-gray-50"
                                }`}
                              >
                                <ProductImageThumb
                                  product={product}
                                  sizeClass="h-10 w-10 sm:h-12 sm:w-12"
                                  imageClass="h-full w-full object-cover"
                                  iconClass="h-4 w-4"
                                />

                                <div className="min-w-0 flex-1 text-left">
                                  <p className="truncate text-sm font-medium text-gray-900">
                                    {product.title}
                                  </p>

                                  <p className="text-xs text-gray-500">
                                    ₹
                                    {product.priceInr?.toLocaleString?.() ||
                                      product.priceInr ||
                                      0}
                                  </p>
                                </div>

                                {checked && (
                                  <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-gray-900">
                                    <Check className="h-3 w-3 text-white" />
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {selectedProducts.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 16 }}
                >
                  <p className="mb-3 text-xs font-medium text-gray-700 sm:text-sm">
                    Selected Products ({selectedProducts.length})
                  </p>

                  <div className="max-h-[40vh] space-y-2 overflow-y-auto">
                    {selectedProducts.map((product, index) => {
                      return (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, x: -16 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.04 }}
                          className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-3 py-3 sm:px-4"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <span className="flex-shrink-0 font-mono text-xs text-gray-400">
                              #{index + 1}
                            </span>

                            <ProductImageThumb
                              product={product}
                              sizeClass="h-12 w-12"
                              imageClass="h-full w-full object-cover"
                              iconClass="h-5 w-5"
                            />

                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-gray-900">
                                {product.title}
                              </p>

                              <p className="hidden text-xs text-gray-500 sm:block">
                                ID: {product.id}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleToggleProduct(product.id)}
                            className="flex-shrink-0 rounded-lg p-1.5 text-red-500 transition-all duration-200 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-end pt-2 sm:pt-4">
              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-black disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-7"
              >
                <span className="flex items-center justify-center gap-2">
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    submitLabel
                  )}
                </span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}