"use client";

import { useEffect, useMemo, useState } from "react";

import getImageUrl, { PLACEHOLDER_IMAGE } from "@/lib/getImageUrl";
import {
  getAdminProduct,
  getApiErrorMessage,
  linkProductColorVariant,
  removeProductColorVariant,
  searchProductVariantCandidates,
  updateProductColorVariant,
} from "@/lib/productVariantApi";

function text(value) {
  return value === null || value === undefined ? "" : String(value);
}

function categoryIdOf(product) {
  const value = product?.categoryId ?? product?.category?.id;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function isValidHex(value) {
  return /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(
    text(value).trim(),
  );
}

function getVariantImage(variant) {
  return getImageUrl(variant, { card: true });
}

export default function ColorVariantManager({ product, onProductChange }) {
  const productId = Number(product?.id);
  const currentCategoryId = categoryIdOf(product);

  const [colorName, setColorName] = useState("");
  const [colorHex, setColorHex] = useState("#111111");
  const [variantDisplayOrder, setVariantDisplayOrder] = useState("0");

  const [query, setQuery] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedColorName, setSelectedColorName] = useState("");
  const [selectedColorHex, setSelectedColorHex] = useState("#FFFFFF");

  const [searching, setSearching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const groupCode = text(product?.variantGroupCode).trim();
  const variants = Array.isArray(product?.colorVariants)
    ? product.colorVariants
    : [];

  useEffect(() => {
    setColorName(text(product?.colorName));
    setColorHex(text(product?.colorHex) || "#111111");
    setVariantDisplayOrder(
      product?.variantDisplayOrder === null ||
        product?.variantDisplayOrder === undefined
        ? "0"
        : String(product.variantDisplayOrder),
    );
  }, [
    product?.id,
    product?.colorName,
    product?.colorHex,
    product?.variantDisplayOrder,
  ]);

  const sortedVariants = useMemo(() => {
    return [...variants].sort((a, b) => {
      const orderA = Number(a?.variantDisplayOrder ?? 0);
      const orderB = Number(b?.variantDisplayOrder ?? 0);

      if (orderA !== orderB) return orderA - orderB;
      return Number(a?.id ?? 0) - Number(b?.id ?? 0);
    });
  }, [variants]);

  const compatibleCandidates = useMemo(() => {
    return candidates.filter(
      (candidate) =>
        Number(candidate.id) !== productId &&
        categoryIdOf(candidate) === currentCategoryId,
    );
  }, [candidates, currentCategoryId, productId]);

  const emitUpdatedProduct = async (responseProduct) => {
    let nextProduct = responseProduct;

    if (!nextProduct?.id) {
      nextProduct = await getAdminProduct(productId);
    }

    onProductChange?.(nextProduct);
    return nextProduct;
  };

  const resetStatus = () => {
    setMessage("");
    setError("");
  };

  const handleSearch = async () => {
    resetStatus();
    setSearching(true);

    try {
      const results = await searchProductVariantCandidates({
        query,
        excludeProductId: productId,
      });

      setCandidates(results);

      if (results.length === 0) {
        setMessage("No matching active products found.");
      }
    } catch (searchError) {
      setCandidates([]);
      setError(
        getApiErrorMessage(searchError, "Unable to search existing products"),
      );
    } finally {
      setSearching(false);
    }
  };

  const selectCandidate = (candidate) => {
    resetStatus();
    setSelectedCandidate(candidate);
    setSelectedColorName(text(candidate.colorName));
    setSelectedColorHex(text(candidate.colorHex) || "#FFFFFF");
  };

  const validateCurrentMetadata = () => {
    if (!colorName.trim()) {
      return "Enter this product's colour name";
    }

    if (!isValidHex(colorHex)) {
      return "Enter a valid colour hex, for example #111111";
    }

    if (variantDisplayOrder !== "" && Number(variantDisplayOrder) < 0) {
      return "Variant display order cannot be negative";
    }

    return null;
  };

  const handleSaveMetadata = async () => {
    resetStatus();

    if (!groupCode) {
      setError("Link this product to another product before saving group metadata.");
      return;
    }

    const validationError = validateCurrentMetadata();

    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);

    try {
      const updated = await updateProductColorVariant(productId, {
        variantGroupCode: groupCode,
        colorName: colorName.trim(),
        colorHex: colorHex.trim().toUpperCase(),
        variantDisplayOrder:
          variantDisplayOrder === "" ? 0 : Number(variantDisplayOrder),
      });

      await emitUpdatedProduct(updated);
      setMessage("Colour details updated.");
    } catch (saveError) {
      setError(getApiErrorMessage(saveError, "Unable to update colour details"));
    } finally {
      setSaving(false);
    }
  };

  const handleLink = async () => {
    resetStatus();

    if (!selectedCandidate?.id) {
      setError("Select an existing product to link");
      return;
    }

    const validationError = validateCurrentMetadata();

    if (validationError) {
      setError(validationError);
      return;
    }

    if (!selectedColorName.trim()) {
      setError("Enter the selected product's colour name");
      return;
    }

    if (!isValidHex(selectedColorHex)) {
      setError("Enter a valid selected product colour hex");
      return;
    }

    if (colorName.trim().toLowerCase() === selectedColorName.trim().toLowerCase()) {
      setError("Both products cannot use the same colour name");
      return;
    }

    const selectedGroup = text(selectedCandidate.variantGroupCode).trim();

    if (groupCode && selectedGroup && groupCode !== selectedGroup) {
      setError(
        "The selected product already belongs to another group. Remove it from that group first.",
      );
      return;
    }

    if (groupCode && selectedGroup === groupCode) {
      setError("The selected product is already in this colour group.");
      return;
    }

    setSaving(true);

    try {
      const updated = await linkProductColorVariant(productId, {
        groupWithProductId: Number(selectedCandidate.id),
        colorName: colorName.trim(),
        colorHex: colorHex.trim().toUpperCase(),
        variantDisplayOrder:
          variantDisplayOrder === ""
            ? null
            : Number(variantDisplayOrder),
        existingProductColorName: selectedColorName.trim(),
        existingProductColorHex: selectedColorHex.trim().toUpperCase(),
      });

      await emitUpdatedProduct(updated);
      setSelectedCandidate(null);
      setCandidates([]);
      setQuery("");
      setMessage("Products linked in the same colour group.");
    } catch (linkError) {
      setError(getApiErrorMessage(linkError, "Unable to link colour variants"));
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async () => {
    resetStatus();

    const confirmed = window.confirm(
      "Remove this product from its colour group?\n\nThe product will not be deleted or archived.",
    );

    if (!confirmed) return;

    setSaving(true);

    try {
      const updated = await removeProductColorVariant(productId);
      await emitUpdatedProduct(updated);
      setCandidates([]);
      setSelectedCandidate(null);
      setMessage("Product removed from the colour group.");
    } catch (removeError) {
      setError(
        getApiErrorMessage(removeError, "Unable to remove the colour group"),
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <section
      id="colour-variants"
      style={{
        border: "1px solid #d0d5dd",
        borderRadius: "16px",
        background: "#f8fafc",
        padding: "20px",
        display: "grid",
        gap: "18px",
        scrollMarginTop: "24px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <p
            style={{
              margin: 0,
              color: "#667085",
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: ".06em",
              textTransform: "uppercase",
            }}
          >
            Separate product / SKU per colour
          </p>
          <h2
            style={{
              margin: "6px 0 0",
              color: "#101828",
              fontSize: 22,
              fontWeight: 900,
            }}
          >
            Colour Variant Management
          </h2>
          <p
            style={{
              margin: "6px 0 0",
              color: "#667085",
              fontSize: 13,
              lineHeight: 1.5,
            }}
          >
            Link products that are the same model but use different colours.
            Price, stock, images, cart and orders remain independent.
          </p>
        </div>

        <span
          style={{
            padding: "8px 12px",
            borderRadius: 999,
            background: groupCode ? "#ecfdf3" : "#f2f4f7",
            color: groupCode ? "#027a48" : "#475467",
            fontSize: 12,
            fontWeight: 800,
            maxWidth: "100%",
            overflowWrap: "anywhere",
          }}
        >
          {groupCode ? `Group: ${groupCode}` : "Not grouped"}
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
          gap: "14px",
        }}
      >
        <div>
          <label style={styles.label}>This product colour name</label>
          <input
            value={colorName}
            onChange={(event) => setColorName(event.target.value)}
            placeholder="Example: Black"
            style={styles.input}
          />
        </div>

        <div>
          <label style={styles.label}>This product colour</label>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "56px minmax(0, 1fr)",
              gap: "10px",
            }}
          >
            <input
              type="color"
              value={/^#[0-9a-fA-F]{6}$/.test(colorHex) ? colorHex : "#111111"}
              onChange={(event) => setColorHex(event.target.value.toUpperCase())}
              style={styles.colorInput}
            />
            <input
              value={colorHex}
              onChange={(event) => setColorHex(event.target.value)}
              placeholder="#111111"
              style={styles.input}
            />
          </div>
        </div>

        <div>
          <label style={styles.label}>Variant display order</label>
          <input
            type="number"
            min="0"
            value={variantDisplayOrder}
            onChange={(event) => setVariantDisplayOrder(event.target.value)}
            style={styles.input}
          />
        </div>
      </div>

      {groupCode && (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={handleSaveMetadata}
            disabled={saving}
            style={{ ...styles.primaryButton, opacity: saving ? 0.65 : 1 }}
          >
            Save Colour Details
          </button>
          <button
            type="button"
            onClick={handleRemove}
            disabled={saving}
            style={{ ...styles.dangerButton, opacity: saving ? 0.65 : 1 }}
          >
            Remove From Group
          </button>
        </div>
      )}

      {sortedVariants.length > 0 && (
        <div>
          <h3 style={styles.subheading}>Current group products</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
              gap: 12,
            }}
          >
            {sortedVariants.map((variant) => {
              const isCurrent = Number(variant.id) === productId;

              return (
                <div
                  key={variant.id}
                  style={{
                    border: isCurrent
                      ? "2px solid #2563eb"
                      : "1px solid #e4e7ec",
                    borderRadius: 12,
                    background: "#ffffff",
                    padding: 10,
                    display: "grid",
                    gridTemplateColumns: "64px minmax(0, 1fr)",
                    gap: 12,
                  }}
                >
                  <img
                    src={getVariantImage(variant)}
                    alt={variant.title || variant.colorName || "Variant"}
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = PLACEHOLDER_IMAGE;
                    }}
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 10,
                      objectFit: "cover",
                      background: "#f2f4f7",
                    }}
                  />
                  <div style={{ minWidth: 0 }}>
                    <strong
                      style={{
                        display: "block",
                        color: "#101828",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {variant.colorName || "Unnamed colour"}
                    </strong>
                    <span
                      style={{
                        display: "block",
                        marginTop: 4,
                        color: "#667085",
                        fontSize: 12,
                      }}
                    >
                      #{variant.id} • Order {variant.variantDisplayOrder ?? 0}
                    </span>
                    <span
                      style={{
                        display: "block",
                        marginTop: 4,
                        color: variant.stock > 0 ? "#027a48" : "#b42318",
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      ₹{Number(variant.priceInr || 0).toLocaleString("en-IN")} •
                      Stock {variant.stock ?? 0}
                    </span>
                    {isCurrent && (
                      <span
                        style={{
                          display: "inline-block",
                          marginTop: 6,
                          padding: "3px 7px",
                          borderRadius: 999,
                          background: "#eff6ff",
                          color: "#175cd3",
                          fontSize: 11,
                          fontWeight: 800,
                        }}
                      >
                        Current product
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div
        style={{
          borderTop: "1px solid #e4e7ec",
          paddingTop: 18,
          display: "grid",
          gap: 14,
        }}
      >
        <div>
          <h3 style={styles.subheading}>
            {groupCode
              ? "Add another existing product to this group"
              : "Create or join a colour group"}
          </h3>
          <p style={styles.note}>
            Search for the other colour product. Both products must use the same
            category.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) auto",
            gap: 10,
          }}
        >
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleSearch();
              }
            }}
            placeholder="Search product title"
            style={styles.input}
          />
          <button
            type="button"
            onClick={handleSearch}
            disabled={searching}
            style={{ ...styles.secondaryButton, opacity: searching ? 0.65 : 1 }}
          >
            {searching ? "Searching..." : "Search"}
          </button>
        </div>

        {compatibleCandidates.length > 0 && (
          <div style={{ display: "grid", gap: 10 }}>
            {compatibleCandidates.map((candidate) => {
              const selected =
                Number(selectedCandidate?.id) === Number(candidate.id);
              const candidateGroup = text(candidate.variantGroupCode).trim();
              const differentGroup =
                groupCode && candidateGroup && candidateGroup !== groupCode;
              const alreadyInGroup =
                groupCode && candidateGroup && candidateGroup === groupCode;
              const disabled = Boolean(differentGroup || alreadyInGroup);

              return (
                <button
                  key={candidate.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => selectCandidate(candidate)}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "64px minmax(0, 1fr) auto",
                    gap: 12,
                    alignItems: "center",
                    textAlign: "left",
                    width: "100%",
                    padding: 10,
                    border: selected
                      ? "2px solid #2563eb"
                      : "1px solid #d0d5dd",
                    borderRadius: 12,
                    background: selected ? "#eff6ff" : "#ffffff",
                    opacity: disabled ? 0.55 : 1,
                    cursor: disabled ? "not-allowed" : "pointer",
                  }}
                >
                  <img
                    src={getImageUrl(candidate, { card: true })}
                    alt={candidate.title || "Product"}
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = PLACEHOLDER_IMAGE;
                    }}
                    style={{
                      width: 64,
                      height: 64,
                      objectFit: "cover",
                      borderRadius: 10,
                      background: "#f2f4f7",
                    }}
                  />
                  <span style={{ minWidth: 0 }}>
                    <strong
                      style={{
                        display: "block",
                        color: "#101828",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      #{candidate.id} {candidate.title}
                    </strong>
                    <span
                      style={{
                        display: "block",
                        marginTop: 4,
                        color: "#667085",
                        fontSize: 12,
                      }}
                    >
                      {candidate.colorName || "Colour not assigned"}
                      {differentGroup
                        ? " • Belongs to another group"
                        : alreadyInGroup
                          ? " • Already in this group"
                          : candidateGroup
                            ? ` • Group ${candidateGroup}`
                            : " • Not grouped"}
                    </span>
                  </span>
                  <span
                    style={{
                      padding: "6px 10px",
                      borderRadius: 999,
                      background: selected ? "#2563eb" : "#f2f4f7",
                      color: selected ? "#ffffff" : "#344054",
                      fontSize: 12,
                      fontWeight: 800,
                    }}
                  >
                    {selected ? "Selected" : disabled ? "Unavailable" : "Select"}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {selectedCandidate && (
          <div
            style={{
              border: "1px solid #d0d5dd",
              borderRadius: 12,
              background: "#ffffff",
              padding: 14,
              display: "grid",
              gap: 14,
            }}
          >
            <strong style={{ color: "#101828" }}>
              Selected: #{selectedCandidate.id} {selectedCandidate.title}
            </strong>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
                gap: 14,
              }}
            >
              <div>
                <label style={styles.label}>Selected product colour name</label>
                <input
                  value={selectedColorName}
                  onChange={(event) => setSelectedColorName(event.target.value)}
                  placeholder="Example: White"
                  style={styles.input}
                />
              </div>
              <div>
                <label style={styles.label}>Selected product colour hex</label>
                <input
                  value={selectedColorHex}
                  onChange={(event) => setSelectedColorHex(event.target.value)}
                  placeholder="#FFFFFF"
                  style={styles.input}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleLink}
              disabled={saving}
              style={{
                ...styles.primaryButton,
                justifySelf: "start",
                opacity: saving ? 0.65 : 1,
              }}
            >
              {saving ? "Saving..." : "Link Colour Products"}
            </button>
          </div>
        )}
      </div>

      {message && (
        <div style={styles.successMessage} role="status">
          {message}
        </div>
      )}
      {error && (
        <div style={styles.errorMessage} role="alert">
          {error}
        </div>
      )}
    </section>
  );
}

const styles = {
  label: {
    display: "block",
    marginBottom: 7,
    color: "#344054",
    fontSize: 13,
    fontWeight: 700,
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 14px",
    border: "1px solid #d0d5dd",
    borderRadius: 10,
    background: "#ffffff",
    color: "#101828",
    fontSize: 14,
    outline: "none",
  },
  colorInput: {
    width: 56,
    height: 46,
    padding: 3,
    border: "1px solid #d0d5dd",
    borderRadius: 10,
    background: "#ffffff",
  },
  subheading: {
    margin: 0,
    color: "#101828",
    fontSize: 16,
    fontWeight: 800,
  },
  note: {
    margin: "5px 0 0",
    color: "#667085",
    fontSize: 12,
    lineHeight: 1.5,
  },
  primaryButton: {
    border: "none",
    borderRadius: 10,
    padding: "11px 16px",
    background: "#2563eb",
    color: "#ffffff",
    fontWeight: 800,
    cursor: "pointer",
  },
  secondaryButton: {
    border: "none",
    borderRadius: 10,
    padding: "11px 16px",
    background: "#111827",
    color: "#ffffff",
    fontWeight: 800,
    cursor: "pointer",
  },
  dangerButton: {
    border: "1px solid #fda29b",
    borderRadius: 10,
    padding: "11px 16px",
    background: "#ffffff",
    color: "#b42318",
    fontWeight: 800,
    cursor: "pointer",
  },
  successMessage: {
    border: "1px solid #abefc6",
    borderRadius: 10,
    padding: "10px 12px",
    background: "#ecfdf3",
    color: "#027a48",
    fontSize: 13,
    fontWeight: 700,
  },
  errorMessage: {
    border: "1px solid #fecdca",
    borderRadius: 10,
    padding: "10px 12px",
    background: "#fef3f2",
    color: "#b42318",
    fontSize: 13,
    fontWeight: 700,
  },
};
