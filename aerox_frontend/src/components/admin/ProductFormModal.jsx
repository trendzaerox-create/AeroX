"use client";

import { useEffect, useState } from "react";

const initialForm = {
  name: "",
  description: "",
  price: "",
  stock: "",
  sku: "",
  brand: "",
  categoryId: "",
  thumbnailUrl: "",
  active: true,
};

export default function ProductFormModal({
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
        name: initialData.name || "",
        description: initialData.description || "",
        price: initialData.price ?? "",
        stock: initialData.stock ?? "",
        sku: initialData.sku || "",
        brand: initialData.brand || "",
        categoryId: initialData.categoryId ?? "",
        thumbnailUrl: initialData.thumbnailUrl || "",
        active: initialData.active ?? true,
      });
    } else {
      setForm(initialForm);
    }
    setErrors({});
  }, [initialData, open]);

  if (!open) return null;

  const validate = () => {
    const nextErrors = {};

    if (!form.name.trim()) nextErrors.name = "Product name is required";
    if (form.price === "" || Number(form.price) < 0) nextErrors.price = "Valid price required";
    if (form.stock === "" || Number(form.stock) < 0) nextErrors.stock = "Valid stock required";
    if (!form.sku.trim()) nextErrors.sku = "SKU is required";

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

    onSubmit({
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      categoryId: form.categoryId ? Number(form.categoryId) : null,
    });
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>
            {initialData ? "Edit Product" : "Add Product"}
          </h2>
          <button onClick={onClose} style={styles.closeBtn} disabled={loading}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={styles.grid}>
            <Field label="Product Name" name="name" value={form.name} onChange={handleChange} error={errors.name} />
            <Field label="SKU" name="sku" value={form.sku} onChange={handleChange} error={errors.sku} />
          </div>

          <Field label="Description" name="description" value={form.description} onChange={handleChange} error={errors.description} />

          <div style={styles.grid}>
            <Field label="Price" name="price" value={form.price} onChange={handleChange} error={errors.price} />
            <Field label="Stock" name="stock" value={form.stock} onChange={handleChange} error={errors.stock} />
          </div>

          <div style={styles.grid}>
            <Field label="Brand" name="brand" value={form.brand} onChange={handleChange} error={errors.brand} />
            <Field label="Category ID" name="categoryId" value={form.categoryId} onChange={handleChange} error={errors.categoryId} />
          </div>

          <Field
            label="Thumbnail URL"
            name="thumbnailUrl"
            value={form.thumbnailUrl}
            onChange={handleChange}
            error={errors.thumbnailUrl}
          />

          <label style={styles.checkboxRow}>
            <input
              type="checkbox"
              name="active"
              checked={form.active}
              onChange={handleChange}
            />
            <span>Active product</span>
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
              {loading ? "Saving..." : "Save Product"}
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
    maxWidth: "860px",
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