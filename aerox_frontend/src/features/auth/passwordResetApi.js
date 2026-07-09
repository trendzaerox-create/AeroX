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

/* ================================
   RESET OPTIONS
================================ */

export async function getPasswordResetOptionsApi(email) {
  const cleanEmail = String(email || "").trim().toLowerCase();

  const res = await fetch(
    `${API_BASE_URL}/api/auth/password-reset/options?email=${encodeURIComponent(
      cleanEmail
    )}`
  );

  return parseResponse(res);
}

/* ================================
   EMAIL PASSWORD RESET
================================ */

export async function requestPasswordResetApi(email) {
  const cleanEmail = String(email || "").trim().toLowerCase();

  const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: cleanEmail,
    }),
  });

  return parseResponse(res);
}

export async function resetPasswordApi({
  token,
  newPassword,
  repeatPassword,
}) {
  const res = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token,
      newPassword,
      repeatPassword,
    }),
  });

  return parseResponse(res);
}

/* ================================
   MOBILE OTP PASSWORD RESET
================================ */

export async function requestMobilePasswordOtpApi(phone) {
  const cleanPhone = String(phone || "")
    .replace(/\D/g, "")
    .slice(0, 10);

  const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password/mobile`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      phone: cleanPhone,
    }),
  });

  return parseResponse(res);
}

export async function requestMobilePasswordOtpByEmailApi(email) {
  const cleanEmail = String(email || "").trim().toLowerCase();

  const res = await fetch(
    `${API_BASE_URL}/api/auth/forgot-password/mobile/by-email`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: cleanEmail,
      }),
    }
  );

  return parseResponse(res);
}

export async function resetPasswordWithMobileOtpApi({
  phone,
  otp,
  newPassword,
  repeatPassword,
}) {
  const cleanPhone = String(phone || "")
    .replace(/\D/g, "")
    .slice(0, 10);

  const cleanOtp = String(otp || "")
    .replace(/\D/g, "")
    .slice(0, 6);

  const res = await fetch(`${API_BASE_URL}/api/auth/reset-password/mobile`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      phone: cleanPhone,
      otp: cleanOtp,
      newPassword,
      repeatPassword,
    }),
  });

  return parseResponse(res);
}