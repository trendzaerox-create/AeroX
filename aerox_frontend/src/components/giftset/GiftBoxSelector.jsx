"use client";

export default function GiftBoxSelector({ giftBoxes, selectedGiftBoxId, onSelect }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {giftBoxes.map((box) => {
        const isSelected = selectedGiftBoxId === box.id;
        return (
          <button
            key={box.id}
            type="button"
            onClick={() => onSelect(box.id)}
            className={`rounded-2xl border p-4 text-left transition ${
              isSelected ? "border-black bg-black text-white" : "bg-white hover:border-black"
            }`}
          >
            <div className="mb-2 text-sm font-semibold">{box.name}</div>
            <div className="text-sm">₹{box.priceInr}</div>
            <div className="mt-1 text-xs opacity-70">Stock: {box.stock}</div>
          </button>
        );
      })}
    </div>
  );
}