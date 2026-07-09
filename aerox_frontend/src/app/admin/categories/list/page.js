
// "use client";

// import Link from "next/link";
// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchAdminCategories,
//   deleteCategory,
//   clearCategoryState,
// } from "@/features/categories/categorySlice";

// export default function AdminCategoryListPage() {
//   const dispatch = useDispatch();

//   const { adminCategories, loading, submitting, error, successMessage } =
//     useSelector((state) => state.categories);

//   useEffect(() => {
//     dispatch(fetchAdminCategories());
//     return () => dispatch(clearCategoryState());
//   }, [dispatch]);

//   const handleDelete = (id) => {
//     const confirmed = window.confirm(
//       "Are you sure you want to delete this category?"
//     );
//     if (!confirmed) return;

//     dispatch(deleteCategory(id));
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="mx-auto max-w-7xl p-6 md:p-8">
//         <div className="mb-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
//           <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
//             <div>
//               <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
//                 Admin Panel
//               </p>

//               <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
//                 Categories
//               </h1>

//               <p className="mt-2 text-sm text-gray-500 md:text-base">
//                 Manage category image, normal banner, and thin banner.
//               </p>
//             </div>

//             <Link
//               href="/admin/categories/create"
//               className="inline-flex items-center justify-center rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
//             >
//               Create Category
//             </Link>
//           </div>
//         </div>

//         {error && (
//           <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-600 shadow-sm">
//             {error}
//           </div>
//         )}

//         {successMessage && (
//           <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-medium text-green-700 shadow-sm">
//             {successMessage}
//           </div>
//         )}

//         <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
//           <div className="border-b border-gray-100 px-6 py-5">
//             <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
//               <div>
//                 <h2 className="text-lg font-semibold text-gray-900">
//                   Category List
//                 </h2>

//                 <p className="text-sm text-gray-500">
//                   View, edit, and delete your store categories.
//                 </p>
//               </div>

//               {!loading && adminCategories.length > 0 && (
//                 <div className="inline-flex w-fit items-center rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700">
//                   Total: {adminCategories.length}
//                 </div>
//               )}
//             </div>
//           </div>

//           {loading ? (
//             <div className="flex min-h-[260px] items-center justify-center px-6 py-10">
//               <div className="text-center">
//                 <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-black" />
//                 <p className="text-sm font-medium text-gray-500">
//                   Loading categories...
//                 </p>
//               </div>
//             </div>
//           ) : adminCategories.length === 0 ? (
//             <div className="flex min-h-[260px] flex-col items-center justify-center px-6 py-12 text-center">
//               <h3 className="text-lg font-semibold text-gray-900">
//                 No categories found
//               </h3>

//               <Link
//                 href="/admin/categories/create"
//                 className="mt-6 inline-flex items-center justify-center rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
//               >
//                 Create First Category
//               </Link>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="min-w-full border-collapse">
//                 <thead className="bg-gray-50">
//                   <tr className="text-left">
//                     <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
//                       ID
//                     </th>

//                     <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
//                       Category
//                     </th>

//                     <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
//                       Images
//                     </th>

//                     <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
//                       Status
//                     </th>

//                     <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {adminCategories.map((category, index) => (
//                     <tr
//                       key={category.id}
//                       className={`transition hover:bg-gray-50 ${
//                         index !== adminCategories.length - 1
//                           ? "border-b border-gray-100"
//                           : ""
//                       }`}
//                     >
//                       <td className="px-6 py-5 text-sm font-medium text-gray-600">
//                         #{category.id}
//                       </td>

//                       <td className="px-6 py-5">
//                         <div className="flex items-center gap-3">
//                           {category.imageUrl ? (
//                             <img
//                               src={category.imageUrl}
//                               alt={category.name || "Category image"}
//                               className="h-12 w-12 rounded-2xl border border-gray-200 bg-gray-50 object-cover"
//                             />
//                           ) : (
//                             <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-sm font-bold text-white">
//                               {category.name?.charAt(0)?.toUpperCase() || "C"}
//                             </div>
//                           )}

//                           <div>
//                             <p className="text-sm font-semibold text-gray-900">
//                               {category.name}
//                             </p>

//                             <p className="text-xs text-gray-500">
//                               Category image
//                             </p>
//                           </div>
//                         </div>
//                       </td>

//                       <td className="px-6 py-5">
//                         <div className="flex items-center gap-3">
//                           <ImageStatus
//                             label="Card"
//                             imageUrl={category.imageUrl}
//                           />
//                           <ImageStatus
//                             label="Banner"
//                             imageUrl={category.bannerImageUrl}
//                           />
//                           <ImageStatus
//                             label="Thin"
//                             imageUrl={category.thinBannerImageUrl}
//                           />
//                         </div>
//                       </td>

//                       <td className="px-6 py-5">
//                         <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 ring-1 ring-inset ring-green-200">
//                           Active
//                         </span>
//                       </td>

//                       <td className="px-6 py-5">
//                         <div className="flex items-center justify-end gap-3">
//                           <Link
//                             href={`/admin/categories/edit/${category.id}`}
//                             className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
//                           >
//                             Edit
//                           </Link>

//                           <button
//                             onClick={() => handleDelete(category.id)}
//                             disabled={submitting}
//                             className="inline-flex items-center justify-center rounded-xl border border-red-300 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
//                           >
//                             Delete
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// function ImageStatus({ label, imageUrl }) {
//   return (
//     <div className="flex flex-col items-center gap-1">
//       {imageUrl ? (
//         <img
//           src={imageUrl}
//           alt={label}
//           className="h-10 w-16 rounded-lg border border-gray-200 bg-gray-50 object-cover"
//         />
//       ) : (
//         <div className="flex h-10 w-16 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 text-[10px] text-gray-400">
//           Empty
//         </div>
//       )}

//       <span className="text-[10px] font-medium text-gray-500">{label}</span>
//     </div>
//   );
// }

























"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdminCategories,
  deleteCategory,
  clearCategoryState,
} from "@/features/categories/categorySlice";

function firstImage(category, arrayField, oldField) {
  if (Array.isArray(category?.[arrayField]) && category[arrayField].length > 0) {
    return category[arrayField][0];
  }

  return category?.[oldField] || "";
}

function imageCount(category, arrayField, oldField) {
  if (Array.isArray(category?.[arrayField])) {
    return category[arrayField].length;
  }

  return category?.[oldField] ? 1 : 0;
}

export default function AdminCategoryListPage() {
  const dispatch = useDispatch();

  const { adminCategories, loading, submitting, error, successMessage } =
    useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchAdminCategories());
    return () => dispatch(clearCategoryState());
  }, [dispatch]);

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) return;

    dispatch(deleteCategory(id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl p-6 md:p-8">
        <div className="mb-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                Admin Panel
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
                Categories
              </h1>

              <p className="mt-2 text-sm text-gray-500 md:text-base">
                Manage category images, normal banners, and thin banners.
              </p>
            </div>

            <Link
              href="/admin/categories/create"
              className="inline-flex items-center justify-center rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Create Category
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-600 shadow-sm">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-medium text-green-700 shadow-sm">
            {successMessage}
          </div>
        )}

        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-6 py-5">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Category List
                </h2>

                <p className="text-sm text-gray-500">
                  View, edit, and delete your store categories.
                </p>
              </div>

              {!loading && adminCategories.length > 0 && (
                <div className="inline-flex w-fit items-center rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700">
                  Total: {adminCategories.length}
                </div>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-[260px] items-center justify-center px-6 py-10">
              <div className="text-center">
                <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-black" />
                <p className="text-sm font-medium text-gray-500">
                  Loading categories...
                </p>
              </div>
            </div>
          ) : adminCategories.length === 0 ? (
            <div className="flex min-h-[260px] flex-col items-center justify-center px-6 py-12 text-center">
              <h3 className="text-lg font-semibold text-gray-900">
                No categories found
              </h3>

              <Link
                href="/admin/categories/create"
                className="mt-6 inline-flex items-center justify-center rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Create First Category
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead className="bg-gray-50">
                  <tr className="text-left">
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      ID
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Category
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Images
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {adminCategories.map((category, index) => {
                    const cardImage = firstImage(
                      category,
                      "imageUrls",
                      "imageUrl"
                    );

                    const bannerImage = firstImage(
                      category,
                      "bannerImageUrls",
                      "bannerImageUrl"
                    );

                    const thinBannerImage = firstImage(
                      category,
                      "thinBannerImageUrls",
                      "thinBannerImageUrl"
                    );

                    const cardCount = imageCount(
                      category,
                      "imageUrls",
                      "imageUrl"
                    );

                    const bannerCount = imageCount(
                      category,
                      "bannerImageUrls",
                      "bannerImageUrl"
                    );

                    const thinCount = imageCount(
                      category,
                      "thinBannerImageUrls",
                      "thinBannerImageUrl"
                    );

                    return (
                      <tr
                        key={category.id}
                        className={`transition hover:bg-gray-50 ${
                          index !== adminCategories.length - 1
                            ? "border-b border-gray-100"
                            : ""
                        }`}
                      >
                        <td className="px-6 py-5 text-sm font-medium text-gray-600">
                          #{category.id}
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            {cardImage ? (
                              <img
                                src={cardImage}
                                alt={category.name || "Category image"}
                                className="h-12 w-12 rounded-2xl border border-gray-200 bg-gray-50 object-cover"
                              />
                            ) : (
                              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-sm font-bold text-white">
                                {category.name?.charAt(0)?.toUpperCase() ||
                                  "C"}
                              </div>
                            )}

                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                                {category.name}
                              </p>

                              <p className="text-xs text-gray-500">
                                {cardCount} category image
                                {cardCount === 1 ? "" : "s"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <ImageStatus
                              label="Card"
                              imageUrl={cardImage}
                              count={cardCount}
                              shape="card"
                            />

                            <ImageStatus
                              label="Banner"
                              imageUrl={bannerImage}
                              count={bannerCount}
                              shape="banner"
                            />

                            <ImageStatus
                              label="Thin"
                              imageUrl={thinBannerImage}
                              count={thinCount}
                              shape="thin"
                            />
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 ring-1 ring-inset ring-green-200">
                            Active
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex items-center justify-end gap-3">
                            <Link
                              href={`/admin/categories/edit/${category.id}`}
                              className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                            >
                              Edit
                            </Link>

                            <button
                              onClick={() => handleDelete(category.id)}
                              disabled={submitting}
                              className="inline-flex items-center justify-center rounded-xl border border-red-300 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ImageStatus({ label, imageUrl, count = 0, shape = "card" }) {
  const sizeClass =
    shape === "banner"
      ? "h-10 w-24"
      : shape === "thin"
      ? "h-8 w-28"
      : "h-10 w-16";

  return (
    <div className="flex flex-col items-center gap-1">
      {imageUrl ? (
        <div className="relative">
          <img
            src={imageUrl}
            alt={label}
            className={`${sizeClass} rounded-lg border border-gray-200 bg-gray-50 object-cover`}
          />

          {count > 1 && (
            <span className="absolute -right-2 -top-2 rounded-full bg-black px-1.5 py-0.5 text-[10px] font-bold text-white">
              +{count - 1}
            </span>
          )}
        </div>
      ) : (
        <div
          className={`${sizeClass} flex items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 text-[10px] text-gray-400`}
        >
          Empty
        </div>
      )}

      <span className="text-[10px] font-medium text-gray-500">
        {label} ({count})
      </span>
    </div>
  );
}