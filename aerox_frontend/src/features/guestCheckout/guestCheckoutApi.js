





import { getGuestCart, clearGuestCart } from "@/lib/guestCart";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8080";

async function parseResponse(res) {
  const text = await res.text();

  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const message =
      data?.message ||
      data?.error ||
      data ||
      "Something went wrong";

    throw new Error(message);
  }

  return data;
}

export async function checkGuestEmailApi(email) {
  const res = await fetch(
    `${API_BASE_URL}/api/guest-checkout/check-email?email=${encodeURIComponent(
      email
    )}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return parseResponse(res);
}

//
// 🔥 FIXED FUNCTION (ONLY CHANGE)
//
export async function guestContinueApi({ email, password, name, phone }) {
  const cartItems = getGuestCart().map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
  }));

  const res = await fetch(`${API_BASE_URL}/api/guest-checkout/continue`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      name,
      phone, // ✅ FIX: NOW SENT TO BACKEND
      items: cartItems,
    }),
  });

  const data = await parseResponse(res);

  clearGuestCart();

  return data;
}

export async function createAddressWithTokenApi(address, token) {
  const res = await fetch(`${API_BASE_URL}/api/addresses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(address),
  });

  return parseResponse(res);
}

export async function placeOrderWithTokenApi(payload, token) {
  const res = await fetch(`${API_BASE_URL}/api/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  return parseResponse(res);
}

export async function createRazorpayOrderWithTokenApi(payload, token) {
  const res = await fetch(
    `${API_BASE_URL}/api/payments/razorpay/create-order`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );

  return parseResponse(res);
}

export async function verifyRazorpayPaymentWithTokenApi(payload, token) {
  const res = await fetch(
    `${API_BASE_URL}/api/payments/razorpay/verify`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );

  return parseResponse(res);
}