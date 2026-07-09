"use client";

import { useState } from "react";

function formatDate(value) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function ShipmentTrackingCard({
  shipment,
  compact = false,
}) {
  const [copied, setCopied] = useState(false);

  if (!shipment) {
    return null;
  }

  async function copyTrackingId() {
    try {
      await navigator.clipboard.writeText(
        shipment.trackingId
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1600);
    } catch {
      window.prompt(
        "Copy tracking ID",
        shipment.trackingId
      );
    }
  }

  return (
    <section
      className={`border border-neutral-200 bg-neutral-50 ${
        compact ? "p-4" : "p-5 sm:p-6"
      }`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
            Shipment tracking
          </p>

          <h3 className="mt-2 text-lg font-semibold text-neutral-950">
            Your order is on the way
          </h3>
        </div>

        <span className="w-fit border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
          Shipped
        </span>
      </div>

      <dl
        className={`grid gap-4 ${
          compact
            ? "mt-4 sm:grid-cols-2"
            : "mt-6 sm:grid-cols-3"
        }`}
      >
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Courier
          </dt>

          <dd className="mt-1 text-sm font-semibold text-neutral-950">
            {shipment.courierName || "—"}
          </dd>
        </div>

        <div>
          <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Tracking ID / AWB
          </dt>

          <dd className="mt-1 break-all text-sm font-semibold text-neutral-950">
            {shipment.trackingId || "—"}
          </dd>
        </div>

        {!compact ? (
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Shipped on
            </dt>

            <dd className="mt-1 text-sm font-semibold text-neutral-950">
              {formatDate(shipment.shippedAt)}
            </dd>
          </div>
        ) : null}
      </dl>

      <div className="mt-5 flex flex-wrap gap-3">
        {shipment.trackingUrl ? (
          <a
            href={shipment.trackingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center justify-center bg-black px-4 text-sm font-semibold text-white transition hover:bg-neutral-800"
          >
            Track shipment
          </a>
        ) : null}

        <button
          type="button"
          onClick={copyTrackingId}
          className="inline-flex h-10 items-center justify-center border border-neutral-300 bg-white px-4 text-sm font-semibold text-neutral-800 transition hover:border-black"
        >
          {copied
            ? "Copied"
            : "Copy tracking ID"}
        </button>
      </div>
    </section>
  );
}