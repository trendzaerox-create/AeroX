"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadHeroImageApi } from "@/features/heroSections/heroSectionApi";
import { fetchProducts } from "@/features/products/productSlice";

export default function HeroSectionForm({
  initialData = null,
  onSubmit,
  submitLabel = "Save Hero Section",
}) {
  const dispatch = useDispatch();

  const { items: products = [], loading } = useSelector(
    (state) => state.products || {}
  );

  const [form, setForm] = useState({
    title: "",
    description: "",
    imageUrl: "",
    cloudinaryPublicId: "",
    productId: "",
    sortOrder: 0,
    active: true,
  });

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData?.title || "",
        description: initialData?.description || "",
        imageUrl: initialData?.imageUrl || "",
        cloudinaryPublicId: initialData?.cloudinaryPublicId || "",
        productId: initialData?.productId ? String(initialData.productId) : "",
        sortOrder: initialData?.sortOrder ?? 0,
        active: initialData?.active ?? true,
      });
    }
  }, [initialData]);

  const getProductTitle = (product) => {
    return product?.title || product?.name || "Untitled Product";
  };








  const limitWords = (text, wordLimit = 14) => {
  const words = String(text || "").trim().split(/\s+/);

  if (words.length <= wordLimit) {
    return text;
  }

  return `${words.slice(0, wordLimit).join(" ")}...`;
};

const getProductOptionLabel = (product) => {
  return `#${product.id} - ${limitWords(getProductTitle(product), 14)}`;
};


  const selectedProduct = products.find(
    (product) => String(product.id) === String(form.productId)
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setLocalError("");

      const res = await uploadHeroImageApi(file);

      setForm((prev) => ({
        ...prev,
        imageUrl: res?.imageUrl || "",
        cloudinaryPublicId: res?.publicId || "",
      }));
    } catch (error) {
      setLocalError(error?.response?.data?.message || "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      setLocalError("Title is required");
      return;
    }

    if (!form.imageUrl.trim()) {
      setLocalError("Hero image is required");
      return;
    }

    if (!form.productId) {
      setLocalError("Please select a linked product");
      return;
    }

    try {
      setSubmitting(true);
      setLocalError("");

      await onSubmit({
        title: form.title.trim(),
        description: form.description.trim(),
        imageUrl: form.imageUrl.trim(),
        cloudinaryPublicId: form.cloudinaryPublicId?.trim() || "",
        productId: Number(form.productId),
        sortOrder: Number(form.sortOrder) || 0,
        active: Boolean(form.active),
      });
    } catch (error) {
      setLocalError(error?.message || "Failed to save hero section");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm"
    >
      {/* Header */}
      <div className="border-b border-gray-100 px-6 py-5 sm:px-8">
        <h2 className="text-lg font-semibold text-gray-900">
          Hero Section Details
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Fill in the details below to create or update your homepage hero
          banner.
        </p>
      </div>

      <div className="space-y-8 px-6 py-6 sm:px-8">
        {localError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {localError}
          </div>
        ) : null}

        {/* Hero Title - full row */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-800">
            Hero Title
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Enter hero title"
            className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-black focus:ring-4 focus:ring-gray-100"
          />
        </div>

        {/* Linked Product - full row */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-800">
            Linked Product
          </label>

          <select
            name="productId"
            value={form.productId}
            onChange={handleChange}
            className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-black focus:ring-4 focus:ring-gray-100"
          >
            <option value="">Select product</option>

            {products.map((product) => (
              <option
                key={product.id}
                value={product.id}
                title={`#${product.id} - ${getProductTitle(product)}`}
              >
                {getProductOptionLabel(product)}
              </option>
            ))}
          </select>

          {loading ? (
            <p className="text-xs font-medium text-gray-500">
              Loading products...
            </p>
          ) : selectedProduct ? (
            <p className="max-w-full truncate text-xs text-gray-500">
              Selected: #{selectedProduct.id} - {getProductTitle(selectedProduct)}
            </p>
          ) : (
            <p className="text-xs text-gray-500">
              Select the product that should open when customer clicks this hero
              banner.
            </p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-800">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={5}
            placeholder="Enter hero description"
            className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-black focus:ring-4 focus:ring-gray-100"
          />
        </div>

        {/* Upload and Sort */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-800">
              Upload Hero Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 file:mr-4 file:rounded-full file:border-0 file:bg-black file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-gray-800"
            />

            {uploading ? (
              <p className="text-xs font-medium text-gray-500">
                Uploading image...
              </p>
            ) : (
              <p className="text-xs text-gray-500">
                Upload a clean, high-quality hero image for the homepage banner.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-800">
              Sort Order
            </label>
            <input
              type="number"
              name="sortOrder"
              min="0"
              value={form.sortOrder}
              onChange={handleChange}
              className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-black focus:ring-4 focus:ring-gray-100"
            />
            <p className="text-xs text-gray-500">
              Lower numbers appear first on the homepage.
            </p>
          </div>
        </div>

        {/* Preview */}
        {form.imageUrl ? (
          <div className="overflow-hidden rounded-[24px] border border-gray-200 bg-gray-50">
            <div className="border-b border-gray-200 px-4 py-3">
              <h3 className="text-sm font-semibold text-gray-800">
                Image Preview
              </h3>
            </div>
            <img
              src={form.imageUrl}
              alt="Hero preview"
              className="h-72 w-full object-cover"
            />
          </div>
        ) : null}

        {/* Active */}
        <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4">
          <label className="flex items-center gap-3">
            <input
              id="active"
              type="checkbox"
              name="active"
              checked={form.active}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
            />
            <div>
              <p className="text-sm font-semibold text-gray-800">
                Active Hero Section
              </p>
              <p className="text-xs text-gray-500">
                Enable this banner to make it available for homepage display.
              </p>
            </div>
          </label>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={uploading || submitting}
            className="inline-flex min-w-[180px] items-center justify-center rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Saving..." : submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}



