

"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadProfile } from "@/features/user/userSlice";
import { logout } from "@/features/auth/authSlice";
import { useRouter } from "next/navigation";
import {
  FiUser,
  FiLock,
  FiPackage,
  FiHeart,
  FiMapPin,
  FiLogOut,
  FiHome,
} from "react-icons/fi";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { profile, loading } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(loadProfile());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  if (loading) {
    return (
      <div style={styles.wrapper}>
        <div style={styles.container}>
          <p style={styles.loadingText}>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={styles.wrapper}>
        <div style={styles.container}>
          <p style={styles.loadingText}>Profile not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <div style={styles.topBar}>
          <div>
            <p style={styles.subHeading}>Account Dashboard</p>
            <h2 style={styles.heading}>My Account</h2>
          </div>

          <button onClick={() => router.push("/")} style={styles.homeBtn}>
            <FiHome size={17} />
            Back to Home
          </button>
        </div>

        <div style={styles.grid}>
          <div style={styles.card}>
            <div style={styles.iconBox}>
              <FiUser />
            </div>

            <div>
              <h3 style={styles.cardTitle}>Profile Information</h3>
              <p style={styles.cardText}>
                <b>Name:</b> {profile.name}
              </p>
              <p style={styles.cardText}>
                <b>Email:</b> {profile.email}
              </p>
              <p style={styles.cardText}>
                <b>Phone:</b> {profile.phone}
              </p>

              <button
                onClick={() => router.push("/account/profile/edit")}
                style={styles.linkBtn}
              >
                Edit Profile
              </button>
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.iconBox}>
              <FiLock />
            </div>

            <div>
              <h3 style={styles.cardTitle}>Security</h3>
              <p style={styles.cardText}>
                Edit login, password and security settings
              </p>

              <button
                onClick={() => router.push("/account/security")}
                style={styles.linkBtn}
              >
                Change Password
              </button>
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.iconBox}>
              <FiPackage />
            </div>

            <div>
              <h3 style={styles.cardTitle}>Orders</h3>
              <p style={styles.cardText}>Track, return, or buy things again</p>

              <button
                onClick={() => router.push("/account/orders")}
                style={styles.linkBtn}
              >
                View Orders
              </button>
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.iconBox}>
              <FiHeart />
            </div>

            <div>
              <h3 style={styles.cardTitle}>Wishlist</h3>
              <p style={styles.cardText}>
                View saved products and favorite items
              </p>

              <button
                onClick={() => router.push("/account/wishlist")}
                style={styles.linkBtn}
              >
                Wishlist
              </button>
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.iconBox}>
              <FiMapPin />
            </div>

            <div>
              <h3 style={styles.cardTitle}>Addresses</h3>
              <p style={styles.cardText}>
                Edit addresses for orders and delivery
              </p>

              <button
                onClick={() => router.push("/account/profile/addresses")}
                style={styles.linkBtn}
              >
                Manage Addresses
              </button>
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.iconBox}>
              <FiLogOut />
            </div>

            <div>
              <h3 style={styles.cardTitle}>Logout</h3>
              <p style={styles.cardText}>Sign out from your account securely</p>

              <button onClick={handleLogout} style={styles.logoutBtn}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "#000",
    padding: "24px 16px 56px",
  },

  container: {
    width: "100%",
    maxWidth: 1000,
    margin: "0 auto",
    color: "#fff",
  },

  topBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
    marginBottom: "22px",
    flexWrap: "wrap",
  },

  subHeading: {
    margin: "0 0 6px",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "#e5e7eb",
  },

  heading: {
    fontSize: "clamp(26px, 5vw, 32px)",
    fontWeight: 800,
    margin: 0,
    color: "#fff",
    letterSpacing: "-0.03em",
  },

  homeBtn: {
    minHeight: "42px",
    padding: "0 16px",
    borderRadius: "999px",
    border: "1px solid #fff",
    background: "#fff",
    color: "#000",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 700,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    whiteSpace: "nowrap",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "20px",
  },

  card: {
    minHeight: "118px",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    background: "#fff",
    padding: "20px",
    display: "flex",
    alignItems: "flex-start",
    gap: "16px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 12px 30px rgba(255,255,255,0.14)",
    overflow: "hidden",
  },

  iconBox: {
    width: "54px",
    minWidth: "54px",
    height: "54px",
    borderRadius: "14px",
    background: "#000",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "26px",
  },

  cardTitle: {
    fontSize: "18px",
    fontWeight: 700,
    margin: "2px 0 8px",
    color: "#000",
  },

  cardText: {
    fontSize: "14px",
    lineHeight: "1.5",
    color: "#111",
    margin: "4px 0",
    wordBreak: "break-word",
  },

  linkBtn: {
    marginTop: "10px",
    padding: 0,
    border: "none",
    background: "transparent",
    color: "#000",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 700,
    textDecoration: "underline",
    textUnderlineOffset: "4px",
  },

  logoutBtn: {
    marginTop: "10px",
    padding: 0,
    border: "none",
    background: "transparent",
    color: "#991b1b",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 700,
    textDecoration: "underline",
    textUnderlineOffset: "4px",
  },

  loadingText: {
    color: "#fff",
    fontSize: "18px",
  },
};