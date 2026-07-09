


"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
  clearCart,
  fetchCart,
  removeCartItem,
  updateCartItem,
} from "@/features/cart/cartSlice";
import {
  clearGiftSetCart,
  fetchGiftSetCart,
  removeGiftSetCartItem,
} from "@/features/giftSet/giftSetSlice";

export default function CartPage() {
  const dispatch = useDispatch();

  const {
    items,
    subtotal,
    totalItems,
    loading: cartLoading,
  } = useSelector((state) => state.cart);

  const {
    summary: giftSetSummary,
    loading: giftSetLoading,
  } = useSelector((state) => state.giftSet);

  const { loading: authLoading, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (authLoading) return;

    dispatch(fetchCart());

    if (token) {
      dispatch(fetchGiftSetCart());
    }
  }, [dispatch, authLoading, token]);

  const giftSetItems = giftSetSummary?.items || [];
  const giftSetTotalItems = giftSetSummary?.totalProducts || 0;
  const giftSetSubtotal = giftSetSummary?.subtotalInr || 0;
  const giftSetDiscountAmount = giftSetSummary?.discountAmountInr || 0;
  const giftSetFinalTotal = giftSetSummary?.finalTotalInr || 0;

  const combinedTotalItems = (totalItems || 0) + giftSetTotalItems;
  const combinedSubtotal = (subtotal || 0) + giftSetFinalTotal;

  if (cartLoading || authLoading || giftSetLoading) {
    return <div style={{ padding: 30 }}>Loading cart...</div>;
  }

  const normalCartEmpty = items.length === 0;
  const giftSetEmpty = giftSetItems.length === 0;
  const everythingEmpty = normalCartEmpty && giftSetEmpty;

  return (
    <div style={{ padding: 30, maxWidth: 1100, margin: "0 auto" }}>
      <h1>Shopping Cart</h1>
      <p>Total Items: {combinedTotalItems}</p>

      {everythingEmpty ? (
        <div>
          <p>Your cart is empty.</p>
          <Link href="/products">Continue Shopping</Link>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
          <div>
            {!normalCartEmpty && (
              <div style={{ marginBottom: 32 }}>
                <h2 style={{ marginBottom: 16 }}>Product Cart</h2>

                {items.map((item) => {
                  const itemKey = item.itemId ?? item.productId;
                  const itemId = item.itemId ?? item.productId;
                  const imagePath = item.images?.[0] || item.image || "";

                  const imageSrc = imagePath
                    ? imagePath.startsWith("http")
                      ? imagePath
                      : `${process.env.NEXT_PUBLIC_API_BASE}${imagePath}`
                    : "/placeholder.png";

                  return (
                    <div
                      key={itemKey}
                      style={{
                        display: "flex",
                        gap: 16,
                        border: "1px solid #ddd",
                        padding: 16,
                        borderRadius: 12,
                        marginBottom: 16,
                      }}
                    >
                      <img
                        src={imageSrc}
                        alt={item.title}
                        width="120"
                        height="120"
                        style={{ objectFit: "cover", borderRadius: 10 }}
                      />

                      <div style={{ flex: 1 }}>
                        <h3 style={{ marginTop: 0 }}>{item.title}</h3>
                        <p>Price: ₹{item.unitPrice}</p>
                        <p>Line Total: ₹{item.lineTotal}</p>

                        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                          <button
                            onClick={() =>
                              item.quantity > 1 &&
                              dispatch(
                                updateCartItem({
                                  itemId,
                                  quantity: item.quantity - 1,
                                })
                              )
                            }
                          >
                            -
                          </button>

                          <span>{item.quantity}</span>

                          <button
                            onClick={() =>
                              dispatch(
                                updateCartItem({
                                  itemId,
                                  quantity: item.quantity + 1,
                                })
                              )
                            }
                          >
                            +
                          </button>

                          <button onClick={() => dispatch(removeCartItem(itemId))}>
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <button onClick={() => dispatch(clearCart())}>Clear Product Cart</button>
              </div>
            )}

            {!giftSetEmpty && (
              <div style={{ marginBottom: 32 }}>
                <h2 style={{ marginBottom: 16 }}>Gift Set Cart</h2>

                {giftSetItems.map((item) => {
                  const imagePath = item.productImagePath || "";
                  const giftBoxImagePath = item.giftBoxImagePath || "";

                  const productImageSrc = imagePath
                    ? imagePath.startsWith("http")
                      ? imagePath
                      : `${process.env.NEXT_PUBLIC_API_BASE}${imagePath}`
                    : "/placeholder.png";

                  const giftBoxImageSrc = giftBoxImagePath
                    ? giftBoxImagePath.startsWith("http")
                      ? giftBoxImagePath
                      : `${process.env.NEXT_PUBLIC_API_BASE}${giftBoxImagePath}`
                    : "/placeholder.png";

                  return (
                    <div
                      key={item.cartItemId}
                      style={{
                        display: "flex",
                        gap: 16,
                        border: "1px solid #ddd",
                        padding: 16,
                        borderRadius: 12,
                        marginBottom: 16,
                      }}
                    >
                      <img
                        src={productImageSrc}
                        alt={item.productTitle}
                        width="120"
                        height="120"
                        style={{ objectFit: "cover", borderRadius: 10 }}
                      />

                      <div style={{ flex: 1 }}>
                        <h3 style={{ marginTop: 0 }}>{item.productTitle}</h3>
                        <p>Product Price: ₹{item.productPriceInr}</p>
                        <p>
                          Gift Box: {item.giftBoxName} — ₹{item.giftBoxPriceInr}
                        </p>
                        <p>Line Total: ₹{item.lineTotalInr}</p>

                        <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 12 }}>
                          <img
                            src={giftBoxImageSrc}
                            alt={item.giftBoxName}
                            width="70"
                            height="70"
                            style={{ objectFit: "cover", borderRadius: 8, border: "1px solid #ddd" }}
                          />

                          <button
                            onClick={() => dispatch(removeGiftSetCartItem(item.cartItemId))}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <button onClick={() => dispatch(clearGiftSetCart())}>
                  Clear Gift Set Cart
                </button>
              </div>
            )}
          </div>

          <div
            style={{
              border: "1px solid #ddd",
              padding: 20,
              borderRadius: 12,
              height: "fit-content",
            }}
          >
            <h3>Order Summary</h3>

            {!normalCartEmpty && (
              <>
                <p>Product Cart Items: {totalItems}</p>
                <p>Product Cart Subtotal: ₹{subtotal}</p>
              </>
            )}

            {!giftSetEmpty && (
              <>
                <p>Gift Set Items: {giftSetTotalItems}</p>
                <p>Gift Set Subtotal: ₹{giftSetSubtotal}</p>
                <p>Gift Set Discount: -₹{giftSetDiscountAmount}</p>
                <p>Gift Set Total: ₹{giftSetFinalTotal}</p>
              </>
            )}

            <p>Shipping: Free</p>
            <hr />
            <h2>Total: ₹{combinedSubtotal}</h2>

            <Link
              href={token ? "/checkout" : "/login?next=/checkout"}
              style={{
                display: "inline-block",
                marginTop: 12,
                background: "#111",
                color: "#fff",
                padding: "12px 18px",
                borderRadius: 8,
                textDecoration: "none",
              }}
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}