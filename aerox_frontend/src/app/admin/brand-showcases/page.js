"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { deleteBrandShowcase, getAdminBrandShowcases } from "@/lib/brandShowcaseApi";
import getImageUrl from "@/lib/getImageUrl";

export default function AdminBrandShowcasesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    try {
      const data = await getAdminBrandShowcases();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load showcases:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleDelete(id) {
    const confirmed = window.confirm("Are you sure you want to delete this showcase?");
    if (!confirmed) return;

    try {
      await deleteBrandShowcase(id);
      await loadData();
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete showcase");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl p-4 md:p-6">
        
        {/* HEADER */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Brand Showcases</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage homepage “From the Brand” sections
            </p>
          </div>

          <Link
            href="/admin/brand-showcases/create"
            className="rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
          >
            + Create Showcase
          </Link>
        </div>

        {/* TABLE */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {loading ? (
            <div className="p-6 text-sm text-gray-500">Loading showcases...</div>
          ) : !items.length ? (
            <div className="p-6 text-sm text-gray-500">No brand showcases found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                
                {/* TABLE HEAD */}
                <thead className="bg-gray-50 border-b">
                  <tr className="text-left text-gray-600">
                    <th className="px-4 py-3 font-semibold">Image</th>
                    <th className="px-4 py-3 font-semibold">Title</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Order</th>
                    <th className="px-4 py-3 font-semibold">Products</th>
                    <th className="px-4 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>

                {/* TABLE BODY */}
                <tbody className="divide-y">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition">
                      
                      {/* IMAGE */}
                      <td className="px-4 py-3">
                        <div className="h-14 w-14 overflow-hidden rounded-lg bg-gray-100">
                          {item.modelImageUrl ? (
                            <img
                              src={getImageUrl ? getImageUrl(item.modelImageUrl) : item.modelImageUrl}
                              alt={item.title}
                              className="h-full w-full object-cover"
                            />
                          ) : null}
                        </div>
                      </td>

                      {/* TITLE */}
                      <td className="px-4 py-3">
                        <div className="font-semibold text-gray-900">
                          {item.title}
                        </div>
                        {item.subtitle && (
                          <div className="text-xs text-gray-500 line-clamp-1">
                            {item.subtitle}
                          </div>
                        )}
                      </td>

                      {/* STATUS */}
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            item.active
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {item.active ? "Active" : "Inactive"}
                        </span>
                      </td>

                      {/* ORDER */}
                      <td className="px-4 py-3 text-gray-600">
                        {item.displayOrder}
                      </td>

                      {/* PRODUCTS */}
                      <td className="px-4 py-3 text-gray-600">
                        {item.products?.length || 0}
                      </td>

                      {/* ACTIONS */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/admin/brand-showcases/edit/${item.id}`}
                            className="rounded-lg border px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                          >
                            Edit
                          </Link>

                          <button
                            onClick={() => handleDelete(item.id)}
                            className="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}