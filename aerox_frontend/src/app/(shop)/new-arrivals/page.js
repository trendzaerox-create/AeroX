import NewArrivalSection from "@/components/home/NewArrivalSection";

async function getProducts() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/api/products`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await res.json();

    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data.products)) {
      return data.products;
    }

    if (Array.isArray(data.content)) {
      return data.content;
    }

    return [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export default async function NewArrivalsPage() {
  const products = await getProducts();
  const newArrivalProducts = products.slice(0, 8);

  return (
    <main className="relative overflow-hidden bg-[#fafafa] text-[#111111]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,0,0,0.04),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(0,0,0,0.05),transparent_32%)]" />

      <section className="relative mx-auto max-w-[1280px] px-4 pt-12 pb-8 sm:px-6 sm:pt-14 sm:pb-10 lg:px-10 lg:pt-16 lg:pb-12">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="opacity-100 translate-y-0 transition-all duration-700">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-500">
              New Arrivals
            </p>

            <h1 className="mt-4 max-w-[760px] text-[34px] font-semibold tracking-[-0.05em] sm:text-[42px] lg:text-[58px]">
              Fresh luxury styles,
              <span className="block text-neutral-500">
                thoughtfully added for the season
              </span>
            </h1>

            <p className="mt-5 max-w-[700px] text-[14px] leading-7 text-neutral-600 sm:text-[15px]">
              Discover the latest additions to our collection — refined
              silhouettes, elegant finishes, and versatile statement pieces
              designed to elevate your everyday look with premium appeal.
            </p>
          </div>

          <div className="opacity-100 translate-y-0 transition-all duration-700 delay-100">
            <div className="rounded-[28px] border border-neutral-200 bg-white/80 p-5 shadow-[0_16px_40px_rgba(0,0,0,0.04)] backdrop-blur-sm sm:p-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-[22px] border border-neutral-200 bg-[#fcfcfc] px-4 py-5 text-center">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                    Curated
                  </p>
                  <p className="mt-2 text-[24px] font-semibold tracking-[-0.04em]">
                    {newArrivalProducts.length}
                  </p>
                </div>

                <div className="rounded-[22px] border border-neutral-200 bg-[#fcfcfc] px-4 py-5 text-center">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                    Quality
                  </p>
                  <p className="mt-2 text-[24px] font-semibold tracking-[-0.04em]">
                    Premium
                  </p>
                </div>

                <div className="rounded-[22px] border border-neutral-200 bg-[#fcfcfc] px-4 py-5 text-center">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                    Style
                  </p>
                  <p className="mt-2 text-[24px] font-semibold tracking-[-0.04em]">
                    Elegant
                  </p>
                </div>
              </div>

              <p className="mt-5 text-[13px] leading-6 text-neutral-600">
                A handpicked edit of the newest designs, chosen for modern
                sophistication, daily practicality, and timeless visual appeal.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-[1280px] px-4 pb-8 sm:px-6 sm:pb-10 lg:px-10 lg:pb-12">
        <div className="rounded-[28px] border border-neutral-200 bg-white px-5 py-5 shadow-[0_18px_50px_rgba(0,0,0,0.04)] sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                Collection Overview
              </p>
              <h2 className="mt-2 text-[24px] font-semibold tracking-[-0.03em]">
                Newly added pieces for your wardrobe
              </h2>
              <p className="mt-2 max-w-[760px] text-[14px] leading-7 text-neutral-600">
                Explore the latest styles now available in our catalogue. Each
                piece is selected to bring together fashion-forward design,
                polished structure, and a premium everyday feel.
              </p>
            </div>

            <div className="text-[12px] font-medium text-neutral-500">
              Showing {newArrivalProducts.length} product
              {newArrivalProducts.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>
      </section>

      <section className="relative">
        <NewArrivalSection products={newArrivalProducts} />
      </section>

      <section className="relative mx-auto max-w-[1280px] px-4 pt-4 pb-14 sm:px-6 sm:pt-6 sm:pb-16 lg:px-10 lg:pt-8 lg:pb-20">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[24px] border border-neutral-200 bg-white px-5 py-6 shadow-[0_12px_30px_rgba(0,0,0,0.03)] transition-transform duration-300 hover:-translate-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
              Premium Finish
            </p>
            <h3 className="mt-2 text-[20px] font-semibold tracking-[-0.03em]">
              Elevated details
            </h3>
            <p className="mt-3 text-[14px] leading-7 text-neutral-600">
              Discover styles crafted with attention to detail, clean structure,
              and an elevated visual finish that complements modern wardrobes.
            </p>
          </div>

          <div className="rounded-[24px] border border-neutral-200 bg-white px-5 py-6 shadow-[0_12px_30px_rgba(0,0,0,0.03)] transition-transform duration-300 hover:-translate-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
              Everyday Luxury
            </p>
            <h3 className="mt-2 text-[20px] font-semibold tracking-[-0.03em]">
              Style meets function
            </h3>
            <p className="mt-3 text-[14px] leading-7 text-neutral-600">
              Our newest arrivals are selected to feel luxurious while still
              being practical enough for work, outings, travel, and daily use.
            </p>
          </div>

          <div className="rounded-[24px] border border-neutral-200 bg-white px-5 py-6 shadow-[0_12px_30px_rgba(0,0,0,0.03)] transition-transform duration-300 hover:-translate-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
              Fresh Selection
            </p>
            <h3 className="mt-2 text-[20px] font-semibold tracking-[-0.03em]">
              New season energy
            </h3>
            <p className="mt-3 text-[14px] leading-7 text-neutral-600">
              Refresh your collection with the latest designs that bring a
              modern, polished, and trend-aware edge to your overall style.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}