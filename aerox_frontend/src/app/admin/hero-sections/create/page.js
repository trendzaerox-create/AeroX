

"use client";

import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import HeroSectionForm from "@/components/admin/HeroSectionForm";
import { createHeroSection } from "@/features/heroSections/heroSectionSlice";

export default function CreateHeroSectionPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async (payload) => {
    const resultAction = await dispatch(createHeroSection(payload));

    if (createHeroSection.fulfilled.match(resultAction)) {
      router.push("/admin/hero-sections");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-[28px] border border-gray-200 bg-white px-6 py-6 shadow-sm sm:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                Admin / Hero Sections
              </p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
                Create Hero Section
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
                Add a new homepage hero banner and connect it to a product for a
                premium storefront experience.
              </p>
            </div>
          </div>
        </div>

        <HeroSectionForm
          initialData={null}
          onSubmit={handleSubmit}
          submitLabel="Create Hero Section"
        />
      </div>
    </div>
  );
}