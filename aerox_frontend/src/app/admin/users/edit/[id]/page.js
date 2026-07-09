




"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useDispatch } from "react-redux";

import { updateUserByAdmin } from "@/features/user/userSlice";
import { getUser } from "@/features/user/userApi";

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch();

  const userId = params.id;

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "CUSTOMER",
  });

  useEffect(() => {
    const loadUser = async () => {
      const data = await getUser(userId);

      setForm({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        role: data.role || "CUSTOMER",
      });
    };

    loadUser();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await dispatch(
      updateUserByAdmin({
        id: userId,
        data: form,
      })
    );

    alert("User updated");

    router.push("/admin/users");
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
    maxWidth: "760px",
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
  };

  const subTextStyle = {
    margin: "8px 0 0",
    color: "#6b7280",
    fontSize: "clamp(13px, 1.6vw, 15px)",
    lineHeight: 1.6,
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

  const formStyle = {
    display: "grid",
    gap: "18px",
  };

  const fieldGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "16px",
  };

  const fieldFullStyle = {
    gridColumn: "1 / -1",
  };

  const fieldStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    minWidth: 0,
  };

  const labelStyle = {
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    color: "#6b7280",
  };

  const inputStyle = {
    width: "100%",
    minHeight: "50px",
    borderRadius: "14px",
    border: "1px solid rgba(17,24,39,0.10)",
    background: "rgba(255,255,255,0.9)",
    padding: "0 16px",
    fontSize: "15px",
    color: "#111827",
    outline: "none",
    transition: "all 0.25s ease",
    boxSizing: "border-box",
    boxShadow: "0 1px 2px rgba(17,24,39,0.04)",
  };

  const selectStyle = {
    ...inputStyle,
    appearance: "none",
    WebkitAppearance: "none",
    MozAppearance: "none",
    cursor: "pointer",
    paddingRight: "44px",
    backgroundImage:
      "linear-gradient(45deg, transparent 50%, #6b7280 50%), linear-gradient(135deg, #6b7280 50%, transparent 50%)",
    backgroundPosition: "calc(100% - 20px) calc(50% - 3px), calc(100% - 14px) calc(50% - 3px)",
    backgroundSize: "6px 6px, 6px 6px",
    backgroundRepeat: "no-repeat",
  };

  const actionRowStyle = {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    marginTop: "4px",
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

  const secondaryButtonStyle = {
    border: "1px solid rgba(17,24,39,0.08)",
    background: "linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)",
    color: "#111827",
    borderRadius: "14px",
    padding: "13px 22px",
    minHeight: "48px",
    fontSize: "14px",
    fontWeight: 700,
    letterSpacing: "0.03em",
    cursor: "pointer",
    transition: "all 0.25s ease",
    boxShadow: "0 8px 18px rgba(17,24,39,0.06)",
  };

  return (
    <div style={pageStyle}>
      <style jsx>{`
        .edit-user-card::before {
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

        .field-input:focus,
        .field-select:focus {
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

        @media (max-width: 768px) {
          .edit-user-grid {
            grid-template-columns: 1fr;
          }

          .edit-user-actions {
            flex-direction: column;
          }

          .edit-user-actions button {
            width: 100%;
          }
        }
      `}</style>

      <div style={wrapperStyle}>
        <div style={headerStyle}>
          <h2 style={headingStyle}>Edit User</h2>
          <p style={subTextStyle}>
            Update user details with a clean, responsive, professional admin
            form.
          </p>
        </div>

        <div className="edit-user-card" style={cardStyle}>
          <form onSubmit={handleSubmit} style={formStyle}>
            <div className="edit-user-grid" style={fieldGridStyle}>
              <div style={fieldStyle}>
                <label style={labelStyle}>NAME</label>
                <input
                  className="field-input"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>EMAIL</label>
                <input
                  className="field-input"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>PHONE</label>
                <input
                  className="field-input"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle}>ROLE</label>
                <select
                  className="field-select"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  style={selectStyle}
                >
                  <option value="CUSTOMER">CUSTOMER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
            </div>

            <div className="edit-user-actions" style={actionRowStyle}>
              <button
                type="submit"
                className="action-btn"
                style={primaryButtonStyle}
              >
                Update User
              </button>

              <button
                type="button"
                className="action-btn"
                onClick={() => router.push("/admin/users")}
                style={secondaryButtonStyle}
              >
                Back to Users
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}