

"use client";

import { useEffect, useState } from "react";

export default function InstagramAdminPage() {
  const [token, setToken] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenInfo, setTokenInfo] = useState(null);
  const [infoLoading, setInfoLoading] = useState(true);
  const [infoError, setInfoError] = useState("");

  const generateToken = () => {
    window.open("https://developers.facebook.com/tools/explorer/", "_blank");
  };

  const loadTokenStatus = async () => {
    try {
      setInfoLoading(true);
      setInfoError("");

      const res = await fetch("/api/admin/instagram/status", {
        method: "GET",
        cache: "no-store",
      });

      const contentType = res.headers.get("content-type") || "";
      const data = contentType.includes("application/json")
        ? await res.json()
        : { error: await res.text() };

      if (!res.ok) {
        setTokenInfo(null);
        setInfoError(data.error || data.message || "Failed to load token status");
        return;
      }

      setTokenInfo(data);
    } catch (e) {
      console.error(e);
      setTokenInfo(null);
      setInfoError("Failed to load token status");
    } finally {
      setInfoLoading(false);
    }
  };

  useEffect(() => {
    loadTokenStatus();
  }, []);

  const updateToken = async () => {
    if (!token.trim()) {
      setStatus("❌ Please paste a token first");
      return;
    }

    try {
      setLoading(true);
      setStatus("Updating token...");

      const res = await fetch("/api/admin/instagram/update-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accessToken: token.trim() }),
      });

      const contentType = res.headers.get("content-type") || "";
      const data = contentType.includes("application/json")
        ? await res.json()
        : { error: await res.text() };

      if (res.ok) {
        setStatus("✅ Token updated successfully");
        setToken("");
        await loadTokenStatus();
      } else {
        setStatus("❌ " + (data.error || data.message || "Update failed"));
      }
    } catch (e) {
      console.error(e);
      setStatus("❌ Network error");
    } finally {
      setLoading(false);
    }
  };

  const pageStyle = {
    minHeight: "100%",
    padding: "clamp(16px, 3vw, 36px)",
    background:
      "linear-gradient(180deg, #f8f8f8 0%, #f3f4f6 45%, #efefef 100%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  };

  const wrapperStyle = {
    width: "100%",
    maxWidth: "860px",
  };

  const headerStyle = {
    marginBottom: "18px",
  };

  const headingStyle = {
    margin: 0,
    fontSize: "clamp(24px, 3vw, 36px)",
    fontWeight: 700,
    color: "#111827",
    letterSpacing: "-0.03em",
    lineHeight: 1.1,
  };

  const subTextStyle = {
    margin: "10px 0 0",
    color: "#6b7280",
    fontSize: "clamp(13px, 1.5vw, 15px)",
    lineHeight: 1.7,
    maxWidth: "700px",
  };

  const cardStyle = {
    position: "relative",
    overflow: "hidden",
    borderRadius: "24px",
    background:
      "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(249,250,251,0.96) 100%)",
    border: "1px solid rgba(17,24,39,0.08)",
    boxShadow:
      "0 16px 40px rgba(17,24,39,0.08), 0 4px 14px rgba(17,24,39,0.05)",
    padding: "clamp(18px, 3vw, 30px)",
  };

  const sectionTitleStyle = {
    margin: 0,
    fontSize: "clamp(18px, 2vw, 22px)",
    fontWeight: 700,
    color: "#111827",
  };

  const topRowStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
    marginBottom: "18px",
  };

  const refreshButtonStyle = {
    border: "1px solid rgba(17,24,39,0.08)",
    background: "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
    color: "#111827",
    borderRadius: "12px",
    padding: "10px 14px",
    minHeight: "42px",
    fontSize: "13px",
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.25s ease",
    boxShadow: "0 6px 14px rgba(17,24,39,0.06)",
  };

  const infoGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "14px",
    marginTop: "10px",
  };

  const infoBoxStyle = {
    borderRadius: "18px",
    padding: "16px",
    background: "rgba(255,255,255,0.75)",
    border: "1px solid rgba(17,24,39,0.06)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.7)",
    minWidth: 0,
  };

  const infoLabelStyle = {
    margin: "0 0 8px",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    color: "#6b7280",
  };

  const infoValueStyle = {
    margin: 0,
    fontSize: "15px",
    fontWeight: 600,
    color: "#111827",
    lineHeight: 1.5,
    wordBreak: "break-word",
  };

  const messageBoxStyle = {
    borderRadius: "16px",
    padding: "14px 16px",
    fontSize: "14px",
    lineHeight: 1.6,
  };

  const primaryButtonStyle = {
    border: "1px solid rgba(17,24,39,0.10)",
    background: "linear-gradient(135deg, #111827 0%, #1f2937 100%)",
    color: "#ffffff",
    borderRadius: "14px",
    padding: "13px 22px",
    minHeight: "48px",
    fontSize: "14px",
    fontWeight: 700,
    letterSpacing: "0.03em",
    cursor: "pointer",
    transition: "all 0.25s ease",
    boxShadow: "0 12px 24px rgba(17,24,39,0.16)",
  };

  const blueButtonStyle = {
    border: "1px solid rgba(37,99,235,0.12)",
    background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
    color: "#ffffff",
    borderRadius: "14px",
    padding: "13px 22px",
    minHeight: "48px",
    fontSize: "14px",
    fontWeight: 700,
    letterSpacing: "0.03em",
    cursor: "pointer",
    transition: "all 0.25s ease",
    boxShadow: "0 12px 24px rgba(37,99,235,0.18)",
  };

  const textareaStyle = {
    width: "100%",
    minHeight: "180px",
    borderRadius: "18px",
    border: "1px solid rgba(17,24,39,0.10)",
    background: "rgba(255,255,255,0.92)",
    padding: "16px",
    fontSize: "14px",
    color: "#111827",
    outline: "none",
    transition: "all 0.25s ease",
    boxSizing: "border-box",
    resize: "vertical",
    lineHeight: 1.6,
    boxShadow: "0 1px 2px rgba(17,24,39,0.04)",
  };

  const actionRowStyle = {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    marginTop: "16px",
  };

  const statusTextStyle = {
    marginTop: "16px",
    fontSize: "14px",
    fontWeight: 600,
    color: "#374151",
    wordBreak: "break-word",
  };

  return (
    <div style={pageStyle}>
      <style jsx>{`
        .insta-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(
            90deg,
            #111827 0%,
            #4b5563 50%,
            #d1d5db 100%
          );
        }

        .field-area:focus {
          border-color: rgba(17, 24, 39, 0.22);
          box-shadow: 0 0 0 4px rgba(17, 24, 39, 0.06);
          transform: translateY(-1px);
        }

        .action-btn:hover {
          transform: translateY(-2px);
        }

        .action-btn:active {
          transform: translateY(0);
        }

        .status-card-hover:hover {
          transform: translateY(-3px);
          box-shadow: 0 18px 36px rgba(17, 24, 39, 0.08),
            0 4px 14px rgba(17, 24, 39, 0.05);
        }

        @media (max-width: 768px) {
          .insta-actions {
            flex-direction: column;
          }

          .insta-actions button {
            width: 100%;
          }
        }
      `}</style>

      <div style={wrapperStyle}>
        <div style={headerStyle}>
          <h1 style={headingStyle}>Instagram Token Management</h1>
          <p style={subTextStyle}>
            Open Graph API Explorer, generate a new long-lived token, paste it
            below, and update the token stored in your database.
          </p>
        </div>

        <div className="insta-card status-card-hover" style={cardStyle}>
          <div style={topRowStyle}>
            <h2 style={sectionTitleStyle}>Current Token Status</h2>

            <button
              type="button"
              onClick={loadTokenStatus}
              className="action-btn"
              style={refreshButtonStyle}
            >
              Refresh Status
            </button>
          </div>

          {infoLoading ? (
            <div
              style={{
                ...messageBoxStyle,
                background: "rgba(59,130,246,0.08)",
                border: "1px solid rgba(59,130,246,0.14)",
                color: "#1d4ed8",
              }}
            >
              Loading token info...
            </div>
          ) : infoError ? (
            <div
              style={{
                ...messageBoxStyle,
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.14)",
                color: "#b91c1c",
              }}
            >
              ❌ {infoError}
            </div>
          ) : tokenInfo?.configured === false ? (
            <div
              style={{
                ...messageBoxStyle,
                background: "rgba(245,158,11,0.08)",
                border: "1px solid rgba(245,158,11,0.14)",
                color: "#92400e",
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: "6px" }}>
                No Instagram token saved in database yet.
              </div>
              <div>
                Generate a new token and update it to create the first record.
              </div>
            </div>
          ) : tokenInfo?.configured ? (
            <div style={infoGridStyle}>
              <div style={infoBoxStyle}>
                <p style={infoLabelStyle}>INSTAGRAM USER ID</p>
                <p style={infoValueStyle}>{tokenInfo.instagramUserId || "-"}</p>
              </div>

              <div style={infoBoxStyle}>
                <p style={infoLabelStyle}>EXPIRES AT</p>
                <p style={infoValueStyle}>
                  {tokenInfo.expiresAt
                    ? new Date(tokenInfo.expiresAt).toLocaleString()
                    : "-"}
                </p>
              </div>

              <div style={infoBoxStyle}>
                <p style={infoLabelStyle}>REFRESHED AT</p>
                <p style={infoValueStyle}>
                  {tokenInfo.refreshedAt
                    ? new Date(tokenInfo.refreshedAt).toLocaleString()
                    : "-"}
                </p>
              </div>

              <div style={infoBoxStyle}>
                <p style={infoLabelStyle}>ACTIVE</p>
                <p style={infoValueStyle}>{tokenInfo.active ? "Yes" : "No"}</p>
              </div>

              <div style={infoBoxStyle}>
                <p style={infoLabelStyle}>EXPIRED</p>
                <p style={infoValueStyle}>{tokenInfo.expired ? "Yes" : "No"}</p>
              </div>
            </div>
          ) : (
            <div
              style={{
                ...messageBoxStyle,
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.14)",
                color: "#b91c1c",
              }}
            >
              No token info found.
            </div>
          )}

          <div className="insta-actions" style={actionRowStyle}>
            <button
              onClick={generateToken}
              type="button"
              className="action-btn"
              style={blueButtonStyle}
            >
              Generate New Token
            </button>
          </div>

          <div style={{ marginTop: "18px" }}>
            <textarea
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Paste new long-lived token here..."
              className="field-area"
              style={textareaStyle}
            />
          </div>

          <div className="insta-actions" style={actionRowStyle}>
            <button
              onClick={updateToken}
              disabled={loading}
              className="action-btn"
              style={{
                ...primaryButtonStyle,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Updating..." : "Update Token"}
            </button>
          </div>

          {status && <p style={statusTextStyle}>{status}</p>}
        </div>
      </div>
    </div>
  );
}