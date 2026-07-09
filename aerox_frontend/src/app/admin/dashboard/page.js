

"use client";

import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../../features/auth/authSlice";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  const cardStyle = {
    padding: "18px",
    borderRadius: "14px",
    background: "linear-gradient(135deg, #ffffff, #f7f7f7)",
    border: "1px solid #ececec",
    boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
    transition: "all 0.25s ease",
    width: "100%",
    boxSizing: "border-box",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f6f6f7",
        padding: "clamp(14px, 3vw, 24px)",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "760px",
          background: "#fff",
          borderRadius: "18px",
          padding: "clamp(16px, 3vw, 24px)",
          boxShadow: "0 14px 34px rgba(0,0,0,0.07)",
          border: "1px solid #ececec",
          boxSizing: "border-box",
          margin: "0 auto",
        }}
      >
        <div style={{ marginBottom: "20px" }}>
          <h1
            style={{
              margin: 0,
              fontSize: "clamp(22px, 4vw, 26px)",
              fontWeight: "700",
              color: "#111",
              lineHeight: 1.2,
              wordBreak: "break-word",
            }}
          >
            Admin Dashboard
          </h1>
          <p
            style={{
              marginTop: "6px",
              fontSize: "clamp(13px, 2vw, 14px)",
              color: "#666",
              lineHeight: 1.5,
            }}
          >
            Welcome to your Trendz AeroX control panel
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gap: "14px",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          }}
        >
          <div
            style={cardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 14px 28px rgba(0,0,0,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.05)";
            }}
          >
            <p
              style={{
                margin: "0 0 6px",
                fontSize: "12px",
                fontWeight: "600",
                color: "#777",
                textTransform: "uppercase",
                letterSpacing: "0.6px",
              }}
            >
              Admin Name
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "clamp(16px, 2.5vw, 18px)",
                fontWeight: "600",
                color: "#111",
                wordBreak: "break-word",
              }}
            >
              {user?.name || "Admin User"}
            </p>
          </div>

          <div
            style={cardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 14px 28px rgba(0,0,0,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.05)";
            }}
          >
            <p
              style={{
                margin: "0 0 6px",
                fontSize: "12px",
                fontWeight: "600",
                color: "#777",
                textTransform: "uppercase",
                letterSpacing: "0.6px",
              }}
            >
              Email Address
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "clamp(14px, 2.3vw, 16px)",
                fontWeight: "500",
                color: "#222",
                wordBreak: "break-word",
                lineHeight: 1.5,
              }}
            >
              {user?.email || "No email available"}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          style={{
            marginTop: "20px",
            padding: "10px 18px",
            minHeight: "44px",
            background: "linear-gradient(135deg, #111, #2b2b2b)",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600",
            boxShadow: "0 8px 18px rgba(0,0,0,0.14)",
            transition: "all 0.25s ease",
            width: "100%",
            maxWidth: "180px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.18)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 8px 18px rgba(0,0,0,0.14)";
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}