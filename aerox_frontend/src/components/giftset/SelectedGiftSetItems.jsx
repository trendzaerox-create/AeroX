
"use client";
import { FaGift } from "react-icons/fa6";


function getItemImage(item) {
  if (item?.productImageUrl) return item.productImageUrl;
  if (item?.productImagePath) return item.productImagePath;
  if (Array.isArray(item?.productImages) && item.productImages.length > 0) {
    return item.productImages[0];
  }
  return "/placeholder.png";
}

function getGiftBoxImage(item) {
  if (item?.giftBoxImagePath) return item.giftBoxImagePath;
  return "/placeholder.png";
}

export default function SelectedGiftSetItems({ items, onRemove }) {
  if (!items?.length) {
    return (
      <div className="overflow-hidden rounded-[30px] border border-dashed border-[#d9d9d9] bg-[linear-gradient(180deg,#ffffff_0%,#fafafa_100%)] px-6 py-12 text-center shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
        <div className="mx-auto flex max-w-md flex-col items-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[#ececec] bg-white text-xl text-[#111] shadow-sm">
  <FaGift className="h-6 w-6" />
</div>
          <h3 className="text-lg font-semibold tracking-[0.02em] text-[#111]">
            Your gift set is empty
          </h3>
          <p className="mt-2 text-sm leading-6 text-[#666]">
            Start selecting products and pair each one with a gift box to build
            a beautiful premium gift set.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {items.map((item, index) => {
        const removeKey =
          item.cartItemId ??
          item.guestItemKey ??
          `${item.productId}-${item.giftBoxId}-${index}`;

        return (
          <div
            key={removeKey}
            className="group overflow-hidden rounded-[30px] border border-[#e9e9e9] bg-[linear-gradient(180deg,#ffffff_0%,#fcfcfc_100%)] shadow-[0_10px_35px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-[2px] hover:shadow-[0_18px_45px_rgba(0,0,0,0.07)]"
          >
            <div className="border-b border-[#f1f1f1] bg-[linear-gradient(90deg,#fbfbfb_0%,#ffffff_50%,#fbfbfb_100%)] px-5 py-4 md:px-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.28em] text-[#8a8a8a]">
                    Selected Item
                  </p>
                  <h3 className="mt-1 text-base font-semibold text-[#111] md:text-lg">
                    Gift Set Product {index + 1}
                  </h3>
                </div>

                <div className="inline-flex items-center rounded-full border border-[#e8e8e8] bg-white px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-[#555] shadow-sm">
                  Ready for gifting
                </div>
              </div>
            </div>

            <div className="p-5 md:p-6">
              <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_220px]">
                <div className="rounded-[24px] border border-[#ededed] bg-white p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-[22px] border border-[#f0f0f0] bg-[linear-gradient(180deg,#fafafa_0%,#f3f3f3_100%)] sm:w-28">
                      <img
                        src={getItemImage(item)}
                        alt={item.productTitle || `Product ${index + 1}`}
                        className="h-full w-full object-contain p-3 transition duration-300 group-hover:scale-[1.02]"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] uppercase tracking-[0.24em] text-[#8a8a8a]">
                        Product
                      </p>
                      <h4 className="mt-2 line-clamp-2 text-[15px] font-semibold leading-6 text-[#111] md:text-base">
                        {item.productTitle}
                      </h4>

                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-[#f6f6f6] px-3 py-1 text-xs font-medium text-[#555]">
                          Premium Pick
                        </span>
                        <span className="rounded-full border border-[#ececec] px-3 py-1 text-xs font-medium text-[#555]">
                          ₹{item.productPriceInr}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[24px] border border-[#ededed] bg-white p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-[22px] border border-[#f0f0f0] bg-[linear-gradient(180deg,#fafafa_0%,#f3f3f3_100%)] sm:w-28">
                      <img
                        src={getGiftBoxImage(item)}
                        alt={item.giftBoxName || `Gift Box ${index + 1}`}
                        className="h-full w-full object-contain p-3 transition duration-300 group-hover:scale-[1.02]"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] uppercase tracking-[0.24em] text-[#8a8a8a]">
                        Gift Box
                      </p>
                      <h4 className="mt-2 line-clamp-2 text-[15px] font-semibold leading-6 text-[#111] md:text-base">
                        {item.giftBoxName}
                      </h4>

                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-[#f6f6f6] px-3 py-1 text-xs font-medium text-[#555]">
                          Gift Ready
                        </span>
                        <span className="rounded-full border border-[#ececec] px-3 py-1 text-xs font-medium text-[#555]">
                          ₹{item.giftBoxPriceInr}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex h-full flex-col justify-between rounded-[24px] border border-[#ececec] bg-[linear-gradient(180deg,#ffffff_0%,#f9f9f9_100%)] p-4 shadow-sm">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.24em] text-[#8a8a8a]">
                      Line Total
                    </p>
                    <p className="mt-2 text-2xl font-semibold tracking-tight text-[#111]">
                      ₹{item.lineTotalInr}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[#666]">
                      Product and gift box combined total for this selection.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onRemove(removeKey)}
                    className="mt-5 inline-flex w-full items-center justify-center rounded-full border border-[#d8d8d8] bg-white px-5 py-3 text-sm font-medium text-[#222] transition duration-300 hover:border-black hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Remove Item
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}