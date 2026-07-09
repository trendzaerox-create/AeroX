"use client";

export default function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
  busy,
}) {
  return (
    <div style={styles.card}>
      <div style={styles.topRow}>
        <div>
          <div style={styles.nameRow}>
            <h3 style={styles.name}>{address.fullName}</h3>
            {address.isDefault && <span style={styles.badge}>Default</span>}
          </div>
          <p style={styles.phone}>{address.phone}</p>
        </div>
      </div>

      <div style={styles.addressText}>
        {address.line1}
        {address.line2 ? `, ${address.line2}` : ""}
        <br />
        {address.city}, {address.state} - {address.pincode}
        <br />
        {address.country}
      </div>

      <div style={styles.actions}>
        {!address.isDefault && (
          <button
            style={styles.secondaryBtn}
            onClick={() => onSetDefault(address.id)}
            disabled={busy}
          >
            Set as Default
          </button>
        )}

        <button
          style={styles.secondaryBtn}
          onClick={() => onEdit(address)}
          disabled={busy}
        >
          Edit
        </button>

        <button
          style={styles.dangerBtn}
          onClick={() => onDelete(address)}
          disabled={busy}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "#111",
    border: "1px solid #2a2a2a",
    borderRadius: "14px",
    padding: "18px",
    marginBottom: "16px",
  },
  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "12px",
  },
  nameRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
  },
  name: {
    color: "#fff",
    fontSize: "18px",
    fontWeight: 700,
    margin: 0,
  },
  badge: {
    background: "#1f7a1f",
    color: "#fff",
    fontSize: "12px",
    padding: "4px 10px",
    borderRadius: "999px",
    fontWeight: 600,
  },
  phone: {
    color: "#cfcfcf",
    marginTop: "6px",
    marginBottom: 0,
  },
  addressText: {
    color: "#d9d9d9",
    marginTop: "14px",
    lineHeight: 1.7,
    fontSize: "15px",
  },
  actions: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginTop: "18px",
  },
  secondaryBtn: {
    background: "transparent",
    color: "#fff",
    border: "1px solid #444",
    borderRadius: "10px",
    padding: "10px 14px",
    cursor: "pointer",
  },
  dangerBtn: {
    background: "#d60000",
    color: "#fff",
    border: "1px solid #d60000",
    borderRadius: "10px",
    padding: "10px 14px",
    cursor: "pointer",
  },
};