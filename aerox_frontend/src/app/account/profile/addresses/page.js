"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import AddressFormModal from "@/components/address/AddressFormModal";
import DeleteAddressModal from "@/components/address/DeleteAddressModal";
import {
  clearAddressMessages,
  createAddress,
  deleteAddress,
  fetchAddresses,
  setDefaultAddress,
  updateAddress,
} from "@/features/address/addressSlice";

export default function AddressPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { addresses, loading, submitting, error, successMessage } = useSelector(
    (state) => state.address
  );

  const [formOpen, setFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingAddress, setDeletingAddress] = useState(null);

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  useEffect(() => {
    if (error || successMessage) {
      const timer = setTimeout(() => {
        dispatch(clearAddressMessages());
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [error, successMessage, dispatch]);

  const sortedAddresses = useMemo(() => {
    const copy = [...addresses];
    return copy.sort((a, b) => {
      if (a.isDefault && !b.isDefault) return -1;
      if (!a.isDefault && b.isDefault) return 1;
      return b.id - a.id;
    });
  }, [addresses]);

  const handleOpenAdd = () => {
    setEditingAddress(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (address) => {
    setEditingAddress(address);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    if (submitting) return;
    setFormOpen(false);
    setEditingAddress(null);
  };

  const handleSubmitForm = async (formData) => {
    let result;

    if (editingAddress) {
      result = await dispatch(
        updateAddress({
          id: editingAddress.id,
          data: formData,
        })
      );
    } else {
      result = await dispatch(createAddress(formData));
    }

    if (!result.error) {
      setFormOpen(false);
      setEditingAddress(null);
      dispatch(fetchAddresses());
    }
  };

  const handleAskDelete = (address) => {
    setDeletingAddress(address);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingAddress) return;

    const result = await dispatch(deleteAddress(deletingAddress.id));
    if (!result.error) {
      setDeleteOpen(false);
      setDeletingAddress(null);
      dispatch(fetchAddresses());
    }
  };

  const handleSetDefault = async (id) => {
    const result = await dispatch(setDefaultAddress(id));
    if (!result.error) {
      dispatch(fetchAddresses());
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <div style={styles.topBar}>
          <div>
            <button
              onClick={() => router.push("/account/profile")}
              style={styles.backBtn}
            >
              ← Back to My Account
            </button>
            <h1 style={styles.heading}>My Addresses</h1>
            <p style={styles.subText}>Manage your delivery addresses</p>
          </div>

          <button style={styles.addBtn} onClick={handleOpenAdd}>
            + Add New Address
          </button>
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}
        {successMessage && <div style={styles.successBox}>{successMessage}</div>}

        {loading ? (
          <div style={styles.emptyState}>Loading addresses...</div>
        ) : sortedAddresses.length === 0 ? (
          <div style={styles.emptyState}>
            <h3 style={{ marginTop: 0, color: "#fff" }}>No saved addresses yet</h3>
            <p style={{ color: "#cfcfcf" }}>
              Add your first delivery address to make checkout faster.
            </p>
            <button style={styles.addBtn} onClick={handleOpenAdd}>
              Add Your First Address
            </button>
          </div>
        ) : (
          <div style={styles.cardGrid}>
            {sortedAddresses.map((a) => (
              <div key={a.id} style={styles.card}>
                <div style={styles.cardTop}>
                  <div>
                    <div style={styles.nameRow}>
                      <strong style={styles.name}>{a.fullName}</strong>
                      {a.isDefault && <span style={styles.defaultBadge}>Default</span>}
                    </div>
                    <div style={styles.phone}>{a.phone}</div>
                  </div>
                </div>

                <div style={styles.addressText}>
                  <div>{a.line1}</div>
                  {a.line2 && <div>{a.line2}</div>}
                  <div>
                    {a.city}, {a.state} - {a.pincode}
                  </div>
                  <div>{a.country}</div>
                </div>

                <div style={styles.actions}>
                  {!a.isDefault && (
                    <button
                      onClick={() => handleSetDefault(a.id)}
                      disabled={submitting}
                      style={styles.secondaryBtn}
                    >
                      Set Default
                    </button>
                  )}

                  <button
                    onClick={() => handleOpenEdit(a)}
                    disabled={submitting}
                    style={styles.secondaryBtn}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleAskDelete(a)}
                    disabled={submitting}
                    style={styles.deleteBtn}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AddressFormModal
        open={formOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmitForm}
        initialData={editingAddress}
        loading={submitting}
      />

      <DeleteAddressModal
        open={deleteOpen}
        onClose={() => {
          if (submitting) return;
          setDeleteOpen(false);
          setDeletingAddress(null);
        }}
        onConfirm={handleConfirmDelete}
        address={deletingAddress}
        loading={submitting}
      />
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "#000",
    padding: "40px 20px",
  },
  container: {
    maxWidth: 950,
    margin: "0 auto",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
    flexWrap: "wrap",
    marginBottom: "24px",
  },
  backBtn: {
    background: "transparent",
    border: "none",
    color: "#bbb",
    cursor: "pointer",
    padding: 0,
    marginBottom: "10px",
    fontSize: "14px",
  },
  heading: {
    color: "#fff",
    fontSize: "34px",
    margin: "0 0 8px",
  },
  subText: {
    color: "#bcbcbc",
    margin: 0,
  },
  addBtn: {
    background: "#fff",
    color: "#000",
    border: "1px solid #fff",
    padding: "12px 18px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: 700,
  },
  cardGrid: {
    display: "grid",
    gap: "16px",
  },
  card: {
    background: "#111",
    border: "1px solid #2a2a2a",
    borderRadius: "14px",
    padding: "18px",
  },
  cardTop: {
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
  },
  defaultBadge: {
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
  deleteBtn: {
    background: "#d60000",
    color: "#fff",
    border: "1px solid #d60000",
    borderRadius: "10px",
    padding: "10px 14px",
    cursor: "pointer",
  },
  emptyState: {
    background: "#111",
    border: "1px solid #2a2a2a",
    borderRadius: "16px",
    padding: "28px",
    textAlign: "center",
    color: "#fff",
  },
  errorBox: {
    background: "rgba(214,0,0,0.12)",
    color: "#ff7b7b",
    border: "1px solid rgba(214,0,0,0.35)",
    borderRadius: "10px",
    padding: "12px 14px",
    marginBottom: "16px",
  },
  successBox: {
    background: "rgba(31,122,31,0.14)",
    color: "#8be28b",
    border: "1px solid rgba(31,122,31,0.35)",
    borderRadius: "10px",
    padding: "12px 14px",
    marginBottom: "16px",
  },
};