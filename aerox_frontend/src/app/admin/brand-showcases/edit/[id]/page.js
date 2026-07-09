"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import BrandShowcaseForm from "@/components/admin/BrandShowcaseForm";
import {
  clearSelectedBrandShowcase,
  fetchAdminBrandShowcaseById,
  updateBrandShowcase,
} from "@/features/brandShowcases/brandShowcaseSlice";

export default function EditBrandShowcasePage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const { selectedItem, loadingSelected, error } = useSelector(
    (state) => state.brandShowcases
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchAdminBrandShowcaseById(id));
    }

    return () => {
      dispatch(clearSelectedBrandShowcase());
    };
  }, [dispatch, id]);

  const handleSubmit = async (payload) => {
    const resultAction = await dispatch(updateBrandShowcase({ id, payload }));

    if (updateBrandShowcase.fulfilled.match(resultAction)) {
      router.push("/admin/brand-showcases");
    }
  };

  if (loadingSelected) {
    return (
      <div className="min-h-screen bg-gray-50/70">
        <div className="mx-auto max-w-7xl p-4 md:p-6">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="animate-pulse space-y-5">
              <div className="h-4 w-40 rounded bg-gray-200" />
              <div className="h-8 w-80 rounded bg-gray-200" />
              <div className="h-4 w-96 max-w-full rounded bg-gray-100" />
              <div className="mt-6 rounded-3xl bg-gray-100 p-6">
                <div className="space-y-4">
                  <div className="h-12 rounded-xl bg-gray-200" />
                  <div className="h-12 rounded-xl bg-gray-200" />
                  <div className="h-28 rounded-xl bg-gray-200" />
                  <div className="h-56 rounded-2xl bg-gray-200" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !selectedItem) {
    return (
      <div className="min-h-screen bg-gray-50/70">
        <div className="mx-auto max-w-7xl p-4 md:p-6">
          <div className="rounded-3xl border border-red-200 bg-white p-6 shadow-sm">
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
              {String(error)}
            </div>

            <div className="mt-5">
              <button
                type="button"
                onClick={() => router.push("/admin/brand-showcases")}
                className="inline-flex items-center justify-center rounded-2xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-800 transition hover:bg-gray-50"
              >
                Back to List
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedItem) {
    return (
      <div className="min-h-screen bg-gray-50/70">
        <div className="mx-auto max-w-7xl p-4 md:p-6">
          <div className="rounded-3xl border border-gray-200 bg-white px-6 py-10 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-2xl">
              ✦
            </div>
            <h2 className="text-xl font-bold text-gray-900">Showcase not found</h2>
            <p className="mt-2 text-sm text-gray-500">
              The requested brand showcase could not be loaded.
            </p>

            <button
              type="button"
              onClick={() => router.push("/admin/brand-showcases")}
              className="mt-6 inline-flex items-center justify-center rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Back to Brand Showcases
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/70">
      <div className="mx-auto max-w-7xl p-4 md:p-6">
        <div className="mb-6 rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1">
                  Admin Panel
                </span>
                <span className="text-gray-300">/</span>
                <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1">
                  Brand Showcases
                </span>
                <span className="text-gray-300">/</span>
                <span className="rounded-full border border-black bg-black px-3 py-1 text-white">
                  Edit
                </span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Edit Brand Showcase
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 sm:text-[15px]">
                Update this homepage showcase section, refine the story block,
                manage product selection, and control section priority.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => router.push("/admin/brand-showcases")}
                className="inline-flex items-center justify-center rounded-2xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-800 transition hover:bg-gray-50"
              >
                Back to List
              </button>
            </div>
          </div>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
              Showcase ID
            </p>
            <p className="mt-2 truncate text-base font-semibold text-gray-900">
              #{selectedItem.id}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
              Current Status
            </p>
            <p className="mt-2 text-base font-semibold text-gray-900">
              {selectedItem.active ? "Active" : "Inactive"}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
              Selected Products
            </p>
            <p className="mt-2 text-base font-semibold text-gray-900">
              {selectedItem.products?.length || 0}
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
          <BrandShowcaseForm
            initialData={selectedItem}
            onSubmit={handleSubmit}
            submitLabel="Update Showcase"
          />
        </div>
      </div>
    </div>
  );
}