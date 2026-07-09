

// "use client";

// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";

// import {
//   fetchAdminOrders,
//   updateAdminOrderStatus,
//   updateAdminOrderShipment,
// } from "@/features/orders/orderSlice";

// const statuses = [
//   "PLACED",
//   "CONFIRMED",
//   "PACKED",
//   "SHIPPED",
//   "DELIVERED",
//   "CANCELLED",
// ];

// const defaultShipmentForm = {
//   courierName: "Delhivery",
//   trackingId: "",
//   trackingUrl: "https://www.delhivery.com/tracking",
// };

// export default function AdminOrdersPage() {
//   const dispatch = useDispatch();

//   const {
//     adminOrders,
//     loading,
//     error,
//   } = useSelector((state) => state.orders);

//   const [selectedOrder, setSelectedOrder] =
//     useState(null);

//   const [shipmentForm, setShipmentForm] =
//     useState(defaultShipmentForm);

//   const [shipmentSaving, setShipmentSaving] =
//     useState(false);

//   const [shipmentError, setShipmentError] =
//     useState("");

//   const [successMessage, setSuccessMessage] =
//     useState("");

//   useEffect(() => {
//     dispatch(fetchAdminOrders());
//   }, [dispatch]);

//   function openShipmentModal(order) {
//     setSelectedOrder(order);
//     setShipmentError("");
//     setSuccessMessage("");

//     setShipmentForm({
//       courierName:
//         order.shipment?.courierName ||
//         "Delhivery",

//       trackingId:
//         order.shipment?.trackingId || "",

//       trackingUrl:
//         order.shipment?.trackingUrl ||
//         "https://www.delhivery.com/tracking",
//     });
//   }

//   function closeShipmentModal() {
//     if (shipmentSaving) {
//       return;
//     }

//     setSelectedOrder(null);
//     setShipmentError("");
//     setShipmentForm(defaultShipmentForm);
//   }

//   function handleShipmentInput(event) {
//     const { name, value } = event.target;

//     setShipmentForm((current) => ({
//       ...current,
//       [name]: value,
//     }));
//   }

//   async function handleShipmentSubmit(event) {
//     event.preventDefault();

//     if (!selectedOrder) {
//       return;
//     }

//     const courierName =
//       shipmentForm.courierName.trim();

//     const trackingId =
//       shipmentForm.trackingId.trim();

//     const trackingUrl =
//       shipmentForm.trackingUrl.trim();

//     if (!courierName) {
//       setShipmentError(
//         "Courier name is required."
//       );
//       return;
//     }

//     if (!trackingId) {
//       setShipmentError(
//         "Tracking ID / AWB is required."
//       );
//       return;
//     }

//     if (
//       trackingUrl &&
//       !trackingUrl.startsWith("http://") &&
//       !trackingUrl.startsWith("https://")
//     ) {
//       setShipmentError(
//         "Tracking URL must begin with http:// or https://"
//       );
//       return;
//     }

//     try {
//       setShipmentSaving(true);
//       setShipmentError("");
//       setSuccessMessage("");

//       await dispatch(
//         updateAdminOrderShipment({
//           id: selectedOrder.id,
//           courierName,
//           trackingId,
//           trackingUrl: trackingUrl || null,
//         })
//       ).unwrap();

//       await dispatch(fetchAdminOrders()).unwrap();

//       setSuccessMessage(
//         `Shipment updated for ${selectedOrder.orderNumber}. The customer email has been triggered.`
//       );

//       setSelectedOrder(null);
//       setShipmentForm(defaultShipmentForm);
//     } catch (requestError) {
//       setShipmentError(
//         typeof requestError === "string"
//           ? requestError
//           : requestError?.message ||
//               "Failed to update shipment."
//       );
//     } finally {
//       setShipmentSaving(false);
//     }
//   }

//   async function handleStatusUpdate(
//     orderId,
//     status
//   ) {
//     setSuccessMessage("");

//     try {
//       await dispatch(
//         updateAdminOrderStatus({
//           id: orderId,
//           status,
//         })
//       ).unwrap();

//       setSuccessMessage(
//         `Order status updated to ${status}.`
//       );
//     } catch {
//       // Redux state already stores the API error.
//     }
//   }

//   const pageStyle = {
//     minHeight: "100vh",
//     padding: "clamp(14px, 2vw, 24px)",
//     background:
//       "linear-gradient(180deg, #f8f8f8 0%, #f3f4f6 45%, #efefef 100%)",
//   };

//   const headerWrapStyle = {
//     display: "flex",
//     flexWrap: "wrap",
//     justifyContent: "space-between",
//     alignItems: "center",
//     gap: "12px",
//     marginBottom: "20px",
//   };

//   const headingStyle = {
//     margin: 0,
//     fontSize: "clamp(22px, 3vw, 34px)",
//     fontWeight: 700,
//     color: "#111827",
//     letterSpacing: "-0.03em",
//   };

//   const subTextStyle = {
//     margin: "6px 0 0",
//     color: "#6b7280",
//     fontSize: "clamp(13px, 1.5vw, 15px)",
//   };

//   const ordersGridStyle = {
//     display: "grid",
//     gap: "18px",
//   };

//   const cardStyle = {
//     position: "relative",
//     overflow: "hidden",
//     borderRadius: "20px",
//     padding: "clamp(16px, 2vw, 22px)",
//     background:
//       "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(249,250,251,0.96) 100%)",
//     border: "1px solid rgba(17,24,39,0.08)",
//     boxShadow:
//       "0 10px 30px rgba(17,24,39,0.06), 0 2px 10px rgba(17,24,39,0.04)",
//     transition:
//       "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
//   };

//   const topBarStyle = {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//     gap: "12px",
//     flexWrap: "wrap",
//     marginBottom: "14px",
//   };

//   const orderNumberStyle = {
//     margin: 0,
//     fontSize: "clamp(17px, 2vw, 22px)",
//     fontWeight: 700,
//     color: "#111827",
//     wordBreak: "break-word",
//   };

//   const statusBadgeStyle = (status) => {
//     const isDelivered =
//       status === "DELIVERED";

//     const isCancelled =
//       status === "CANCELLED";

//     const isShipped =
//       status === "SHIPPED";

//     const isPacked =
//       status === "PACKED";

//     const isConfirmed =
//       status === "CONFIRMED";

//     let bg = "rgba(17,24,39,0.08)";
//     let color = "#111827";
//     let border = "rgba(17,24,39,0.12)";

//     if (isDelivered) {
//       bg = "rgba(16,185,129,0.12)";
//       color = "#047857";
//       border = "rgba(16,185,129,0.22)";
//     } else if (isCancelled) {
//       bg = "rgba(239,68,68,0.12)";
//       color = "#b91c1c";
//       border = "rgba(239,68,68,0.22)";
//     } else if (isShipped) {
//       bg = "rgba(59,130,246,0.12)";
//       color = "#1d4ed8";
//       border = "rgba(59,130,246,0.22)";
//     } else if (isPacked) {
//       bg = "rgba(168,85,247,0.12)";
//       color = "#7c3aed";
//       border = "rgba(168,85,247,0.22)";
//     } else if (isConfirmed) {
//       bg = "rgba(245,158,11,0.12)";
//       color = "#b45309";
//       border = "rgba(245,158,11,0.22)";
//     }

//     return {
//       display: "inline-flex",
//       alignItems: "center",
//       justifyContent: "center",
//       minHeight: "36px",
//       padding: "8px 14px",
//       borderRadius: "999px",
//       background: bg,
//       color,
//       border: `1px solid ${border}`,
//       fontSize: "12px",
//       fontWeight: 700,
//       letterSpacing: "0.04em",
//       whiteSpace: "nowrap",
//     };
//   };

//   const infoGridStyle = {
//     display: "grid",
//     gridTemplateColumns:
//       "repeat(auto-fit, minmax(180px, 1fr))",
//     gap: "12px",
//     marginBottom: "16px",
//   };

//   const infoCardStyle = {
//     borderRadius: "16px",
//     padding: "14px",
//     background: "rgba(255,255,255,0.72)",
//     border: "1px solid rgba(17,24,39,0.06)",
//     boxShadow:
//       "inset 0 1px 0 rgba(255,255,255,0.7)",
//     minWidth: 0,
//   };

//   const infoLabelStyle = {
//     margin: "0 0 6px",
//     fontSize: "11px",
//     fontWeight: 700,
//     letterSpacing: "0.08em",
//     color: "#6b7280",
//   };

//   const infoValueStyle = {
//     margin: 0,
//     fontSize: "15px",
//     fontWeight: 600,
//     color: "#111827",
//     wordBreak: "break-word",
//   };

//   const addressBoxStyle = {
//     borderRadius: "16px",
//     padding: "14px",
//     background:
//       "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
//     border: "1px solid rgba(17,24,39,0.06)",
//     color: "#374151",
//     lineHeight: 1.65,
//     fontSize: "14px",
//     marginBottom: "16px",
//     wordBreak: "break-word",
//   };

//   const shipmentBoxStyle = {
//     borderRadius: "16px",
//     padding: "16px",
//     marginBottom: "16px",
//     background: "#eff6ff",
//     border: "1px solid #bfdbfe",
//   };

//   const actionsWrapStyle = {
//     display: "flex",
//     flexWrap: "wrap",
//     gap: "10px",
//   };

//   const getButtonStyle = (
//     currentStatus,
//     buttonStatus
//   ) => {
//     const active =
//       currentStatus === buttonStatus;

//     return {
//       border: active
//         ? "1px solid rgba(17,24,39,0.18)"
//         : "1px solid rgba(17,24,39,0.08)",

//       background: active
//         ? "linear-gradient(135deg, #111827 0%, #1f2937 100%)"
//         : "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",

//       color: active
//         ? "#ffffff"
//         : "#111827",

//       borderRadius: "12px",
//       padding: "10px 14px",
//       minHeight: "42px",
//       fontSize: "12px",
//       fontWeight: 700,
//       letterSpacing: "0.04em",
//       cursor: "pointer",

//       transition:
//         "transform 0.22s ease, box-shadow 0.22s ease, background 0.22s ease, color 0.22s ease",

//       boxShadow: active
//         ? "0 10px 20px rgba(17,24,39,0.14)"
//         : "0 4px 12px rgba(17,24,39,0.05)",

//       whiteSpace: "nowrap",
//       flex: "0 1 auto",
//     };
//   };

//   const shipmentButtonStyle = {
//     border: "none",
//     background: "#111827",
//     color: "#ffffff",
//     borderRadius: "12px",
//     padding: "11px 18px",
//     minHeight: "44px",
//     fontSize: "13px",
//     fontWeight: 700,
//     cursor: "pointer",
//   };

//   const emptyStateStyle = {
//     borderRadius: "20px",
//     padding: "30px 20px",
//     textAlign: "center",
//     background: "rgba(255,255,255,0.9)",
//     border: "1px solid rgba(17,24,39,0.08)",
//     color: "#6b7280",
//     boxShadow:
//       "0 10px 30px rgba(17,24,39,0.05)",
//   };

//   return (
//     <div style={pageStyle}>
//       <style jsx>{`
//         .orders-card:hover {
//           transform: translateY(-4px);
//           box-shadow:
//             0 18px 40px rgba(17, 24, 39, 0.1),
//             0 4px 16px rgba(17, 24, 39, 0.06);
//           border-color: rgba(17, 24, 39, 0.12);
//         }

//         .status-btn:hover {
//           transform: translateY(-2px);
//           box-shadow:
//             0 12px 24px rgba(17, 24, 39, 0.12);
//         }

//         .shipment-btn:hover {
//           opacity: 0.88;
//         }

//         .modal-overlay {
//           position: fixed;
//           inset: 0;
//           z-index: 9999;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           padding: 16px;
//           background: rgba(0, 0, 0, 0.65);
//         }

//         .shipment-modal {
//           width: 100%;
//           max-width: 560px;
//           max-height: 92vh;
//           overflow-y: auto;
//           border-radius: 22px;
//           background: white;
//           box-shadow:
//             0 30px 80px rgba(0, 0, 0, 0.3);
//         }

//         .shipment-input {
//           width: 100%;
//           min-height: 48px;
//           padding: 12px 14px;
//           border: 1px solid #d1d5db;
//           border-radius: 12px;
//           color: #111827;
//           background: white;
//           outline: none;
//           box-sizing: border-box;
//         }

//         .shipment-input:focus {
//           border-color: #111827;
//           box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.08);
//         }

//         @media (max-width: 768px) {
//           .orders-topbar {
//             flex-direction: column;
//             align-items: flex-start;
//           }

//           .status-btn {
//             flex: 1 1 calc(50% - 8px);
//             text-align: center;
//           }
//         }

//         @media (max-width: 520px) {
//           .status-btn {
//             flex: 1 1 100%;
//             width: 100%;
//           }
//         }
//       `}</style>

//       <div style={headerWrapStyle}>
//         <div>
//           <h1 style={headingStyle}>
//             Admin Orders
//           </h1>

//           <p style={subTextStyle}>
//             Manage order status and shipment
//             tracking details.
//           </p>
//         </div>
//       </div>

//       {successMessage && (
//         <div
//           style={{
//             marginBottom: "18px",
//             padding: "14px 16px",
//             borderRadius: "12px",
//             background: "#ecfdf5",
//             border: "1px solid #a7f3d0",
//             color: "#047857",
//             fontSize: "14px",
//             fontWeight: 600,
//           }}
//         >
//           {successMessage}
//         </div>
//       )}

//       {error && (
//         <div
//           style={{
//             marginBottom: "18px",
//             padding: "14px 16px",
//             borderRadius: "12px",
//             background: "#fef2f2",
//             border: "1px solid #fecaca",
//             color: "#b91c1c",
//             fontSize: "14px",
//             fontWeight: 600,
//           }}
//         >
//           {error}
//         </div>
//       )}

//       {loading && !adminOrders?.length ? (
//         <div style={emptyStateStyle}>
//           Loading orders...
//         </div>
//       ) : adminOrders?.length > 0 ? (
//         <div style={ordersGridStyle}>
//           {adminOrders.map((order) => (
//             <div
//               key={order.id}
//               className="orders-card"
//               style={cardStyle}
//             >
//               <div
//                 style={{
//                   position: "absolute",
//                   top: 0,
//                   left: 0,
//                   right: 0,
//                   height: "4px",
//                   background:
//                     "linear-gradient(90deg, #111827 0%, #4b5563 50%, #d1d5db 100%)",
//                 }}
//               />

//               <div
//                 className="orders-topbar"
//                 style={topBarStyle}
//               >
//                 <div style={{ minWidth: 0 }}>
//                   <h3 style={orderNumberStyle}>
//                     {order.orderNumber}
//                   </h3>
//                 </div>

//                 <div
//                   style={statusBadgeStyle(
//                     order.status
//                   )}
//                 >
//                   {order.status}
//                 </div>
//               </div>

//               <div style={infoGridStyle}>
//                 <div style={infoCardStyle}>
//                   <p style={infoLabelStyle}>
//                     PAYMENT METHOD
//                   </p>

//                   <p style={infoValueStyle}>
//                     {order.paymentMethod || "—"}
//                   </p>
//                 </div>

//                 <div style={infoCardStyle}>
//                   <p style={infoLabelStyle}>
//                     PAYMENT STATUS
//                   </p>

//                   <p style={infoValueStyle}>
//                     {order.paymentStatus ||
//                       "PENDING"}
//                   </p>
//                 </div>

//                 <div style={infoCardStyle}>
//                   <p style={infoLabelStyle}>
//                     TOTAL AMOUNT
//                   </p>

//                   <p style={infoValueStyle}>
//                     ₹{order.totalAmount}
//                   </p>
//                 </div>
//               </div>

//               <div style={addressBoxStyle}>
//                 <div
//                   style={{
//                     fontSize: "11px",
//                     fontWeight: 700,
//                     letterSpacing: "0.08em",
//                     color: "#6b7280",
//                     marginBottom: "8px",
//                   }}
//                 >
//                   DELIVERY ADDRESS
//                 </div>

//                 <strong
//                   style={{ color: "#111827" }}
//                 >
//                   {order.addressFullName}
//                 </strong>

//                 {order.addressPhone
//                   ? `, ${order.addressPhone}`
//                   : ""}

//                 <br />

//                 {order.addressLine1}

//                 {order.addressLine2
//                   ? `, ${order.addressLine2}`
//                   : ""}

//                 <br />

//                 {order.addressCity},{" "}
//                 {order.addressState} -{" "}
//                 {order.addressPincode}
//               </div>

//               {order.shipment ? (
//                 <div style={shipmentBoxStyle}>
//                   <p
//                     style={{
//                       margin: "0 0 12px",
//                       fontSize: "11px",
//                       fontWeight: 700,
//                       letterSpacing: "0.08em",
//                       color: "#1d4ed8",
//                     }}
//                   >
//                     SHIPMENT DETAILS
//                   </p>

//                   <div style={infoGridStyle}>
//                     <div>
//                       <p style={infoLabelStyle}>
//                         COURIER
//                       </p>

//                       <p style={infoValueStyle}>
//                         {
//                           order.shipment
//                             .courierName
//                         }
//                       </p>
//                     </div>

//                     <div>
//                       <p style={infoLabelStyle}>
//                         TRACKING ID / AWB
//                       </p>

//                       <p style={infoValueStyle}>
//                         {
//                           order.shipment
//                             .trackingId
//                         }
//                       </p>
//                     </div>
//                   </div>

//                   {order.shipment
//                     .trackingUrl && (
//                     <a
//                       href={
//                         order.shipment
//                           .trackingUrl
//                       }
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       style={{
//                         display: "inline-block",
//                         color: "#1d4ed8",
//                         fontSize: "13px",
//                         fontWeight: 700,
//                         textDecoration:
//                           "underline",
//                       }}
//                     >
//                       Open courier tracking
//                     </a>
//                   )}
//                 </div>
//               ) : (
//                 <div
//                   style={{
//                     ...shipmentBoxStyle,
//                     background: "#f9fafb",
//                     borderColor: "#e5e7eb",
//                     color: "#6b7280",
//                     fontSize: "14px",
//                   }}
//                 >
//                   Shipment details have not been
//                   added yet.
//                 </div>
//               )}

//               <div
//                 style={{
//                   marginBottom: "16px",
//                 }}
//               >
//                 <button
//                   type="button"
//                   className="shipment-btn"
//                   style={{
//                     ...shipmentButtonStyle,
//                     opacity:
//                       order.status === "CANCELLED"
//                         ? 0.45
//                         : 1,

//                     cursor:
//                       order.status === "CANCELLED"
//                         ? "not-allowed"
//                         : "pointer",
//                   }}
//                   disabled={
//                     order.status === "CANCELLED"
//                   }
//                   onClick={() =>
//                     openShipmentModal(order)
//                   }
//                 >
//                   {order.shipment
//                     ? "Update Tracking"
//                     : "Add Shipment"}
//                 </button>
//               </div>

//               <div
//                 className="orders-actions"
//                 style={actionsWrapStyle}
//               >
//                 {statuses.map((status) => (
//                   <button
//                     key={status}
//                     type="button"
//                     className="status-btn"
//                     style={getButtonStyle(
//                       order.status,
//                       status
//                     )}
//                     onClick={() =>
//                       handleStatusUpdate(
//                         order.id,
//                         status
//                       )
//                     }
//                   >
//                     {status}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div style={emptyStateStyle}>
//           <h3
//             style={{
//               margin: "0 0 8px",
//               fontSize: "20px",
//               color: "#111827",
//             }}
//           >
//             No orders found
//           </h3>

//           <p
//             style={{
//               margin: 0,
//               fontSize: "14px",
//             }}
//           >
//             Orders will appear here after
//             customers place them.
//           </p>
//         </div>
//       )}

//       {selectedOrder && (
//         <div
//           className="modal-overlay"
//           onMouseDown={(event) => {
//             if (
//               event.target === event.currentTarget
//             ) {
//               closeShipmentModal();
//             }
//           }}
//         >
//           <div className="shipment-modal">
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent:
//                   "space-between",
//                 alignItems: "flex-start",
//                 gap: "16px",
//                 padding: "22px",
//                 borderBottom:
//                   "1px solid #e5e7eb",
//               }}
//             >
//               <div>
//                 <p
//                   style={{
//                     margin: 0,
//                     color: "#6b7280",
//                     fontSize: "12px",
//                     fontWeight: 700,
//                     letterSpacing: "0.08em",
//                   }}
//                 >
//                   SHIPMENT DETAILS
//                 </p>

//                 <h2
//                   style={{
//                     margin: "7px 0 0",
//                     color: "#111827",
//                     fontSize: "22px",
//                   }}
//                 >
//                   {selectedOrder.shipment
//                     ? "Update tracking"
//                     : "Add shipment"}
//                 </h2>

//                 <p
//                   style={{
//                     margin: "6px 0 0",
//                     color: "#6b7280",
//                     fontSize: "14px",
//                   }}
//                 >
//                   {selectedOrder.orderNumber}
//                 </p>
//               </div>

//               <button
//                 type="button"
//                 disabled={shipmentSaving}
//                 onClick={closeShipmentModal}
//                 style={{
//                   width: "38px",
//                   height: "38px",
//                   borderRadius: "50%",
//                   border:
//                     "1px solid #d1d5db",
//                   background: "white",
//                   fontSize: "20px",
//                   cursor: "pointer",
//                 }}
//               >
//                 ×
//               </button>
//             </div>

//             <form
//               onSubmit={handleShipmentSubmit}
//               style={{
//                 padding: "22px",
//               }}
//             >
//               <div
//                 style={{
//                   marginBottom: "18px",
//                 }}
//               >
//                 <label
//                   htmlFor="courierName"
//                   style={{
//                     display: "block",
//                     marginBottom: "8px",
//                     fontSize: "13px",
//                     fontWeight: 700,
//                     color: "#374151",
//                   }}
//                 >
//                   Courier name
//                 </label>

//                 <input
//                   id="courierName"
//                   name="courierName"
//                   className="shipment-input"
//                   value={
//                     shipmentForm.courierName
//                   }
//                   onChange={
//                     handleShipmentInput
//                   }
//                   disabled={shipmentSaving}
//                   placeholder="Delhivery"
//                 />
//               </div>

//               <div
//                 style={{
//                   marginBottom: "18px",
//                 }}
//               >
//                 <label
//                   htmlFor="trackingId"
//                   style={{
//                     display: "block",
//                     marginBottom: "8px",
//                     fontSize: "13px",
//                     fontWeight: 700,
//                     color: "#374151",
//                   }}
//                 >
//                   Tracking ID / AWB
//                 </label>

//                 <input
//                   id="trackingId"
//                   name="trackingId"
//                   className="shipment-input"
//                   value={
//                     shipmentForm.trackingId
//                   }
//                   onChange={
//                     handleShipmentInput
//                   }
//                   disabled={shipmentSaving}
//                   placeholder="Enter AWB number"
//                 />
//               </div>

//               <div
//                 style={{
//                   marginBottom: "18px",
//                 }}
//               >
//                 <label
//                   htmlFor="trackingUrl"
//                   style={{
//                     display: "block",
//                     marginBottom: "8px",
//                     fontSize: "13px",
//                     fontWeight: 700,
//                     color: "#374151",
//                   }}
//                 >
//                   Tracking URL
//                 </label>

//                 <input
//                   id="trackingUrl"
//                   name="trackingUrl"
//                   type="url"
//                   className="shipment-input"
//                   value={
//                     shipmentForm.trackingUrl
//                   }
//                   onChange={
//                     handleShipmentInput
//                   }
//                   disabled={shipmentSaving}
//                   placeholder="https://www.delhivery.com/tracking"
//                 />
//               </div>

//               {shipmentError && (
//                 <div
//                   style={{
//                     marginBottom: "18px",
//                     padding: "12px 14px",
//                     borderRadius: "10px",
//                     background: "#fef2f2",
//                     border:
//                       "1px solid #fecaca",
//                     color: "#b91c1c",
//                     fontSize: "13px",
//                     fontWeight: 600,
//                   }}
//                 >
//                   {shipmentError}
//                 </div>
//               )}

//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "flex-end",
//                   flexWrap: "wrap",
//                   gap: "10px",
//                   paddingTop: "18px",
//                   borderTop:
//                     "1px solid #e5e7eb",
//                 }}
//               >
//                 <button
//                   type="button"
//                   disabled={shipmentSaving}
//                   onClick={closeShipmentModal}
//                   style={{
//                     minHeight: "44px",
//                     padding: "10px 18px",
//                     borderRadius: "11px",
//                     border:
//                       "1px solid #d1d5db",
//                     background: "white",
//                     color: "#111827",
//                     fontWeight: 700,
//                     cursor: "pointer",
//                   }}
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   type="submit"
//                   disabled={shipmentSaving}
//                   style={{
//                     minHeight: "44px",
//                     padding: "10px 20px",
//                     borderRadius: "11px",
//                     border: "none",
//                     background: "#111827",
//                     color: "white",
//                     fontWeight: 700,
//                     cursor: shipmentSaving
//                       ? "not-allowed"
//                       : "pointer",
//                     opacity: shipmentSaving
//                       ? 0.6
//                       : 1,
//                   }}
//                 >
//                   {shipmentSaving
//                     ? "Saving..."
//                     : "Save & Send Email"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }






































"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchAdminOrders,
  updateAdminOrderStatus,
} from "@/features/orders/orderSlice";

const statuses = [
  "PLACED",
  "CONFIRMED",
  "PACKED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export default function AdminOrdersPage() {
  const dispatch = useDispatch();

  const { adminOrders, loading, error } =
    useSelector((state) => state.orders);

  const [successMessage, setSuccessMessage] =
    useState("");

  useEffect(() => {
    dispatch(fetchAdminOrders());
  }, [dispatch]);

  async function handleStatusUpdate(
    orderId,
    status
  ) {
    setSuccessMessage("");

    try {
      await dispatch(
        updateAdminOrderStatus({
          id: orderId,
          status,
        })
      ).unwrap();

      setSuccessMessage(
        `Order status updated to ${status}.`
      );
    } catch {
      // Redux state already stores the API error.
    }
  }

  const pageStyle = {
    minHeight: "100vh",
    padding: "clamp(14px, 2vw, 24px)",
    background:
      "linear-gradient(180deg, #f8f8f8 0%, #f3f4f6 45%, #efefef 100%)",
  };

  const headerWrapStyle = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    marginBottom: "20px",
  };

  const headingStyle = {
    margin: 0,
    fontSize: "clamp(22px, 3vw, 34px)",
    fontWeight: 700,
    color: "#111827",
    letterSpacing: "-0.03em",
  };

  const subTextStyle = {
    margin: "6px 0 0",
    color: "#6b7280",
    fontSize: "clamp(13px, 1.5vw, 15px)",
  };

  const ordersGridStyle = {
    display: "grid",
    gap: "18px",
  };

  const cardStyle = {
    position: "relative",
    overflow: "hidden",
    borderRadius: "20px",
    padding: "clamp(16px, 2vw, 22px)",
    background:
      "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(249,250,251,0.96) 100%)",
    border: "1px solid rgba(17,24,39,0.08)",
    boxShadow:
      "0 10px 30px rgba(17,24,39,0.06), 0 2px 10px rgba(17,24,39,0.04)",
    transition:
      "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
  };

  const topBarStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "12px",
    flexWrap: "wrap",
    marginBottom: "14px",
  };

  const orderNumberStyle = {
    margin: 0,
    fontSize: "clamp(17px, 2vw, 22px)",
    fontWeight: 700,
    color: "#111827",
    wordBreak: "break-word",
  };

  const statusBadgeStyle = (status) => {
    const isDelivered =
      status === "DELIVERED";
    const isCancelled =
      status === "CANCELLED";
    const isShipped =
      status === "SHIPPED";
    const isPacked =
      status === "PACKED";
    const isConfirmed =
      status === "CONFIRMED";

    let bg = "rgba(17,24,39,0.08)";
    let color = "#111827";
    let border = "rgba(17,24,39,0.12)";

    if (isDelivered) {
      bg = "rgba(16,185,129,0.12)";
      color = "#047857";
      border = "rgba(16,185,129,0.22)";
    } else if (isCancelled) {
      bg = "rgba(239,68,68,0.12)";
      color = "#b91c1c";
      border = "rgba(239,68,68,0.22)";
    } else if (isShipped) {
      bg = "rgba(59,130,246,0.12)";
      color = "#1d4ed8";
      border = "rgba(59,130,246,0.22)";
    } else if (isPacked) {
      bg = "rgba(168,85,247,0.12)";
      color = "#7c3aed";
      border = "rgba(168,85,247,0.22)";
    } else if (isConfirmed) {
      bg = "rgba(245,158,11,0.12)";
      color = "#b45309";
      border = "rgba(245,158,11,0.22)";
    }

    return {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "36px",
      padding: "8px 14px",
      borderRadius: "999px",
      background: bg,
      color,
      border: `1px solid ${border}`,
      fontSize: "12px",
      fontWeight: 700,
      letterSpacing: "0.04em",
      whiteSpace: "nowrap",
    };
  };

  const infoGridStyle = {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "12px",
    marginBottom: "16px",
  };

  const infoCardStyle = {
    borderRadius: "16px",
    padding: "14px",
    background: "rgba(255,255,255,0.72)",
    border: "1px solid rgba(17,24,39,0.06)",
    boxShadow:
      "inset 0 1px 0 rgba(255,255,255,0.7)",
    minWidth: 0,
  };

  const infoLabelStyle = {
    margin: "0 0 6px",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    color: "#6b7280",
  };

  const infoValueStyle = {
    margin: 0,
    fontSize: "15px",
    fontWeight: 600,
    color: "#111827",
    wordBreak: "break-word",
  };

  const addressBoxStyle = {
    borderRadius: "16px",
    padding: "14px",
    background:
      "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
    border: "1px solid rgba(17,24,39,0.06)",
    color: "#374151",
    lineHeight: 1.65,
    fontSize: "14px",
    marginBottom: "16px",
    wordBreak: "break-word",
  };

  const shipmentBoxStyle = {
    borderRadius: "16px",
    padding: "16px",
    marginBottom: "16px",
    background: "#eff6ff",
    border: "1px solid #bfdbfe",
  };

  const actionsWrapStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  };

  const getButtonStyle = (
    currentStatus,
    buttonStatus
  ) => {
    const active =
      currentStatus === buttonStatus;

    return {
      border: active
        ? "1px solid rgba(17,24,39,0.18)"
        : "1px solid rgba(17,24,39,0.08)",
      background: active
        ? "linear-gradient(135deg, #111827 0%, #1f2937 100%)"
        : "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
      color: active ? "#ffffff" : "#111827",
      borderRadius: "12px",
      padding: "10px 14px",
      minHeight: "42px",
      fontSize: "12px",
      fontWeight: 700,
      letterSpacing: "0.04em",
      cursor: "pointer",
      transition:
        "transform 0.22s ease, box-shadow 0.22s ease, background 0.22s ease, color 0.22s ease",
      boxShadow: active
        ? "0 10px 20px rgba(17,24,39,0.14)"
        : "0 4px 12px rgba(17,24,39,0.05)",
      whiteSpace: "nowrap",
      flex: "0 1 auto",
    };
  };

  const shiprocketLinkStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    background: "#111827",
    color: "#ffffff",
    borderRadius: "12px",
    padding: "11px 18px",
    minHeight: "44px",
    fontSize: "13px",
    fontWeight: 700,
    cursor: "pointer",
    textDecoration: "none",
  };

  const disabledShiprocketStyle = {
    ...shiprocketLinkStyle,
    opacity: 0.45,
    cursor: "not-allowed",
  };

  const emptyStateStyle = {
    borderRadius: "20px",
    padding: "30px 20px",
    textAlign: "center",
    background: "rgba(255,255,255,0.9)",
    border: "1px solid rgba(17,24,39,0.08)",
    color: "#6b7280",
    boxShadow:
      "0 10px 30px rgba(17,24,39,0.05)",
  };

  return (
    <div style={pageStyle}>
      <style jsx>{`
        .orders-card:hover {
          transform: translateY(-4px);
          box-shadow:
            0 18px 40px rgba(17, 24, 39, 0.1),
            0 4px 16px rgba(17, 24, 39, 0.06);
          border-color: rgba(17, 24, 39, 0.12);
        }

        .status-btn:hover,
        .shiprocket-link:hover {
          transform: translateY(-2px);
          box-shadow:
            0 12px 24px rgba(17, 24, 39, 0.12);
        }

        @media (max-width: 768px) {
          .orders-topbar {
            flex-direction: column;
            align-items: flex-start;
          }

          .status-btn {
            flex: 1 1 calc(50% - 8px);
            text-align: center;
          }
        }

        @media (max-width: 520px) {
          .status-btn,
          .shiprocket-link {
            flex: 1 1 100%;
            width: 100%;
          }
        }
      `}</style>

      <div style={headerWrapStyle}>
        <div>
          <h1 style={headingStyle}>
            Admin Orders
          </h1>

          <p style={subTextStyle}>
            Manage order status and create Shiprocket
            shipments.
          </p>
        </div>
      </div>

      {successMessage && (
        <div
          style={{
            marginBottom: "18px",
            padding: "14px 16px",
            borderRadius: "12px",
            background: "#ecfdf5",
            border: "1px solid #a7f3d0",
            color: "#047857",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          {successMessage}
        </div>
      )}

      {error && (
        <div
          style={{
            marginBottom: "18px",
            padding: "14px 16px",
            borderRadius: "12px",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#b91c1c",
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          {error}
        </div>
      )}

      {loading && !adminOrders?.length ? (
        <div style={emptyStateStyle}>
          Loading orders...
        </div>
      ) : adminOrders?.length > 0 ? (
        <div style={ordersGridStyle}>
          {adminOrders.map((order) => {
            const isCancelled =
              order.status === "CANCELLED";

            return (
              <div
                key={order.id}
                className="orders-card"
                style={cardStyle}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    background:
                      "linear-gradient(90deg, #111827 0%, #4b5563 50%, #d1d5db 100%)",
                  }}
                />

                <div
                  className="orders-topbar"
                  style={topBarStyle}
                >
                  <div style={{ minWidth: 0 }}>
                    <h3 style={orderNumberStyle}>
                      {order.orderNumber}
                    </h3>
                  </div>

                  <div
                    style={statusBadgeStyle(
                      order.status
                    )}
                  >
                    {order.status}
                  </div>
                </div>

                <div style={infoGridStyle}>
                  <div style={infoCardStyle}>
                    <p style={infoLabelStyle}>
                      PAYMENT METHOD
                    </p>

                    <p style={infoValueStyle}>
                      {order.paymentMethod || "—"}
                    </p>
                  </div>

                  <div style={infoCardStyle}>
                    <p style={infoLabelStyle}>
                      PAYMENT STATUS
                    </p>

                    <p style={infoValueStyle}>
                      {order.paymentStatus ||
                        "PENDING"}
                    </p>
                  </div>

                  <div style={infoCardStyle}>
                    <p style={infoLabelStyle}>
                      TOTAL AMOUNT
                    </p>

                    <p style={infoValueStyle}>
                      ₹{order.totalAmount}
                    </p>
                  </div>
                </div>

                <div style={addressBoxStyle}>
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      color: "#6b7280",
                      marginBottom: "8px",
                    }}
                  >
                    DELIVERY ADDRESS
                  </div>

                  <strong
                    style={{ color: "#111827" }}
                  >
                    {order.addressFullName}
                  </strong>

                  {order.addressPhone
                    ? `, ${order.addressPhone}`
                    : ""}

                  <br />

                  {order.addressLine1}

                  {order.addressLine2
                    ? `, ${order.addressLine2}`
                    : ""}

                  <br />

                  {order.addressCity},{" "}
                  {order.addressState} -{" "}
                  {order.addressPincode}
                </div>

                {order.shipment ? (
                  <div style={shipmentBoxStyle}>
                    <p
                      style={{
                        margin: "0 0 12px",
                        fontSize: "11px",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        color: "#1d4ed8",
                      }}
                    >
                      SHIPROCKET TRACKING
                    </p>

                    <div style={infoGridStyle}>
                      <div>
                        <p style={infoLabelStyle}>
                          COURIER
                        </p>

                        <p style={infoValueStyle}>
                          {order.shipment
                            .courierName || "—"}
                        </p>
                      </div>

                      <div>
                        <p style={infoLabelStyle}>
                          AWB / TRACKING ID
                        </p>

                        <p style={infoValueStyle}>
                          {order.shipment
                            .trackingId || "—"}
                        </p>
                      </div>
                    </div>

                    {order.shipment
                      .trackingUrl && (
                      <a
                        href={
                          order.shipment
                            .trackingUrl
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display:
                            "inline-block",
                          color: "#1d4ed8",
                          fontSize: "13px",
                          fontWeight: 700,
                          textDecoration:
                            "underline",
                        }}
                      >
                        Open Shiprocket tracking
                      </a>
                    )}
                  </div>
                ) : (
                  <div
                    style={{
                      ...shipmentBoxStyle,
                      background: "#f9fafb",
                      borderColor: "#e5e7eb",
                      color: "#6b7280",
                      fontSize: "14px",
                    }}
                  >
                    Shiprocket shipment has not been
                    created yet.
                  </div>
                )}

                <div
                  style={{
                    marginBottom: "16px",
                  }}
                >
                  {isCancelled ? (
                    <span
                      style={
                        disabledShiprocketStyle
                      }
                    >
                      Shiprocket Disabled
                    </span>
                  ) : (
                    <Link
                      href={`/admin/orders/${order.id}/shiprocket`}
                      className="shiprocket-link"
                      style={shiprocketLinkStyle}
                    >
                      {order.shipment
                        ? "View Shiprocket"
                        : "Create Shiprocket"}
                    </Link>
                  )}
                </div>

                <div
                  className="orders-actions"
                  style={actionsWrapStyle}
                >
                  {statuses.map((status) => (
                    <button
                      key={status}
                      type="button"
                      className="status-btn"
                      style={getButtonStyle(
                        order.status,
                        status
                      )}
                      onClick={() =>
                        handleStatusUpdate(
                          order.id,
                          status
                        )
                      }
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={emptyStateStyle}>
          <h3
            style={{
              margin: "0 0 8px",
              fontSize: "20px",
              color: "#111827",
            }}
          >
            No orders found
          </h3>

          <p
            style={{
              margin: 0,
              fontSize: "14px",
            }}
          >
            Orders will appear here after customers
            place them.
          </p>
        </div>
      )}
    </div>
  );
}