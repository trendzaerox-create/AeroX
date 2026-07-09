

"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  getPasswordResetOptionsApi,
  requestPasswordResetApi,
  requestMobilePasswordOtpByEmailApi,
} from "@/features/auth/passwordResetApi";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const queryEmail = searchParams.get("email") || "";
  const fromCheckout = searchParams.get("from") === "checkout";

  const [mode, setMode] = useState("email");
  const [email, setEmail] = useState("");
  const [maskedPhone, setMaskedPhone] = useState("");
  const [hasPhone, setHasPhone] = useState(false);

  const [optionsLoading, setOptionsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const cleanEmail = queryEmail.trim().toLowerCase();

    if (!cleanEmail) {
      return;
    }

    setEmail(cleanEmail);

    async function loadResetOptions() {
      try {
        setOptionsLoading(true);
        setError("");

        const res = await getPasswordResetOptionsApi(cleanEmail);

        setEmail(res?.email || cleanEmail);
        setMaskedPhone(res?.maskedPhone || "");
        setHasPhone(Boolean(res?.hasPhone));
      } catch (err) {
        console.error(err);
        setError("Could not load reset options. Please try again.");
      } finally {
        setOptionsLoading(false);
      }
    }

    loadResetOptions();
  }, [queryEmail]);

  const handleEmailReset = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      setError("Email not found. Please go back to checkout and try again.");
      return;
    }

    try {
      setLoading(true);

      const res = await requestPasswordResetApi(cleanEmail);

      setMessage(
        res?.message ||
          "If an account exists with this email, a password reset link has been sent."
      );
    } catch (err) {
      setError(err?.message || "Could not send reset link.");
    } finally {
      setLoading(false);
    }
  };

  const handleMobileOtp = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !hasPhone) {
      setError("No registered mobile number found for this account.");
      return;
    }

    try {
      setLoading(true);

      const res = await requestMobilePasswordOtpByEmailApi(cleanEmail);

      setMessage(
        res?.message ||
          "If an account exists with this email and mobile number, an OTP has been sent."
      );

      setTimeout(() => {
        router.push(
          `/reset-password/mobile?email=${encodeURIComponent(cleanEmail)}`
        );
      }, 700);
    } catch (err) {
      setError(err?.message || "Could not send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const changeMode = (nextMode) => {
    setMode(nextMode);
    setError("");
    setMessage("");
  };

  return (
    <>
      <main className="forgot-shell">
        <div className="bg-orb orb-one" />
        <div className="bg-orb orb-two" />

        <section className="forgot-card">
          <div className="card-topline" />

          <div className="brand-row">
            <div className="brand-mark">TF</div>

            <div>
              <div className="brand-name">Trendz Firenze</div>
              <div className="brand-subtitle">Secure Account Recovery</div>
            </div>
          </div>

          <div className="content-head">
            <p className="eyebrow">Password Assistance</p>
            <h1>Forgot Password?</h1>
            <p className="desc">
              Confirm your registered account and choose email reset link or
              mobile OTP.
            </p>
          </div>

          {fromCheckout && (
            <div className="checkout-note">
              Recovery started from checkout for your existing account.
            </div>
          )}

          <div className="mode-tabs" role="tablist" aria-label="Reset method">
            <button
              type="button"
              className={mode === "email" ? "active" : ""}
              onClick={() => changeMode("email")}
            >
              <span>Email</span>
              <small>Reset link</small>
            </button>

            <button
              type="button"
              className={mode === "mobile" ? "active" : ""}
              onClick={() => changeMode("mobile")}
            >
              <span>Mobile OTP</span>
              <small>Instant verification</small>
            </button>
          </div>

          {message && <div className="success-box">{message}</div>}
          {error && <div className="error-box">{error}</div>}

          {mode === "email" && (
            <form onSubmit={handleEmailReset} className="reset-form">
              <div className="field-group">
                <label>Email Address</label>

                <div className="readonly-box">
                  {optionsLoading ? "Loading..." : email || "No email found"}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || optionsLoading || !email}
                className="primary-btn"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          )}

          {mode === "mobile" && (
            <form onSubmit={handleMobileOtp} className="reset-form">
              <div className="field-group">
                <label>Registered Mobile Number</label>

                <div className="readonly-box">
                  {optionsLoading
                    ? "Loading..."
                    : hasPhone
                      ? maskedPhone
                      : "No mobile number found"}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || optionsLoading || !hasPhone}
                className="primary-btn"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          )}

          <button
            type="button"
            className="back-btn"
            onClick={() => router.push("/login")}
          >
            Back to Login
          </button>

          <p className="secure-note">
            Protected checkout recovery for your Trendz Firenze account.
          </p>
        </section>
      </main>

      <style jsx>{`
        .forgot-shell {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px 14px;
          background:
            radial-gradient(circle at 20% 10%, rgba(15, 23, 42, 0.07), transparent 25%),
            radial-gradient(circle at 85% 20%, rgba(148, 163, 184, 0.18), transparent 28%),
            linear-gradient(135deg, #f8fafc 0%, #eef2f7 45%, #f8fafc 100%);
        }

        .bg-orb {
          position: absolute;
          border-radius: 999px;
          filter: blur(6px);
          opacity: 0.5;
          pointer-events: none;
        }

        .orb-one {
          width: 190px;
          height: 190px;
          left: -65px;
          bottom: 10%;
          background: rgba(15, 23, 42, 0.07);
        }

        .orb-two {
          width: 250px;
          height: 250px;
          right: -95px;
          top: 8%;
          background: rgba(203, 213, 225, 0.5);
        }

        .forgot-card {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 440px;
          padding: 26px;
          border-radius: 24px;
          border: 1px solid rgba(15, 23, 42, 0.08);
          background: rgba(255, 255, 255, 0.95);
          box-shadow:
            0 22px 60px rgba(15, 23, 42, 0.11),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(16px);
        }

        .card-topline {
          position: absolute;
          top: 0;
          left: 26px;
          right: 26px;
          height: 3px;
          border-radius: 999px;
          background: linear-gradient(90deg, transparent, #111827, transparent);
          opacity: 0.65;
        }

        .brand-row {
          display: flex;
          align-items: center;
          gap: 11px;
          margin-bottom: 20px;
        }

        .brand-mark {
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 13px;
          background: #111827;
          color: #ffffff;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.08em;
          box-shadow: 0 12px 26px rgba(15, 23, 42, 0.2);
        }

        .brand-name {
          color: #0f172a;
          font-size: 14px;
          font-weight: 900;
          letter-spacing: -0.02em;
        }

        .brand-subtitle {
          margin-top: 2px;
          color: #64748b;
          font-size: 11px;
          font-weight: 700;
        }

        .content-head {
          margin-bottom: 18px;
        }

        .eyebrow {
          margin: 0 0 7px;
          color: #64748b;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        h1 {
          margin: 0;
          color: #0f172a;
          font-size: 30px;
          line-height: 1.08;
          font-weight: 950;
          letter-spacing: -0.05em;
        }

        .desc {
          margin: 10px 0 0;
          color: #64748b;
          font-size: 13.5px;
          line-height: 1.65;
        }

        .checkout-note {
          padding: 11px 13px;
          margin-bottom: 14px;
          border-radius: 14px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #475569;
          font-size: 12px;
          font-weight: 800;
          line-height: 1.5;
        }

        .mode-tabs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          padding: 5px;
          margin-bottom: 16px;
          border-radius: 17px;
          background: #f1f5f9;
          border: 1px solid rgba(15, 23, 42, 0.06);
        }

        .mode-tabs button {
          min-height: 54px;
          padding: 10px;
          border: 1px solid transparent;
          border-radius: 13px;
          background: transparent;
          color: #334155;
          cursor: pointer;
          transition: all 0.22s ease;
          text-align: left;
        }

        .mode-tabs button span {
          display: block;
          font-size: 13px;
          font-weight: 900;
        }

        .mode-tabs button small {
          display: block;
          margin-top: 3px;
          color: #64748b;
          font-size: 10.5px;
          font-weight: 700;
        }

        .mode-tabs button.active {
          background: #ffffff;
          color: #0f172a;
          border-color: rgba(15, 23, 42, 0.08);
          box-shadow: 0 10px 24px rgba(15, 23, 42, 0.09);
        }

        .reset-form {
          margin-top: 14px;
        }

        .field-group {
          margin-bottom: 14px;
        }

        label {
          display: block;
          margin-bottom: 7px;
          color: #111827;
          font-size: 12.5px;
          font-weight: 900;
        }

        .readonly-box {
          width: 100%;
          min-height: 48px;
          display: flex;
          align-items: center;
          padding: 0 14px;
          border: 1px solid #d7dde6;
          border-radius: 14px;
          background: #f8fafc;
          color: #0f172a;
          font-size: 13.5px;
          font-weight: 800;
          box-sizing: border-box;
          word-break: break-word;
        }

        .primary-btn,
        .back-btn {
          width: 100%;
          min-height: 48px;
          border-radius: 14px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 900;
          transition: all 0.22s ease;
        }

        .primary-btn {
          border: 1px solid #111827;
          background: #111827;
          color: #ffffff;
          box-shadow: 0 14px 28px rgba(15, 23, 42, 0.2);
        }

        .primary-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 18px 34px rgba(15, 23, 42, 0.24);
        }

        .primary-btn:disabled {
          border-color: #9ca3af;
          background: #9ca3af;
          cursor: not-allowed;
          box-shadow: none;
        }

        .back-btn {
          margin-top: 10px;
          border: 1px solid #d7dde6;
          background: #ffffff;
          color: #111827;
        }

        .back-btn:hover {
          background: #f8fafc;
          border-color: #111827;
        }

        .success-box,
        .error-box {
          padding: 12px 13px;
          margin-bottom: 14px;
          border-radius: 14px;
          font-size: 12.5px;
          line-height: 1.5;
          font-weight: 800;
        }

        .success-box {
          background: #ecfdf3;
          border: 1px solid #bbf7d0;
          color: #166534;
        }

        .error-box {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #991b1b;
        }

        .secure-note {
          margin: 14px 0 0;
          text-align: center;
          color: #94a3b8;
          font-size: 11.5px;
          font-weight: 700;
        }

        @media (min-width: 1440px) {
          .forgot-card {
            max-width: 420px;
            padding: 24px;
          }

          h1 {
            font-size: 29px;
          }
        }

        @media (max-width: 768px) {
          .forgot-shell {
            padding: 22px 14px;
          }

          .forgot-card {
            max-width: 430px;
            padding: 24px;
            border-radius: 22px;
          }
        }

        @media (max-width: 520px) {
          .forgot-shell {
            align-items: flex-start;
            padding: 18px 12px;
          }

          .forgot-card {
            max-width: 100%;
            padding: 22px 18px;
            border-radius: 22px;
          }

          .card-topline {
            left: 20px;
            right: 20px;
          }

          h1 {
            font-size: 28px;
          }

          .mode-tabs {
            grid-template-columns: 1fr;
          }

          .mode-tabs button {
            min-height: 52px;
          }
        }

        @media (max-width: 380px) {
          .forgot-card {
            padding: 20px 15px;
          }

          h1 {
            font-size: 26px;
          }

          .desc {
            font-size: 13px;
          }
        }
      `}</style>
    </>
  );
}