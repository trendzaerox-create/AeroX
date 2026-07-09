



import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "token";

export function saveToken(token) {
  if (
    typeof window ===
    "undefined"
  )
    return;

  localStorage.setItem(
    TOKEN_KEY,
    token
  );

  document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=604800; samesite=lax`;
}

function isTokenExpired(token) {
  try {
    const decoded =
      jwtDecode(token);

    return (
      decoded.exp * 1000 <
      Date.now()
    );
  } catch {
    return true;
  }
}

export function getToken() {
  if (
    typeof window ===
    "undefined"
  ) {
    return null;
  }

  const token =
    localStorage.getItem(
      TOKEN_KEY
    );

  if (!token) {
    return null;
  }

  if (
    token === "undefined" ||
    token === "null"
  ) {
    removeToken();
    return null;
  }

  if (isTokenExpired(token)) {
    removeToken();
    return null;
  }

  return token;
}

export function removeToken() {
  if (
    typeof window ===
    "undefined"
  )
    return;

  localStorage.removeItem(
    TOKEN_KEY
  );

  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0; samesite=lax`;
}