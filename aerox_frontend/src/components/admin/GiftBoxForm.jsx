"use client";

import { useEffect, useMemo, useState } from "react";
import { uploadGiftBoxImageApi } from "@/features/giftBoxes/giftBoxApi";

export default function GiftBoxForm({
  initialData,
  onSubmit,
  submitting,
  submitText = "Save Gift Box",
}) {
  const [form, setForm] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    priceInr: initialData?.priceInr ?? 149,
    stock: initialData?.stock ?? 0,
    active: initialData?.active ?? true,
    imagePath: initialData?.imagePath || "",
    cloudinaryPublicId: initialData?.cloudinaryPublicId || "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    setForm({
      name: initialData?.name || "",
      description: initialData?.description || "",
      priceInr: initialData?.priceInr ?? 149,
      stock: initialData?.stock ?? 0,
      active: initialData?.active ?? true,
      imagePath: initialData?.imagePath || "",
      cloudinaryPublicId: initialData?.cloudinaryPublicId || "",
    });
  }, [initialData]);

  const previewUrl = useMemo(() => {
    if (selectedFile) {
      return URL.createObjectURL(selectedFile);
    }
    return form.imagePath || "";
  }, [selectedFile, form.imagePath]);

  useEffect(() => {
    return () => {
      if (selectedFile && previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [selectedFile, previewUrl]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "priceInr" || name === "stock"
          ? Number(value)
          : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    setLocalError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    try {
      let payload = { ...form };

      if (selectedFile) {
        setUploading(true);

        const uploaded = await uploadGiftBoxImageApi(selectedFile);

        payload = {
          ...payload,
          imagePath: uploaded.imageUrl,
          cloudinaryPublicId: uploaded.publicId,
        };
      }

      if (!payload.imagePath) {
        setLocalError("Please upload a gift box image.");
        return;
      }

      await onSubmit(payload);
    } catch (error) {
      setLocalError(
        error?.response?.data?.message ||
          error?.message ||
          "Image upload failed"
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm text-black"
    >
      {localError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {localError}
        </div>
      )}

      <div>
        <label
          htmlFor="name"
          className="mb-2 block text-sm font-medium text-black"
        >
          Gift Box Name
        </label>
        <input
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-black placeholder-gray-500 outline-none focus:border-black"
          placeholder="Black Premium Gift Box"
          required
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="mb-2 block text-sm font-medium text-black"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-black placeholder-gray-500 outline-none focus:border-black"
          placeholder="Premium gift box for curated gifting"
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label
            htmlFor="priceInr"
            className="mb-2 block text-sm font-medium text-black"
          >
            Price (INR)
          </label>
          <input
            id="priceInr"
            type="number"
            name="priceInr"
            value={form.priceInr}
            onChange={handleChange}
            min="0"
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-black outline-none focus:border-black"
            required
          />
        </div>

        <div>
          <label
            htmlFor="stock"
            className="mb-2 block text-sm font-medium text-black"
          >
            Stock
          </label>
          <input
            id="stock"
            type="number"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            min="0"
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-black outline-none focus:border-black"
            required
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="giftBoxImage"
          className="mb-2 block text-sm font-medium text-black"
        >
          Gift Box Image
        </label>

        <input
          id="giftBoxImage"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-black file:mr-4 file:rounded-lg file:border-0 file:bg-black file:px-4 file:py-2 file:text-sm file:font-medium file:text-white"
        />

        {previewUrl && (
          <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 p-3">
            <img
              src={previewUrl}
              alt="Gift box preview"
              className="h-48 w-full rounded-xl object-cover"
            />
          </div>
        )}
      </div>

      <label className="flex items-center gap-3 text-sm font-medium text-black">
        <input
          type="checkbox"
          name="active"
          checked={form.active}
          onChange={handleChange}
          className="accent-black"
        />
        Active
      </label>

      <button
        type="submit"
        disabled={submitting || uploading}
        className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {uploading ? "Uploading image..." : submitting ? "Saving..." : submitText}
      </button>
    </form>
  );
}