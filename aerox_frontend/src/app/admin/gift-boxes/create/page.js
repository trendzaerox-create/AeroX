"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import GiftBoxForm from "@/components/admin/GiftBoxForm";
import {
  clearGiftBoxMessages,
  createGiftBox,
} from "@/features/giftBoxes/giftBoxSlice";
import { useRouter } from "next/navigation";

export default function CreateGiftBoxPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { submitting, error, success } = useSelector(
    (state) => state.giftBoxes
  );

  useEffect(() => {
    return () => {
      dispatch(clearGiftBoxMessages());
    };
  }, [dispatch]);

  const handleSubmit = async (payload) => {
    const result = await dispatch(createGiftBox(payload));
    if (createGiftBox.fulfilled.match(result)) {
      router.push("/admin/gift-boxes/list");
    }
  };

  return (
    <div className="max-w-3xl p-6 text-black">
      <h1 className="mb-6 text-2xl font-bold text-black">Create Gift Box</h1>

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-xl bg-green-50 p-3 text-sm text-green-600">
          {success}
        </div>
      )}

      <GiftBoxForm
        onSubmit={handleSubmit}
        submitting={submitting}
        submitText="Create Gift Box"
      />
    </div>
  );
}