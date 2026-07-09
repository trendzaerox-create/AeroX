
// "use client";

// import { useState, useEffect, useMemo } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useRouter } from "next/navigation";

// import {
//   uploadProductImages,
//   setImages,
//   clearImages,
// } from "@/features/products/uploadSlice";
// import { createProduct } from "@/features/products/adminProductSlice";
// import { fetchAdminCategories } from "@/features/categories/categorySlice";
// import getImageUrl from "@/lib/getImageUrl";

// function emptyEditorRow() {
//   return { first: "", second: "" };
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
//   return JSON.stringify(rowsToJsonArray(rows, firstKey, secondKey));
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

// function getUploadedImageUrl(item) {
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

// function validateJsonArray(value, fieldName) {
//   try {
//     const parsed = JSON.parse(value || "[]");

//     if (!Array.isArray(parsed)) {
//       alert(`${fieldName} must be a JSON array []`);
//       return false;
//     }

//     return true;
//   } catch {
//     alert(`${fieldName} has invalid JSON format`);
//     return false;
//   }
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
//       rowIndex === index ? { ...row, [field]: value } : row
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

// export default function CreateProductPage() {
//   const dispatch = useDispatch();
//   const router = useRouter();

//   const categories = useSelector(
//     (state) => state.categories.adminCategories || []
//   );
//   const uploadedImages = useSelector((state) => state.upload.images || []);
//   const uploadLoading = useSelector((state) => state.upload.loading);

//   const [loading, setLoading] = useState(false);

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

//   const [specificationRows, setSpecificationRows] = useState([
//     emptyEditorRow(),
//   ]);
//   const [featureRows, setFeatureRows] = useState([emptyEditorRow()]);
//   const [faqRows, setFaqRows] = useState([emptyEditorRow()]);
//   const [boxRows, setBoxRows] = useState([emptyEditorRow()]);

//   const [files, setFiles] = useState([]);
//   const [pdpBannerFiles, setPdpBannerFiles] = useState([]);
//   const [pdpBannerImages, setPdpBannerImages] = useState([]);
//   const [pdpBannerUploadLoading, setPdpBannerUploadLoading] = useState(false);

//   useEffect(() => {
//     dispatch(fetchAdminCategories());
//     dispatch(clearImages());

//     return () => {
//       dispatch(clearImages());
//     };
//   }, [dispatch]);

//   const removeImage = (index) => {
//     const arr = [...uploadedImages];
//     arr.splice(index, 1);
//     dispatch(setImages(arr));
//   };

//   const removePdpBannerImage = (index) => {
//     const arr = [...pdpBannerImages];
//     arr.splice(index, 1);
//     setPdpBannerImages(arr);
//   };

//   const handleUpload = async () => {
//     if (files.length === 0) {
//       alert("Please select image or video files first");
//       return;
//     }

//     try {
//       await dispatch(uploadProductImages(files)).unwrap();
//       setFiles([]);
//       alert("Media uploaded successfully");
//     } catch (err) {
//       console.error(err);
//       alert("Upload failed");
//     }
//   };

//   const handlePdpBannerUpload = async () => {
//     if (pdpBannerFiles.length === 0) {
//       alert("Please select PDP banner images first");
//       return;
//     }

//     try {
//       setPdpBannerUploadLoading(true);

//       const result = await dispatch(uploadProductImages(pdpBannerFiles)).unwrap();
//       const newImages = normalizeUploadedResponse(result);

//       setPdpBannerImages((prev) => [...prev, ...newImages]);

//       setPdpBannerFiles([]);
//       alert("PDP banner images uploaded successfully");
//     } catch (err) {
//       console.error(err);
//       alert("PDP banner upload failed");
//     } finally {
//       setPdpBannerUploadLoading(false);
//     }
//   };

//   const discountPercent = useMemo(() => {
//     const sellingPrice = Number(price);
//     const originalPrice = Number(mrp);

//     if (
//       !Number.isFinite(sellingPrice) ||
//       !Number.isFinite(originalPrice) ||
//       sellingPrice <= 0 ||
//       originalPrice <= 0 ||
//       sellingPrice >= originalPrice
//     ) {
//       return 0;
//     }

//     return Math.round(((originalPrice - sellingPrice) * 100) / originalPrice);
//   }, [price, mrp]);

//   const handleCreate = async () => {
//     if (loading) return;

//     const specificationsJson = rowsToJsonString(
//       specificationRows,
//       "name",
//       "value"
//     );
//     const featureHighlightsJson = rowsToJsonString(
//       featureRows,
//       "title",
//       "description"
//     );
//     const faqJson = rowsToJsonString(faqRows, "question", "answer");
//     const boxContentsJson = rowsToJsonString(boxRows, "item", "quantity");

//     if (!title.trim()) return alert("Title is required");
//     if (!price || Number(price) <= 0)
//       return alert("Please enter a valid selling price");
//     if (mrp && Number(mrp) <= 0) return alert("Please enter a valid MRP");
//     if (mrp && Number(mrp) < Number(price))
//       return alert("MRP must be greater than or equal to selling price");
//     if (!stock && stock !== 0) return alert("Stock is required");
//     if (Number(stock) < 0) return alert("Stock cannot be negative");
//     if (displayOrder && Number(displayOrder) < 1)
//       return alert("Display Order must be 1 or greater");
//     if (!categoryId) return alert("Please select category");

//     if (!validateJsonArray(specificationsJson, "Specifications JSON")) return;
//     if (!validateJsonArray(featureHighlightsJson, "Feature Highlights JSON"))
//       return;
//     if (!validateJsonArray(faqJson, "FAQ JSON")) return;
//     if (!validateJsonArray(boxContentsJson, "Box Contents JSON")) return;

//     setLoading(true);

//     try {
//       const pdpBannersJson = JSON.stringify(
//         pdpBannerImages
//           .map((img, index) => ({
//             imageUrl: getUploadedImageUrl(img),
//             sortOrder: index + 1,
//             active: true,
//           }))
//           .filter((banner) => Boolean(banner.imageUrl))
//       );

//       const data = {
//         title: title.trim(),
//         description: description.trim(),
//         priceInr: Number(price),
//         mrpInr: mrp ? Number(mrp) : null,
//         stock: Number(stock),
//         displayOrder: displayOrder ? Number(displayOrder) : null,
//         categoryId: Number(categoryId),
//         images: uploadedImages,

//         shortHighlights: shortHighlights.trim(),
//         specificationsJson,
//         featureHighlightsJson,
//         faqJson,
//         warrantyInfo: warrantyInfo.trim(),
//         boxContentsJson,
//         compatibility: compatibility.trim(),
//         demoVideoUrl: demoVideoUrl.trim(),
//         pdpBannersJson,
//       };

//       await dispatch(createProduct(data)).unwrap();

//       dispatch(clearImages());
//       setPdpBannerImages([]);
//       alert("Product Created");
//       router.push("/admin/products");
//     } catch (err) {
//       console.error(err);
//       alert(typeof err === "string" ? err : err?.message || "Create failed");
//     } finally {
//       setLoading(false);
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

//   const syncSpecificationRows = (nextRows) => {
//     setSpecificationRows(nextRows.length > 0 ? nextRows : [emptyEditorRow()]);
//   };

//   const syncFeatureRows = (nextRows) => {
//     setFeatureRows(nextRows.length > 0 ? nextRows : [emptyEditorRow()]);
//   };

//   const syncFaqRows = (nextRows) => {
//     setFaqRows(nextRows.length > 0 ? nextRows : [emptyEditorRow()]);
//   };

//   const syncBoxRows = (nextRows) => {
//     setBoxRows(nextRows.length > 0 ? nextRows : [emptyEditorRow()]);
//   };

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background: "#f8f8f8",
//         padding: "32px 16px",
//       }}
//     >
//       <div
//         style={{
//           maxWidth: "900px",
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
//             fontSize: "28px",
//             fontWeight: "700",
//             color: "#111827",
//             margin: "0 0 24px 0",
//           }}
//         >
//           Create Product
//         </h1>

//         <div style={{ display: "grid", gap: "18px" }}>
//           <div>
//             <label style={labelStyle}>Title</label>
//             <input
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               style={inputStyle}
//             />
//           </div>

//           <div>
//             <label style={labelStyle}>Description</label>
//             <textarea
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
//               firstPlaceholder="Example: Material"
//               secondPlaceholder="Example: Premium vegan leather"
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
//               firstPlaceholder="Example: Spacious Design"
//               secondPlaceholder="Example: Fits daily essentials comfortably"
//               addButtonText="+ Add Feature"
//               inputStyle={inputStyle}
//               labelStyle={labelStyle}
//             />

//             <div>
//               <label style={labelStyle}>PDP Banner Images</label>
//               <input
//                 type="file"
//                 multiple
//                 accept="image/*"
//                 onChange={(e) =>
//                   setPdpBannerFiles(Array.from(e.target.files || []))
//                 }
//                 style={inputStyle}
//               />

//               <button
//                 type="button"
//                 onClick={handlePdpBannerUpload}
//                 disabled={pdpBannerUploadLoading}
//                 style={{
//                   marginTop: "12px",
//                   padding: "12px 18px",
//                   background: pdpBannerUploadLoading ? "#9ca3af" : "#111827",
//                   color: "#ffffff",
//                   border: "none",
//                   borderRadius: "10px",
//                   fontSize: "14px",
//                   fontWeight: "600",
//                   cursor: pdpBannerUploadLoading ? "not-allowed" : "pointer",
//                 }}
//               >
//                 {pdpBannerUploadLoading ? "Uploading..." : "Upload PDP Banners"}
//               </button>

//               <div
//                 style={{
//                   display: "flex",
//                   gap: "14px",
//                   flexWrap: "wrap",
//                   marginTop: "16px",
//                 }}
//               >
//                 {pdpBannerImages.map((img, i) => (
//                   <div
//                     key={i}
//                     style={{
//                       position: "relative",
//                       border: "1px solid #e5e7eb",
//                       padding: "8px",
//                       borderRadius: "12px",
//                       background: "#ffffff",
//                     }}
//                   >
//                     <img
//                       src={getImageUrl(img)}
//                       width="180"
//                       alt={`PDP banner ${i + 1}`}
//                       style={{
//                         width: "180px",
//                         height: "90px",
//                         objectFit: "cover",
//                         borderRadius: "8px",
//                       }}
//                     />

//                     <button
//                       type="button"
//                       onClick={() => removePdpBannerImage(i)}
//                       style={{
//                         position: "absolute",
//                         top: "-8px",
//                         right: "-8px",
//                         background: "#dc2626",
//                         color: "#ffffff",
//                         border: "none",
//                         borderRadius: "999px",
//                         width: "24px",
//                         height: "24px",
//                         cursor: "pointer",
//                         fontSize: "16px",
//                         fontWeight: "700",
//                       }}
//                     >
//                       ×
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <EditableJsonRows
//               title="FAQs"
//               note="Admin fills normal rows. This page automatically saves it as faqJson JSON array string."
//               rows={faqRows}
//               onRowsChange={syncFaqRows}
//               firstLabel="FAQ Question"
//               secondLabel="FAQ Answer"
//               firstPlaceholder="Example: Is this suitable for daily use?"
//               secondPlaceholder="Example: Yes, it is designed for regular use."
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
//               firstPlaceholder="Example: Handbag"
//               secondPlaceholder="Example: 1 Unit"
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
//           </div>

//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
//               gap: "18px",
//             }}
//           >
//             <div>
//               <label style={labelStyle}>Selling Price (₹)</label>
//               <input
//                 type="number"
//                 min="0"
//                 value={price}
//                 onChange={(e) => setPrice(e.target.value)}
//                 style={inputStyle}
//               />
//             </div>

//             <div>
//               <label style={labelStyle}>MRP / Original Price (₹)</label>
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
//             <label style={labelStyle}>Product Images / Videos</label>
//             <input
//               type="file"
//               multiple
//               accept="image/*,video/mp4,video/webm,video/quicktime"
//               onChange={(e) => setFiles(Array.from(e.target.files || []))}
//               style={inputStyle}
//             />
//           </div>

//           <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
//             <button
//               type="button"
//               onClick={handleUpload}
//               disabled={uploadLoading}
//               style={{
//                 padding: "12px 18px",
//                 background: uploadLoading ? "#9ca3af" : "#111827",
//                 color: "#ffffff",
//                 border: "none",
//                 borderRadius: "10px",
//                 fontSize: "14px",
//                 fontWeight: "600",
//                 cursor: uploadLoading ? "not-allowed" : "pointer",
//               }}
//             >
//               {uploadLoading ? "Uploading..." : "Upload Media"}
//             </button>

//             <button
//               type="button"
//               onClick={handleCreate}
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
//               {loading ? "Creating..." : "Create Product"}
//             </button>
//           </div>
//         </div>

//         <div style={{ marginTop: "28px" }}>
//           <h3
//             style={{
//               fontSize: "18px",
//               fontWeight: "700",
//               color: "#111827",
//               marginBottom: "14px",
//             }}
//           >
//             Uploaded Media
//           </h3>

//           <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
//             {uploadedImages.map((img, i) => (
//               <div
//                 key={i}
//                 style={{
//                   position: "relative",
//                   border: "1px solid #e5e7eb",
//                   padding: "8px",
//                   borderRadius: "12px",
//                   background: "#ffffff",
//                 }}
//               >
//                 <img
//                   src={getImageUrl(img)}
//                   width="120"
//                   alt={`Product media ${i + 1}`}
//                   style={{
//                     width: "120px",
//                     height: "120px",
//                     objectFit: "cover",
//                     borderRadius: "8px",
//                   }}
//                 />

//                 <button
//                   type="button"
//                   onClick={() => removeImage(i)}
//                   style={{
//                     position: "absolute",
//                     top: "-8px",
//                     right: "-8px",
//                     background: "#dc2626",
//                     color: "#ffffff",
//                     border: "none",
//                     borderRadius: "999px",
//                     width: "24px",
//                     height: "24px",
//                     cursor: "pointer",
//                     fontSize: "16px",
//                     fontWeight: "700",
//                   }}
//                 >
//                   ×
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }











































































































"use client";

import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import {
  uploadProductImages,
  setImages,
  clearImages,
} from "@/features/products/uploadSlice";
import { createProduct } from "@/features/adminProducts/adminProductThunks";
import { fetchAdminCategories } from "@/features/categories/categorySlice";
import getImageUrl from "@/lib/getImageUrl";

function emptyEditorRow() {
  return { first: "", second: "" };
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
  return JSON.stringify(rowsToJsonArray(rows, firstKey, secondKey));
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

function getUploadedImageUrl(item) {
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

function validateJsonArray(value, fieldName) {
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
      rowIndex === index ? { ...row, [field]: value } : row
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

export default function CreateProductPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const categories = useSelector(
    (state) => state.categories.adminCategories || []
  );
  const uploadedImages = useSelector((state) => state.upload.images || []);
  const uploadLoading = useSelector((state) => state.upload.loading);

  const [loading, setLoading] = useState(false);

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

  const [specificationRows, setSpecificationRows] = useState([
    emptyEditorRow(),
  ]);
  const [featureRows, setFeatureRows] = useState([emptyEditorRow()]);
  const [faqRows, setFaqRows] = useState([emptyEditorRow()]);
  const [boxRows, setBoxRows] = useState([emptyEditorRow()]);

  const [files, setFiles] = useState([]);
  const [pdpBannerFiles, setPdpBannerFiles] = useState([]);
  const [pdpBannerImages, setPdpBannerImages] = useState([]);
  const [pdpBannerUploadLoading, setPdpBannerUploadLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchAdminCategories());
    dispatch(clearImages());

    return () => {
      dispatch(clearImages());
    };
  }, [dispatch]);

  const removeImage = (index) => {
    const arr = [...uploadedImages];
    arr.splice(index, 1);
    dispatch(setImages(arr));
  };

  const removePdpBannerImage = (index) => {
    const arr = [...pdpBannerImages];
    arr.splice(index, 1);
    setPdpBannerImages(arr);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      alert("Please select image or video files first");
      return;
    }

    try {
      await dispatch(uploadProductImages(files)).unwrap();
      setFiles([]);
      alert("Media uploaded successfully");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  const handlePdpBannerUpload = async () => {
    if (pdpBannerFiles.length === 0) {
      alert("Please select PDP banner images first");
      return;
    }

    try {
      setPdpBannerUploadLoading(true);

      const result = await dispatch(uploadProductImages(pdpBannerFiles)).unwrap();
      const newImages = normalizeUploadedResponse(result);

      setPdpBannerImages((prev) => [...prev, ...newImages]);

      setPdpBannerFiles([]);
      alert("PDP banner images uploaded successfully");
    } catch (err) {
      console.error(err);
      alert("PDP banner upload failed");
    } finally {
      setPdpBannerUploadLoading(false);
    }
  };

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

  const handleCreate = async () => {
    if (loading) return;

    const specificationsJson = rowsToJsonString(
      specificationRows,
      "name",
      "value"
    );
    const featureHighlightsJson = rowsToJsonString(
      featureRows,
      "title",
      "description"
    );
    const faqJson = rowsToJsonString(faqRows, "question", "answer");
    const boxContentsJson = rowsToJsonString(boxRows, "item", "quantity");

    if (!title.trim()) return alert("Title is required");
    if (!price || Number(price) <= 0)
      return alert("Please enter a valid final selling price");
    if (!mrp || Number(mrp) <= 0) return alert("Please enter a valid MRP");
    if (!discountInr || Number(discountInr) <= 0)
      return alert("Please enter a valid discounted price");
    if (Number(discountInr) > Number(mrp))
      return alert("Discounted price cannot be greater than MRP");
    if (Number(price) > Number(discountInr))
      return alert("Final selling price cannot be greater than discounted price");
    if (!stock && stock !== 0) return alert("Stock is required");
    if (Number(stock) < 0) return alert("Stock cannot be negative");
    if (displayOrder && Number(displayOrder) < 1)
      return alert("Display Order must be 1 or greater");
    if (!categoryId) return alert("Please select category");

    if (!validateJsonArray(specificationsJson, "Specifications JSON")) return;
    if (!validateJsonArray(featureHighlightsJson, "Feature Highlights JSON"))
      return;
    if (!validateJsonArray(faqJson, "FAQ JSON")) return;
    if (!validateJsonArray(boxContentsJson, "Box Contents JSON")) return;

    setLoading(true);

    try {
      const pdpBannersJson = JSON.stringify(
        pdpBannerImages
          .map((img, index) => ({
            imageUrl: getUploadedImageUrl(img),
            sortOrder: index + 1,
            active: true,
          }))
          .filter((banner) => Boolean(banner.imageUrl))
      );

      const data = {
        title: title.trim(),
        description: description.trim(),
        priceInr: Number(price),
        mrpInr: Number(mrp),
        discountInr: Number(discountInr),
        stock: Number(stock),
        displayOrder: displayOrder ? Number(displayOrder) : null,
        categoryId: Number(categoryId),
        images: Array.from(
          new Set(uploadedImages.map((img) => getUploadedImageUrl(img)).filter(Boolean))
        ),

        shortHighlights: shortHighlights.trim(),
        specificationsJson,
        featureHighlightsJson,
        faqJson,
        warrantyInfo: warrantyInfo.trim(),
        boxContentsJson,
        compatibility: compatibility.trim(),
        demoVideoUrl: demoVideoUrl.trim(),
        pdpBannersJson,
      };

      await dispatch(createProduct(data)).unwrap();

      dispatch(clearImages());
      setPdpBannerImages([]);
      alert("Product Created");
      router.push("/admin/products");
    } catch (err) {
      console.error(err);
      alert(typeof err === "string" ? err : err?.message || "Create failed");
    } finally {
      setLoading(false);
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

  const syncSpecificationRows = (nextRows) => {
    setSpecificationRows(nextRows.length > 0 ? nextRows : [emptyEditorRow()]);
  };

  const syncFeatureRows = (nextRows) => {
    setFeatureRows(nextRows.length > 0 ? nextRows : [emptyEditorRow()]);
  };

  const syncFaqRows = (nextRows) => {
    setFaqRows(nextRows.length > 0 ? nextRows : [emptyEditorRow()]);
  };

  const syncBoxRows = (nextRows) => {
    setBoxRows(nextRows.length > 0 ? nextRows : [emptyEditorRow()]);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8f8f8",
        padding: "32px 16px",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
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
            fontSize: "28px",
            fontWeight: "700",
            color: "#111827",
            margin: "0 0 24px 0",
          }}
        >
          Create Product
        </h1>

        <div style={{ display: "grid", gap: "18px" }}>
          <div>
            <label style={labelStyle}>Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Description</label>
            <textarea
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
              firstPlaceholder="Example: Material"
              secondPlaceholder="Example: Premium vegan leather"
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
              firstPlaceholder="Example: Spacious Design"
              secondPlaceholder="Example: Fits daily essentials comfortably"
              addButtonText="+ Add Feature"
              inputStyle={inputStyle}
              labelStyle={labelStyle}
            />

            <div>
              <label style={labelStyle}>PDP Banner Images</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) =>
                  setPdpBannerFiles(Array.from(e.target.files || []))
                }
                style={inputStyle}
              />

              <button
                type="button"
                onClick={handlePdpBannerUpload}
                disabled={pdpBannerUploadLoading}
                style={{
                  marginTop: "12px",
                  padding: "12px 18px",
                  background: pdpBannerUploadLoading ? "#9ca3af" : "#111827",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: pdpBannerUploadLoading ? "not-allowed" : "pointer",
                }}
              >
                {pdpBannerUploadLoading ? "Uploading..." : "Upload PDP Banners"}
              </button>

              <div
                style={{
                  display: "flex",
                  gap: "14px",
                  flexWrap: "wrap",
                  marginTop: "16px",
                }}
              >
                {pdpBannerImages.map((img, i) => (
                  <div
                    key={i}
                    style={{
                      position: "relative",
                      border: "1px solid #e5e7eb",
                      padding: "8px",
                      borderRadius: "12px",
                      background: "#ffffff",
                    }}
                  >
                    <img
                      src={getImageUrl(img)}
                      width="180"
                      alt={`PDP banner ${i + 1}`}
                      style={{
                        width: "180px",
                        height: "90px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />

                    <button
                      type="button"
                      onClick={() => removePdpBannerImage(i)}
                      style={{
                        position: "absolute",
                        top: "-8px",
                        right: "-8px",
                        background: "#dc2626",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "999px",
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

            <EditableJsonRows
              title="FAQs"
              note="Admin fills normal rows. This page automatically saves it as faqJson JSON array string."
              rows={faqRows}
              onRowsChange={syncFaqRows}
              firstLabel="FAQ Question"
              secondLabel="FAQ Answer"
              firstPlaceholder="Example: Is this suitable for daily use?"
              secondPlaceholder="Example: Yes, it is designed for regular use."
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
              firstPlaceholder="Example: Handbag"
              secondPlaceholder="Example: 1 Unit"
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
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "18px",
            }}
          >
            <div>
              <label style={labelStyle}>Final Selling Price (₹)</label>
              <input
                type="number"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>MRP / Original Price (₹)</label>
              <input
                type="number"
                min="0"
                value={mrp}
                onChange={(e) => setMrp(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Discounted Price (₹)</label>
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
            <label style={labelStyle}>Product Images / Videos</label>
            <input
              type="file"
              multiple
              accept="image/*,video/mp4,video/webm,video/quicktime"
              onChange={(e) => setFiles(Array.from(e.target.files || []))}
              style={inputStyle}
            />
          </div>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={handleUpload}
              disabled={uploadLoading}
              style={{
                padding: "12px 18px",
                background: uploadLoading ? "#9ca3af" : "#111827",
                color: "#ffffff",
                border: "none",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: uploadLoading ? "not-allowed" : "pointer",
              }}
            >
              {uploadLoading ? "Uploading..." : "Upload Media"}
            </button>

            <button
              type="button"
              onClick={handleCreate}
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
              {loading ? "Creating..." : "Create Product"}
            </button>
          </div>
        </div>

        <div style={{ marginTop: "28px" }}>
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "700",
              color: "#111827",
              marginBottom: "14px",
            }}
          >
            Uploaded Media
          </h3>

          <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
            {uploadedImages.map((img, i) => (
              <div
                key={i}
                style={{
                  position: "relative",
                  border: "1px solid #e5e7eb",
                  padding: "8px",
                  borderRadius: "12px",
                  background: "#ffffff",
                }}
              >
                <img
                  src={getImageUrl(img)}
                  width="120"
                  alt={`Product media ${i + 1}`}
                  style={{
                    width: "120px",
                    height: "120px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />

                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  style={{
                    position: "absolute",
                    top: "-8px",
                    right: "-8px",
                    background: "#dc2626",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "999px",
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
      </div>
    </div>
  );
}