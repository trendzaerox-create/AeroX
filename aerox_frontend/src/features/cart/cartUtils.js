



// src/lib/guestCart.js

const GUEST_CART_KEY = "guest_cart";

/* ===============================
   GET CART
================================ */
export function getGuestCart() {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/* ===============================
   SAVE CART
================================ */
export function saveGuestCart(items) {
  if (typeof window === "undefined") return;
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
}

/* ===============================
   CLEAR CART
================================ */
export function clearGuestCart() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(GUEST_CART_KEY);
}

/* ===============================
   ADD ITEM (FIXED)
================================ */
export function addGuestCartItem(product, quantity = 1) {
  const cart = getGuestCart();

  const existing = cart.find((item) => item.productId === product.id);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      productId: product.id,
      title: product.title,
      quantity,
      unitPrice: product.priceInr || product.price || 0, // 🔥 FIX
      image: product.images?.[0]?.imageUrl || product.images?.[0] || ""
    });
  }

  saveGuestCart(cart);
  return cart;
}

/* ===============================
   REMOVE ITEM
================================ */
export function removeGuestCartItem(productId) {
  const cart = getGuestCart().filter(
    (item) => item.productId !== productId
  );

  saveGuestCart(cart);
  return cart;
}

/* ===============================
   MERGE PAYLOAD
================================ */
export function buildMergePayloadFromGuestCart() {
  const items = getGuestCart().map((item) => ({
    productId: item.productId,
    quantity: item.quantity
  }));

  return { items };
}