"use client";

import { useEffect, useState } from "react";

const DELHIVERY_TRACKING_URL =
  "https://www.delhivery.com/tracking";

const EMPTY_FORM = {
  courierName: "Delhivery",
  trackingId: "",
  trackingUrl: DELHIVERY_TRACKING_URL,
};

export default function ShipmentForm({
  order,
  saving = false,
  serverError = "",
  onSave,
  onCancel,
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [validationError, setValidationError] =
    useState("");

  useEffect(() => {
    setValidationError("");

    setForm({
      courierName:
        order?.shipment?.courierName || "Delhivery",

      trackingId:
        order?.shipment?.trackingId || "",

      trackingUrl:
        order?.shipment?.trackingUrl ||
        DELHIVERY_TRACKING_URL,
    });
  }, [order]);

  function updateField(event) {
    const { name, value } = event.target;

    setForm((current) => {
      const updated = {
        ...current,
        [name]: value,
      };

      if (
        name === "courierName" &&
        value.trim().toLowerCase() === "delhivery" &&
        !current.trackingUrl.trim()
      ) {
        updated.trackingUrl =
          DELHIVERY_TRACKING_URL;
      }

      return updated;
    });
  }

  async function submitForm(event) {
    event.preventDefault();

    const courierName = form.courierName.trim();
    const trackingId = form.trackingId.trim();
    const trackingUrl = form.trackingUrl.trim();

    if (!courierName) {
      setValidationError(
        "Courier name is required."
      );
      return;
    }

    if (!trackingId) {
      setValidationError(
        "Tracking ID / AWB is required."
      );
      return;
    }

    if (
      trackingUrl &&
      !trackingUrl.startsWith("http://") &&
      !trackingUrl.startsWith("https://")
    ) {
      setValidationError(
        "Tracking URL must start with http:// or https://"
      );
      return;
    }

    setValidationError("");

    await onSave({
      courierName,
      trackingId,
      trackingUrl: trackingUrl || null,
    });
  }

  if (!order) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-xl overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-neutral-200 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">
              Shipment details
            </p>

            <h2 className="mt-2 text-xl font-semibold text-neutral-950">
              {order.shipment
                ? "Update shipment"
                : "Add shipment"}
            </h2>

            <p className="mt-1 text-sm text-neutral-600">
              Order {order.orderNumber}
            </p>
          </div>

          <button
            type="button"
            disabled={saving}
            onClick={onCancel}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-300 text-lg text-neutral-600 transition hover:border-black hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close shipment form"
          >
            ×
          </button>
        </div>

        <form
          onSubmit={submitForm}
          className="space-y-5 p-6"
        >
          <div>
            <label
              htmlFor="courierName"
              className="mb-2 block text-sm font-medium text-neutral-800"
            >
              Courier name
            </label>

            <input
              id="courierName"
              name="courierName"
              value={form.courierName}
              onChange={updateField}
              disabled={saving}
              placeholder="Delhivery"
              className="h-12 w-full rounded-lg border border-neutral-300 px-4 text-sm outline-none transition focus:border-black disabled:bg-neutral-100"
            />
          </div>

          <div>
            <label
              htmlFor="trackingId"
              className="mb-2 block text-sm font-medium text-neutral-800"
            >
              Tracking ID / AWB
            </label>

            <input
              id="trackingId"
              name="trackingId"
              value={form.trackingId}
              onChange={updateField}
              disabled={saving}
              placeholder="Enter courier AWB"
              className="h-12 w-full rounded-lg border border-neutral-300 px-4 text-sm outline-none transition focus:border-black disabled:bg-neutral-100"
            />
          </div>

          <div>
            <label
              htmlFor="trackingUrl"
              className="mb-2 block text-sm font-medium text-neutral-800"
            >
              Tracking URL
            </label>

            <input
              id="trackingUrl"
              name="trackingUrl"
              type="url"
              value={form.trackingUrl}
              onChange={updateField}
              disabled={saving}
              placeholder="https://www.delhivery.com/tracking"
              className="h-12 w-full rounded-lg border border-neutral-300 px-4 text-sm outline-none transition focus:border-black disabled:bg-neutral-100"
            />

            <p className="mt-2 text-xs leading-5 text-neutral-500">
              Keep this blank for Delhivery to use the
              configured default tracking URL.
            </p>
          </div>

          {validationError ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {validationError}
            </div>
          ) : null}

          {serverError ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {serverError}
            </div>
          ) : null}

          <div className="flex flex-col-reverse gap-3 border-t border-neutral-200 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              disabled={saving}
              onClick={onCancel}
              className="inline-flex h-11 items-center justify-center rounded-lg border border-neutral-300 px-5 text-sm font-semibold text-neutral-800 transition hover:border-black disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-11 items-center justify-center rounded-lg bg-black px-6 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : "Save & send email"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}