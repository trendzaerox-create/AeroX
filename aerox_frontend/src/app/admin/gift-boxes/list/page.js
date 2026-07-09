"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteGiftBox,
  fetchAdminGiftBoxes,
  updateGiftBoxStatus,
} from "@/features/giftBoxes/giftBoxSlice";
import Link from "next/link";

export default function AdminGiftBoxListPage() {
  const dispatch = useDispatch();
  const { adminGiftBoxes = [], loading, error, success } = useSelector(
    (state) => state.giftBoxes
  );

  useEffect(() => {
    dispatch(fetchAdminGiftBoxes());
  }, [dispatch]);

  const getImageSrc = (imagePath) => {
    if (!imagePath) return "/placeholder.png";

    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }

    return `${process.env.NEXT_PUBLIC_API_BASE || ""}${imagePath}`;
  };

  return (
    <div className="space-y-6 p-6 text-black">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-black">Gift Boxes</h1>

        <Link
          href="/admin/gift-boxes/create"
          className="rounded-xl bg-black px-4 py-2 text-white transition hover:opacity-90"
        >
          Create Gift Box
        </Link>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl bg-green-50 p-3 text-sm text-green-600">
          {success}
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full text-sm text-black">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-black">
                Image
              </th>
              <th className="px-4 py-3 text-left font-semibold text-black">
                Name
              </th>
              <th className="px-4 py-3 text-left font-semibold text-black">
                Price
              </th>
              <th className="px-4 py-3 text-left font-semibold text-black">
                Stock
              </th>
              <th className="px-4 py-3 text-left font-semibold text-black">
                Status
              </th>
              <th className="px-4 py-3 text-left font-semibold text-black">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {adminGiftBoxes.map((item) => (
              <tr key={item.id} className="border-b last:border-b-0">
                <td className="px-4 py-3">
                  <div className="h-16 w-16 overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
                    <img
                      src={getImageSrc(item.imagePath)}
                      alt={item.name || "Gift box"}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </td>

                <td className="px-4 py-3 font-medium text-black">
                  {item.name}
                </td>

                <td className="px-4 py-3 text-black">₹{item.priceInr}</td>

                <td className="px-4 py-3 text-black">{item.stock}</td>

                <td className="px-4 py-3">
                  <span
                    className={item.active ? "text-green-600" : "text-red-600"}
                  >
                    {item.active ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/admin/gift-boxes/edit/${item.id}`}
                      className="rounded-lg border border-gray-300 px-3 py-1 text-black transition hover:bg-gray-50"
                    >
                      Edit
                    </Link>

                    <button
                      type="button"
                      onClick={() =>
                        dispatch(
                          updateGiftBoxStatus({
                            id: item.id,
                            active: !item.active,
                          })
                        )
                      }
                      className="rounded-lg border border-gray-300 px-3 py-1 text-black transition hover:bg-gray-50"
                    >
                      {item.active ? "Deactivate" : "Activate"}
                    </button>

                    <button
                      type="button"
                      onClick={() => dispatch(deleteGiftBox(item.id))}
                      className="rounded-lg border border-red-200 px-3 py-1 text-red-600 transition hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {!loading && adminGiftBoxes.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                  No gift boxes found
                </td>
              </tr>
            )}

            {loading && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}