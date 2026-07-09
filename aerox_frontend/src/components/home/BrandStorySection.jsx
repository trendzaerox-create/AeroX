"use client";

const items = [
  {
    title: "Italian-inspired elegance",
    text: "Shapes and finishes designed to feel refined, elevated, and timeless.",
  },
  {
    title: "Made for everyday use",
    text: "Spacious, practical designs that carry your daily essentials with ease.",
  },
  {
    title: "Premium visual appeal",
    text: "Luxury-focused styling created to stand out across work, travel, and events.",
  },
];

export default function BrandStorySection() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,0,0,0.03),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(0,0,0,0.04),transparent_36%)]" />

      <div className="relative mx-auto max-w-[1280px] px-4 py-14 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div className="animate-[fadeUp_0.7s_ease-out]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Brand Story
            </p>

            <h2 className="mt-3 max-w-[540px] text-[30px] font-semibold leading-[1.08] tracking-[-0.03em] text-[#111111] sm:text-[38px] lg:text-[42px]">
              Inspired by elegance. Designed for real life.
            </h2>

            <p className="mt-5 max-w-[620px] text-[15px] leading-7 text-neutral-600 sm:text-[16px]">
              Trendz Firenze brings together premium style and modern utility.
              Our collection is designed for women who want fashion that feels
              polished, practical, and effortless every day.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:gap-5">
            {items.map((item, index) => (
              <div
                key={item.title}
                className="group animate-[fadeUp_0.8s_ease-out] rounded-[24px] border border-neutral-200 bg-[#f8f8f8] p-6 transition-all duration-500 ease-out hover:-translate-y-1 hover:border-neutral-300 hover:bg-white hover:shadow-[0_18px_40px_rgba(0,0,0,0.08)] sm:p-7"
                style={{
                  animationDelay: `${index * 120}ms`,
                  animationFillMode: "both",
                }}
              >
                <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-full border border-neutral-300 bg-white text-[12px] font-semibold text-[#111111] transition-all duration-300 group-hover:border-black group-hover:bg-black group-hover:text-white">
                  0{index + 1}
                </div>

                <h3 className="text-[20px] font-semibold leading-tight text-[#111111] sm:text-[22px]">
                  {item.title}
                </h3>

                <p className="mt-3 text-[14px] leading-7 text-neutral-600 sm:text-[15px]">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(24px);
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