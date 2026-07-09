"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPasswordApi } from "@/features/auth/passwordResetApi";

function EyeIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#000000"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M1 12C2.73 7.11 7 4 12 4C17 4 21.27 7.11 23 12C21.27 16.89 17 20 12 20C7 20 2.73 16.89 1 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#000000"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C7 20 2.73 16.89 1 12C1.8 9.73 3.26 7.78 5.16 6.35" />
      <path d="M9.9 4.24A10.8 10.8 0 0 1 12 4C17 4 21.27 7.11 23 12A11.1 11.1 0 0 1 19.83 16.28" />
      <path d="M14.12 14.12A3 3 0 0 1 9.88 9.88" />
      <path d="M1 1L23 23" />
    </svg>
  );
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = useMemo(() => {
    return searchParams.get("token") || "";
  }, [searchParams]);

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

    if (!token) {
      setError("Invalid reset link. Please request a new password reset email.");
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

      const res = await resetPasswordApi({
        token,
        newPassword,
        repeatPassword,
      });

      setSuccessMessage(
        res?.message ||
          "Password reset successful. You can now login with your new password."
      );

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
        <div className="reset-bg-orb orb-one" />
        <div className="reset-bg-orb orb-two" />

        <section className="reset-card">
          <div className="brand-badge">Trendz Firenze</div>

          <h1>Reset Password</h1>

          <p className="desc">
            Create a new password for your account. Your reset link can be used
            only once.
          </p>

          {!token && (
            <div className="error-box">
              Invalid reset link. Please request a new password reset email.
            </div>
          )}

          {successMessage && (
            <div className="success-box">{successMessage}</div>
          )}

          {error && <div className="error-box">{error}</div>}

          <form onSubmit={handleResetPassword}>
            <label>New Password</label>

            <div className="password-wrap">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                disabled={!token || loading}
              />

              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
                aria-label={
                  showNewPassword ? "Hide password" : "Show password"
                }
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
                disabled={!token || loading}
              />

              <button
                type="button"
                onClick={() => setShowRepeatPassword((prev) => !prev)}
                aria-label={
                  showRepeatPassword
                    ? "Hide repeat password"
                    : "Show repeat password"
                }
                className="eye-btn"
              >
                {showRepeatPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={!token || loading}
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>

          <button
            type="button"
            className="back-btn"
            onClick={() => router.push("/login")}
          >
            Back to Login
          </button>
        </section>
      </main>

      <style jsx>{`
        .reset-shell {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 28px 16px;
          overflow: hidden;
          background: radial-gradient(
            circle at top left,
            rgba(255, 255, 255, 0.98) 0%,
            #f8fafc 45%,
            #f1f5f9 100%
          );
        }

        .reset-bg-orb {
          position: absolute;
          border-radius: 999px;
          filter: blur(70px);
          opacity: 0.45;
          pointer-events: none;
        }

        .orb-one {
          width: 320px;
          height: 320px;
          background: rgba(17, 24, 39, 0.08);
          top: -80px;
          left: -80px;
        }

        .orb-two {
          width: 420px;
          height: 420px;
          background: rgba(148, 163, 184, 0.14);
          right: -120px;
          bottom: -120px;
        }

        .reset-card {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 480px;
          padding: 32px;
          border-radius: 28px;
          border: 1px solid rgba(226, 232, 240, 0.9);
          background: rgba(255, 255, 255, 0.96);
          box-shadow: 0 24px 70px rgba(15, 23, 42, 0.1);
          backdrop-filter: blur(16px);
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
          line-height: 1.1;
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

        .password-wrap {
          position: relative;
          width: 100%;
        }

        input {
          width: 100%;
          padding: 14px 52px 14px 14px;
          border: 1px solid #d1d5db;
          border-radius: 14px;
          background: #fff;
          color: #111827;
          font-size: 14px;
          outline: none;
          box-sizing: border-box;
        }

        input:focus {
          border-color: #0f172a;
          box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.08);
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
          align-items: center;
          justify-content: center;
        }

        .submit-btn {
          width: 100%;
          margin-top: 24px;
          padding: 15px 18px;
          border: none;
          border-radius: 16px;
          background: linear-gradient(135deg, #111827 0%, #0f172a 100%);
          color: #fff;
          cursor: pointer;
          font-size: 15px;
          font-weight: 900;
          box-shadow: 0 18px 36px rgba(17, 24, 39, 0.2);
        }

        .submit-btn:disabled {
          background: #9ca3af;
          cursor: not-allowed;
          box-shadow: none;
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
          font-size: 14px;
          font-weight: 700;
          line-height: 1.5;
        }

        .error-box {
          padding: 13px 14px;
          margin-bottom: 16px;
          border-radius: 14px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #b91c1c;
          font-size: 14px;
          font-weight: 700;
          line-height: 1.5;
        }

        @media (max-width: 640px) {
          .reset-card {
            padding: 24px 20px;
            border-radius: 24px;
          }

          h1 {
            font-size: 30px;
          }
        }
      `}</style>
    </>
  );
}