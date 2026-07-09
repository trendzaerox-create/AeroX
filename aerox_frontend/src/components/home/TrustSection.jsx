"use client";

const items = [
  "Premium quality finish",
  "Secure checkout",
  "Fast shipping support",
  "Easy returns assistance",
];

export default function TrustSection() {
  return (
    <section className="relative overflow-hidden border-y border-neutral-200 bg-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,0,0,0.025),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(0,0,0,0.035),transparent_34%)]" />

      <div className="relative mx-auto max-w-[1280px] px-4 py-10 sm:px-6 sm:py-12 lg:px-10">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {items.map((item, index) => (
            <div
              key={item}
              className="group animate-[fadeUp_0.8s_ease-out] rounded-[22px] border border-neutral-200 bg-[#fafafa] px-5 py-6 text-center transition-all duration-500 ease-out hover:-translate-y-1 hover:border-neutral-300 hover:bg-white hover:shadow-[0_16px_36px_rgba(0,0,0,0.06)] sm:px-6 sm:py-7"
              style={{
                animationDelay: `${index * 100}ms`,
                animationFillMode: "both",
              }}
            >
              <div className="mx-auto mb-4 h-[1px] w-10 bg-black/10 transition-all duration-300 group-hover:w-14 group-hover:bg-black/20" />

              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#111111] sm:text-[13px]">
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(22px);
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