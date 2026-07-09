// may be not using

"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyOrders } from "@/features/orders/orderSlice";
import Link from "next/link";

export default function OrdersPage() {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  if (loading) {
    return <div style={{ padding: 20 }}>Loading orders...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: 20 }}>
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return <div style={{ padding: 20 }}>No orders found.</div>;
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 20 }}>
      <h1>My Orders</h1>

      {orders.map((order) => (
        <Link
          key={order.id}
          href={`/account/orders/${order.id}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <div
            style={{
              border: "1px solid #ddd",
              padding: 16,
              marginTop: 12,
              borderRadius: 10,
              background: "#fff",
              cursor: "pointer",
            }}
          >
            <h3>{order.orderNumber}</h3>
            <p>Status: {order.status}</p>
            <p>Total: ₹{order.totalAmount}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}