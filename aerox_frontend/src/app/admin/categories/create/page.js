
// "use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useDispatch, useSelector } from "react-redux";
// import CategoryForm from "@/components/admin/CategoryForm";
// import {
//   createCategory,
//   clearCategoryState,
// } from "@/features/categories/categorySlice";

// export default function AdminCreateCategoryPage() {
//   const router = useRouter();
//   const dispatch = useDispatch();

//   const { submitting, error, successMessage } = useSelector(
//     (state) => state.categories
//   );

//   useEffect(() => {
//     return () => dispatch(clearCategoryState());
//   }, [dispatch]);

//   const handleSubmit = async (payload) => {
//     const resultAction = await dispatch(createCategory(payload));

//     if (createCategory.fulfilled.match(resultAction)) {
//       router.push("/admin/categories/list");
//     }
//   };

//   return (
//     <div className="max-w-3xl p-6">
//       <div className="mb-6">
//         <h1 className="text-3xl font-bold">Create Category</h1>
//         <p className="text-sm text-gray-500">
//           Add category image, banner image, and thin banner image.
//         </p>
//       </div>

//       {error && (
//         <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
//           {error}
//         </div>
//       )}

//       {successMessage && (
//         <div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
//           {successMessage}
//         </div>
//       )}

//       <CategoryForm
//         initialValues={{
//           name: "",
//           imageUrl: "",
//           bannerImageUrl: "",
//           thinBannerImageUrl: "",
//         }}
//         onSubmit={handleSubmit}
//         loading={submitting}
//       />
//     </div>
//   );
// }



















"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import CategoryForm from "@/components/admin/CategoryForm";
import {
  createCategory,
  clearCategoryState,
} from "@/features/categories/categorySlice";

export default function AdminCreateCategoryPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { submitting, error, successMessage } = useSelector(
    (state) => state.categories
  );

  useEffect(() => {
    return () => dispatch(clearCategoryState());
  }, [dispatch]);

  const handleSubmit = async (payload) => {
    const resultAction = await dispatch(createCategory(payload));

    if (createCategory.fulfilled.match(resultAction)) {
      router.push("/admin/categories/list");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl p-6 md:p-8">
        <div className="mb-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                Admin Panel
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
                Create Category
              </h1>

              <p className="mt-2 text-sm text-gray-500 md:text-base">
                Add multiple category images, banner images, and thin banner
                images.
              </p>
            </div>

            <Link
              href="/admin/categories/list"
              className="inline-flex items-center justify-center rounded-2xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Back to Categories
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
            <h2 className="text-lg font-semibold text-gray-900">
              Category Information
            </h2>
            <p className="text-sm text-gray-500">
              Select multiple images, preview them, remove separately, then
              save.
            </p>
          </div>

          <div className="p-6 md:p-8">
            <CategoryForm
              initialValues={{
                name: "",
                imageUrls: [],
                bannerImageUrls: [],
                thinBannerImageUrls: [],
              }}
              onSubmit={handleSubmit}
              loading={submitting}
            />
          </div>
        </div>
      </div>
    </div>
  );
}