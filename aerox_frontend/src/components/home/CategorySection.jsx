"use client";

const fallbackCards = [
  { title: "Tote Bags", subtitle: "Structured everyday carry" },
  { title: "Sling Bags", subtitle: "Compact and elegant" },
  { title: "Satchel Bags", subtitle: "Smart work-ready styles" },
  { title: "Crossbody", subtitle: "Hands-free premium fashion" },
];

export default function CategorySection({
  categories = [],
  categoryId,
  setCategoryId,
}) {
  const cards =
    categories.length > 0
      ? categories.slice(0, 4).map((c) => ({
          title: c.name,
          subtitle: "Explore the collection",
          id: c.id,
        }))
      : fallbackCards;

  return (
    <section className="relative overflow-hidden bg-white">
      {/* background glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,0,0,0.03),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(0,0,0,0.04),transparent_34%)]" />

      <div className="relative mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
        
        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          
          <div className="animate-[fadeUp_0.7s_ease-out]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Shop by Category
            </p>

            <h2 className="mt-3 text-[28px] font-semibold tracking-[-0.03em] text-[#111111] sm:text-[38px]">
              Find your signature style
            </h2>
          </div>

          {/* FIXED DROPDOWN */}
          <div className="relative w-full animate-[fadeUp_0.9s_ease-out] sm:w-[260px]">
            <select
              value={categoryId}
              onChange={(e) =>
                setCategoryId(e.target.value ? Number(e.target.value) : "")
              }
              className="h-[50px] w-full appearance-none rounded-full border border-neutral-300 bg-white pl-5 pr-12 text-[14px] text-[#111111] outline-none transition-all duration-300 focus:border-neutral-500 focus:shadow-[0_8px_24px_rgba(0,0,0,0.06)]"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* CUSTOM ARROW */}
            <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-neutral-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-[16px] w-[16px]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </span>
          </div>
        </div>

        CATEGORY CARDS
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((item, index) => {
            const isActive = item.id && Number(categoryId) === Number(item.id);

            return (
              <button
                key={item.id || item.title}
                type="button"
                onClick={() => item.id && setCategoryId(item.id)}
                className={[
                  "group relative overflow-hidden rounded-[26px] border p-7 text-left transition-all duration-500 ease-out",
                  "animate-[fadeUp_0.8s_ease-out]",
                  isActive
                    ? "border-black bg-black text-white shadow-[0_20px_45px_rgba(0,0,0,0.16)]"
                    : "border-neutral-200 bg-[#f8f8f8] text-[#111111] hover:-translate-y-1 hover:border-neutral-300 hover:bg-white hover:shadow-[0_18px_40px_rgba(0,0,0,0.08)]",
                ].join(" ")}
                style={{
                  animationDelay: `${index * 120}ms`,
                  animationFillMode: "both",
                }}
              >
                {/* glow overlay */}
                <div
                  className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${
                    isActive
                      ? "opacity-100 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.14),transparent_35%)]"
                      : "opacity-0 group-hover:opacity-100 bg-[radial-gradient(circle_at_top_left,rgba(0,0,0,0.04),transparent_35%)]"
                  }`}
                />

                <div className="relative flex min-h-[210px] flex-col justify-between">
                  
                  <div>
                    <div
                      className={[
                        "mb-8 inline-flex rounded-full border px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] transition-all duration-300",
                        isActive
                          ? "border-white/20 bg-white/10 text-white"
                          : "border-neutral-300 bg-white text-neutral-500 group-hover:border-neutral-400 group-hover:text-neutral-700",
                      ].join(" ")}
                    >
                      Category
                    </div>

                    <h3
                      className={`text-[24px] font-semibold leading-[1.08] tracking-[-0.03em] ${
                        isActive ? "text-white" : "text-[#111111]"
                      }`}
                    >
                      {item.title}
                    </h3>

                    <p
                      className={`mt-3 text-[14px] leading-6 ${
                        isActive ? "text-white/75" : "text-neutral-600"
                      }`}
                    >
                      {item.subtitle}
                    </p>
                  </div>

                  <div className="mt-10 flex items-center justify-between">
                    <span
                      className={`text-[12px] font-semibold uppercase tracking-[0.16em] ${
                        isActive ? "text-white/90" : "text-neutral-800"
                      }`}
                    >
                      Explore
                    </span>

                    <span
                      className={[
                        "inline-flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-300",
                        isActive
                          ? "border-white/20 bg-white/10 text-white"
                          : "border-neutral-300 bg-white text-[#111111] group-hover:border-black group-hover:bg-black group-hover:text-white",
                      ].join(" ")}
                    >
                      →
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* animation */}
      <style jsx>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(26px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}