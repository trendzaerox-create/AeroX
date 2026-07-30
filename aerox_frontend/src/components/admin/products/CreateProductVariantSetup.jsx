"use client";

import { useEffect, useMemo, useState } from "react";

import getImageUrl, { PLACEHOLDER_IMAGE } from "@/lib/getImageUrl";
import {
  getApiErrorMessage,
  searchProductVariantCandidates,
} from "@/lib/productVariantApi";

export const EMPTY_CREATE_VARIANT_SETUP = {
  enabled: false,
  selectedProduct: null,
  colorName: "",
  colorHex: "#111111",
  variantDisplayOrder: "",
  existingProductColorName: "",
  existingProductColorHex: "#FFFFFF",
};

function normaliseCategoryId(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function getCandidateCategoryId(candidate) {
  return normaliseCategoryId(
    candidate?.categoryId ?? candidate?.category?.id ?? null,
  );
}

export function validateCreateVariantSetup(setup, categoryId) {
  if (!setup?.enabled) {
    return null;
  }

  const selected = setup.selectedProduct;

  if (!selected?.id) {
    return "Select the existing product that belongs to this colour family";
  }

  const currentCategoryId = normaliseCategoryId(categoryId);
  const selectedCategoryId = getCandidateCategoryId(selected);

  if (
    currentCategoryId &&
    selectedCategoryId &&
    currentCategoryId !== selectedCategoryId
  ) {
    return "Colour variants must use products from the same category";
  }

  if (!String(setup.colorName || "").trim()) {
    return "Enter the new product colour name";
  }

  if (!/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(
    String(setup.colorHex || "").trim(),
  )) {
    return "Enter a valid new product colour hex, for example #111111";
  }

  if (!String(selected.colorName || setup.existingProductColorName || "").trim()) {
    return "Enter the selected existing product colour name";
  }

  const selectedHex = String(
    selected.colorHex || setup.existingProductColorHex || "",
  ).trim();

  if (!/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(selectedHex)) {
    return "Enter a valid selected product colour hex";
  }

  if (
    String(setup.colorName).trim().toLowerCase() ===
    String(selected.colorName || setup.existingProductColorName)
      .trim()
      .toLowerCase()
  ) {
    return "The two products cannot use the same colour name";
  }

  if (
    setup.variantDisplayOrder !== "" &&
    Number(setup.variantDisplayOrder) < 0
  ) {
    return "Variant display order cannot be negative";
  }

  return null;
}

export function createVariantLinkPayload(setup) {
  const selected = setup.selectedProduct;

  return {
    groupWithProductId: Number(selected.id),
    colorName: String(setup.colorName || "").trim(),
    colorHex: String(setup.colorHex || "").trim().toUpperCase(),
    variantDisplayOrder:
      setup.variantDisplayOrder === ""
        ? null
        : Number(setup.variantDisplayOrder),
    existingProductColorName: String(
      selected.colorName || setup.existingProductColorName || "",
    ).trim(),
    existingProductColorHex: String(
      selected.colorHex || setup.existingProductColorHex || "",
    )
      .trim()
      .toUpperCase(),
  };
}

export default function CreateProductVariantSetup({
  categoryId,
  value,
  onChange,
  inputStyle,
  labelStyle,
}) {
  const setup = value || EMPTY_CREATE_VARIANT_SETUP;
  const [query, setQuery] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  const selectedCategoryId = normaliseCategoryId(categoryId);

  const updateSetup = (patch) => {
    onChange({ ...setup, ...patch });
  };

  useEffect(() => {
    const candidateCategoryId = getCandidateCategoryId(setup.selectedProduct);

    if (
      selectedCategoryId &&
      candidateCategoryId &&
      selectedCategoryId !== candidateCategoryId
    ) {
      updateSetup({
        selectedProduct: null,
        existingProductColorName: "",
        existingProductColorHex: "#FFFFFF",
      });
    }
    // Only react to category changes; updateSetup intentionally uses current setup.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategoryId]);

  const compatibleCandidates = useMemo(() => {
    if (!selectedCategoryId) {
      return candidates;
    }

    return candidates.filter(
      (candidate) => getCandidateCategoryId(candidate) === selectedCategoryId,
    );
  }, [candidates, selectedCategoryId]);

  const handleSearch = async () => {
    if (!selectedCategoryId) {
      setSearchError("Select the category first");
      return;
    }

    setSearching(true);
    setSearchError("");

    try {
      const results = await searchProductVariantCandidates({ query });
      setCandidates(results);

      if (results.length === 0) {
        setSearchError("No matching active products found");
      }
    } catch (error) {
      setCandidates([]);
      setSearchError(
        getApiErrorMessage(error, "Unable to search existing products"),
      );
    } finally {
      setSearching(false);
    }
  };

  const selectCandidate = (candidate) => {
    updateSetup({
      selectedProduct: candidate,
      existingProductColorName: candidate.colorName || "",
      existingProductColorHex: candidate.colorHex || "#FFFFFF",
    });
  };

  return (
    <section
      style={{
        border: "1px solid #d0d5dd",
        borderRadius: "14px",
        padding: "18px",
        background: "#f8fafc",
        display: "grid",
        gap: "16px",
      }}
    >
      <div>
        <h2
          style={{
            margin: 0,
            color: "#101828",
            fontSize: "20px",
            fontWeight: 800,
          }}
        >
          Colour Variant Setup
        </h2>
        <p
          style={{
            margin: "6px 0 0",
            color: "#667085",
            fontSize: "13px",
            lineHeight: 1.5,
          }}
        >
          Each colour is created as its own product. Enable this to link the new
          product to an existing colour product immediately after creation.
        </p>
      </div>

      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          color: "#111827",
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        <input
          type="checkbox"
          checked={Boolean(setup.enabled)}
          onChange={(event) =>
            updateSetup({
              enabled: event.target.checked,
              selectedProduct: event.target.checked
                ? setup.selectedProduct
                : null,
            })
          }
        />
        Link this product to an existing colour family
      </label>

      {setup.enabled && (
        <>
          <div>
            <label style={labelStyle}>Search existing product</label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) auto",
                gap: "10px",
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
                placeholder="Search by product title"
                style={inputStyle}
              />
              <button
                type="button"
                onClick={handleSearch}
                disabled={searching || !selectedCategoryId}
                style={{
                  padding: "12px 18px",
                  border: "none",
                  borderRadius: "10px",
                  background:
                    searching || !selectedCategoryId ? "#98a2b3" : "#111827",
                  color: "#ffffff",
                  fontWeight: 700,
                  cursor:
                    searching || !selectedCategoryId
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                {searching ? "Searching..." : "Search"}
              </button>
            </div>
            {!selectedCategoryId && (
              <p style={{ margin: "6px 0 0", color: "#b42318", fontSize: 12 }}>
                Select the new product category before searching.
              </p>
            )}
            {searchError && (
              <p style={{ margin: "6px 0 0", color: "#b42318", fontSize: 12 }}>
                {searchError}
              </p>
            )}
          </div>

          {compatibleCandidates.length > 0 && (
            <div style={{ display: "grid", gap: "10px" }}>
              {compatibleCandidates.map((candidate) => {
                const selected =
                  Number(setup.selectedProduct?.id) === Number(candidate.id);

                return (
                  <button
                    key={candidate.id}
                    type="button"
                    onClick={() => selectCandidate(candidate)}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "64px minmax(0, 1fr) auto",
                      gap: "12px",
                      alignItems: "center",
                      textAlign: "left",
                      width: "100%",
                      padding: "10px",
                      border: selected
                        ? "2px solid #2563eb"
                        : "1px solid #d0d5dd",
                      borderRadius: "12px",
                      background: selected ? "#eff6ff" : "#ffffff",
                      cursor: "pointer",
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
                        borderRadius: "10px",
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
                        {candidate.variantGroupCode
                          ? ` • Group ${candidate.variantGroupCode}`
                          : " • Not grouped yet"}
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
                      {selected ? "Selected" : "Select"}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {setup.selectedProduct && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
                gap: "14px",
                borderTop: "1px solid #e4e7ec",
                paddingTop: "16px",
              }}
            >
              <div>
                <label style={labelStyle}>New product colour name</label>
                <input
                  value={setup.colorName}
                  onChange={(event) =>
                    updateSetup({ colorName: event.target.value })
                  }
                  placeholder="Example: Pink"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>New product colour</label>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "56px minmax(0, 1fr)",
                    gap: "10px",
                  }}
                >
                  <input
                    type="color"
                    value={/^#[0-9a-fA-F]{6}$/.test(setup.colorHex)
                      ? setup.colorHex
                      : "#111111"}
                    onChange={(event) =>
                      updateSetup({ colorHex: event.target.value.toUpperCase() })
                    }
                    style={{
                      width: "56px",
                      height: "46px",
                      padding: "3px",
                      border: "1px solid #d1d5db",
                      borderRadius: "10px",
                      background: "#ffffff",
                    }}
                  />
                  <input
                    value={setup.colorHex}
                    onChange={(event) =>
                      updateSetup({ colorHex: event.target.value })
                    }
                    placeholder="#F4A6B8"
                    style={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Variant display order</label>
                <input
                  type="number"
                  min="0"
                  value={setup.variantDisplayOrder}
                  onChange={(event) =>
                    updateSetup({ variantDisplayOrder: event.target.value })
                  }
                  placeholder="Automatic"
                  style={inputStyle}
                />
              </div>

              {!setup.selectedProduct.colorName && (
                <div>
                  <label style={labelStyle}>Selected product colour name</label>
                  <input
                    value={setup.existingProductColorName}
                    onChange={(event) =>
                      updateSetup({
                        existingProductColorName: event.target.value,
                      })
                    }
                    placeholder="Example: Black"
                    style={inputStyle}
                  />
                </div>
              )}

              {!setup.selectedProduct.colorHex && (
                <div>
                  <label style={labelStyle}>Selected product colour hex</label>
                  <input
                    value={setup.existingProductColorHex}
                    onChange={(event) =>
                      updateSetup({ existingProductColorHex: event.target.value })
                    }
                    placeholder="#111111"
                    style={inputStyle}
                  />
                </div>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
}
