"use client";

import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { closeCartDrawer, removeCartItem, updateCartItem } from "@/features/cart/cartSlice";

export default function CartDrawer() {
  const dispatch = useDispatch();
  const { drawerOpen, items, subtotal } = useSelector((state) => state.cart);

  if (!drawerOpen) return null;

  return (
    <div style={overlayStyle}>
      <div style={drawerStyle}>
        <div style={headerStyle}>
          <h3 style={{ margin: 0 }}>Your Cart</h3>
          <button onClick={() => dispatch(closeCartDrawer())}>X</button>
        </div>

        <div style={{ flex: 1, overflowY: "auto" }}>
          {items.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            items.map((item) => (
              <div key={item.itemId} style={itemStyle}>
               <img
  src={
    item.images?.[0]
      ? `${process.env.NEXT_PUBLIC_API_BASE}${item.images[0]}`
      : "/placeholder.png"
  }
  alt={item.title}
  width="70"
  height="70"
  style={{ objectFit: "cover", borderRadius: 8 }}
/>

                <div style={{ flex: 1 }}>
                  <p style={{ margin: "0 0 6px", fontWeight: 600 }}>{item.title}</p>
                  <p style={{ margin: "0 0 8px" }}>₹{item.unitPrice}</p>

                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <button
                      onClick={() =>
                        item.quantity > 1 &&
                        dispatch(updateCartItem({ itemId: item.itemId, quantity: item.quantity - 1 }))
                      }
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() =>
                        dispatch(updateCartItem({ itemId: item.itemId, quantity: item.quantity + 1 }))
                      }
                    >
                      +
                    </button>

                    <button onClick={() => dispatch(removeCartItem(item.itemId))}>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div style={footerStyle}>
          <p style={{ fontWeight: 700 }}>Subtotal: ₹{subtotal}</p>
          <Link href="/cart" onClick={() => dispatch(closeCartDrawer())}>
            View Cart
          </Link>
        </div>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "flex-end",
  zIndex: 9999
};

const drawerStyle = {
  width: 420,
  maxWidth: "100%",
  background: "#fff",
  height: "100%",
  padding: 20,
  display: "flex",
  flexDirection: "column"
};

const headerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 20
};

const itemStyle = {
  display: "flex",
  gap: 12,
  marginBottom: 16,
  borderBottom: "1px solid #ddd",
  paddingBottom: 12
};

const footerStyle = {
  borderTop: "1px solid #ddd",
  paddingTop: 16
};