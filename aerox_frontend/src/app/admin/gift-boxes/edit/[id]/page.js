"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import GiftBoxForm from "@/components/admin/GiftBoxForm";
import {
  clearCurrentGiftBox,
  clearGiftBoxMessages,
  fetchAdminGiftBoxById,
  updateGiftBox,
} from "@/features/giftBoxes/giftBoxSlice";
import { useParams, useRouter } from "next/navigation";

export default function EditGiftBoxPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useParams();

  const { currentGiftBox, loading, submitting, error, success } = useSelector(
    (state) => state.giftBoxes
  );

  useEffect(() => {
    if (params?.id) {
      dispatch(fetchAdminGiftBoxById(params.id));
    }

    return () => {
      dispatch(clearCurrentGiftBox());
      dispatch(clearGiftBoxMessages());
    };
  }, [dispatch, params?.id]);

  const handleSubmit = async (payload) => {
    const result = await dispatch(
      updateGiftBox({ id: params.id, payload })
    );

    if (updateGiftBox.fulfilled.match(result)) {
      router.push("/admin/gift-boxes/list");
    }
  };

  if (loading || !currentGiftBox) {
    return <div className="p-6 text-black">Loading...</div>;
  }

  return (
    <div className="max-w-3xl p-6 text-black">
      <h1 className="mb-6 text-2xl font-bold text-black">Edit Gift Box</h1>

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
        initialData={currentGiftBox}
        onSubmit={handleSubmit}
        submitting={submitting}
        submitText="Update Gift Box"
      />
    </div>
  );
}