

"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import HeroSectionForm from "@/components/admin/HeroSectionForm";
import {
  clearCurrentHeroSection,
  fetchAdminHeroSectionById,
  updateHeroSection,
} from "@/features/heroSections/heroSectionSlice";

export default function EditHeroSectionPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const { currentItem, loadingCurrent } = useSelector(
    (state) => state.heroSections
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchAdminHeroSectionById(id));
    }

    return () => {
      dispatch(clearCurrentHeroSection());
    };
  }, [dispatch, id]);

  const handleSubmit = async (payload) => {
    const resultAction = await dispatch(updateHeroSection({ id, payload }));

    if (updateHeroSection.fulfilled.match(resultAction)) {
      router.push("/admin/hero-sections");
    }
  };

  if (loadingCurrent || !currentItem) {
    return (
      <div className="min-h-screen bg-[#f8f8f8]">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="rounded-[28px] border border-gray-200 bg-white p-8 text-sm text-gray-500 shadow-sm">
            Loading hero section...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-[28px] border border-gray-200 bg-white px-6 py-6 shadow-sm sm:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
              Admin / Hero Sections
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
              Edit Hero Section
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
              Update the selected homepage hero banner while keeping the linked
              product and display order organized.
            </p>
          </div>
        </div>

        <HeroSectionForm
          initialData={currentItem}
          onSubmit={handleSubmit}
          submitLabel="Update Hero Section"
        />
      </div>
    </div>
  );
}