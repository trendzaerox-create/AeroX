

"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { logout } from "@/features/auth/authSlice";
import { fetchCart } from "@/features/cart/cartSlice";

export default function Navbar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { user, token } = useSelector((state) => state.auth);
  const { totalItems } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch, token]);

  const query = searchParams?.toString();
  const fullPath = query ? `${pathname}?${query}` : pathname;

  const loginHref = `/login?next=${encodeURIComponent(fullPath)}`;

  const handleLogout = async () => {
    dispatch(logout());
    dispatch(fetchCart());
    router.replace("/");
  };

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        background: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "14px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <Link
          href="/"
          style={{
            textDecoration: "none",
            color: "#111827",
            fontWeight: 800,
            fontSize: "22px",
            letterSpacing: "0.3px",
          }}
        >
          Trendz Firenze
        </Link>

        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/"
            style={{
              textDecoration: "none",
              color: "#374151",
              fontWeight: 600,
            }}
          >
            Home
          </Link>

          <Link
            href="/products"
            style={{
              textDecoration: "none",
              color: "#374151",
              fontWeight: 600,
            }}
          >
            Products
          </Link>

          <Link
            href="/cart"
            style={{
              textDecoration: "none",
              color: "#111827",
              fontWeight: 700,
              border: "1px solid #d1d5db",
              padding: "10px 14px",
              borderRadius: "10px",
              background: "#f9fafb",
            }}
          >
            Cart ({totalItems || 0})
          </Link>

          {user && token ? (
            <>
              <Link
                href={user.role === "ADMIN" ? "/admin/dashboard" : "/account/profile"}
                style={{
                  textDecoration: "none",
                  color: "#374151",
                  fontWeight: 600,
                }}
              >
                {user.role === "ADMIN" ? "Dashboard" : "My Account"}
              </Link>

              <button
                onClick={handleLogout}
                style={{
                  border: "none",
                  background: "#111827",
                  color: "#fff",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href={loginHref}
                style={{
                  textDecoration: "none",
                  color: "#111827",
                  fontWeight: 700,
                  border: "1px solid #d1d5db",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  background: "#fff",
                }}
              >
                Login
              </Link>

              <Link
                href="/register"
                style={{
                  textDecoration: "none",
                  color: "#fff",
                  fontWeight: 700,
                  padding: "10px 14px",
                  borderRadius: "10px",
                  background: "#111827",
                }}
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}