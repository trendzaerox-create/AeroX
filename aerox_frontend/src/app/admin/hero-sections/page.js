"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteHeroSection,
  fetchAdminHeroSections,
} from "@/features/heroSections/heroSectionSlice";

export default function AdminHeroSectionsPage() {
  const dispatch = useDispatch();
  const { adminItems, loadingAdmin } = useSelector((state) => state.heroSections);

  useEffect(() => {
    dispatch(fetchAdminHeroSections());
  }, [dispatch]);

  const handleDelete = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this hero section?");
    if (!ok) return;
    await dispatch(deleteHeroSection(id));
  };

  return (
    <div className="space-y-6">
      {/* Header with title and CTA button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Hero Sections
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage homepage hero banners linked to products.
          </p>
        </div>

        <Link
          href="/admin/hero-sections/create"
          className="inline-flex items-center justify-center rounded-full bg-black px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-gray-800"
        >
          Add Hero Section
        </Link>
      </div>

      {/* Hero sections list card */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {loadingAdmin ? (
          <div className="p-8 text-center text-sm text-gray-500">
            Loading hero sections...
          </div>
        ) : adminItems?.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">
            No hero sections found.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {adminItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 p-5 transition hover:bg-gray-50/50 md:flex-row md:items-center md:justify-between"
              >
                {/* Left side: image + info */}
                <div className="flex min-w-0 items-center gap-4">
                  <div className="h-20 w-28 flex-shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="min-w-0 space-y-1">
                    <h3 className="truncate text-base font-semibold text-gray-900">
                      {item.title}
                    </h3>

                    <p className="text-sm text-gray-600">
                      Product: {item.productTitle || "N/A"}
                    </p>

                    <p className="text-sm text-gray-600">
                      Sort: {item.sortOrder} | Status:{" "}
                      <span
                        className={
                          item.active
                            ? "font-semibold text-green-600"
                            : "font-semibold text-gray-400"
                        }
                      >
                        {item.active ? "Active" : "Inactive"}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Right side: action buttons */}
                <div className="flex flex-wrap items-center gap-3 md:justify-end">
                  <Link
                    href={`/admin/hero-sections/edit/${item.id}`}
                    className="inline-flex min-w-[90px] items-center justify-center rounded-full border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
                  >
                    Edit
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="inline-flex min-w-[100px] items-center justify-center rounded-full border border-red-700 bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-red-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}



