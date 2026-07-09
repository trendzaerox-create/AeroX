// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { useRouter, useParams } from "next/navigation";
// import { useDispatch, useSelector } from "react-redux";
// import api from "@/lib/apiClient";

// import { fetchAdminCategories } from "@/features/categories/categorySlice";

// import {
//   updateProduct,
//   addProductReview,
//   updateProductReview,
//   deleteProductReview,
// } from "@/features/adminProducts/adminProductThunks";

// import { uploadProductImages } from "@/features/products/uploadSlice";

// const API_BASE_URL =
//   process.env.NEXT_PUBLIC_API_BASE_URL ||
//   process.env.NEXT_PUBLIC_API_URL ||
//   process.env.NEXT_PUBLIC_API_BASE ||
//   "http://localhost:8080";

// function getMediaUrl(item) {
//   if (!item) return "";
//   if (typeof item === "string") return item;

//   return (
//     item.imageUrl ||
//     item.mediaUrl ||
//     item.videoUrl ||
//     item.url ||
//     item.fileUrl ||
//     item.secure_url ||
//     item.path ||
//     ""
//   );
// }

// function uniqueMediaItems(items = []) {
//   const seen = new Set();

//   return items.filter((item) => {
//     const url = getMediaUrl(item);

//     if (!url) return false;

//     const cleanUrl = String(url).trim();

//     if (seen.has(cleanUrl)) return false;

//     seen.add(cleanUrl);
//     return true;
//   });
// }

// function normalizeUploadedResponse(res) {
//   if (!res) return [];

//   if (Array.isArray(res)) return res;

//   if (Array.isArray(res.urls)) return res.urls;
//   if (Array.isArray(res.images)) return res.images;
//   if (Array.isArray(res.data)) return res.data;
//   if (Array.isArray(res.files)) return res.files;

//   return [res];
// }

// function resolveUrl(url = "") {
//   if (!url) return "";
//   if (url.startsWith("blob:")) return url;
//   if (url.startsWith("http")) return url;

//   const base = API_BASE_URL.replace(/\/$/, "");
//   const path = url.startsWith("/") ? url : `/${url}`;

//   return `${base}${path}`;
// }

// function safeJsonArray(value) {
//   if (!value || !String(value).trim()) return [];

//   try {
//     const parsed = JSON.parse(value);
//     return Array.isArray(parsed) ? parsed : [];
//   } catch {
//     return [];
//   }
// }

// function stringifyJson(value) {
//   return JSON.stringify(value, null, 2);
// }

// function emptyEditorRow() {
//   return { first: "", second: "" };
// }

// function getFirstAvailableValue(item, keys) {
//   if (!item || typeof item !== "object") return "";

//   for (const key of keys) {
//     const value = item[key];

//     if (value !== null && value !== undefined && String(value).trim() !== "") {
//       return String(value);
//     }
//   }

//   return "";
// }

// function normalizeEditorRows(jsonValue, firstKeys = [], secondKeys = []) {
//   const parsed = safeJsonArray(jsonValue);

//   const rows = parsed
//     .map((item) => {
//       if (typeof item === "string") {
//         return {
//           first: item,
//           second: "",
//         };
//       }

//       return {
//         first: getFirstAvailableValue(item, firstKeys),
//         second: getFirstAvailableValue(item, secondKeys),
//       };
//     })
//     .filter((row) => row.first.trim() || row.second.trim());

//   return rows.length > 0 ? rows : [emptyEditorRow()];
// }

// function rowsToJsonArray(rows, firstKey, secondKey) {
//   return rows
//     .map((row) => ({
//       [firstKey]: String(row.first || "").trim(),
//       [secondKey]: String(row.second || "").trim(),
//     }))
//     .filter((item) => item[firstKey] || item[secondKey]);
// }

// function rowsToJsonString(rows, firstKey, secondKey) {
//   return stringifyJson(rowsToJsonArray(rows, firstKey, secondKey));
// }

// function EditableJsonRows({
//   title,
//   note,
//   rows,
//   onRowsChange,
//   firstLabel,
//   secondLabel,
//   firstPlaceholder,
//   secondPlaceholder,
//   addButtonText,
//   inputStyle,
//   labelStyle,
// }) {
//   const safeRows = rows && rows.length > 0 ? rows : [emptyEditorRow()];

//   const updateRow = (index, field, value) => {
//     const nextRows = safeRows.map((row, rowIndex) =>
//       rowIndex === index ? { ...row, [field]: value } : row,
//     );

//     onRowsChange(nextRows);
//   };

//   const addRow = () => {
//     onRowsChange([...safeRows, emptyEditorRow()]);
//   };

//   const removeRow = (index) => {
//     const nextRows = safeRows.filter((_, rowIndex) => rowIndex !== index);
//     onRowsChange(nextRows.length > 0 ? nextRows : [emptyEditorRow()]);
//   };

//   return (
//     <div>
//       <label style={labelStyle}>{title}</label>

//       {note && (
//         <p
//           style={{
//             margin: "-2px 0 12px",
//             fontSize: "12px",
//             lineHeight: 1.5,
//             color: "#6b7280",
//           }}
//         >
//           {note}
//         </p>
//       )}

//       <div style={{ display: "grid", gap: "12px" }}>
//         {safeRows.map((row, index) => (
//           <div
//             key={index}
//             style={{
//               display: "grid",
//               gridTemplateColumns: "1fr 1fr auto",
//               gap: "12px",
//               alignItems: "end",
//               border: "1px solid #e5e7eb",
//               borderRadius: "12px",
//               padding: "12px",
//               background: "#ffffff",
//             }}
//           >
//             <div>
//               <label
//                 style={{
//                   display: "block",
//                   marginBottom: "6px",
//                   fontSize: "12px",
//                   fontWeight: "700",
//                   color: "#374151",
//                 }}
//               >
//                 {firstLabel}
//               </label>
//               <input
//                 value={row.first}
//                 onChange={(e) => updateRow(index, "first", e.target.value)}
//                 placeholder={firstPlaceholder}
//                 style={inputStyle}
//               />
//             </div>

//             <div>
//               <label
//                 style={{
//                   display: "block",
//                   marginBottom: "6px",
//                   fontSize: "12px",
//                   fontWeight: "700",
//                   color: "#374151",
//                 }}
//               >
//                 {secondLabel}
//               </label>
//               <input
//                 value={row.second}
//                 onChange={(e) => updateRow(index, "second", e.target.value)}
//                 placeholder={secondPlaceholder}
//                 style={inputStyle}
//               />
//             </div>

//             <button
//               type="button"
//               onClick={() => removeRow(index)}
//               style={{
//                 padding: "12px 14px",
//                 background: "#dc2626",
//                 color: "#ffffff",
//                 border: "none",
//                 borderRadius: "10px",
//                 cursor: "pointer",
//                 fontWeight: "700",
//                 whiteSpace: "nowrap",
//               }}
//             >
//               Remove
//             </button>
//           </div>
//         ))}
//       </div>

//       <button
//         type="button"
//         onClick={addRow}
//         style={{
//           marginTop: "12px",
//           padding: "11px 16px",
//           background: "#111827",
//           color: "#ffffff",
//           border: "none",
//           borderRadius: "10px",
//           fontSize: "14px",
//           fontWeight: "700",
//           cursor: "pointer",
//         }}
//       >
//         {addButtonText}
//       </button>
//     </div>
//   );
// }

// export default function EditProductPage() {
//   const dispatch = useDispatch();
//   const router = useRouter();
//   const params = useParams();

//   const id = params?.id;
//   const productId = Number(id);

//   const [loading, setLoading] = useState(false);
//   const [bannerUploading, setBannerUploading] = useState(false);

//   const categories = useSelector(
//     (state) => state.categories?.adminCategories || [],
//   );

//   const [product, setProduct] = useState(null);

//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [price, setPrice] = useState("");
//   const [mrp, setMrp] = useState("");
//   const [stock, setStock] = useState("");
//   const [displayOrder, setDisplayOrder] = useState("");
//   const [categoryId, setCategoryId] = useState("");

//   const [shortHighlights, setShortHighlights] = useState("");
//   const [warrantyInfo, setWarrantyInfo] = useState("");
//   const [compatibility, setCompatibility] = useState("");
//   const [demoVideoUrl, setDemoVideoUrl] = useState("");
//   const [pdpBannersJson, setPdpBannersJson] = useState("[]");

//   const [specificationRows, setSpecificationRows] = useState([
//     emptyEditorRow(),
//   ]);
//   const [featureRows, setFeatureRows] = useState([emptyEditorRow()]);
//   const [faqRows, setFaqRows] = useState([emptyEditorRow()]);
//   const [boxRows, setBoxRows] = useState([emptyEditorRow()]);

//   const [files, setFiles] = useState([]);
//   const [bannerFiles, setBannerFiles] = useState([]);
//   const [bannerPreviewUrls, setBannerPreviewUrls] = useState([]);

//   const [images, setImages] = useState([]);
//   const [reviews, setReviews] = useState([]);

//   const [reviewerName, setReviewerName] = useState("");
//   const [rating, setRating] = useState("5");
//   const [reviewText, setReviewText] = useState("");
//   const [featured, setFeatured] = useState(false);
//   const [editingReviewId, setEditingReviewId] = useState(null);

//   const parsedPdpBanners = useMemo(
//     () => safeJsonArray(pdpBannersJson),
//     [pdpBannersJson],
//   );

//   useEffect(() => {
//     dispatch(fetchAdminCategories());
//   }, [dispatch]);

//   useEffect(() => {
//     if (!id) return;

//     api
//       .get(`/api/admin/products/${id}`)
//       .then((res) => {
//         const p = res.data;

//         const nextSpecificationsJson = p.specificationsJson || "[]";
//         const nextFeatureHighlightsJson = p.featureHighlightsJson || "[]";
//         const nextFaqJson = p.faqJson || "[]";
//         const nextBoxContentsJson = p.boxContentsJson || "[]";

//         setProduct(p);
//         setTitle(p.title || "");
//         setDescription(p.description || "");

//         setPrice(
//           p.priceInr === null || p.priceInr === undefined
//             ? ""
//             : String(p.priceInr),
//         );

//         setMrp(
//           p.mrpInr === null || p.mrpInr === undefined ? "" : String(p.mrpInr),
//         );

//         setStock(
//           p.stock === null || p.stock === undefined ? "" : String(p.stock),
//         );

//         setDisplayOrder(
//           p.displayOrder === null || p.displayOrder === undefined
//             ? ""
//             : String(p.displayOrder),
//         );

//         const resolvedCategoryId =
//           typeof p.category === "object" && p.category !== null
//             ? p.category.id
//             : p.categoryId;

//         setCategoryId(
//           resolvedCategoryId === null || resolvedCategoryId === undefined
//             ? ""
//             : String(resolvedCategoryId),
//         );

//         setShortHighlights(p.shortHighlights || "");
//         setWarrantyInfo(p.warrantyInfo || "");
//         setCompatibility(p.compatibility || "");
//         setDemoVideoUrl(p.demoVideoUrl || "");
//         setPdpBannersJson(p.pdpBannersJson || "[]");

//         setSpecificationRows(
//           normalizeEditorRows(
//             nextSpecificationsJson,
//             ["name", "title", "key", "label", "specification"],
//             ["value", "description", "detail", "details"],
//           ),
//         );

//         setFeatureRows(
//           normalizeEditorRows(
//             nextFeatureHighlightsJson,
//             ["title", "name", "feature", "heading"],
//             ["description", "value", "detail", "details", "text"],
//           ),
//         );

//         setFaqRows(
//           normalizeEditorRows(
//             nextFaqJson,
//             ["question", "q", "title"],
//             ["answer", "a", "description", "value"],
//           ),
//         );

//         setBoxRows(
//           normalizeEditorRows(
//             nextBoxContentsJson,
//             ["item", "name", "title", "boxItem", "content"],
//             ["quantity", "detail", "details", "value", "description"],
//           ),
//         );

//         setImages(uniqueMediaItems(p.images || []));
//         setReviews(p.reviews || []);
//       })
//       .catch((err) => {
//         console.error(err);
//         alert("Failed to load product");
//       });
//   }, [id]);

//   useEffect(() => {
//     return () => {
//       bannerPreviewUrls.forEach((url) => URL.revokeObjectURL(url));
//     };
//   }, [bannerPreviewUrls]);

//   const syncSpecificationRows = (nextRows) => {
//     const rows = nextRows.length > 0 ? nextRows : [emptyEditorRow()];
//     setSpecificationRows(rows);
//   };

//   const syncFeatureRows = (nextRows) => {
//     const rows = nextRows.length > 0 ? nextRows : [emptyEditorRow()];
//     setFeatureRows(rows);
//   };

//   const syncFaqRows = (nextRows) => {
//     const rows = nextRows.length > 0 ? nextRows : [emptyEditorRow()];
//     setFaqRows(rows);
//   };

//   const syncBoxRows = (nextRows) => {
//     const rows = nextRows.length > 0 ? nextRows : [emptyEditorRow()];
//     setBoxRows(rows);
//   };

//   const handleBannerFileChange = (e) => {
//     const selected = Array.from(e.target.files || []);

//     bannerPreviewUrls.forEach((url) => URL.revokeObjectURL(url));

//     setBannerFiles(selected);
//     setBannerPreviewUrls(selected.map((file) => URL.createObjectURL(file)));
//   };

//   const removeSelectedBanner = (index) => {
//     URL.revokeObjectURL(bannerPreviewUrls[index]);

//     setBannerFiles((prev) => prev.filter((_, i) => i !== index));
//     setBannerPreviewUrls((prev) => prev.filter((_, i) => i !== index));
//   };

//   const removeSavedBanner = (index) => {
//     const arr = [...parsedPdpBanners];
//     arr.splice(index, 1);
//     setPdpBannersJson(stringifyJson(arr));
//   };

//   const removeImage = (index) => {
//     const arr = [...images];
//     arr.splice(index, 1);
//     setImages(arr);
//   };

//   const handleUpload = async () => {
//     if (files.length === 0) {
//       alert("Please select image or video files first");
//       return;
//     }

//     try {
//       const res = await dispatch(uploadProductImages(files)).unwrap();
//       const uploadedMedia = normalizeUploadedResponse(res);

//       setImages((prev) => uniqueMediaItems([...prev, ...uploadedMedia]));
//       setFiles([]);

//       alert("Media uploaded successfully");
//     } catch (err) {
//       console.error(err);
//       alert(typeof err === "string" ? err : err?.message || "Upload failed");
//     }
//   };

//   const handleBannerUpload = async () => {
//     if (bannerFiles.length === 0) {
//       alert("Please select banner image first");
//       return;
//     }

//     setBannerUploading(true);

//     try {
//       const res = await dispatch(uploadProductImages(bannerFiles)).unwrap();
//       const uploadedMedia = normalizeUploadedResponse(res);

//       const oldBanners = safeJsonArray(pdpBannersJson);

//       const uploadedBanners = uploadedMedia
//         .map((item, index) => {
//           const imageUrl = getMediaUrl(item);

//           return {
//             id: Date.now() + index,
//             title: "Premium Product Banner",
//             subtitle: "Highlight your product feature",
//             description: "Add your banner description here.",
//             imageUrl,
//             buttonText: "Shop Now",
//             buttonLink: `/product/${productId}`,
//             sortOrder: oldBanners.length + index + 1,
//             active: true,
//           };
//         })
//         .filter((banner) => Boolean(banner.imageUrl));

//       if (uploadedBanners.length === 0) {
//         alert("Upload completed, but image URL was not returned from backend.");
//         return;
//       }

//       const newBanners = [...oldBanners, ...uploadedBanners];

//       setPdpBannersJson(stringifyJson(newBanners));

//       bannerPreviewUrls.forEach((url) => URL.revokeObjectURL(url));
//       setBannerFiles([]);
//       setBannerPreviewUrls([]);

//       alert("Banner uploaded. Now click Update Product to save.");
//     } catch (err) {
//       console.error(err);
//       alert(
//         typeof err === "string" ? err : err?.message || "Banner upload failed",
//       );
//     } finally {
//       setBannerUploading(false);
//     }
//   };

//   const validateJsonArray = (value, fieldName) => {
//     try {
//       const parsed = JSON.parse(value || "[]");
//       if (!Array.isArray(parsed)) {
//         alert(`${fieldName} must be a JSON array []`);
//         return false;
//       }
//       return true;
//     } catch {
//       alert(`${fieldName} has invalid JSON format`);
//       return false;
//     }
//   };

//   const handleUpdate = async () => {
//     if (loading) return;

//     const cleanSpecificationsJson = rowsToJsonString(
//       specificationRows,
//       "name",
//       "value",
//     );
//     const cleanFeatureHighlightsJson = rowsToJsonString(
//       featureRows,
//       "title",
//       "description",
//     );
//     const cleanFaqJson = rowsToJsonString(faqRows, "question", "answer");
//     const cleanBoxContentsJson = rowsToJsonString(boxRows, "item", "quantity");

//     if (!title.trim()) {
//       alert("Title is required");
//       return;
//     }

//     if (!price || Number(price) <= 0) {
//       alert("Please enter a valid selling price");
//       return;
//     }

//     if (mrp && Number(mrp) <= 0) {
//       alert("Please enter a valid MRP");
//       return;
//     }

//     if (mrp && Number(mrp) < Number(price)) {
//       alert("MRP must be greater than or equal to selling price");
//       return;
//     }

//     if (!stock && stock !== 0) {
//       alert("Stock is required");
//       return;
//     }

//     if (Number(stock) < 0) {
//       alert("Stock cannot be negative");
//       return;
//     }

//     if (displayOrder && Number(displayOrder) < 1) {
//       alert("Display Order must be 1 or greater");
//       return;
//     }

//     if (!categoryId) {
//       alert("Please select category");
//       return;
//     }

//     if (!validateJsonArray(cleanSpecificationsJson, "Specifications JSON"))
//       return;
//     if (
//       !validateJsonArray(cleanFeatureHighlightsJson, "Feature Highlights JSON")
//     )
//       return;
//     if (!validateJsonArray(cleanFaqJson, "FAQ JSON")) return;
//     if (!validateJsonArray(cleanBoxContentsJson, "Box Contents JSON")) return;
//     if (!validateJsonArray(pdpBannersJson, "PDP Banners JSON")) return;

//     setLoading(true);

//     try {
//       const data = {
//         title: title.trim(),
//         description: description.trim(),
//         priceInr: Number(price),
//         mrpInr: mrp ? Number(mrp) : null,
//         stock: Number(stock),
//         displayOrder: displayOrder ? Number(displayOrder) : null,
//         categoryId: Number(categoryId),

//         images: uniqueMediaItems(images)
//           .map((item) => getMediaUrl(item))
//           .filter(Boolean),

//         shortHighlights: shortHighlights?.trim() || "",
//         specificationsJson: cleanSpecificationsJson,
//         featureHighlightsJson: cleanFeatureHighlightsJson,
//         faqJson: cleanFaqJson,
//         warrantyInfo: warrantyInfo?.trim() || "",
//         boxContentsJson: cleanBoxContentsJson,
//         compatibility: compatibility?.trim() || "",
//         demoVideoUrl: demoVideoUrl?.trim() || "",
//         pdpBannersJson: pdpBannersJson?.trim() || "[]",
//       };

//       await dispatch(updateProduct({ id: productId, data })).unwrap();

//       alert("Product updated");
//       router.push("/admin/products");
//     } catch (err) {
//       console.error(err);
//       alert(typeof err === "string" ? err : err?.message || "Update failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetReviewForm = () => {
//     setReviewerName("");
//     setRating("5");
//     setReviewText("");
//     setFeatured(false);
//     setEditingReviewId(null);
//   };

//   const handleSaveReview = async () => {
//   if (!reviewerName.trim() || !reviewText.trim()) {
//     alert("Reviewer name and review text are required");
//     return;
//   }

//   const data = {
//     reviewerName: reviewerName.trim(),
//     rating: Number(rating),
//     reviewText: reviewText.trim(),
//     featured,
//   };

//   try {
//     if (editingReviewId) {
//       const result = await dispatch(
//         updateProductReview({
//           productId,
//           reviewId: editingReviewId,
//           data,
//         })
//       ).unwrap();

//       // Works for both response types:
//       // 1. direct review object
//       // 2. { review: reviewObject }
//       const savedReview = result?.review || result;

//       setReviews((prev) =>
//         prev.map((r) =>
//           Number(r.id) === Number(savedReview.id) ? savedReview : r
//         )
//       );

//       alert("Review updated");
//     } else {
//       const result = await dispatch(
//         addProductReview({
//           productId,
//           data,
//         })
//       ).unwrap();

//       // Works for both response types:
//       // 1. direct review object
//       // 2. { review: reviewObject }
//       const savedReview = result?.review || result;

//       setReviews((prev) => [savedReview, ...prev]);
//       alert("Review added");
//     }

//     resetReviewForm();
//   } catch (err) {
//     console.error(err);
//     alert(typeof err === "string" ? err : err?.message || "Review save failed");
//   }
// };

//   const handleEditReview = (review) => {
//     setEditingReviewId(review.id);
//     setReviewerName(review.reviewerName || "");
//     setRating(String(review.rating || 5));
//     setReviewText(review.reviewText || "");
//     setFeatured(!!review.featured);
//   };

//   const handleDeleteReview = async (reviewId) => {
//     const ok = window.confirm("Delete this review?");
//     if (!ok) return;

//     try {
//       await dispatch(deleteProductReview({ productId, reviewId })).unwrap();
//       setReviews((prev) => prev.filter((r) => r.id !== reviewId));

//       if (editingReviewId === reviewId) resetReviewForm();

//       alert("Review deleted");
//     } catch (err) {
//       console.error(err);
//       alert("Review delete failed");
//     }
//   };

//   const labelStyle = {
//     display: "block",
//     marginBottom: "8px",
//     fontSize: "14px",
//     fontWeight: "600",
//     color: "#111827",
//   };

//   const inputStyle = {
//     width: "100%",
//     padding: "12px 14px",
//     border: "1px solid #d1d5db",
//     borderRadius: "10px",
//     fontSize: "15px",
//     color: "#111827",
//     background: "#ffffff",
//     outline: "none",
//     boxSizing: "border-box",
//   };

//   const textareaStyle = {
//     ...inputStyle,
//     resize: "vertical",
//   };

//   const jsonTextareaStyle = {
//     ...textareaStyle,
//     fontFamily:
//       "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
//     fontSize: "13px",
//     lineHeight: 1.6,
//   };

//   if (!product) {
//     return (
//       <div
//         style={{
//           minHeight: "100vh",
//           background: "#f8f8f8",
//           padding: "40px 16px",
//           color: "#111827",
//         }}
//       >
//         Loading...
//       </div>
//     );
//   }

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background: "#f8f8f8",
//         padding: "40px 16px",
//       }}
//     >
//       <div
//         style={{
//           maxWidth: "960px",
//           margin: "0 auto",
//           background: "#ffffff",
//           border: "1px solid #e5e7eb",
//           borderRadius: "16px",
//           padding: "28px",
//           boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
//         }}
//       >
//         <h1
//           style={{
//             margin: "0 0 24px 0",
//             fontSize: "28px",
//             fontWeight: "700",
//             color: "#111827",
//           }}
//         >
//           Edit Product
//         </h1>

//         <div style={{ display: "grid", gap: "18px" }}>
//           <div>
//             <label style={labelStyle}>Title</label>
//             <input
//               placeholder="Title"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               style={inputStyle}
//             />
//           </div>

//           <div>
//             <label style={labelStyle}>Description</label>
//             <textarea
//               placeholder="Description"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               rows={5}
//               style={textareaStyle}
//             />
//           </div>

//           <div
//             style={{
//               border: "1px solid #e5e7eb",
//               borderRadius: "14px",
//               background: "#f9fafb",
//               padding: "18px",
//               display: "grid",
//               gap: "16px",
//             }}
//           >
//             <h2
//               style={{
//                 margin: 0,
//                 fontSize: "20px",
//                 fontWeight: "800",
//                 color: "#111827",
//               }}
//             >
//               Advanced Product Details
//             </h2>

//             <div>
//               <label style={labelStyle}>Short Highlights</label>
//               <textarea
//                 value={shortHighlights}
//                 onChange={(e) => setShortHighlights(e.target.value)}
//                 rows={3}
//                 style={textareaStyle}
//               />
//             </div>

//             <EditableJsonRows
//               title="Specifications"
//               note="Admin fills normal rows. This page automatically saves it as specificationsJson JSON array string."
//               rows={specificationRows}
//               onRowsChange={syncSpecificationRows}
//               firstLabel="Specification Name"
//               secondLabel="Specification Value"
//               firstPlaceholder="Example: Battery Backup"
//               secondPlaceholder="Example: Up to 54 Hours"
//               addButtonText="+ Add Specification"
//               inputStyle={inputStyle}
//               labelStyle={labelStyle}
//             />

//             <EditableJsonRows
//               title="Feature Highlights"
//               note="Admin fills normal rows. This page automatically saves it as featureHighlightsJson JSON array string."
//               rows={featureRows}
//               onRowsChange={syncFeatureRows}
//               firstLabel="Feature Title"
//               secondLabel="Feature Description"
//               firstPlaceholder="Example: Deep Bass Sound"
//               secondPlaceholder="Example: Powerful bass with clear vocals"
//               addButtonText="+ Add Feature"
//               inputStyle={inputStyle}
//               labelStyle={labelStyle}
//             />

//             <EditableJsonRows
//               title="FAQs"
//               note="Admin fills normal rows. This page automatically saves it as faqJson JSON array string."
//               rows={faqRows}
//               onRowsChange={syncFaqRows}
//               firstLabel="FAQ Question"
//               secondLabel="FAQ Answer"
//               firstPlaceholder="Example: Is this product wireless?"
//               secondPlaceholder="Example: Yes, it supports wireless use."
//               addButtonText="+ Add FAQ"
//               inputStyle={inputStyle}
//               labelStyle={labelStyle}
//             />

//             <div>
//               <label style={labelStyle}>Warranty Info</label>
//               <textarea
//                 value={warrantyInfo}
//                 onChange={(e) => setWarrantyInfo(e.target.value)}
//                 rows={3}
//                 style={textareaStyle}
//               />
//             </div>

//             <EditableJsonRows
//               title="Box Contents"
//               note="Admin fills normal rows. This page automatically saves it as boxContentsJson JSON array string."
//               rows={boxRows}
//               onRowsChange={syncBoxRows}
//               firstLabel="Box Item"
//               secondLabel="Quantity / Detail"
//               firstPlaceholder="Example: Earbuds"
//               secondPlaceholder="Example: 1 Pair"
//               addButtonText="+ Add Box Item"
//               inputStyle={inputStyle}
//               labelStyle={labelStyle}
//             />

//             <div>
//               <label style={labelStyle}>Compatibility</label>
//               <input
//                 value={compatibility}
//                 onChange={(e) => setCompatibility(e.target.value)}
//                 style={inputStyle}
//               />
//             </div>

//             <div>
//               <label style={labelStyle}>Demo Video URL</label>
//               <input
//                 value={demoVideoUrl}
//                 onChange={(e) => setDemoVideoUrl(e.target.value)}
//                 style={inputStyle}
//               />
//             </div>

//             <div>
//               <label style={labelStyle}>Upload PDP Banner Images</label>

//               <input
//                 type="file"
//                 multiple
//                 accept="image/*"
//                 onChange={handleBannerFileChange}
//                 style={inputStyle}
//               />

//               {bannerPreviewUrls.length > 0 && (
//                 <div style={{ marginTop: "14px" }}>
//                   <p
//                     style={{
//                       margin: "0 0 10px",
//                       color: "#111827",
//                       fontWeight: 700,
//                     }}
//                   >
//                     Temporary Selected Banner Preview
//                   </p>

//                   <div
//                     style={{
//                       display: "flex",
//                       gap: "12px",
//                       flexWrap: "wrap",
//                     }}
//                   >
//                     {bannerPreviewUrls.map((url, index) => (
//                       <div
//                         key={url}
//                         style={{
//                           position: "relative",
//                           width: "180px",
//                           border: "1px solid #e5e7eb",
//                           borderRadius: "12px",
//                           padding: "8px",
//                           background: "#ffffff",
//                         }}
//                       >
//                         <img
//                           src={url}
//                           alt="Temporary PDP Banner"
//                           style={{
//                             width: "100%",
//                             height: "100px",
//                             objectFit: "cover",
//                             borderRadius: "8px",
//                             display: "block",
//                           }}
//                         />

//                         <button
//                           type="button"
//                           onClick={() => removeSelectedBanner(index)}
//                           style={{
//                             position: "absolute",
//                             top: "-8px",
//                             right: "-8px",
//                             background: "#dc2626",
//                             color: "#fff",
//                             border: "none",
//                             borderRadius: "50%",
//                             width: "24px",
//                             height: "24px",
//                             cursor: "pointer",
//                             fontSize: "16px",
//                             fontWeight: "700",
//                           }}
//                         >
//                           ×
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               <button
//                 type="button"
//                 onClick={handleBannerUpload}
//                 disabled={bannerUploading}
//                 style={{
//                   marginTop: "12px",
//                   padding: "12px 18px",
//                   background: bannerUploading ? "#9ca3af" : "#111827",
//                   color: "#ffffff",
//                   border: "none",
//                   borderRadius: "10px",
//                   fontSize: "14px",
//                   fontWeight: "600",
//                   cursor: bannerUploading ? "not-allowed" : "pointer",
//                 }}
//               >
//                 {bannerUploading ? "Uploading..." : "Upload Banner Image"}
//               </button>
//             </div>

//             {parsedPdpBanners.length > 0 && (
//               <div>
//                 <label style={labelStyle}>Saved PDP Banner Preview</label>

//                 <div style={{ display: "grid", gap: "12px" }}>
//                   {parsedPdpBanners.map((banner, index) => {
//                     const imgUrl = resolveUrl(banner.imageUrl);

//                     return (
//                       <div
//                         key={`${banner.imageUrl}-${index}`}
//                         style={{
//                           display: "grid",
//                           gridTemplateColumns: "160px 1fr auto",
//                           gap: "14px",
//                           alignItems: "center",
//                           border: "1px solid #e5e7eb",
//                           borderRadius: "12px",
//                           padding: "10px",
//                           background: "#ffffff",
//                         }}
//                       >
//                         <img
//                           src={imgUrl}
//                           alt={banner.title || "PDP Banner"}
//                           style={{
//                             width: "160px",
//                             height: "90px",
//                             objectFit: "cover",
//                             borderRadius: "8px",
//                             background: "#f3f4f6",
//                           }}
//                         />

//                         <div>
//                           <div
//                             style={{
//                               fontWeight: "800",
//                               color: "#111827",
//                               marginBottom: "4px",
//                             }}
//                           >
//                             {banner.title || "Untitled Banner"}
//                           </div>

//                           <div
//                             style={{
//                               color: "#4b5563",
//                               fontSize: "13px",
//                               wordBreak: "break-all",
//                             }}
//                           >
//                             {banner.imageUrl}
//                           </div>
//                         </div>

//                         <button
//                           type="button"
//                           onClick={() => removeSavedBanner(index)}
//                           style={{
//                             padding: "10px 14px",
//                             background: "#dc2626",
//                             color: "#ffffff",
//                             border: "none",
//                             borderRadius: "8px",
//                             cursor: "pointer",
//                             fontWeight: "700",
//                           }}
//                         >
//                           Remove
//                         </button>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             )}

//             <div>
//               <label style={labelStyle}>PDP Banners JSON Preview</label>
//               <textarea
//                 value={pdpBannersJson}
//                 readOnly
//                 rows={12}
//                 style={{
//                   ...jsonTextareaStyle,
//                   background: "#f3f4f6",
//                   color: "#374151",
//                 }}
//               />
//               <p
//                 style={{
//                   margin: "6px 0 0",
//                   fontSize: "12px",
//                   color: "#6b7280",
//                 }}
//               >
//                 This is generated automatically from uploaded PDP banners. Admin
//                 does not need to type JSON manually.
//               </p>
//             </div>
//           </div>

//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
//               gap: "18px",
//             }}
//           >
//             <div>
//               <label style={labelStyle}>Selling Price ₹</label>
//               <input
//                 type="number"
//                 min="0"
//                 value={price}
//                 onChange={(e) => setPrice(e.target.value)}
//                 style={inputStyle}
//               />
//             </div>

//             <div>
//               <label style={labelStyle}>MRP ₹</label>
//               <input
//                 type="number"
//                 min="0"
//                 value={mrp}
//                 onChange={(e) => setMrp(e.target.value)}
//                 style={inputStyle}
//               />
//             </div>

//             <div>
//               <label style={labelStyle}>Stock</label>
//               <input
//                 type="number"
//                 min="0"
//                 value={stock}
//                 onChange={(e) => setStock(e.target.value)}
//                 style={inputStyle}
//               />
//             </div>

//             <div>
//               <label style={labelStyle}>Display Order</label>
//               <input
//                 type="number"
//                 min="1"
//                 value={displayOrder}
//                 onChange={(e) => setDisplayOrder(e.target.value)}
//                 placeholder="1"
//                 style={inputStyle}
//               />
//               <p
//                 style={{
//                   margin: "6px 0 0",
//                   fontSize: "12px",
//                   color: "#6b7280",
//                 }}
//               >
//                 Lower number shows first. Example: 1 = first product.
//               </p>
//             </div>
//           </div>

//           <div>
//             <label style={labelStyle}>Category</label>
//             <select
//               value={categoryId}
//               onChange={(e) => setCategoryId(e.target.value)}
//               style={inputStyle}
//             >
//               <option value="">Select Category</option>
//               {categories.map((cat) => (
//                 <option key={cat.id} value={cat.id}>
//                   {cat.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label style={labelStyle}>Upload More Images / Videos</label>
//             <input
//               type="file"
//               multiple
//               accept="image/*,video/mp4,video/webm,video/quicktime"
//               onChange={(e) => setFiles(Array.from(e.target.files || []))}
//               style={inputStyle}
//             />
//           </div>

//           {images.length > 0 && (
//             <div>
//               <label style={labelStyle}>Current Product Images</label>

//               <div
//                 style={{
//                   display: "flex",
//                   gap: "12px",
//                   flexWrap: "wrap",
//                   marginTop: "10px",
//                 }}
//               >
//                 {images.map((item, index) => {
//                   const mediaUrl = resolveUrl(getMediaUrl(item));
//                   const isVideo =
//                     mediaUrl.endsWith(".mp4") ||
//                     mediaUrl.endsWith(".webm") ||
//                     mediaUrl.endsWith(".mov");

//                   return (
//                     <div
//                       key={`${mediaUrl}-${index}`}
//                       style={{
//                         position: "relative",
//                         width: "150px",
//                         border: "1px solid #e5e7eb",
//                         borderRadius: "12px",
//                         padding: "8px",
//                         background: "#ffffff",
//                       }}
//                     >
//                       {isVideo ? (
//                         <video
//                           src={mediaUrl}
//                           controls
//                           style={{
//                             width: "100%",
//                             height: "120px",
//                             objectFit: "cover",
//                             borderRadius: "8px",
//                             background: "#f3f4f6",
//                           }}
//                         />
//                       ) : (
//                         <img
//                           src={mediaUrl}
//                           alt="Product"
//                           style={{
//                             width: "100%",
//                             height: "120px",
//                             objectFit: "cover",
//                             borderRadius: "8px",
//                             background: "#f3f4f6",
//                           }}
//                         />
//                       )}

//                       <button
//                         type="button"
//                         onClick={() => removeImage(index)}
//                         style={{
//                           position: "absolute",
//                           top: "-8px",
//                           right: "-8px",
//                           background: "#dc2626",
//                           color: "#fff",
//                           border: "none",
//                           borderRadius: "50%",
//                           width: "24px",
//                           height: "24px",
//                           cursor: "pointer",
//                           fontSize: "16px",
//                           fontWeight: "700",
//                         }}
//                       >
//                         ×
//                       </button>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           )}

//           <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
//             <button
//               type="button"
//               onClick={handleUpload}
//               style={{
//                 padding: "12px 18px",
//                 background: "#111827",
//                 color: "#ffffff",
//                 border: "none",
//                 borderRadius: "10px",
//                 fontSize: "14px",
//                 fontWeight: "600",
//                 cursor: "pointer",
//               }}
//             >
//               Upload Media
//             </button>

//             <button
//               type="button"
//               onClick={handleUpdate}
//               disabled={loading}
//               style={{
//                 padding: "12px 18px",
//                 background: loading ? "#9ca3af" : "#2563eb",
//                 color: "#ffffff",
//                 border: "none",
//                 borderRadius: "10px",
//                 fontSize: "14px",
//                 fontWeight: "600",
//                 cursor: loading ? "not-allowed" : "pointer",
//               }}
//             >
//               {loading ? "Updating..." : "Update Product"}
//             </button>
//           </div>

//           <hr
//             style={{
//               margin: "40px 0",
//               borderColor: "#e5e7eb",
//             }}
//           />

//           <h2
//             style={{
//               fontSize: "24px",
//               fontWeight: "700",
//               color: "#111827",
//               marginBottom: "20px",
//             }}
//           >
//             Manage Reviews
//           </h2>

//           <div style={{ display: "grid", gap: "18px" }}>
//             <div>
//               <label style={labelStyle}>Reviewer Name</label>
//               <input
//                 value={reviewerName}
//                 onChange={(e) => setReviewerName(e.target.value)}
//                 placeholder="Reviewer Name"
//                 style={inputStyle}
//               />
//             </div>

//             <div>
//               <label style={labelStyle}>Rating</label>
//               <select
//                 value={rating}
//                 onChange={(e) => setRating(e.target.value)}
//                 style={inputStyle}
//               >
//                 <option value="5">5 Star</option>
//                 <option value="4">4 Star</option>
//                 <option value="3">3 Star</option>
//                 <option value="2">2 Star</option>
//                 <option value="1">1 Star</option>
//               </select>
//             </div>

//             <div>
//               <label style={labelStyle}>Review Text</label>
//               <textarea
//                 value={reviewText}
//                 onChange={(e) => setReviewText(e.target.value)}
//                 rows={4}
//                 style={textareaStyle}
//                 placeholder="Customer review..."
//               />
//             </div>

//             <label
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "12px",
//                 marginTop: "14px",
//                 marginBottom: "14px",
//                 padding: "12px 14px",
//                 background: "#f9fafb",
//                 border: "1px solid #d1d5db",
//                 borderRadius: "10px",
//                 color: "#111827",
//                 fontSize: "15px",
//                 fontWeight: "600",
//                 cursor: "pointer",
//                 width: "fit-content",
//               }}
//             >
//               <input
//                 type="checkbox"
//                 checked={featured}
//                 onChange={(e) => setFeatured(e.target.checked)}
//                 style={{
//                   width: "18px",
//                   height: "18px",
//                   accentColor: "#2563eb",
//                   cursor: "pointer",
//                 }}
//               />
//               Featured Review
//             </label>
//             <button
//               type="button"
//               onClick={handleSaveReview}
//               style={{
//                 padding: "12px 18px",
//                 background: "#111827",
//                 color: "#fff",
//                 border: "none",
//                 borderRadius: "10px",
//                 cursor: "pointer",
//                 fontWeight: "600",
//               }}
//             >
//               {editingReviewId ? "Update Review" : "Add Review"}
//             </button>
//           </div>

//           <div
//             style={{
//               marginTop: "32px",
//               background: "#ffffff",
//               border: "1px solid #e5e7eb",
//               borderRadius: "14px",
//               padding: "20px",
//               boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
//             }}
//           >
//             <h3
//               style={{
//                 fontSize: "20px",
//                 fontWeight: "700",
//                 marginBottom: "18px",
//                 color: "#111827",
//               }}
//             >
//               Existing Reviews
//             </h3>

//             {reviews && reviews.length > 0 ? (
//               reviews.map((review) => (
//                 <div
//                   key={review.id}
//                   style={{
//                     background: "#f9fafb",
//                     border: "1px solid #e5e7eb",
//                     padding: "16px",
//                     borderRadius: "12px",
//                     marginBottom: "14px",
//                   }}
//                 >
//                   <div
//                     style={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       alignItems: "center",
//                       marginBottom: "10px",
//                       gap: "10px",
//                     }}
//                   >
//                     <strong
//                       style={{
//                         fontSize: "15px",
//                         color: "#111827",
//                       }}
//                     >
//                       {review.reviewerName || "Customer"}
//                     </strong>

//                     <span
//                       style={{
//                         background: "#16a34a",
//                         color: "#ffffff",
//                         padding: "4px 10px",
//                         borderRadius: "999px",
//                         fontSize: "13px",
//                         fontWeight: "600",
//                       }}
//                     >
//                       ★ {review.rating}/5
//                     </span>
//                   </div>

//                   <p
//                     style={{
//                       fontSize: "14px",
//                       color: "#374151",
//                       lineHeight: "1.6",
//                       marginBottom: "14px",
//                     }}
//                   >
//                     {review.reviewText || "No review text added"}
//                   </p>

//                   <div
//                     style={{
//                       display: "flex",
//                       gap: "10px",
//                       flexWrap: "wrap",
//                     }}
//                   >
//                     <button
//                       type="button"
//                       onClick={() => handleEditReview(review)}
//                       style={{
//                         background: "#2563eb",
//                         color: "#ffffff",
//                         border: "none",
//                         padding: "8px 14px",
//                         borderRadius: "8px",
//                         cursor: "pointer",
//                         fontSize: "14px",
//                         fontWeight: "600",
//                       }}
//                     >
//                       Edit
//                     </button>

//                     <button
//                       type="button"
//                       onClick={() => handleDeleteReview(review.id)}
//                       style={{
//                         background: "#dc2626",
//                         color: "#ffffff",
//                         border: "none",
//                         padding: "8px 14px",
//                         borderRadius: "8px",
//                         cursor: "pointer",
//                         fontSize: "14px",
//                         fontWeight: "600",
//                       }}
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <p
//                 style={{
//                   color: "#6b7280",
//                   fontSize: "14px",
//                   margin: 0,
//                 }}
//               >
//                 No reviews added yet.
//               </p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




















"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import api from "@/lib/apiClient";

import { fetchAdminCategories } from "@/features/categories/categorySlice";

import {
  updateProduct,
  addProductReview,
  updateProductReview,
  deleteProductReview,
} from "@/features/adminProducts/adminProductThunks";

import { uploadProductImages } from "@/features/products/uploadSlice";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE ||
  "http://localhost:8080";

function getMediaUrl(item) {
  if (!item) return "";
  if (typeof item === "string") return item;

  return (
    item.imageUrl ||
    item.mediaUrl ||
    item.videoUrl ||
    item.url ||
    item.fileUrl ||
    item.secure_url ||
    item.path ||
    ""
  );
}

function uniqueMediaItems(items = []) {
  const seen = new Set();

  return items.filter((item) => {
    const url = getMediaUrl(item);

    if (!url) return false;

    const cleanUrl = String(url).trim();

    if (seen.has(cleanUrl)) return false;

    seen.add(cleanUrl);
    return true;
  });
}

function normalizeUploadedResponse(res) {
  if (!res) return [];

  if (Array.isArray(res)) return res;

  if (Array.isArray(res.urls)) return res.urls;
  if (Array.isArray(res.images)) return res.images;
  if (Array.isArray(res.data)) return res.data;
  if (Array.isArray(res.files)) return res.files;

  return [res];
}

function resolveUrl(url = "") {
  if (!url) return "";
  if (url.startsWith("blob:")) return url;
  if (url.startsWith("http")) return url;

  const base = API_BASE_URL.replace(/\/$/, "");
  const path = url.startsWith("/") ? url : `/${url}`;

  return `${base}${path}`;
}

function safeJsonArray(value) {
  if (!value || !String(value).trim()) return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function stringifyJson(value) {
  return JSON.stringify(value, null, 2);
}

function emptyEditorRow() {
  return { first: "", second: "" };
}

function getFirstAvailableValue(item, keys) {
  if (!item || typeof item !== "object") return "";

  for (const key of keys) {
    const value = item[key];

    if (value !== null && value !== undefined && String(value).trim() !== "") {
      return String(value);
    }
  }

  return "";
}

function normalizeEditorRows(jsonValue, firstKeys = [], secondKeys = []) {
  const parsed = safeJsonArray(jsonValue);

  const rows = parsed
    .map((item) => {
      if (typeof item === "string") {
        return {
          first: item,
          second: "",
        };
      }

      return {
        first: getFirstAvailableValue(item, firstKeys),
        second: getFirstAvailableValue(item, secondKeys),
      };
    })
    .filter((row) => row.first.trim() || row.second.trim());

  return rows.length > 0 ? rows : [emptyEditorRow()];
}

function rowsToJsonArray(rows, firstKey, secondKey) {
  return rows
    .map((row) => ({
      [firstKey]: String(row.first || "").trim(),
      [secondKey]: String(row.second || "").trim(),
    }))
    .filter((item) => item[firstKey] || item[secondKey]);
}

function rowsToJsonString(rows, firstKey, secondKey) {
  return stringifyJson(rowsToJsonArray(rows, firstKey, secondKey));
}

function EditableJsonRows({
  title,
  note,
  rows,
  onRowsChange,
  firstLabel,
  secondLabel,
  firstPlaceholder,
  secondPlaceholder,
  addButtonText,
  inputStyle,
  labelStyle,
}) {
  const safeRows = rows && rows.length > 0 ? rows : [emptyEditorRow()];

  const updateRow = (index, field, value) => {
    const nextRows = safeRows.map((row, rowIndex) =>
      rowIndex === index ? { ...row, [field]: value } : row,
    );

    onRowsChange(nextRows);
  };

  const addRow = () => {
    onRowsChange([...safeRows, emptyEditorRow()]);
  };

  const removeRow = (index) => {
    const nextRows = safeRows.filter((_, rowIndex) => rowIndex !== index);
    onRowsChange(nextRows.length > 0 ? nextRows : [emptyEditorRow()]);
  };

  return (
    <div>
      <label style={labelStyle}>{title}</label>

      {note && (
        <p
          style={{
            margin: "-2px 0 12px",
            fontSize: "12px",
            lineHeight: 1.5,
            color: "#6b7280",
          }}
        >
          {note}
        </p>
      )}

      <div style={{ display: "grid", gap: "12px" }}>
        {safeRows.map((row, index) => (
          <div
            key={index}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr auto",
              gap: "12px",
              alignItems: "end",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              padding: "12px",
              background: "#ffffff",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontSize: "12px",
                  fontWeight: "700",
                  color: "#374151",
                }}
              >
                {firstLabel}
              </label>
              <input
                value={row.first}
                onChange={(e) => updateRow(index, "first", e.target.value)}
                placeholder={firstPlaceholder}
                style={inputStyle}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontSize: "12px",
                  fontWeight: "700",
                  color: "#374151",
                }}
              >
                {secondLabel}
              </label>
              <input
                value={row.second}
                onChange={(e) => updateRow(index, "second", e.target.value)}
                placeholder={secondPlaceholder}
                style={inputStyle}
              />
            </div>

            <button
              type="button"
              onClick={() => removeRow(index)}
              style={{
                padding: "12px 14px",
                background: "#dc2626",
                color: "#ffffff",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: "700",
                whiteSpace: "nowrap",
              }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addRow}
        style={{
          marginTop: "12px",
          padding: "11px 16px",
          background: "#111827",
          color: "#ffffff",
          border: "none",
          borderRadius: "10px",
          fontSize: "14px",
          fontWeight: "700",
          cursor: "pointer",
        }}
      >
        {addButtonText}
      </button>
    </div>
  );
}

export default function EditProductPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useParams();

  const id = params?.id;
  const productId = Number(id);

  const [loading, setLoading] = useState(false);
  const [bannerUploading, setBannerUploading] = useState(false);

  const categories = useSelector(
    (state) => state.categories?.adminCategories || [],
  );

  const [product, setProduct] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [mrp, setMrp] = useState("");
  const [discountInr, setDiscountInr] = useState("");
  const [stock, setStock] = useState("");
  const [displayOrder, setDisplayOrder] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [shortHighlights, setShortHighlights] = useState("");
  const [warrantyInfo, setWarrantyInfo] = useState("");
  const [compatibility, setCompatibility] = useState("");
  const [demoVideoUrl, setDemoVideoUrl] = useState("");
  const [pdpBannersJson, setPdpBannersJson] = useState("[]");

  const [specificationRows, setSpecificationRows] = useState([
    emptyEditorRow(),
  ]);
  const [featureRows, setFeatureRows] = useState([emptyEditorRow()]);
  const [faqRows, setFaqRows] = useState([emptyEditorRow()]);
  const [boxRows, setBoxRows] = useState([emptyEditorRow()]);

  const [files, setFiles] = useState([]);
  const [bannerFiles, setBannerFiles] = useState([]);
  const [bannerPreviewUrls, setBannerPreviewUrls] = useState([]);

  const [images, setImages] = useState([]);
  const [reviews, setReviews] = useState([]);

  const [reviewerName, setReviewerName] = useState("");
  const [rating, setRating] = useState("5");
  const [reviewText, setReviewText] = useState("");
  const [featured, setFeatured] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);

  const parsedPdpBanners = useMemo(
    () => safeJsonArray(pdpBannersJson),
    [pdpBannersJson],
  );

  const discountPercent = useMemo(() => {
    const discountedPrice = Number(discountInr);
    const originalPrice = Number(mrp);

    if (
      !Number.isFinite(discountedPrice) ||
      !Number.isFinite(originalPrice) ||
      discountedPrice <= 0 ||
      originalPrice <= 0 ||
      discountedPrice >= originalPrice
    ) {
      return 0;
    }

    return Math.round(((originalPrice - discountedPrice) * 100) / originalPrice);
  }, [discountInr, mrp]);

  useEffect(() => {
    dispatch(fetchAdminCategories());
  }, [dispatch]);

  useEffect(() => {
    if (!id) return;

    api
      .get(`/api/admin/products/${id}`)
      .then((res) => {
        const p = res.data;

        const nextSpecificationsJson = p.specificationsJson || "[]";
        const nextFeatureHighlightsJson = p.featureHighlightsJson || "[]";
        const nextFaqJson = p.faqJson || "[]";
        const nextBoxContentsJson = p.boxContentsJson || "[]";

        setProduct(p);
        setTitle(p.title || "");
        setDescription(p.description || "");

        setPrice(
          p.priceInr === null || p.priceInr === undefined
            ? ""
            : String(p.priceInr),
        );

        setMrp(
          p.mrpInr === null || p.mrpInr === undefined ? "" : String(p.mrpInr),
        );

        setDiscountInr(
          p.discountInr === null || p.discountInr === undefined
            ? ""
            : String(p.discountInr),
        );

        setStock(
          p.stock === null || p.stock === undefined ? "" : String(p.stock),
        );

        setDisplayOrder(
          p.displayOrder === null || p.displayOrder === undefined
            ? ""
            : String(p.displayOrder),
        );

        const resolvedCategoryId =
          typeof p.category === "object" && p.category !== null
            ? p.category.id
            : p.categoryId;

        setCategoryId(
          resolvedCategoryId === null || resolvedCategoryId === undefined
            ? ""
            : String(resolvedCategoryId),
        );

        setShortHighlights(p.shortHighlights || "");
        setWarrantyInfo(p.warrantyInfo || "");
        setCompatibility(p.compatibility || "");
        setDemoVideoUrl(p.demoVideoUrl || "");
        setPdpBannersJson(p.pdpBannersJson || "[]");

        setSpecificationRows(
          normalizeEditorRows(
            nextSpecificationsJson,
            ["name", "title", "key", "label", "specification"],
            ["value", "description", "detail", "details"],
          ),
        );

        setFeatureRows(
          normalizeEditorRows(
            nextFeatureHighlightsJson,
            ["title", "name", "feature", "heading"],
            ["description", "value", "detail", "details", "text"],
          ),
        );

        setFaqRows(
          normalizeEditorRows(
            nextFaqJson,
            ["question", "q", "title"],
            ["answer", "a", "description", "value"],
          ),
        );

        setBoxRows(
          normalizeEditorRows(
            nextBoxContentsJson,
            ["item", "name", "title", "boxItem", "content"],
            ["quantity", "detail", "details", "value", "description"],
          ),
        );

        setImages(uniqueMediaItems(p.images || []));
        setReviews(p.reviews || []);
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to load product");
      });
  }, [id]);

  useEffect(() => {
    return () => {
      bannerPreviewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [bannerPreviewUrls]);

  const syncSpecificationRows = (nextRows) => {
    const rows = nextRows.length > 0 ? nextRows : [emptyEditorRow()];
    setSpecificationRows(rows);
  };

  const syncFeatureRows = (nextRows) => {
    const rows = nextRows.length > 0 ? nextRows : [emptyEditorRow()];
    setFeatureRows(rows);
  };

  const syncFaqRows = (nextRows) => {
    const rows = nextRows.length > 0 ? nextRows : [emptyEditorRow()];
    setFaqRows(rows);
  };

  const syncBoxRows = (nextRows) => {
    const rows = nextRows.length > 0 ? nextRows : [emptyEditorRow()];
    setBoxRows(rows);
  };

  const handleBannerFileChange = (e) => {
    const selected = Array.from(e.target.files || []);

    bannerPreviewUrls.forEach((url) => URL.revokeObjectURL(url));

    setBannerFiles(selected);
    setBannerPreviewUrls(selected.map((file) => URL.createObjectURL(file)));
  };

  const removeSelectedBanner = (index) => {
    URL.revokeObjectURL(bannerPreviewUrls[index]);

    setBannerFiles((prev) => prev.filter((_, i) => i !== index));
    setBannerPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const removeSavedBanner = (index) => {
    const arr = [...parsedPdpBanners];
    arr.splice(index, 1);
    setPdpBannersJson(stringifyJson(arr));
  };

  const removeImage = (index) => {
    const arr = [...images];
    arr.splice(index, 1);
    setImages(arr);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      alert("Please select image or video files first");
      return;
    }

    try {
      const res = await dispatch(uploadProductImages(files)).unwrap();
      const uploadedMedia = normalizeUploadedResponse(res);

      setImages((prev) => uniqueMediaItems([...prev, ...uploadedMedia]));
      setFiles([]);

      alert("Media uploaded successfully");
    } catch (err) {
      console.error(err);
      alert(typeof err === "string" ? err : err?.message || "Upload failed");
    }
  };

  const handleBannerUpload = async () => {
    if (bannerFiles.length === 0) {
      alert("Please select banner image first");
      return;
    }

    setBannerUploading(true);

    try {
      const res = await dispatch(uploadProductImages(bannerFiles)).unwrap();
      const uploadedMedia = normalizeUploadedResponse(res);

      const oldBanners = safeJsonArray(pdpBannersJson);

      const uploadedBanners = uploadedMedia
        .map((item, index) => {
          const imageUrl = getMediaUrl(item);

          return {
            id: Date.now() + index,
            title: "Premium Product Banner",
            subtitle: "Highlight your product feature",
            description: "Add your banner description here.",
            imageUrl,
            buttonText: "Shop Now",
            buttonLink: `/product/${productId}`,
            sortOrder: oldBanners.length + index + 1,
            active: true,
          };
        })
        .filter((banner) => Boolean(banner.imageUrl));

      if (uploadedBanners.length === 0) {
        alert("Upload completed, but image URL was not returned from backend.");
        return;
      }

      const newBanners = [...oldBanners, ...uploadedBanners];

      setPdpBannersJson(stringifyJson(newBanners));

      bannerPreviewUrls.forEach((url) => URL.revokeObjectURL(url));
      setBannerFiles([]);
      setBannerPreviewUrls([]);

      alert("Banner uploaded. Now click Update Product to save.");
    } catch (err) {
      console.error(err);
      alert(
        typeof err === "string" ? err : err?.message || "Banner upload failed",
      );
    } finally {
      setBannerUploading(false);
    }
  };

  const validateJsonArray = (value, fieldName) => {
    try {
      const parsed = JSON.parse(value || "[]");
      if (!Array.isArray(parsed)) {
        alert(`${fieldName} must be a JSON array []`);
        return false;
      }
      return true;
    } catch {
      alert(`${fieldName} has invalid JSON format`);
      return false;
    }
  };

  const handleUpdate = async () => {
    if (loading) return;

    const cleanSpecificationsJson = rowsToJsonString(
      specificationRows,
      "name",
      "value",
    );
    const cleanFeatureHighlightsJson = rowsToJsonString(
      featureRows,
      "title",
      "description",
    );
    const cleanFaqJson = rowsToJsonString(faqRows, "question", "answer");
    const cleanBoxContentsJson = rowsToJsonString(boxRows, "item", "quantity");

    if (!title.trim()) {
      alert("Title is required");
      return;
    }

    if (!price || Number(price) <= 0) {
      alert("Please enter a valid final selling price");
      return;
    }

    if (!mrp || Number(mrp) <= 0) {
      alert("Please enter a valid MRP");
      return;
    }

    if (!discountInr || Number(discountInr) <= 0) {
      alert("Please enter a valid discounted price");
      return;
    }

    if (Number(discountInr) > Number(mrp)) {
      alert("Discounted price cannot be greater than MRP");
      return;
    }

    if (Number(price) > Number(discountInr)) {
      alert("Final selling price cannot be greater than discounted price");
      return;
    }

    if (!stock && stock !== 0) {
      alert("Stock is required");
      return;
    }

    if (Number(stock) < 0) {
      alert("Stock cannot be negative");
      return;
    }

    if (displayOrder && Number(displayOrder) < 1) {
      alert("Display Order must be 1 or greater");
      return;
    }

    if (!categoryId) {
      alert("Please select category");
      return;
    }

    if (!validateJsonArray(cleanSpecificationsJson, "Specifications JSON"))
      return;
    if (
      !validateJsonArray(cleanFeatureHighlightsJson, "Feature Highlights JSON")
    )
      return;
    if (!validateJsonArray(cleanFaqJson, "FAQ JSON")) return;
    if (!validateJsonArray(cleanBoxContentsJson, "Box Contents JSON")) return;
    if (!validateJsonArray(pdpBannersJson, "PDP Banners JSON")) return;

    setLoading(true);

    try {
      const data = {
        title: title.trim(),
        description: description.trim(),
        priceInr: Number(price),
        mrpInr: Number(mrp),
        discountInr: Number(discountInr),
        stock: Number(stock),
        displayOrder: displayOrder ? Number(displayOrder) : null,
        categoryId: Number(categoryId),

        images: uniqueMediaItems(images)
          .map((item) => getMediaUrl(item))
          .filter(Boolean),

        shortHighlights: shortHighlights?.trim() || "",
        specificationsJson: cleanSpecificationsJson,
        featureHighlightsJson: cleanFeatureHighlightsJson,
        faqJson: cleanFaqJson,
        warrantyInfo: warrantyInfo?.trim() || "",
        boxContentsJson: cleanBoxContentsJson,
        compatibility: compatibility?.trim() || "",
        demoVideoUrl: demoVideoUrl?.trim() || "",
        pdpBannersJson: pdpBannersJson?.trim() || "[]",
      };

      await dispatch(updateProduct({ id: productId, data })).unwrap();

      alert("Product updated");
      router.push("/admin/products");
    } catch (err) {
      console.error(err);
      alert(typeof err === "string" ? err : err?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const resetReviewForm = () => {
    setReviewerName("");
    setRating("5");
    setReviewText("");
    setFeatured(false);
    setEditingReviewId(null);
  };

  const handleSaveReview = async () => {
  if (!reviewerName.trim() || !reviewText.trim()) {
    alert("Reviewer name and review text are required");
    return;
  }

  const data = {
    reviewerName: reviewerName.trim(),
    rating: Number(rating),
    reviewText: reviewText.trim(),
    featured,
  };

  try {
    if (editingReviewId) {
      const result = await dispatch(
        updateProductReview({
          productId,
          reviewId: editingReviewId,
          data,
        })
      ).unwrap();

      // Works for both response types:
      // 1. direct review object
      // 2. { review: reviewObject }
      const savedReview = result?.review || result;

      setReviews((prev) =>
        prev.map((r) =>
          Number(r.id) === Number(savedReview.id) ? savedReview : r
        )
      );

      alert("Review updated");
    } else {
      const result = await dispatch(
        addProductReview({
          productId,
          data,
        })
      ).unwrap();

      // Works for both response types:
      // 1. direct review object
      // 2. { review: reviewObject }
      const savedReview = result?.review || result;

      setReviews((prev) => [savedReview, ...prev]);
      alert("Review added");
    }

    resetReviewForm();
  } catch (err) {
    console.error(err);
    alert(typeof err === "string" ? err : err?.message || "Review save failed");
  }
};

  const handleEditReview = (review) => {
    setEditingReviewId(review.id);
    setReviewerName(review.reviewerName || "");
    setRating(String(review.rating || 5));
    setReviewText(review.reviewText || "");
    setFeatured(!!review.featured);
  };

  const handleDeleteReview = async (reviewId) => {
    const ok = window.confirm("Delete this review?");
    if (!ok) return;

    try {
      await dispatch(deleteProductReview({ productId, reviewId })).unwrap();
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));

      if (editingReviewId === reviewId) resetReviewForm();

      alert("Review deleted");
    } catch (err) {
      console.error(err);
      alert("Review delete failed");
    }
  };

  const labelStyle = {
    display: "block",
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#111827",
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    border: "1px solid #d1d5db",
    borderRadius: "10px",
    fontSize: "15px",
    color: "#111827",
    background: "#ffffff",
    outline: "none",
    boxSizing: "border-box",
  };

  const textareaStyle = {
    ...inputStyle,
    resize: "vertical",
  };

  const jsonTextareaStyle = {
    ...textareaStyle,
    fontFamily:
      "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    fontSize: "13px",
    lineHeight: 1.6,
  };

  if (!product) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f8f8f8",
          padding: "40px 16px",
          color: "#111827",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8f8f8",
        padding: "40px 16px",
      }}
    >
      <div
        style={{
          maxWidth: "960px",
          margin: "0 auto",
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "16px",
          padding: "28px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
        }}
      >
        <h1
          style={{
            margin: "0 0 24px 0",
            fontSize: "28px",
            fontWeight: "700",
            color: "#111827",
          }}
        >
          Edit Product
        </h1>

        <div style={{ display: "grid", gap: "18px" }}>
          <div>
            <label style={labelStyle}>Title</label>
            <input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              style={textareaStyle}
            />
          </div>

          <div
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "14px",
              background: "#f9fafb",
              padding: "18px",
              display: "grid",
              gap: "16px",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: "20px",
                fontWeight: "800",
                color: "#111827",
              }}
            >
              Advanced Product Details
            </h2>

            <div>
              <label style={labelStyle}>Short Highlights</label>
              <textarea
                value={shortHighlights}
                onChange={(e) => setShortHighlights(e.target.value)}
                rows={3}
                style={textareaStyle}
              />
            </div>

            <EditableJsonRows
              title="Specifications"
              note="Admin fills normal rows. This page automatically saves it as specificationsJson JSON array string."
              rows={specificationRows}
              onRowsChange={syncSpecificationRows}
              firstLabel="Specification Name"
              secondLabel="Specification Value"
              firstPlaceholder="Example: Battery Backup"
              secondPlaceholder="Example: Up to 54 Hours"
              addButtonText="+ Add Specification"
              inputStyle={inputStyle}
              labelStyle={labelStyle}
            />

            <EditableJsonRows
              title="Feature Highlights"
              note="Admin fills normal rows. This page automatically saves it as featureHighlightsJson JSON array string."
              rows={featureRows}
              onRowsChange={syncFeatureRows}
              firstLabel="Feature Title"
              secondLabel="Feature Description"
              firstPlaceholder="Example: Deep Bass Sound"
              secondPlaceholder="Example: Powerful bass with clear vocals"
              addButtonText="+ Add Feature"
              inputStyle={inputStyle}
              labelStyle={labelStyle}
            />

            <EditableJsonRows
              title="FAQs"
              note="Admin fills normal rows. This page automatically saves it as faqJson JSON array string."
              rows={faqRows}
              onRowsChange={syncFaqRows}
              firstLabel="FAQ Question"
              secondLabel="FAQ Answer"
              firstPlaceholder="Example: Is this product wireless?"
              secondPlaceholder="Example: Yes, it supports wireless use."
              addButtonText="+ Add FAQ"
              inputStyle={inputStyle}
              labelStyle={labelStyle}
            />

            <div>
              <label style={labelStyle}>Warranty Info</label>
              <textarea
                value={warrantyInfo}
                onChange={(e) => setWarrantyInfo(e.target.value)}
                rows={3}
                style={textareaStyle}
              />
            </div>

            <EditableJsonRows
              title="Box Contents"
              note="Admin fills normal rows. This page automatically saves it as boxContentsJson JSON array string."
              rows={boxRows}
              onRowsChange={syncBoxRows}
              firstLabel="Box Item"
              secondLabel="Quantity / Detail"
              firstPlaceholder="Example: Earbuds"
              secondPlaceholder="Example: 1 Pair"
              addButtonText="+ Add Box Item"
              inputStyle={inputStyle}
              labelStyle={labelStyle}
            />

            <div>
              <label style={labelStyle}>Compatibility</label>
              <input
                value={compatibility}
                onChange={(e) => setCompatibility(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Demo Video URL</label>
              <input
                value={demoVideoUrl}
                onChange={(e) => setDemoVideoUrl(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Upload PDP Banner Images</label>

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleBannerFileChange}
                style={inputStyle}
              />

              {bannerPreviewUrls.length > 0 && (
                <div style={{ marginTop: "14px" }}>
                  <p
                    style={{
                      margin: "0 0 10px",
                      color: "#111827",
                      fontWeight: 700,
                    }}
                  >
                    Temporary Selected Banner Preview
                  </p>

                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      flexWrap: "wrap",
                    }}
                  >
                    {bannerPreviewUrls.map((url, index) => (
                      <div
                        key={url}
                        style={{
                          position: "relative",
                          width: "180px",
                          border: "1px solid #e5e7eb",
                          borderRadius: "12px",
                          padding: "8px",
                          background: "#ffffff",
                        }}
                      >
                        <img
                          src={url}
                          alt="Temporary PDP Banner"
                          style={{
                            width: "100%",
                            height: "100px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            display: "block",
                          }}
                        />

                        <button
                          type="button"
                          onClick={() => removeSelectedBanner(index)}
                          style={{
                            position: "absolute",
                            top: "-8px",
                            right: "-8px",
                            background: "#dc2626",
                            color: "#fff",
                            border: "none",
                            borderRadius: "50%",
                            width: "24px",
                            height: "24px",
                            cursor: "pointer",
                            fontSize: "16px",
                            fontWeight: "700",
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleBannerUpload}
                disabled={bannerUploading}
                style={{
                  marginTop: "12px",
                  padding: "12px 18px",
                  background: bannerUploading ? "#9ca3af" : "#111827",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: bannerUploading ? "not-allowed" : "pointer",
                }}
              >
                {bannerUploading ? "Uploading..." : "Upload Banner Image"}
              </button>
            </div>

            {parsedPdpBanners.length > 0 && (
              <div>
                <label style={labelStyle}>Saved PDP Banner Preview</label>

                <div style={{ display: "grid", gap: "12px" }}>
                  {parsedPdpBanners.map((banner, index) => {
                    const imgUrl = resolveUrl(banner.imageUrl);

                    return (
                      <div
                        key={`${banner.imageUrl}-${index}`}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "160px 1fr auto",
                          gap: "14px",
                          alignItems: "center",
                          border: "1px solid #e5e7eb",
                          borderRadius: "12px",
                          padding: "10px",
                          background: "#ffffff",
                        }}
                      >
                        <img
                          src={imgUrl}
                          alt={banner.title || "PDP Banner"}
                          style={{
                            width: "160px",
                            height: "90px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            background: "#f3f4f6",
                          }}
                        />

                        <div>
                          <div
                            style={{
                              fontWeight: "800",
                              color: "#111827",
                              marginBottom: "4px",
                            }}
                          >
                            {banner.title || "Untitled Banner"}
                          </div>

                          <div
                            style={{
                              color: "#4b5563",
                              fontSize: "13px",
                              wordBreak: "break-all",
                            }}
                          >
                            {banner.imageUrl}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeSavedBanner(index)}
                          style={{
                            padding: "10px 14px",
                            background: "#dc2626",
                            color: "#ffffff",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: "700",
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div>
              <label style={labelStyle}>PDP Banners JSON Preview</label>
              <textarea
                value={pdpBannersJson}
                readOnly
                rows={12}
                style={{
                  ...jsonTextareaStyle,
                  background: "#f3f4f6",
                  color: "#374151",
                }}
              />
              <p
                style={{
                  margin: "6px 0 0",
                  fontSize: "12px",
                  color: "#6b7280",
                }}
              >
                This is generated automatically from uploaded PDP banners. Admin
                does not need to type JSON manually.
              </p>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "18px",
            }}
          >
            <div>
              <label style={labelStyle}>Final Selling Price ₹</label>
              <input
                type="number"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>MRP ₹</label>
              <input
                type="number"
                min="0"
                value={mrp}
                onChange={(e) => setMrp(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Discounted Price ₹</label>
              <input
                type="number"
                min="0"
                value={discountInr}
                onChange={(e) => setDiscountInr(e.target.value)}
                style={inputStyle}
              />
              {discountPercent > 0 && (
                <p
                  style={{
                    margin: "6px 0 0",
                    fontSize: "12px",
                    color: "#16a34a",
                    fontWeight: "700",
                  }}
                >
                  {discountPercent}% discount from MRP
                </p>
              )}
            </div>

            <div>
              <label style={labelStyle}>Stock</label>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Display Order</label>
              <input
                type="number"
                min="1"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(e.target.value)}
                placeholder="1"
                style={inputStyle}
              />
              <p
                style={{
                  margin: "6px 0 0",
                  fontSize: "12px",
                  color: "#6b7280",
                }}
              >
                Lower number shows first. Example: 1 = first product.
              </p>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              style={inputStyle}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Upload More Images / Videos</label>
            <input
              type="file"
              multiple
              accept="image/*,video/mp4,video/webm,video/quicktime"
              onChange={(e) => setFiles(Array.from(e.target.files || []))}
              style={inputStyle}
            />
          </div>

          {images.length > 0 && (
            <div>
              <label style={labelStyle}>Current Product Images</label>

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  flexWrap: "wrap",
                  marginTop: "10px",
                }}
              >
                {images.map((item, index) => {
                  const mediaUrl = resolveUrl(getMediaUrl(item));
                  const isVideo =
                    mediaUrl.endsWith(".mp4") ||
                    mediaUrl.endsWith(".webm") ||
                    mediaUrl.endsWith(".mov");

                  return (
                    <div
                      key={`${mediaUrl}-${index}`}
                      style={{
                        position: "relative",
                        width: "150px",
                        border: "1px solid #e5e7eb",
                        borderRadius: "12px",
                        padding: "8px",
                        background: "#ffffff",
                      }}
                    >
                      {isVideo ? (
                        <video
                          src={mediaUrl}
                          controls
                          style={{
                            width: "100%",
                            height: "120px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            background: "#f3f4f6",
                          }}
                        />
                      ) : (
                        <img
                          src={mediaUrl}
                          alt="Product"
                          style={{
                            width: "100%",
                            height: "120px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            background: "#f3f4f6",
                          }}
                        />
                      )}

                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        style={{
                          position: "absolute",
                          top: "-8px",
                          right: "-8px",
                          background: "#dc2626",
                          color: "#fff",
                          border: "none",
                          borderRadius: "50%",
                          width: "24px",
                          height: "24px",
                          cursor: "pointer",
                          fontSize: "16px",
                          fontWeight: "700",
                        }}
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={handleUpload}
              style={{
                padding: "12px 18px",
                background: "#111827",
                color: "#ffffff",
                border: "none",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Upload Media
            </button>

            <button
              type="button"
              onClick={handleUpdate}
              disabled={loading}
              style={{
                padding: "12px 18px",
                background: loading ? "#9ca3af" : "#2563eb",
                color: "#ffffff",
                border: "none",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Updating..." : "Update Product"}
            </button>
          </div>

          <hr
            style={{
              margin: "40px 0",
              borderColor: "#e5e7eb",
            }}
          />

          <h2
            style={{
              fontSize: "24px",
              fontWeight: "700",
              color: "#111827",
              marginBottom: "20px",
            }}
          >
            Manage Reviews
          </h2>

          <div style={{ display: "grid", gap: "18px" }}>
            <div>
              <label style={labelStyle}>Reviewer Name</label>
              <input
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                placeholder="Reviewer Name"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Rating</label>
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                style={inputStyle}
              >
                <option value="5">5 Star</option>
                <option value="4">4 Star</option>
                <option value="3">3 Star</option>
                <option value="2">2 Star</option>
                <option value="1">1 Star</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Review Text</label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={4}
                style={textareaStyle}
                placeholder="Customer review..."
              />
            </div>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginTop: "14px",
                marginBottom: "14px",
                padding: "12px 14px",
                background: "#f9fafb",
                border: "1px solid #d1d5db",
                borderRadius: "10px",
                color: "#111827",
                fontSize: "15px",
                fontWeight: "600",
                cursor: "pointer",
                width: "fit-content",
              }}
            >
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                style={{
                  width: "18px",
                  height: "18px",
                  accentColor: "#2563eb",
                  cursor: "pointer",
                }}
              />
              Featured Review
            </label>
            <button
              type="button"
              onClick={handleSaveReview}
              style={{
                padding: "12px 18px",
                background: "#111827",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              {editingReviewId ? "Update Review" : "Add Review"}
            </button>
          </div>

          <div
            style={{
              marginTop: "32px",
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "14px",
              padding: "20px",
              boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
            }}
          >
            <h3
              style={{
                fontSize: "20px",
                fontWeight: "700",
                marginBottom: "18px",
                color: "#111827",
              }}
            >
              Existing Reviews
            </h3>

            {reviews && reviews.length > 0 ? (
              reviews.map((review) => (
                <div
                  key={review.id}
                  style={{
                    background: "#f9fafb",
                    border: "1px solid #e5e7eb",
                    padding: "16px",
                    borderRadius: "12px",
                    marginBottom: "14px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "10px",
                      gap: "10px",
                    }}
                  >
                    <strong
                      style={{
                        fontSize: "15px",
                        color: "#111827",
                      }}
                    >
                      {review.reviewerName || "Customer"}
                    </strong>

                    <span
                      style={{
                        background: "#16a34a",
                        color: "#ffffff",
                        padding: "4px 10px",
                        borderRadius: "999px",
                        fontSize: "13px",
                        fontWeight: "600",
                      }}
                    >
                      ★ {review.rating}/5
                    </span>
                  </div>

                  <p
                    style={{
                      fontSize: "14px",
                      color: "#374151",
                      lineHeight: "1.6",
                      marginBottom: "14px",
                    }}
                  >
                    {review.reviewText || "No review text added"}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      flexWrap: "wrap",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => handleEditReview(review)}
                      style={{
                        background: "#2563eb",
                        color: "#ffffff",
                        border: "none",
                        padding: "8px 14px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "600",
                      }}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteReview(review.id)}
                      style={{
                        background: "#dc2626",
                        color: "#ffffff",
                        border: "none",
                        padding: "8px 14px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "600",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p
                style={{
                  color: "#6b7280",
                  fontSize: "14px",
                  margin: 0,
                }}
              >
                No reviews added yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

