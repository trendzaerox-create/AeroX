"use client";

export default function DeleteProductModal({
  open,
  onClose,
  onConfirm,
  product,
  loading,
}) {
  if (!open || !product) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3 style={styles.title}>Delete Product</h3>
        <p style={styles.text}>
          Are you sure you want to delete <strong>{product.name}</strong>?
        </p>

        <div style={styles.actions}>
          <button onClick={onClose} style={styles.cancelBtn} disabled={loading}>
            Cancel
          </button>
          <button onClick={onConfirm} style={styles.deleteBtn} disabled={loading}>
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
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
    zIndex: 1100,
    padding: "20px",
  },
  modal: {
    width: "100%",
    maxWidth: "420px",
    background: "#111",
    border: "1px solid #2a2a2a",
    borderRadius: "14px",
    padding: "22px",
    color: "#fff",
  },
  title: {
    marginTop: 0,
    marginBottom: "10px",
  },
  text: {
    color: "#d5d5d5",
    lineHeight: 1.6,
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "20px",
  },
  cancelBtn: {
    background: "transparent",
    color: "#fff",
    border: "1px solid #444",
    borderRadius: "10px",
    padding: "10px 16px",
    cursor: "pointer",
  },
  deleteBtn: {
    background: "#d60000",
    color: "#fff",
    border: "1px solid #d60000",
    borderRadius: "10px",
    padding: "10px 16px",
    cursor: "pointer",
  },
};