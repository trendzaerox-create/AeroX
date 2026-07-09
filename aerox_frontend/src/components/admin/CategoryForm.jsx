

// "use client";

// import { useState, useEffect } from "react";

// const API_BASE_URL =
//   process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

// export default function CategoryForm({
//   initialValues = {
//     name: "",
//     imageUrls: [],
//     bannerImageUrls: [],
//     thinBannerImageUrls: [],
//   },
//   onSubmit,
//   loading = false,
// }) {
//   const [name, setName] = useState(initialValues.name || "");
//   const [imageUrls, setImageUrls] = useState(initialValues.imageUrls || []);
//   const [bannerImageUrls, setBannerImageUrls] = useState(
//     initialValues.bannerImageUrls || []
//   );
//   const [thinBannerImageUrls, setThinBannerImageUrls] = useState(
//     initialValues.thinBannerImageUrls || []
//   );

//   const [uploadingField, setUploadingField] = useState("");
//   const [uploadError, setUploadError] = useState("");

//   useEffect(() => {
//     setName(initialValues?.name || "");
//     setImageUrls(initialValues?.imageUrls || []);
//     setBannerImageUrls(initialValues?.bannerImageUrls || []);
//     setThinBannerImageUrls(initialValues?.thinBannerImageUrls || []);
//   }, [initialValues]);

//   const uploadSingleFile = async (file) => {
//     const formData = new FormData();
//     formData.append("file", file);

//     const token =
//       localStorage.getItem("accessToken") ||
//       localStorage.getItem("token") ||
//       localStorage.getItem("adminToken");

//     const response = await fetch(
//       `${API_BASE_URL}/api/admin/categories/upload-image`,
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       }
//     );

//     if (!response.ok) {
//       throw new Error("Image upload failed");
//     }

//     const data = await response.json();
//     return data.imageUrl;
//   };

//   const handleImageUpload = async (e, fieldName) => {
//     const files = Array.from(e.target.files || []);
//     if (!files.length) return;

//     try {
//       setUploadingField(fieldName);
//       setUploadError("");

//       const uploadedUrls = [];

//       for (const file of files) {
//         const imageUrl = await uploadSingleFile(file);
//         uploadedUrls.push(imageUrl);
//       }

//       if (fieldName === "imageUrls") {
//         setImageUrls((prev) => [...prev, ...uploadedUrls]);
//       }

//       if (fieldName === "bannerImageUrls") {
//         setBannerImageUrls((prev) => [...prev, ...uploadedUrls]);
//       }

//       if (fieldName === "thinBannerImageUrls") {
//         setThinBannerImageUrls((prev) => [...prev, ...uploadedUrls]);
//       }
//     } catch (error) {
//       setUploadError(error.message || "Image upload failed");
//     } finally {
//       setUploadingField("");
//       e.target.value = "";
//     }
//   };

//   const removeImage = (fieldName, index) => {
//     if (fieldName === "imageUrls") {
//       setImageUrls((prev) => prev.filter((_, i) => i !== index));
//     }

//     if (fieldName === "bannerImageUrls") {
//       setBannerImageUrls((prev) => prev.filter((_, i) => i !== index));
//     }

//     if (fieldName === "thinBannerImageUrls") {
//       setThinBannerImageUrls((prev) => prev.filter((_, i) => i !== index));
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const trimmedName = name.trim();
//     if (!trimmedName) return;

//     onSubmit({
//       name: trimmedName,
//       imageUrls,
//       bannerImageUrls,
//       thinBannerImageUrls,

//       imageUrl: imageUrls[0] || null,
//       bannerImageUrl: bannerImageUrls[0] || null,
//       thinBannerImageUrl: thinBannerImageUrls[0] || null,
//     });
//   };

//   const uploading = Boolean(uploadingField);

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
//     >
//       <div>
//         <label className="mb-2 block text-sm font-semibold text-gray-700">
//           Category Name
//         </label>

//         <input
//           type="text"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           placeholder="Enter category name"
//           autoComplete="off"
//           className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-black placeholder:text-gray-400 outline-none focus:border-black"
//           required
//         />
//       </div>

//       <ImageUploadField
//         label="Category Card Images"
//         helper="You can upload multiple category card images."
//         imageUrls={imageUrls}
//         previewType="square"
//         uploading={uploadingField === "imageUrls"}
//         disabled={uploading || loading}
//         onUpload={(e) => handleImageUpload(e, "imageUrls")}
//         onRemove={(index) => removeImage("imageUrls", index)}
//       />

//       <ImageUploadField
//         label="Normal Banner Images"
//         helper="Recommended: 1920 × 600 px. You can upload multiple banner images."
//         imageUrls={bannerImageUrls}
//         previewType="banner"
//         uploading={uploadingField === "bannerImageUrls"}
//         disabled={uploading || loading}
//         onUpload={(e) => handleImageUpload(e, "bannerImageUrls")}
//         onRemove={(index) => removeImage("bannerImageUrls", index)}
//       />

//       <ImageUploadField
//         label="Thin Banner Images"
//         helper="Recommended: 1920 × 220 px. You can upload multiple thin banner images."
//         imageUrls={thinBannerImageUrls}
//         previewType="thinBanner"
//         uploading={uploadingField === "thinBannerImageUrls"}
//         disabled={uploading || loading}
//         onUpload={(e) => handleImageUpload(e, "thinBannerImageUrls")}
//         onRemove={(index) => removeImage("thinBannerImageUrls", index)}
//       />

//       {uploadError && (
//         <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
//           {uploadError}
//         </p>
//       )}

//       <button
//         type="submit"
//         disabled={loading || uploading || !name.trim()}
//         className="rounded-xl bg-black px-5 py-3 text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
//       >
//         {loading ? "Saving..." : uploading ? "Uploading..." : "Save Category"}
//       </button>
//     </form>
//   );
// }

// function ImageUploadField({
//   label,
//   helper,
//   imageUrls = [],
//   previewType = "square",
//   uploading,
//   disabled,
//   onUpload,
//   onRemove,
// }) {
//   const isBanner = previewType === "banner";
//   const isThinBanner = previewType === "thinBanner";

//   const gridClassName =
//     isBanner || isThinBanner
//       ? "grid grid-cols-1 gap-4"
//       : "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4";

//   const previewClassName =
//     previewType === "banner"
//       ? "h-36 w-full"
//       : previewType === "thinBanner"
//       ? "h-20 w-full"
//       : "h-32 w-32";

//   return (
//     <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
//       <label className="mb-2 block text-sm font-semibold text-gray-700">
//         {label}
//       </label>

//       <p className="mb-3 text-xs text-gray-500">{helper}</p>

//       <input
//         type="file"
//         accept="image/*"
//         multiple
//         onChange={onUpload}
//         disabled={disabled}
//         className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-black outline-none focus:border-black disabled:cursor-not-allowed disabled:opacity-60"
//       />

//       {uploading && (
//         <p className="mt-2 text-sm text-gray-500">Uploading images...</p>
//       )}

//       {imageUrls.length > 0 && (
//         <div className="mt-4">
//           <p className="mb-3 text-sm font-medium text-gray-600">
//             Image Preview
//           </p>

//           <div className={gridClassName}>
//             {imageUrls.map((url, index) => (
//               <div
//                 key={`${url}-${index}`}
//                 className={`relative overflow-hidden rounded-xl border border-gray-200 bg-white p-2 ${
//                   isBanner || isThinBanner ? "w-full" : "w-fit"
//                 }`}
//               >
//                 <button
//                   type="button"
//                   onClick={() => onRemove(index)}
//                   className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black text-lg font-bold leading-none text-white shadow-md transition hover:bg-red-600"
//                   aria-label="Remove image"
//                 >
//                   ×
//                 </button>

//                 <img
//                   src={url}
//                   alt={`${label} preview ${index + 1}`}
//                   className={`${previewClassName} rounded-lg border border-gray-100 bg-white object-cover`}
//                 />
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }














"use client";

import { useEffect, useMemo, useState } from "react";
import { uploadCategoryImagesApi } from "@/features/categories/categoryApi";

function normalizeArray(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  if (typeof value === "string" && value.trim()) {
    return [value.trim()];
  }

  return [];
}

function createPreviewItems(urls = []) {
  return normalizeArray(urls).map((url) => ({
    type: "url",
    url,
    file: null,
    preview: url,
  }));
}

export default function CategoryForm({
  initialValues,
  onSubmit,
  loading = false,
}) {
  const safeInitialValues = useMemo(() => {
    const values = initialValues || {};

    return {
      name: values.name || "",
      imageUrls: normalizeArray(values.imageUrls || values.imageUrl),
      bannerImageUrls: normalizeArray(
        values.bannerImageUrls || values.bannerImageUrl
      ),
      thinBannerImageUrls: normalizeArray(
        values.thinBannerImageUrls || values.thinBannerImageUrl
      ),
    };
  }, [initialValues]);

  const [name, setName] = useState(safeInitialValues.name);
  const [cardImages, setCardImages] = useState(
    createPreviewItems(safeInitialValues.imageUrls)
  );
  const [bannerImages, setBannerImages] = useState(
    createPreviewItems(safeInitialValues.bannerImageUrls)
  );
  const [thinBannerImages, setThinBannerImages] = useState(
    createPreviewItems(safeInitialValues.thinBannerImageUrls)
  );
  const [uploading, setUploading] = useState(false);
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    setName(safeInitialValues.name);
    setCardImages(createPreviewItems(safeInitialValues.imageUrls));
    setBannerImages(createPreviewItems(safeInitialValues.bannerImageUrls));
    setThinBannerImages(createPreviewItems(safeInitialValues.thinBannerImageUrls));
  }, [safeInitialValues]);

  useEffect(() => {
    return () => {
      revokeBlobUrls(cardImages);
      revokeBlobUrls(bannerImages);
      revokeBlobUrls(thinBannerImages);
    };
  }, []);

  const handleFilesChange = (event, setter) => {
    const files = Array.from(event.target.files || []);

    if (files.length === 0) return;

    const newItems = files.map((file) => ({
      type: "file",
      url: "",
      file,
      preview: URL.createObjectURL(file),
    }));

    setter((prev) => [...prev, ...newItems]);

    event.target.value = "";
  };

  const removeImage = (index, setter) => {
    setter((prev) => {
      const target = prev[index];

      if (target?.type === "file" && target.preview) {
        URL.revokeObjectURL(target.preview);
      }

      return prev.filter((_, itemIndex) => itemIndex !== index);
    });
  };

  const moveImage = (index, direction, setter) => {
    setter((prev) => {
      const next = [...prev];
      const targetIndex = index + direction;

      if (targetIndex < 0 || targetIndex >= next.length) {
        return prev;
      }

      const temp = next[index];
      next[index] = next[targetIndex];
      next[targetIndex] = temp;

      return next;
    });
  };

  const uploadNewFilesAndReturnUrls = async (items) => {
    const existingUrls = items
      .filter((item) => item.type === "url" && item.url)
      .map((item) => item.url);

    const files = items
      .filter((item) => item.type === "file" && item.file)
      .map((item) => item.file);

    if (files.length === 0) {
      return existingUrls;
    }

    const uploadedUrls = await uploadCategoryImagesApi(files);

    return [...existingUrls, ...uploadedUrls];
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLocalError("");

      if (!name.trim()) {
        setLocalError("Category name is required");
        return;
      }

      setUploading(true);

      const [imageUrls, bannerImageUrls, thinBannerImageUrls] =
        await Promise.all([
          uploadNewFilesAndReturnUrls(cardImages),
          uploadNewFilesAndReturnUrls(bannerImages),
          uploadNewFilesAndReturnUrls(thinBannerImages),
        ]);

      await onSubmit({
        name: name.trim(),
        imageUrls,
        bannerImageUrls,
        thinBannerImageUrls,
      });
    } catch (error) {
      setLocalError(
        error.response?.data?.message ||
          error.message ||
          "Failed to upload category images"
      );
    } finally {
      setUploading(false);
    }
  };

  const disabled = loading || uploading;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {localError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-600">
          {localError}
        </div>
      )}

      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-900">
          Category Name
        </label>

        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Example: Sling Bags"
          disabled={disabled}
          className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-black disabled:cursor-not-allowed disabled:bg-gray-100"
        />
      </div>

      <ImageUploadSection
        title="Category Card Images"
        description="Used for category card/thumbnail image. You can upload multiple images."
        inputId="category-card-images"
        items={cardImages}
        setItems={setCardImages}
        onFilesChange={handleFilesChange}
        onRemove={removeImage}
        onMove={moveImage}
        disabled={disabled}
        previewClassName="aspect-square"
      />

      <ImageUploadSection
        title="Banner Images"
        description="Used for main category banner. Multiple images can be used as carousel."
        inputId="category-banner-images"
        items={bannerImages}
        setItems={setBannerImages}
        onFilesChange={handleFilesChange}
        onRemove={removeImage}
        onMove={moveImage}
        disabled={disabled}
        previewClassName="aspect-[16/5]"
      />

      <ImageUploadSection
        title="Thin Banner Images"
        description="Used for thin full-width banner. Multiple images can be used as carousel."
        inputId="category-thin-banner-images"
        items={thinBannerImages}
        setItems={setThinBannerImages}
        onFilesChange={handleFilesChange}
        onRemove={removeImage}
        onMove={moveImage}
        disabled={disabled}
        previewClassName="aspect-[20/4]"
      />

      <div className="flex flex-col gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:items-center sm:justify-end">
        <button
          type="submit"
          disabled={disabled}
          className="inline-flex items-center justify-center rounded-2xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {uploading
            ? "Uploading Images..."
            : loading
            ? "Saving..."
            : "Save Category"}
        </button>
      </div>
    </form>
  );
}

function ImageUploadSection({
  title,
  description,
  inputId,
  items,
  setItems,
  onFilesChange,
  onRemove,
  onMove,
  disabled,
  previewClassName,
}) {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-base font-bold text-gray-900">{title}</h3>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>

        <label
          htmlFor={inputId}
          className={`inline-flex cursor-pointer items-center justify-center rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 transition hover:bg-gray-50 ${
            disabled ? "pointer-events-none opacity-50" : ""
          }`}
        >
          Select Images
        </label>

        <input
          id={inputId}
          type="file"
          accept="image/*"
          multiple
          disabled={disabled}
          onChange={(event) => onFilesChange(event, setItems)}
          className="hidden"
        />
      </div>

      {items.length === 0 ? (
        <div className="flex min-h-[120px] items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center">
          <p className="text-sm font-medium text-gray-400">
            No image selected
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {items.map((item, index) => (
            <div
              key={`${item.preview}-${index}`}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50"
            >
              <div className={`relative w-full bg-gray-100 ${previewClassName}`}>
                <img
                  src={item.preview}
                  alt={`${title} ${index + 1}`}
                  className="h-full w-full object-cover"
                />

                <button
                  type="button"
                  onClick={() => onRemove(index, setItems)}
                  disabled={disabled}
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black text-lg font-bold leading-none text-white shadow-md transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Remove image"
                >
                  ×
                </button>

                <div className="absolute left-2 top-2 rounded-full bg-black/80 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                  {item.type === "file" ? "New" : "Saved"}
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 bg-white px-3 py-3">
                <p className="truncate text-xs font-medium text-gray-500">
                  Image {index + 1}
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onMove(index, -1, setItems)}
                    disabled={disabled || index === 0}
                    className="rounded-lg border border-gray-300 px-2 py-1 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    ↑
                  </button>

                  <button
                    type="button"
                    onClick={() => onMove(index, 1, setItems)}
                    disabled={disabled || index === items.length - 1}
                    className="rounded-lg border border-gray-300 px-2 py-1 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    ↓
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function revokeBlobUrls(items) {
  items.forEach((item) => {
    if (item?.type === "file" && item.preview) {
      URL.revokeObjectURL(item.preview);
    }
  });
}