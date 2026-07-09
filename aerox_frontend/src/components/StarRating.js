"use client";

export default function StarRating({
  value = 0,
  size = "16px",
  showNumber = false,
  numberValue = "",
}) {
  const rounded = Math.round(value);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
      }}
    >
      <div style={{ display: "flex", gap: "2px" }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            style={{
              color: i <= rounded ? "#f5c518" : "#d0d0d0",
              fontSize: size,
              lineHeight: 1,
            }}
          >
            ★
          </span>
        ))}
      </div>

      {showNumber && (
        <span
          style={{
            fontSize: "14px",
            color: "#555",
            fontWeight: "600",
          }}
        >
          {numberValue}
        </span>
      )}
    </div>
  );
}