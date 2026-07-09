

// "use client";

// import { useEffect, useMemo } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchAdminProducts,
//   deleteProduct,
// } from "@/features/adminProducts/adminProductThunks";
// import { useRouter } from "next/navigation";

// export default function AdminProductsPage() {
//   const dispatch = useDispatch();
//   const router = useRouter();

//   const products = useSelector((state) => state.adminProducts.products || []);
//   const loading = useSelector((state) => state.adminProducts.loading);

//   useEffect(() => {
//     dispatch(fetchAdminProducts());
//   }, [dispatch]);

//   const hasValue = (value) =>
//     value !== null && value !== undefined && String(value).trim() !== "";

//   const getDisplayOrder = (product) => {
//     const value =
//       product?.displayOrder ??
//       product?.display_order ??
//       product?.displayorder ??
//       null;

//     if (!hasValue(value)) return null;

//     const numberValue = Number(value);
//     return Number.isFinite(numberValue) ? numberValue : null;
//   };

//   const sortedProducts = useMemo(() => {
//     return [...products].sort((a, b) => {
//       const orderA = getDisplayOrder(a);
//       const orderB = getDisplayOrder(b);

//       const safeOrderA = orderA === null ? 999999 : orderA;
//       const safeOrderB = orderB === null ? 999999 : orderB;

//       if (safeOrderA !== safeOrderB) {
//         return safeOrderA - safeOrderB;
//       }

//       return Number(a.id || 0) - Number(b.id || 0);
//     });
//   }, [products]);

//   const handleArchive = async (id) => {
//     const ok = window.confirm(
//       "Archive this product?\n\nIt will be hidden from customers but kept for order history."
//     );

//     if (!ok) return;

//     const resultAction = await dispatch(deleteProduct(id));

//     if (deleteProduct.fulfilled.match(resultAction)) {
//       dispatch(fetchAdminProducts());
//     } else {
//       alert(resultAction.payload || "Archive failed");
//     }
//   };

//   const getCategoryName = (category) => {
//     if (!category) return "No category";
//     if (typeof category === "object") return category?.name || "No category";
//     return category;
//   };

//   const getImageSrc = (image) => {
//     if (!image) return "";

//     const img =
//       typeof image === "string"
//         ? image
//         : image?.imageUrl ||
//           image?.url ||
//           image?.mediaUrl ||
//           image?.videoUrl ||
//           "";

//     if (!img) return "";

//     if (img.startsWith("http")) return img;

//     const base =
//       process.env.NEXT_PUBLIC_API_BASE ||
//       process.env.NEXT_PUBLIC_API_BASE_URL ||
//       process.env.NEXT_PUBLIC_API_URL ||
//       "";

//     return `${base}${img}`;
//   };

//   const getFirstImage = (product) => {
//     if (Array.isArray(product?.images) && product.images.length > 0) {
//       return product.images[0];
//     }

//     if (Array.isArray(product?.imageUrls) && product.imageUrls.length > 0) {
//       return product.imageUrls[0];
//     }

//     return (
//       product?.imageUrl ||
//       product?.thumbnailUrl ||
//       product?.mainImageUrl ||
//       product?.mediaUrl ||
//       ""
//     );
//   };

//   const shortText = (value, limit = 95) => {
//     if (!hasValue(value)) return "—";
//     const text = String(value);
//     return text.length > limit ? `${text.slice(0, limit)}...` : text;
//   };

//   const getPrice = (product) => {
//     return Number(
//       product?.priceInr ??
//         product?.price ??
//         product?.sellingPrice ??
//         product?.selling_price ??
//         0
//     );
//   };

//   const getMrp = (product) => {
//     return Number(
//       product?.mrpInr ??
//         product?.mrp ??
//         product?.compareAtPrice ??
//         product?.compare_at_price ??
//         0
//     );
//   };

//   const getDiscountPercent = (product) => {
//     const directDiscount = Number(
//       product?.discountPercent ?? product?.discount_percent ?? 0
//     );

//     if (directDiscount > 0) return directDiscount;

//     const sellingPrice = getPrice(product);
//     const mrp = getMrp(product);

//     if (mrp > 0 && sellingPrice > 0 && mrp > sellingPrice) {
//       return Math.round(((mrp - sellingPrice) / mrp) * 100);
//     }

//     return 0;
//   };

//   const renderPriceBlock = (product) => {
//     const sellingPrice = getPrice(product);
//     const mrp = getMrp(product);
//     const discountPercent = getDiscountPercent(product);

//     return (
//       <div style={styles.priceWrap}>
//         <span style={styles.priceText}>
//           ₹{sellingPrice.toLocaleString("en-IN")}
//         </span>

//         {discountPercent > 0 && mrp > sellingPrice && (
//           <>
//             <span style={styles.discountText}>-{discountPercent}%</span>
//             <span style={styles.mrpText}>
//               MRP ₹{mrp.toLocaleString("en-IN")}
//             </span>
//           </>
//         )}
//       </div>
//     );
//   };

//   const getStockValue = (product) => {
//     const value =
//       product?.stock ??
//       product?.stockQuantity ??
//       product?.stock_quantity ??
//       product?.quantity ??
//       0;

//     const numberValue = Number(value);
//     return Number.isFinite(numberValue) ? numberValue : 0;
//   };

//   const getProductStatus = (product) => {
//     const isArchived =
//       product?.deleted === true ||
//       product?.isDeleted === true ||
//       product?.is_deleted === true ||
//       product?.active === false ||
//       product?.isActive === false ||
//       product?.is_active === false;

//     return isArchived ? "Archived" : "Active";
//   };

//   const getStatusStyle = (status) => {
//     if (status === "Archived") {
//       return {
//         background: "#f2f4f7",
//         color: "#475467",
//         border: "1px solid #e4e7ec",
//       };
//     }

//     return {
//       background: "#ecfdf3",
//       color: "#027a48",
//       border: "1px solid #abefc6",
//     };
//   };

//   const activeCount = sortedProducts.filter(
//     (product) => getProductStatus(product) === "Active"
//   ).length;

//   const archivedCount = sortedProducts.filter(
//     (product) => getProductStatus(product) === "Archived"
//   ).length;

//   return (
//     <div style={styles.page}>
//       <div style={styles.container}>
//         <div style={styles.headerCard}>
//           <div>
//             <p style={styles.overline}>Admin Dashboard</p>
//             <h1 style={styles.heading}>Products Management</h1>
//             <p style={styles.subtext}>
//               Manage product list, display order, stock, status and PDP editing.
//             </p>
//           </div>

//           <button
//             type="button"
//             onClick={() => router.push("/admin/products/create")}
//             style={styles.primaryButton}
//           >
//             + Create Product
//           </button>
//         </div>

//         <div style={styles.statsGrid}>
//           <div style={styles.statCard}>
//             <p style={styles.statLabel}>Total Products</p>
//             <h2 style={styles.statValue}>{sortedProducts.length}</h2>
//           </div>

//           <div style={styles.statCard}>
//             <p style={styles.statLabel}>Active Products</p>
//             <h2 style={styles.statValue}>{activeCount}</h2>
//           </div>

//           <div style={styles.statCard}>
//             <p style={styles.statLabel}>Archived Products</p>
//             <h2 style={styles.statValue}>{archivedCount}</h2>
//           </div>
//         </div>

//         <div style={styles.tableCard}>
//           <div style={styles.tableHeader}>
//             <div>
//               <h2 style={styles.tableTitle}>All Products</h2>
//               <p style={styles.tableSubtitle}>
//                 Products are arranged by display_order first, then product ID.
//               </p>
//             </div>

//             <div style={styles.headerHint}>
//               PDP details are managed from the edit page.
//             </div>
//           </div>

//           {loading ? (
//             <div style={styles.loadingBox}>Loading products...</div>
//           ) : sortedProducts.length === 0 ? (
//             <div style={styles.emptyBox}>
//               <h3 style={styles.emptyTitle}>No products found</h3>
//               <p style={styles.emptyText}>
//                 Create your first product to start managing your catalogue.
//               </p>

//               <button
//                 type="button"
//                 onClick={() => router.push("/admin/products/create")}
//                 style={styles.primaryButton}
//               >
//                 + Create Product
//               </button>
//             </div>
//           ) : (
//             <>
//               <div style={styles.desktopTableWrapper}>
//                 <table style={styles.table}>
//                   <thead>
//                     <tr>
//                       <th style={styles.th}>Display Order</th>
//                       <th style={styles.th}>ID</th>
//                       <th style={styles.th}>Image</th>
//                       <th style={styles.th}>Product</th>
//                       <th style={styles.th}>Category</th>
//                       <th style={styles.th}>Price</th>
//                       <th style={styles.th}>Stock</th>
//                       <th style={styles.th}>Status</th>
//                       <th style={styles.thAction}>Actions</th>
//                     </tr>
//                   </thead>

//                   <tbody>
//                     {sortedProducts.map((product) => {
//                       const firstImage = getFirstImage(product);
//                       const img = getImageSrc(firstImage);
//                       const displayOrder = getDisplayOrder(product);
//                       const status = getProductStatus(product);
//                       const isArchived = status === "Archived";
//                       const stock = getStockValue(product);

//                       return (
//                         <tr key={product.id} style={styles.tr}>
//                           <td style={styles.td}>
//                             <span style={styles.orderBadge}>
//                               {displayOrder ?? "—"}
//                             </span>
//                           </td>

//                           <td style={styles.td}>
//                             <span style={styles.idBadge}>#{product.id}</span>
//                           </td>

//                           <td style={styles.td}>
//                             {img ? (
//                               <img
//                                 src={img}
//                                 alt={product.title || "Product image"}
//                                 style={styles.productImage}
//                               />
//                             ) : (
//                               <div style={styles.noImage}>No Image</div>
//                             )}
//                           </td>

//                           <td style={styles.tdProduct}>
//                             <div style={styles.productTitle}>
//                               {shortText(product.title, 90)}
//                             </div>

//                             {hasValue(product.shortHighlights) && (
//                               <div style={styles.productShortText}>
//                                 {shortText(product.shortHighlights, 95)}
//                               </div>
//                             )}
//                           </td>

//                           <td style={styles.td}>
//                             <span style={styles.categoryBadge}>
//                               {getCategoryName(product.category)}
//                             </span>
//                           </td>

//                           <td style={styles.td}>{renderPriceBlock(product)}</td>

//                           <td style={styles.td}>
//                             <span
//                               style={{
//                                 ...styles.stockBadge,
//                                 ...(stock <= 0
//                                   ? styles.stockOut
//                                   : stock <= 5
//                                   ? styles.stockLow
//                                   : styles.stockGood),
//                               }}
//                             >
//                               {stock}
//                             </span>
//                           </td>

//                           <td style={styles.td}>
//                             <span
//                               style={{
//                                 ...styles.statusBadge,
//                                 ...getStatusStyle(status),
//                               }}
//                             >
//                               {status}
//                             </span>
//                           </td>

//                           <td style={styles.tdAction}>
//                             <div style={styles.actionGroup}>
//                               <button
//                                 type="button"
//                                 onClick={() =>
//                                   router.push(
//                                     `/admin/products/edit/${product.id}`
//                                   )
//                                 }
//                                 style={styles.editButton}
//                               >
//                                 View / Edit PDP
//                               </button>

//                               {!isArchived && (
//                                 <button
//                                   type="button"
//                                   onClick={() => handleArchive(product.id)}
//                                   style={styles.archiveButton}
//                                 >
//                                   Archive
//                                 </button>
//                               )}
//                             </div>
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>

//               <div style={styles.mobileList}>
//                 {sortedProducts.map((product) => {
//                   const firstImage = getFirstImage(product);
//                   const img = getImageSrc(firstImage);
//                   const displayOrder = getDisplayOrder(product);
//                   const status = getProductStatus(product);
//                   const isArchived = status === "Archived";
//                   const stock = getStockValue(product);

//                   return (
//                     <div key={product.id} style={styles.mobileCard}>
//                       <div style={styles.mobileTop}>
//                         {img ? (
//                           <img
//                             src={img}
//                             alt={product.title || "Product image"}
//                             style={styles.mobileImage}
//                           />
//                         ) : (
//                           <div style={styles.mobileNoImage}>No Image</div>
//                         )}

//                         <div style={styles.mobileInfo}>
//                           <div style={styles.mobileTitle}>
//                             {shortText(product.title, 95)}
//                           </div>

//                           <div style={styles.mobileCategory}>
//                             {getCategoryName(product.category)}
//                           </div>

//                           <div style={styles.mobileMeta}>
//                             <span style={styles.idBadge}>#{product.id}</span>
//                             <span style={styles.orderBadge}>
//                               Order {displayOrder ?? "—"}
//                             </span>
//                           </div>
//                         </div>
//                       </div>

//                       <div style={styles.mobileDetailsGrid}>
//                         <div style={styles.mobileDetailBox}>
//                           <span style={styles.mobileDetailLabel}>Price</span>
//                           {renderPriceBlock(product)}
//                         </div>

//                         <div style={styles.mobileDetailBox}>
//                           <span style={styles.mobileDetailLabel}>Stock</span>
//                           <span
//                             style={{
//                               ...styles.stockBadge,
//                               ...(stock <= 0
//                                 ? styles.stockOut
//                                 : stock <= 5
//                                 ? styles.stockLow
//                                 : styles.stockGood),
//                             }}
//                           >
//                             {stock}
//                           </span>
//                         </div>

//                         <div style={styles.mobileDetailBox}>
//                           <span style={styles.mobileDetailLabel}>Status</span>
//                           <span
//                             style={{
//                               ...styles.statusBadge,
//                               ...getStatusStyle(status),
//                             }}
//                           >
//                             {status}
//                           </span>
//                         </div>
//                       </div>

//                       <div style={styles.mobileActions}>
//                         <button
//                           type="button"
//                           onClick={() =>
//                             router.push(`/admin/products/edit/${product.id}`)
//                           }
//                           style={styles.mobileEditButton}
//                         >
//                           View / Edit PDP
//                         </button>

//                         {!isArchived && (
//                           <button
//                             type="button"
//                             onClick={() => handleArchive(product.id)}
//                             style={styles.mobileArchiveButton}
//                           >
//                             Archive
//                           </button>
//                         )}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// const styles = {
//   page: {
//     minHeight: "100vh",
//     background: "#f8fafc",
//     padding: "32px 20px",
//     overflowX: "hidden",
//   },

//   container: {
//     width: "100%",
//     maxWidth: "1400px",
//     margin: "0 auto",
//   },

//   headerCard: {
//     background: "#ffffff",
//     borderRadius: "20px",
//     padding: "28px 32px",
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     gap: "20px",
//     border: "1px solid #e5e7eb",
//     marginBottom: "20px",
//     flexWrap: "wrap",
//     boxShadow: "0 1px 2px rgba(16, 24, 40, 0.04)",
//   },

//   overline: {
//     margin: 0,
//     fontSize: "12px",
//     fontWeight: 800,
//     letterSpacing: "0.08em",
//     textTransform: "uppercase",
//     color: "#667085",
//   },

//   heading: {
//     margin: "8px 0 10px",
//     fontSize: "32px",
//     fontWeight: 900,
//     color: "#101828",
//     lineHeight: 1.15,
//   },

//   subtext: {
//     margin: 0,
//     fontSize: "15px",
//     color: "#667085",
//     lineHeight: 1.5,
//   },

//   primaryButton: {
//     background: "#111827",
//     color: "#ffffff",
//     border: "none",
//     borderRadius: "12px",
//     padding: "14px 18px",
//     fontSize: "14px",
//     fontWeight: 800,
//     cursor: "pointer",
//     boxShadow: "0 8px 18px rgba(17, 24, 39, 0.16)",
//   },

//   statsGrid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
//     gap: "16px",
//     marginBottom: "20px",
//   },

//   statCard: {
//     background: "#ffffff",
//     border: "1px solid #e5e7eb",
//     borderRadius: "18px",
//     padding: "20px",
//     boxShadow: "0 1px 2px rgba(16, 24, 40, 0.04)",
//   },

//   statLabel: {
//     margin: 0,
//     fontSize: "13px",
//     fontWeight: 800,
//     color: "#667085",
//   },

//   statValue: {
//     margin: "8px 0 0",
//     fontSize: "28px",
//     fontWeight: 900,
//     color: "#101828",
//   },

//   tableCard: {
//     background: "#ffffff",
//     borderRadius: "20px",
//     border: "1px solid #e5e7eb",
//     overflow: "hidden",
//     boxShadow: "0 1px 2px rgba(16, 24, 40, 0.04)",
//   },

//   tableHeader: {
//     padding: "24px",
//     borderBottom: "1px solid #eaecf0",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     gap: "16px",
//     flexWrap: "wrap",
//   },

//   tableTitle: {
//     margin: 0,
//     fontSize: "20px",
//     fontWeight: 900,
//     color: "#101828",
//   },

//   tableSubtitle: {
//     margin: "6px 0 0",
//     fontSize: "14px",
//     color: "#667085",
//     lineHeight: 1.45,
//   },

//   headerHint: {
//     background: "#f8fafc",
//     border: "1px solid #e5e7eb",
//     borderRadius: "999px",
//     padding: "9px 12px",
//     color: "#475467",
//     fontSize: "12px",
//     fontWeight: 800,
//   },

//   desktopTableWrapper: {
//     width: "100%",
//     maxHeight: "calc(100vh - 330px)",
//     overflow: "auto",
//     position: "relative",
//   },

//   table: {
//     width: "100%",
//     minWidth: "1100px",
//     borderCollapse: "separate",
//     borderSpacing: 0,
//   },

//   th: {
//     textAlign: "left",
//     padding: "14px 16px",
//     background: "#f9fafb",
//     color: "#475467",
//     fontSize: "13px",
//     fontWeight: 900,
//     borderBottom: "1px solid #eaecf0",
//     whiteSpace: "nowrap",
//     position: "sticky",
//     top: 0,
//     zIndex: 5,
//   },

//   thAction: {
//     textAlign: "left",
//     padding: "14px 16px",
//     background: "#f9fafb",
//     color: "#475467",
//     fontSize: "13px",
//     fontWeight: 900,
//     borderBottom: "1px solid #eaecf0",
//     whiteSpace: "nowrap",
//     position: "sticky",
//     top: 0,
//     right: 0,
//     zIndex: 8,
//     boxShadow: "-8px 0 12px rgba(16, 24, 40, 0.04)",
//   },

//   tr: {
//     background: "#ffffff",
//   },

//   td: {
//     padding: "14px 16px",
//     borderBottom: "1px solid #f2f4f7",
//     verticalAlign: "middle",
//     fontSize: "14px",
//     color: "#101828",
//     whiteSpace: "nowrap",
//   },

//   tdProduct: {
//     padding: "14px 16px",
//     borderBottom: "1px solid #f2f4f7",
//     verticalAlign: "middle",
//     fontSize: "14px",
//     color: "#101828",
//     width: "360px",
//     minWidth: "360px",
//   },

//   tdAction: {
//     padding: "14px 16px",
//     borderBottom: "1px solid #f2f4f7",
//     verticalAlign: "middle",
//     background: "#ffffff",
//     position: "sticky",
//     right: 0,
//     zIndex: 4,
//     boxShadow: "-8px 0 12px rgba(16, 24, 40, 0.04)",
//   },

//   orderBadge: {
//     display: "inline-flex",
//     alignItems: "center",
//     justifyContent: "center",
//     background: "#111827",
//     color: "#ffffff",
//     borderRadius: "999px",
//     padding: "6px 10px",
//     fontSize: "12px",
//     fontWeight: 900,
//     minWidth: "36px",
//     textAlign: "center",
//   },

//   idBadge: {
//     display: "inline-flex",
//     alignItems: "center",
//     justifyContent: "center",
//     background: "#f2f4f7",
//     color: "#344054",
//     borderRadius: "999px",
//     padding: "6px 10px",
//     fontSize: "12px",
//     fontWeight: 800,
//   },

//   productImage: {
//     width: "64px",
//     height: "64px",
//     objectFit: "cover",
//     borderRadius: "14px",
//     border: "1px solid #e5e7eb",
//     background: "#ffffff",
//     display: "block",
//   },

//   noImage: {
//     width: "64px",
//     height: "64px",
//     borderRadius: "14px",
//     border: "1px dashed #d0d5dd",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontSize: "11px",
//     color: "#98a2b3",
//     background: "#f9fafb",
//     textAlign: "center",
//   },

//   productTitle: {
//     fontSize: "14px",
//     fontWeight: 900,
//     color: "#101828",
//     lineHeight: 1.45,
//     whiteSpace: "normal",
//   },

//   productShortText: {
//     marginTop: "5px",
//     fontSize: "12px",
//     color: "#667085",
//     lineHeight: 1.45,
//     whiteSpace: "normal",
//   },

//   categoryBadge: {
//     display: "inline-flex",
//     maxWidth: "180px",
//     borderRadius: "999px",
//     background: "#f8fafc",
//     border: "1px solid #e5e7eb",
//     color: "#475467",
//     padding: "7px 10px",
//     fontSize: "12px",
//     fontWeight: 800,
//     whiteSpace: "normal",
//     lineHeight: 1.3,
//   },

//   priceWrap: {
//     display: "grid",
//     gap: "4px",
//   },

//   priceText: {
//     fontWeight: 900,
//     color: "#111827",
//     fontSize: "14px",
//   },

//   discountText: {
//     color: "#cc0c39",
//     fontSize: "13px",
//     fontWeight: 900,
//   },

//   mrpText: {
//     color: "#667085",
//     fontSize: "12px",
//     textDecoration: "line-through",
//   },

//   stockBadge: {
//     display: "inline-flex",
//     alignItems: "center",
//     justifyContent: "center",
//     minWidth: "42px",
//     padding: "6px 10px",
//     borderRadius: "999px",
//     fontSize: "12px",
//     fontWeight: 900,
//   },

//   stockGood: {
//     background: "#ecfdf3",
//     color: "#027a48",
//     border: "1px solid #abefc6",
//   },

//   stockLow: {
//     background: "#fffaeb",
//     color: "#b54708",
//     border: "1px solid #fedf89",
//   },

//   stockOut: {
//     background: "#fef3f2",
//     color: "#b42318",
//     border: "1px solid #fecdca",
//   },

//   statusBadge: {
//     display: "inline-flex",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: "6px 12px",
//     borderRadius: "999px",
//     fontSize: "12px",
//     fontWeight: 900,
//   },

//   actionGroup: {
//     display: "flex",
//     gap: "8px",
//     flexWrap: "wrap",
//     minWidth: "230px",
//   },

//   editButton: {
//     background: "#ffffff",
//     color: "#344054",
//     border: "1px solid #d0d5dd",
//     borderRadius: "10px",
//     padding: "10px 14px",
//     fontSize: "13px",
//     fontWeight: 800,
//     cursor: "pointer",
//     whiteSpace: "nowrap",
//   },

//   archiveButton: {
//     background: "#fff7ed",
//     color: "#b54708",
//     border: "1px solid #fed7aa",
//     borderRadius: "10px",
//     padding: "10px 14px",
//     fontSize: "13px",
//     fontWeight: 800,
//     cursor: "pointer",
//     whiteSpace: "nowrap",
//   },

//   loadingBox: {
//     padding: "70px 20px",
//     textAlign: "center",
//     color: "#667085",
//     fontWeight: 700,
//   },

//   emptyBox: {
//     padding: "70px 20px",
//     textAlign: "center",
//     color: "#667085",
//   },

//   emptyTitle: {
//     margin: 0,
//     fontSize: "20px",
//     fontWeight: 900,
//     color: "#101828",
//   },

//   emptyText: {
//     margin: "8px 0 20px",
//     fontSize: "14px",
//     color: "#667085",
//   },

//   mobileList: {
//     display: "none",
//     padding: "16px",
//     gap: "14px",
//   },

//   mobileCard: {
//     background: "#ffffff",
//     border: "1px solid #e5e7eb",
//     borderRadius: "18px",
//     padding: "14px",
//     boxShadow: "0 1px 2px rgba(16, 24, 40, 0.04)",
//   },

//   mobileTop: {
//     display: "flex",
//     gap: "12px",
//     alignItems: "flex-start",
//   },

//   mobileImage: {
//     width: "76px",
//     height: "76px",
//     objectFit: "cover",
//     borderRadius: "14px",
//     border: "1px solid #e5e7eb",
//     background: "#ffffff",
//     flexShrink: 0,
//   },

//   mobileNoImage: {
//     width: "76px",
//     height: "76px",
//     borderRadius: "14px",
//     border: "1px dashed #d0d5dd",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontSize: "11px",
//     color: "#98a2b3",
//     background: "#f9fafb",
//     textAlign: "center",
//     flexShrink: 0,
//   },

//   mobileInfo: {
//     flex: 1,
//     minWidth: 0,
//   },

//   mobileTitle: {
//     fontSize: "14px",
//     fontWeight: 900,
//     color: "#101828",
//     lineHeight: 1.4,
//   },

//   mobileCategory: {
//     marginTop: "5px",
//     fontSize: "12px",
//     color: "#667085",
//     fontWeight: 700,
//   },

//   mobileMeta: {
//     display: "flex",
//     alignItems: "center",
//     gap: "8px",
//     flexWrap: "wrap",
//     marginTop: "10px",
//   },

//   mobileDetailsGrid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
//     gap: "10px",
//     marginTop: "14px",
//   },

//   mobileDetailBox: {
//     background: "#f8fafc",
//     border: "1px solid #e5e7eb",
//     borderRadius: "14px",
//     padding: "10px",
//     display: "grid",
//     gap: "7px",
//     alignContent: "start",
//   },

//   mobileDetailLabel: {
//     fontSize: "11px",
//     color: "#667085",
//     fontWeight: 900,
//     textTransform: "uppercase",
//     letterSpacing: "0.04em",
//   },

//   mobileActions: {
//     display: "grid",
//     gridTemplateColumns: "1fr auto",
//     gap: "10px",
//     marginTop: "14px",
//   },

//   mobileEditButton: {
//     background: "#111827",
//     color: "#ffffff",
//     border: "none",
//     borderRadius: "12px",
//     padding: "12px 14px",
//     fontSize: "13px",
//     fontWeight: 900,
//     cursor: "pointer",
//   },

//   mobileArchiveButton: {
//     background: "#fff7ed",
//     color: "#b54708",
//     border: "1px solid #fed7aa",
//     borderRadius: "12px",
//     padding: "12px 14px",
//     fontSize: "13px",
//     fontWeight: 900,
//     cursor: "pointer",
//   },
// };

































"use client";

import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdminProducts,
  deleteProduct,
} from "@/features/adminProducts/adminProductThunks";
import { useRouter } from "next/navigation";

export default function AdminProductsPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const products = useSelector((state) => state.adminProducts.products || []);
  const loading = useSelector((state) => state.adminProducts.loading);

  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  const hasValue = (value) =>
    value !== null && value !== undefined && String(value).trim() !== "";

  const getDisplayOrder = (product) => {
    const value =
      product?.displayOrder ??
      product?.display_order ??
      product?.displayorder ??
      null;

    if (!hasValue(value)) return null;

    const numberValue = Number(value);
    return Number.isFinite(numberValue) ? numberValue : null;
  };

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      const orderA = getDisplayOrder(a);
      const orderB = getDisplayOrder(b);

      const safeOrderA = orderA === null ? 999999 : orderA;
      const safeOrderB = orderB === null ? 999999 : orderB;

      if (safeOrderA !== safeOrderB) {
        return safeOrderA - safeOrderB;
      }

      return Number(a.id || 0) - Number(b.id || 0);
    });
  }, [products]);

  const handleArchive = async (id) => {
    const ok = window.confirm(
      "Archive this product?\n\nIt will be hidden from customers but kept for order history."
    );

    if (!ok) return;

    const resultAction = await dispatch(deleteProduct(id));

    if (deleteProduct.fulfilled.match(resultAction)) {
      dispatch(fetchAdminProducts());
    } else {
      alert(resultAction.payload || "Archive failed");
    }
  };

  const getCategoryName = (category) => {
    if (!category) return "No category";
    if (typeof category === "object") return category?.name || "No category";
    return category;
  };

  const getImageSrc = (image) => {
    if (!image) return "";

    const img =
      typeof image === "string"
        ? image
        : image?.imageUrl ||
          image?.url ||
          image?.mediaUrl ||
          image?.videoUrl ||
          "";

    if (!img) return "";

    if (img.startsWith("http")) return img;

    const base =
      process.env.NEXT_PUBLIC_API_BASE ||
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "";

    return `${base}${img}`;
  };

  const getFirstImage = (product) => {
    if (Array.isArray(product?.images) && product.images.length > 0) {
      return product.images[0];
    }

    if (Array.isArray(product?.imageUrls) && product.imageUrls.length > 0) {
      return product.imageUrls[0];
    }

    return (
      product?.imageUrl ||
      product?.thumbnailUrl ||
      product?.mainImageUrl ||
      product?.mediaUrl ||
      ""
    );
  };

  const shortText = (value, limit = 95) => {
    if (!hasValue(value)) return "—";
    const text = String(value);
    return text.length > limit ? `${text.slice(0, limit)}...` : text;
  };

  const getPrice = (product) => {
    return Number(
      product?.priceInr ??
        product?.price ??
        product?.sellingPrice ??
        product?.selling_price ??
        0
    );
  };

  const getMrp = (product) => {
    return Number(
      product?.mrpInr ??
        product?.mrp ??
        product?.compareAtPrice ??
        product?.compare_at_price ??
        0
    );
  };

  const getDiscountPrice = (product) => {
    return Number(
      product?.discountInr ??
        product?.discount_inr ??
        product?.discountPrice ??
        product?.discount_price ??
        0
    );
  };

  const getDiscountPercent = (product) => {
    const directDiscount = Number(
      product?.discountPercent ?? product?.discount_percent ?? 0
    );

    if (directDiscount > 0) return directDiscount;

    const discountPrice = getDiscountPrice(product);
    const mrp = getMrp(product);

    if (mrp > 0 && discountPrice > 0 && mrp > discountPrice) {
      return Math.round(((mrp - discountPrice) / mrp) * 100);
    }

    return 0;
  };

  const renderPriceBlock = (product) => {
    const sellingPrice = getPrice(product);
    const mrp = getMrp(product);
    const discountPrice = getDiscountPrice(product);
    const discountPercent = getDiscountPercent(product);

    return (
      <div style={styles.priceWrap}>
        <span style={styles.priceText}>
          ₹{sellingPrice.toLocaleString("en-IN")}
        </span>

        {discountPrice > 0 && discountPrice !== sellingPrice && (
          <span style={styles.discountPriceText}>
            Discount ₹{discountPrice.toLocaleString("en-IN")}
          </span>
        )}

        {discountPercent > 0 && mrp > discountPrice && (
          <>
            <span style={styles.discountText}>-{discountPercent}%</span>
            <span style={styles.mrpText}>
              MRP ₹{mrp.toLocaleString("en-IN")}
            </span>
          </>
        )}
      </div>
    );
  };

  const getStockValue = (product) => {
    const value =
      product?.stock ??
      product?.stockQuantity ??
      product?.stock_quantity ??
      product?.quantity ??
      0;

    const numberValue = Number(value);
    return Number.isFinite(numberValue) ? numberValue : 0;
  };

  const getProductStatus = (product) => {
    const isArchived =
      product?.deleted === true ||
      product?.isDeleted === true ||
      product?.is_deleted === true ||
      product?.active === false ||
      product?.isActive === false ||
      product?.is_active === false;

    return isArchived ? "Archived" : "Active";
  };

  const getStatusStyle = (status) => {
    if (status === "Archived") {
      return {
        background: "#f2f4f7",
        color: "#475467",
        border: "1px solid #e4e7ec",
      };
    }

    return {
      background: "#ecfdf3",
      color: "#027a48",
      border: "1px solid #abefc6",
    };
  };

  const activeCount = sortedProducts.filter(
    (product) => getProductStatus(product) === "Active"
  ).length;

  const archivedCount = sortedProducts.filter(
    (product) => getProductStatus(product) === "Archived"
  ).length;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.headerCard}>
          <div>
            <p style={styles.overline}>Admin Dashboard</p>
            <h1 style={styles.heading}>Products Management</h1>
            <p style={styles.subtext}>
              Manage product list, display order, stock, status and PDP editing.
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/admin/products/create")}
            style={styles.primaryButton}
          >
            + Create Product
          </button>
        </div>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Total Products</p>
            <h2 style={styles.statValue}>{sortedProducts.length}</h2>
          </div>

          <div style={styles.statCard}>
            <p style={styles.statLabel}>Active Products</p>
            <h2 style={styles.statValue}>{activeCount}</h2>
          </div>

          <div style={styles.statCard}>
            <p style={styles.statLabel}>Archived Products</p>
            <h2 style={styles.statValue}>{archivedCount}</h2>
          </div>
        </div>

        <div style={styles.tableCard}>
          <div style={styles.tableHeader}>
            <div>
              <h2 style={styles.tableTitle}>All Products</h2>
              <p style={styles.tableSubtitle}>
                Products are arranged by display_order first, then product ID.
              </p>
            </div>

            <div style={styles.headerHint}>
              PDP details are managed from the edit page.
            </div>
          </div>

          {loading ? (
            <div style={styles.loadingBox}>Loading products...</div>
          ) : sortedProducts.length === 0 ? (
            <div style={styles.emptyBox}>
              <h3 style={styles.emptyTitle}>No products found</h3>
              <p style={styles.emptyText}>
                Create your first product to start managing your catalogue.
              </p>

              <button
                type="button"
                onClick={() => router.push("/admin/products/create")}
                style={styles.primaryButton}
              >
                + Create Product
              </button>
            </div>
          ) : (
            <>
              <div style={styles.desktopTableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Display Order</th>
                      <th style={styles.th}>ID</th>
                      <th style={styles.th}>Image</th>
                      <th style={styles.th}>Product</th>
                      <th style={styles.th}>Category</th>
                      <th style={styles.th}>Price</th>
                      <th style={styles.th}>Stock</th>
                      <th style={styles.th}>Status</th>
                      <th style={styles.thAction}>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {sortedProducts.map((product) => {
                      const firstImage = getFirstImage(product);
                      const img = getImageSrc(firstImage);
                      const displayOrder = getDisplayOrder(product);
                      const status = getProductStatus(product);
                      const isArchived = status === "Archived";
                      const stock = getStockValue(product);

                      return (
                        <tr key={product.id} style={styles.tr}>
                          <td style={styles.td}>
                            <span style={styles.orderBadge}>
                              {displayOrder ?? "—"}
                            </span>
                          </td>

                          <td style={styles.td}>
                            <span style={styles.idBadge}>#{product.id}</span>
                          </td>

                          <td style={styles.td}>
                            {img ? (
                              <img
                                src={img}
                                alt={product.title || "Product image"}
                                style={styles.productImage}
                              />
                            ) : (
                              <div style={styles.noImage}>No Image</div>
                            )}
                          </td>

                          <td style={styles.tdProduct}>
                            <div style={styles.productTitle}>
                              {shortText(product.title, 90)}
                            </div>

                            {hasValue(product.shortHighlights) && (
                              <div style={styles.productShortText}>
                                {shortText(product.shortHighlights, 95)}
                              </div>
                            )}
                          </td>

                          <td style={styles.td}>
                            <span style={styles.categoryBadge}>
                              {getCategoryName(product.category)}
                            </span>
                          </td>

                          <td style={styles.td}>{renderPriceBlock(product)}</td>

                          <td style={styles.td}>
                            <span
                              style={{
                                ...styles.stockBadge,
                                ...(stock <= 0
                                  ? styles.stockOut
                                  : stock <= 5
                                  ? styles.stockLow
                                  : styles.stockGood),
                              }}
                            >
                              {stock}
                            </span>
                          </td>

                          <td style={styles.td}>
                            <span
                              style={{
                                ...styles.statusBadge,
                                ...getStatusStyle(status),
                              }}
                            >
                              {status}
                            </span>
                          </td>

                          <td style={styles.tdAction}>
                            <div style={styles.actionGroup}>
                              <button
                                type="button"
                                onClick={() =>
                                  router.push(
                                    `/admin/products/edit/${product.id}`
                                  )
                                }
                                style={styles.editButton}
                              >
                                View / Edit PDP
                              </button>

                              {!isArchived && (
                                <button
                                  type="button"
                                  onClick={() => handleArchive(product.id)}
                                  style={styles.archiveButton}
                                >
                                  Archive
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div style={styles.mobileList}>
                {sortedProducts.map((product) => {
                  const firstImage = getFirstImage(product);
                  const img = getImageSrc(firstImage);
                  const displayOrder = getDisplayOrder(product);
                  const status = getProductStatus(product);
                  const isArchived = status === "Archived";
                  const stock = getStockValue(product);

                  return (
                    <div key={product.id} style={styles.mobileCard}>
                      <div style={styles.mobileTop}>
                        {img ? (
                          <img
                            src={img}
                            alt={product.title || "Product image"}
                            style={styles.mobileImage}
                          />
                        ) : (
                          <div style={styles.mobileNoImage}>No Image</div>
                        )}

                        <div style={styles.mobileInfo}>
                          <div style={styles.mobileTitle}>
                            {shortText(product.title, 95)}
                          </div>

                          <div style={styles.mobileCategory}>
                            {getCategoryName(product.category)}
                          </div>

                          <div style={styles.mobileMeta}>
                            <span style={styles.idBadge}>#{product.id}</span>
                            <span style={styles.orderBadge}>
                              Order {displayOrder ?? "—"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div style={styles.mobileDetailsGrid}>
                        <div style={styles.mobileDetailBox}>
                          <span style={styles.mobileDetailLabel}>Price</span>
                          {renderPriceBlock(product)}
                        </div>

                        <div style={styles.mobileDetailBox}>
                          <span style={styles.mobileDetailLabel}>Stock</span>
                          <span
                            style={{
                              ...styles.stockBadge,
                              ...(stock <= 0
                                ? styles.stockOut
                                : stock <= 5
                                ? styles.stockLow
                                : styles.stockGood),
                            }}
                          >
                            {stock}
                          </span>
                        </div>

                        <div style={styles.mobileDetailBox}>
                          <span style={styles.mobileDetailLabel}>Status</span>
                          <span
                            style={{
                              ...styles.statusBadge,
                              ...getStatusStyle(status),
                            }}
                          >
                            {status}
                          </span>
                        </div>
                      </div>

                      <div style={styles.mobileActions}>
                        <button
                          type="button"
                          onClick={() =>
                            router.push(`/admin/products/edit/${product.id}`)
                          }
                          style={styles.mobileEditButton}
                        >
                          View / Edit PDP
                        </button>

                        {!isArchived && (
                          <button
                            type="button"
                            onClick={() => handleArchive(product.id)}
                            style={styles.mobileArchiveButton}
                          >
                            Archive
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    padding: "32px 20px",
    overflowX: "hidden",
  },

  container: {
    width: "100%",
    maxWidth: "1400px",
    margin: "0 auto",
  },

  headerCard: {
    background: "#ffffff",
    borderRadius: "20px",
    padding: "28px 32px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    border: "1px solid #e5e7eb",
    marginBottom: "20px",
    flexWrap: "wrap",
    boxShadow: "0 1px 2px rgba(16, 24, 40, 0.04)",
  },

  overline: {
    margin: 0,
    fontSize: "12px",
    fontWeight: 800,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#667085",
  },

  heading: {
    margin: "8px 0 10px",
    fontSize: "32px",
    fontWeight: 900,
    color: "#101828",
    lineHeight: 1.15,
  },

  subtext: {
    margin: 0,
    fontSize: "15px",
    color: "#667085",
    lineHeight: 1.5,
  },

  primaryButton: {
    background: "#111827",
    color: "#ffffff",
    border: "none",
    borderRadius: "12px",
    padding: "14px 18px",
    fontSize: "14px",
    fontWeight: 800,
    cursor: "pointer",
    boxShadow: "0 8px 18px rgba(17, 24, 39, 0.16)",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "16px",
    marginBottom: "20px",
  },

  statCard: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "18px",
    padding: "20px",
    boxShadow: "0 1px 2px rgba(16, 24, 40, 0.04)",
  },

  statLabel: {
    margin: 0,
    fontSize: "13px",
    fontWeight: 800,
    color: "#667085",
  },

  statValue: {
    margin: "8px 0 0",
    fontSize: "28px",
    fontWeight: 900,
    color: "#101828",
  },

  tableCard: {
    background: "#ffffff",
    borderRadius: "20px",
    border: "1px solid #e5e7eb",
    overflow: "hidden",
    boxShadow: "0 1px 2px rgba(16, 24, 40, 0.04)",
  },

  tableHeader: {
    padding: "24px",
    borderBottom: "1px solid #eaecf0",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
    flexWrap: "wrap",
  },

  tableTitle: {
    margin: 0,
    fontSize: "20px",
    fontWeight: 900,
    color: "#101828",
  },

  tableSubtitle: {
    margin: "6px 0 0",
    fontSize: "14px",
    color: "#667085",
    lineHeight: 1.45,
  },

  headerHint: {
    background: "#f8fafc",
    border: "1px solid #e5e7eb",
    borderRadius: "999px",
    padding: "9px 12px",
    color: "#475467",
    fontSize: "12px",
    fontWeight: 800,
  },

  desktopTableWrapper: {
    width: "100%",
    maxHeight: "calc(100vh - 330px)",
    overflow: "auto",
    position: "relative",
  },

  table: {
    width: "100%",
    minWidth: "1100px",
    borderCollapse: "separate",
    borderSpacing: 0,
  },

  th: {
    textAlign: "left",
    padding: "14px 16px",
    background: "#f9fafb",
    color: "#475467",
    fontSize: "13px",
    fontWeight: 900,
    borderBottom: "1px solid #eaecf0",
    whiteSpace: "nowrap",
    position: "sticky",
    top: 0,
    zIndex: 5,
  },

  thAction: {
    textAlign: "left",
    padding: "14px 16px",
    background: "#f9fafb",
    color: "#475467",
    fontSize: "13px",
    fontWeight: 900,
    borderBottom: "1px solid #eaecf0",
    whiteSpace: "nowrap",
    position: "sticky",
    top: 0,
    right: 0,
    zIndex: 8,
    boxShadow: "-8px 0 12px rgba(16, 24, 40, 0.04)",
  },

  tr: {
    background: "#ffffff",
  },

  td: {
    padding: "14px 16px",
    borderBottom: "1px solid #f2f4f7",
    verticalAlign: "middle",
    fontSize: "14px",
    color: "#101828",
    whiteSpace: "nowrap",
  },

  tdProduct: {
    padding: "14px 16px",
    borderBottom: "1px solid #f2f4f7",
    verticalAlign: "middle",
    fontSize: "14px",
    color: "#101828",
    width: "360px",
    minWidth: "360px",
  },

  tdAction: {
    padding: "14px 16px",
    borderBottom: "1px solid #f2f4f7",
    verticalAlign: "middle",
    background: "#ffffff",
    position: "sticky",
    right: 0,
    zIndex: 4,
    boxShadow: "-8px 0 12px rgba(16, 24, 40, 0.04)",
  },

  orderBadge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#111827",
    color: "#ffffff",
    borderRadius: "999px",
    padding: "6px 10px",
    fontSize: "12px",
    fontWeight: 900,
    minWidth: "36px",
    textAlign: "center",
  },

  idBadge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f2f4f7",
    color: "#344054",
    borderRadius: "999px",
    padding: "6px 10px",
    fontSize: "12px",
    fontWeight: 800,
  },

  productImage: {
    width: "64px",
    height: "64px",
    objectFit: "cover",
    borderRadius: "14px",
    border: "1px solid #e5e7eb",
    background: "#ffffff",
    display: "block",
  },

  noImage: {
    width: "64px",
    height: "64px",
    borderRadius: "14px",
    border: "1px dashed #d0d5dd",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    color: "#98a2b3",
    background: "#f9fafb",
    textAlign: "center",
  },

  productTitle: {
    fontSize: "14px",
    fontWeight: 900,
    color: "#101828",
    lineHeight: 1.45,
    whiteSpace: "normal",
  },

  productShortText: {
    marginTop: "5px",
    fontSize: "12px",
    color: "#667085",
    lineHeight: 1.45,
    whiteSpace: "normal",
  },

  categoryBadge: {
    display: "inline-flex",
    maxWidth: "180px",
    borderRadius: "999px",
    background: "#f8fafc",
    border: "1px solid #e5e7eb",
    color: "#475467",
    padding: "7px 10px",
    fontSize: "12px",
    fontWeight: 800,
    whiteSpace: "normal",
    lineHeight: 1.3,
  },

  priceWrap: {
    display: "grid",
    gap: "4px",
  },

  priceText: {
    fontWeight: 900,
    color: "#111827",
    fontSize: "14px",
  },

  discountPriceText: {
    color: "#475467",
    fontSize: "12px",
    fontWeight: 800,
  },

  discountText: {
    color: "#cc0c39",
    fontSize: "13px",
    fontWeight: 900,
  },

  mrpText: {
    color: "#667085",
    fontSize: "12px",
    textDecoration: "line-through",
  },

  stockBadge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "42px",
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 900,
  },

  stockGood: {
    background: "#ecfdf3",
    color: "#027a48",
    border: "1px solid #abefc6",
  },

  stockLow: {
    background: "#fffaeb",
    color: "#b54708",
    border: "1px solid #fedf89",
  },

  stockOut: {
    background: "#fef3f2",
    color: "#b42318",
    border: "1px solid #fecdca",
  },

  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "6px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 900,
  },

  actionGroup: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    minWidth: "230px",
  },

  editButton: {
    background: "#ffffff",
    color: "#344054",
    border: "1px solid #d0d5dd",
    borderRadius: "10px",
    padding: "10px 14px",
    fontSize: "13px",
    fontWeight: 800,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },

  archiveButton: {
    background: "#fff7ed",
    color: "#b54708",
    border: "1px solid #fed7aa",
    borderRadius: "10px",
    padding: "10px 14px",
    fontSize: "13px",
    fontWeight: 800,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },

  loadingBox: {
    padding: "70px 20px",
    textAlign: "center",
    color: "#667085",
    fontWeight: 700,
  },

  emptyBox: {
    padding: "70px 20px",
    textAlign: "center",
    color: "#667085",
  },

  emptyTitle: {
    margin: 0,
    fontSize: "20px",
    fontWeight: 900,
    color: "#101828",
  },

  emptyText: {
    margin: "8px 0 20px",
    fontSize: "14px",
    color: "#667085",
  },

  mobileList: {
    display: "none",
    padding: "16px",
    gap: "14px",
  },

  mobileCard: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "18px",
    padding: "14px",
    boxShadow: "0 1px 2px rgba(16, 24, 40, 0.04)",
  },

  mobileTop: {
    display: "flex",
    gap: "12px",
    alignItems: "flex-start",
  },

  mobileImage: {
    width: "76px",
    height: "76px",
    objectFit: "cover",
    borderRadius: "14px",
    border: "1px solid #e5e7eb",
    background: "#ffffff",
    flexShrink: 0,
  },

  mobileNoImage: {
    width: "76px",
    height: "76px",
    borderRadius: "14px",
    border: "1px dashed #d0d5dd",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    color: "#98a2b3",
    background: "#f9fafb",
    textAlign: "center",
    flexShrink: 0,
  },

  mobileInfo: {
    flex: 1,
    minWidth: 0,
  },

  mobileTitle: {
    fontSize: "14px",
    fontWeight: 900,
    color: "#101828",
    lineHeight: 1.4,
  },

  mobileCategory: {
    marginTop: "5px",
    fontSize: "12px",
    color: "#667085",
    fontWeight: 700,
  },

  mobileMeta: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap",
    marginTop: "10px",
  },

  mobileDetailsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "10px",
    marginTop: "14px",
  },

  mobileDetailBox: {
    background: "#f8fafc",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "10px",
    display: "grid",
    gap: "7px",
    alignContent: "start",
  },

  mobileDetailLabel: {
    fontSize: "11px",
    color: "#667085",
    fontWeight: 900,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },

  mobileActions: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    gap: "10px",
    marginTop: "14px",
  },

  mobileEditButton: {
    background: "#111827",
    color: "#ffffff",
    border: "none",
    borderRadius: "12px",
    padding: "12px 14px",
    fontSize: "13px",
    fontWeight: 900,
    cursor: "pointer",
  },

  mobileArchiveButton: {
    background: "#fff7ed",
    color: "#b54708",
    border: "1px solid #fed7aa",
    borderRadius: "12px",
    padding: "12px 14px",
    fontSize: "13px",
    fontWeight: 900,
    cursor: "pointer",
  },
};