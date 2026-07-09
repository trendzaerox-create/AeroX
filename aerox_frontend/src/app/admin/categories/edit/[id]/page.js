


"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import CategoryForm from "@/components/admin/CategoryForm";
import {
  fetchAdminCategoryById,
  updateCategory,
  clearCategoryState,
  clearSelectedCategory,
} from "@/features/categories/categorySlice";

function normalizeArray(value, fallbackValue) {
  if (Array.isArray(value) && value.length > 0) {
    return value;
  }

  if (typeof fallbackValue === "string" && fallbackValue.trim()) {
    return [fallbackValue.trim()];
  }

  return [];
}

export default function AdminEditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch();

  const id = params?.id;

  const { selectedCategory, loading, submitting, error, successMessage } =
    useSelector((state) => state.categories);

  useEffect(() => {
    if (id) {
      dispatch(fetchAdminCategoryById(id));
    }

    return () => {
      dispatch(clearCategoryState());
      dispatch(clearSelectedCategory());
    };
  }, [dispatch, id]);

  const initialValues = useMemo(() => {
    const category = selectedCategory || {};

    return {
      name: category.name || "",

      imageUrls: normalizeArray(category.imageUrls, category.imageUrl),

      bannerImageUrls: normalizeArray(
        category.bannerImageUrls,
        category.bannerImageUrl
      ),

      thinBannerImageUrls: normalizeArray(
        category.thinBannerImageUrls,
        category.thinBannerImageUrl
      ),
    };
  }, [selectedCategory]);

  const handleSubmit = async (payload) => {
    const resultAction = await dispatch(updateCategory({ id, payload }));

    if (updateCategory.fulfilled.match(resultAction)) {
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
                Edit Category
              </h1>

              <p className="mt-2 text-sm text-gray-500 md:text-base">
                Existing images will show by default. You can remove or upload
                new images separately.
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
              Edit category name, images, banners, and thin banners.
            </p>
          </div>

          {loading ? (
            <div className="flex min-h-[280px] items-center justify-center px-6 py-10">
              <div className="text-center">
                <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-black" />
                <p className="text-sm font-medium text-gray-500">
                  Loading category...
                </p>
              </div>
            </div>
          ) : (
            <div className="p-6 md:p-8">
              <CategoryForm
                initialValues={initialValues}
                onSubmit={handleSubmit}
                loading={submitting}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}