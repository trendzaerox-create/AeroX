"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteNewsletterSubscriber,
  fetchNewsletterSubscribers,
} from "@/features/newsletter/newsletterSlice";

export default function AdminNewsletterPage() {
  const dispatch = useDispatch();

  const { subscribers, loading, error } = useSelector(
    (state) => state.newsletter
  );

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (token) {
      dispatch(fetchNewsletterSubscribers(token));
    }
  }, [dispatch, token]);

  const handleDelete = (id) => {
    if (!window.confirm("Delete this subscriber?")) return;

    dispatch(deleteNewsletterSubscriber({ id, token }));
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl rounded-3xl bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col justify-between gap-3 border-b border-neutral-200 pb-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
              Admin Dashboard
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-[#111111]">
              Newsletter Subscribers
            </h1>
          </div>

          <div className="rounded-full bg-black px-5 py-2 text-sm font-medium text-white">
            Total: {subscribers.length}
          </div>
        </div>

        {loading && (
          <p className="py-6 text-center text-sm text-neutral-500">
            Loading subscribers...
          </p>
        )}

        {error && (
          <p className="py-6 text-center text-sm font-medium text-red-600">
            {error}
          </p>
        )}

        {!loading && subscribers.length === 0 && (
          <p className="py-10 text-center text-sm text-neutral-500">
            No subscribers found.
          </p>
        )}

        {subscribers.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-neutral-200">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-neutral-100 text-xs uppercase tracking-[0.12em] text-neutral-500">
                <tr>
                  {/* <th className="px-4 py-4">ID</th> */}
                  <th className="px-4 py-4">Email</th>
                  <th className="px-4 py-4">Subscribed At</th>
                  <th className="px-4 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {subscribers.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-neutral-200 transition hover:bg-neutral-50"
                  >
                    {/* <td className="px-4 py-4 text-neutral-500">{item.id}</td> */}

                    <td className="px-4 py-4 font-medium text-[#111111]">
                      {item.email}
                    </td>

                    <td className="px-4 py-4 text-neutral-500">
                      {item.subscribedAt
                        ? new Date(item.subscribedAt).toLocaleString()
                        : "-"}
                    </td>

                    <td className="px-4 py-4 text-right">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="rounded-full border border-red-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-red-600 transition hover:bg-red-600 hover:text-white"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}