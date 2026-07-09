"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPasswordWithMobileOtpApi } from "@/features/auth/passwordResetApi";

function EyeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12C2.73 7.11 7 4 12 4C17 4 21.27 7.11 23 12C21.27 16.89 17 20 12 20C7 20 2.73 16.89 1 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C7 20 2.73 16.89 1 12C1.8 9.73 3.26 7.78 5.16 6.35" />
      <path d="M9.9 4.24A10.8 10.8 0 0 1 12 4C17 4 21.27 7.11 23 12A11.1 11.1 0 0 1 19.83 16.28" />
      <path d="M14.12 14.12A3 3 0 0 1 9.88 9.88" />
      <path d="M1 1L23 23" />
    </svg>
  );
}

export default function MobileResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialPhone = useMemo(() => {
    return (searchParams.get("phone") || "").replace(/\D/g, "").slice(0, 10);
  }, [searchParams]);

  const [phone, setPhone] = useState(initialPhone);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();

    setError("");
    setSuccessMessage("");

    const cleanPhone = phone.replace(/\D/g, "").slice(0, 10);

    if (!/^[0-9]{10}$/.test(cleanPhone)) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }

    if (!/^[0-9]{6}$/.test(otp)) {
      setError("Enter a valid 6-digit OTP.");
      return;
    }

    if (!newPassword || newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (newPassword !== repeatPassword) {
      setError("New password and repeat password do not match.");
      return;
    }

    try {
      setLoading(true);

      const res = await resetPasswordWithMobileOtpApi({
        phone: cleanPhone,
        otp,
        newPassword,
        repeatPassword,
      });

      setSuccessMessage(
        res?.message ||
          "Password reset successful. You can now login with your new password."
      );

      setOtp("");
      setNewPassword("");
      setRepeatPassword("");

      setTimeout(() => {
        router.replace("/login");
      }, 1500);
    } catch (err) {
      setError(err?.message || "Password reset failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main className="reset-shell">
        <section className="reset-card">
          <div className="brand-badge">Trendz Firenze</div>

          <h1>Reset by Mobile OTP</h1>

          <p className="desc">
            Enter the OTP sent to your registered mobile number and create a new password.
          </p>

          {successMessage && <div className="success-box">{successMessage}</div>}
          {error && <div className="error-box">{error}</div>}

          <form onSubmit={handleResetPassword}>
            <label>Mobile Number</label>
            <input
              type="tel"
              placeholder="10-digit mobile number"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
              }
              inputMode="numeric"
              disabled={loading}
            />

            <label>OTP</label>
            <input
              type="tel"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              inputMode="numeric"
              disabled={loading}
            />

            <label>New Password</label>
            <div className="password-wrap">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                disabled={loading}
              />

              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="eye-btn"
              >
                {showNewPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>

            <label>Repeat Password</label>
            <div className="password-wrap">
              <input
                type={showRepeatPassword ? "text" : "password"}
                placeholder="Repeat new password"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                autoComplete="new-password"
                disabled={loading}
              />

              <button
                type="button"
                onClick={() => setShowRepeatPassword((prev) => !prev)}
                className="eye-btn"
              >
                {showRepeatPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>

          <button
            type="button"
            className="back-btn"
            onClick={() => router.push("/forgot-password")}
          >
            Back
          </button>
        </section>
      </main>

      <style jsx>{`
        .reset-shell {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 28px 16px;
          background: radial-gradient(
            circle at top left,
            #ffffff 0%,
            #f8fafc 45%,
            #f1f5f9 100%
          );
        }

        .reset-card {
          width: 100%;
          max-width: 500px;
          padding: 32px;
          border-radius: 28px;
          border: 1px solid #e5e7eb;
          background: #ffffff;
          box-shadow: 0 24px 70px rgba(15, 23, 42, 0.1);
        }

        .brand-badge {
          display: inline-flex;
          padding: 8px 14px;
          border-radius: 999px;
          background: rgba(17, 24, 39, 0.06);
          color: #475569;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 18px;
        }

        h1 {
          margin: 0;
          font-size: 34px;
          color: #0f172a;
          font-weight: 900;
          letter-spacing: -0.04em;
        }

        .desc {
          margin: 12px 0 24px;
          font-size: 14px;
          line-height: 1.7;
          color: #64748b;
        }

        label {
          display: block;
          margin: 16px 0 8px;
          color: #111827;
          font-size: 13px;
          font-weight: 800;
        }

        input {
          width: 100%;
          padding: 14px;
          border: 1px solid #d1d5db;
          border-radius: 14px;
          background: #ffffff;
          color: #111827;
          font-size: 14px;
          outline: none;
          box-sizing: border-box;
        }

        .password-wrap {
          position: relative;
        }

        .password-wrap input {
          padding-right: 52px;
        }

        .eye-btn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          border: none;
          background: transparent;
          cursor: pointer;
          padding: 6px;
          display: flex;
        }

        .submit-btn {
          width: 100%;
          margin-top: 24px;
          padding: 15px 18px;
          border: none;
          border-radius: 16px;
          background: #111827;
          color: #ffffff;
          cursor: pointer;
          font-size: 15px;
          font-weight: 900;
        }

        .submit-btn:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .back-btn {
          width: 100%;
          margin-top: 14px;
          padding: 13px 18px;
          border: 1px solid #d1d5db;
          border-radius: 16px;
          background: #ffffff;
          color: #111827;
          cursor: pointer;
          font-size: 14px;
          font-weight: 800;
        }

        .success-box {
          padding: 13px 14px;
          margin-bottom: 16px;
          border-radius: 14px;
          background: #ecfdf3;
          border: 1px solid #bbf7d0;
          color: #166534;
          font-size: 13px;
          font-weight: 700;
        }

        .error-box {
          padding: 13px 14px;
          margin-bottom: 16px;
          border-radius: 14px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #991b1b;
          font-size: 13px;
          font-weight: 700;
        }

        @media (max-width: 520px) {
          .reset-card {
            padding: 24px;
            border-radius: 22px;
          }

          h1 {
            font-size: 30px;
          }
        }
      `}</style>
    </>
  );
}