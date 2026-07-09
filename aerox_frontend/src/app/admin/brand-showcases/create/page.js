"use client";

import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import BrandShowcaseForm from "@/components/admin/BrandShowcaseForm";
import { createBrandShowcase } from "@/features/brandShowcases/brandShowcaseSlice";

export default function CreateBrandShowcasePage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async (payload) => {
    const resultAction = await dispatch(createBrandShowcase(payload));

    if (createBrandShowcase.fulfilled.match(resultAction)) {
      router.push("/admin/brand-showcases");
    }
  };

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
                  Create
                </span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Create Brand Showcase
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 sm:text-[15px]">
                Add a new homepage brand showcase section with model image, content,
                display order, and selected products.
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
              Section Type
            </p>
            <p className="mt-2 text-base font-semibold text-gray-900">
              Homepage Brand Block
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
              Status
            </p>
            <p className="mt-2 text-base font-semibold text-gray-900">
              Ready to Create
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
              Purpose
            </p>
            <p className="mt-2 text-base font-semibold text-gray-900">
              Storytelling + Product Discovery
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
          <BrandShowcaseForm
            initialData={null}
            onSubmit={handleSubmit}
            submitLabel="Create Showcase"
          />
        </div>
      </div>
    </div>
  );
}