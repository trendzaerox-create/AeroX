"use client";

import { useEffect, useState } from "react";

const initialForm = {
  fullName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
  isDefault: false,
};

export default function AddressFormModal({
  open,
  onClose,
  onSubmit,
  initialData = null,
  loading = false,
}) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({
        fullName: initialData.fullName || "",
        phone: initialData.phone || "",
        line1: initialData.line1 || "",
        line2: initialData.line2 || "",
        city: initialData.city || "",
        state: initialData.state || "",
        pincode: initialData.pincode || "",
        country: initialData.country || "India",
        isDefault: Boolean(initialData.isDefault),
      });
    } else {
      setForm(initialForm);
    }
    setErrors({});
  }, [initialData, open]);

  if (!open) return null;

  const validate = () => {
    const nextErrors = {};

    if (!form.fullName.trim()) nextErrors.fullName = "Full name is required";
    if (!/^\d{10}$/.test(form.phone)) nextErrors.phone = "Phone must be 10 digits";
    if (!form.line1.trim()) nextErrors.line1 = "Address Line 1 is required";
    if (!form.city.trim()) nextErrors.city = "City is required";
    if (!form.state.trim()) nextErrors.state = "State is required";
    if (!/^\d{6}$/.test(form.pincode)) nextErrors.pincode = "Pincode must be 6 digits";
    if (!form.country.trim()) nextErrors.country = "Country is required";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>
            {initialData ? "Edit Address" : "Add New Address"}
          </h2>
          <button onClick={onClose} style={styles.closeBtn} disabled={loading}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={styles.grid}>
            <Field
              label="Full Name"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              error={errors.fullName}
            />
            <Field
              label="Phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              error={errors.phone}
            />
          </div>

          <Field
            label="Address Line 1"
            name="line1"
            value={form.line1}
            onChange={handleChange}
            error={errors.line1}
          />

          <Field
            label="Address Line 2"
            name="line2"
            value={form.line2}
            onChange={handleChange}
            error={errors.line2}
          />

          <div style={styles.grid}>
            <Field
              label="City"
              name="city"
              value={form.city}
              onChange={handleChange}
              error={errors.city}
            />
            <Field
              label="State"
              name="state"
              value={form.state}
              onChange={handleChange}
              error={errors.state}
            />
          </div>

          <div style={styles.grid}>
            <Field
              label="Pincode"
              name="pincode"
              value={form.pincode}
              onChange={handleChange}
              error={errors.pincode}
            />
            <Field
              label="Country"
              name="country"
              value={form.country}
              onChange={handleChange}
              error={errors.country}
            />
          </div>

          <label style={styles.checkboxRow}>
            <input
              type="checkbox"
              name="isDefault"
              checked={form.isDefault}
              onChange={handleChange}
            />
            <span>Make this my default address</span>
          </label>

          <div style={styles.footer}>
            <button
              type="button"
              onClick={onClose}
              style={styles.cancelBtn}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" style={styles.saveBtn} disabled={loading}>
              {loading ? "Saving..." : "Save Address"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, name, value, onChange, error }) {
  return (
    <div style={{ marginBottom: "14px" }}>
      <label style={styles.label}>{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        style={{
          ...styles.input,
          border: error ? "1px solid #ff4d4f" : "1px solid #333",
        }}
      />
      {error && <div style={styles.error}>{error}</div>}
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.65)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    padding: "20px",
  },
  modal: {
    width: "100%",
    maxWidth: "760px",
    background: "#0f0f0f",
    border: "1px solid #2a2a2a",
    borderRadius: "16px",
    padding: "22px",
    color: "#fff",
    maxHeight: "90vh",
    overflowY: "auto",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "18px",
  },
  title: {
    margin: 0,
    fontSize: "24px",
  },
  closeBtn: {
    background: "transparent",
    border: "none",
    color: "#fff",
    fontSize: "22px",
    cursor: "pointer",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "14px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    color: "#ddd",
    fontSize: "14px",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "10px",
    background: "#161616",
    color: "#fff",
    outline: "none",
  },
  error: {
    color: "#ff6b6b",
    marginTop: "6px",
    fontSize: "13px",
  },
  checkboxRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#ddd",
    marginTop: "8px",
    marginBottom: "18px",
  },
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "10px",
  },
  cancelBtn: {
    background: "transparent",
    color: "#fff",
    border: "1px solid #444",
    borderRadius: "10px",
    padding: "10px 16px",
    cursor: "pointer",
  },
  saveBtn: {
    background: "#fff",
    color: "#000",
    border: "1px solid #fff",
    borderRadius: "10px",
    padding: "10px 16px",
    cursor: "pointer",
    fontWeight: 700,
  },
};