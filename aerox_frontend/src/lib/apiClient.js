import axios from "axios";
import { getToken, removeToken } from "./tokenStorage";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  ""
).replace(/\/+$/, "");

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

const PUBLIC_PAGE_PREFIXES = [
  "/products",
  "/product",
  "/checkout",
];

const PUBLIC_PAGES = new Set([
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
]);

function isPublicPage(pathname = "") {
  if (PUBLIC_PAGES.has(pathname)) {
    return true;
  }

  return PUBLIC_PAGE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function getErrorStatus(error) {
  return Number(error?.response?.status || 0);
}

api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = getErrorStatus(error);
    const skipAuthRedirect = error?.config?.skipAuthRedirect === true;

    if (
      typeof window !== "undefined" &&
      !skipAuthRedirect &&
      (status === 401 || status === 403)
    ) {
      const pathname = window.location.pathname;
      const fullPath = `${pathname}${window.location.search}${window.location.hash}`;
      const alreadyOnLogin = pathname === "/login";

      if (!alreadyOnLogin && !isPublicPage(pathname)) {
        removeToken();

        try {
          window.sessionStorage.setItem("redirectAfterLogin", fullPath);
        } catch {
          // Storage can be blocked in private/restricted browser contexts.
        }

        window.location.replace(
          `/login?next=${encodeURIComponent(fullPath)}`,
        );
      }
    }

    return Promise.reject(error);
  },
);

export default api;
