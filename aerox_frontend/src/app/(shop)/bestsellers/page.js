import BestSellerSection from "@/components/home/BestSellerSection";

async function getProducts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/products?page=0&size=50`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await res.json();

    if (Array.isArray(data)) return data;
    if (Array.isArray(data.products)) return data.products;
    if (Array.isArray(data.content)) return data.content;

    return [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export default async function BestSellersPage() {
  const products = await getProducts();

  const bestSellerProducts = products.slice(0, 50);

  return (
    <main className="relative overflow-hidden bg-[#f8f7f4] text-[#111111]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.7),rgba(248,247,244,0.95)),radial-gradient(circle_at_top_left,rgba(0,0,0,0.04),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(0,0,0,0.05),transparent_28%)]" />

      <section className="relative mx-auto max-w-[1280px] px-4 pt-12 pb-10 sm:px-6 sm:pt-14 sm:pb-12 lg:px-10 lg:pt-18 lg:pb-16">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[32px] border border-neutral-200 bg-white px-6 py-8 shadow-[0_18px_50px_rgba(0,0,0,0.04)] sm:px-8 sm:py-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-500">
              Best Sellers
            </p>

            <h1 className="mt-4 max-w-[700px] text-[34px] font-semibold tracking-[-0.05em] sm:text-[42px] lg:text-[56px]">
              Bestselling handbags
              <span className="mt-1 block text-neutral-500">
                with proven customer love
              </span>
            </h1>

            <p className="mt-5 max-w-[680px] text-[14px] leading-7 text-neutral-600 sm:text-[15px]">
              These standout pieces reflect the most loved styles in the Trendz
              Firenze collection. Designed with premium appeal and everyday
              versatility, they represent the products customers return to again
              and again.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] border border-neutral-200 bg-[#fcfcfb] px-5 py-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                  Why they lead
                </p>
                <p className="mt-3 text-[14px] leading-7 text-neutral-600">
                  Strong silhouettes, premium styling, practical storage, and a
                  polished luxury-inspired finish.
                </p>
              </div>

              <div className="rounded-[24px] border border-neutral-200 bg-[#fcfcfb] px-5 py-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                  Customer appeal
                </p>
                <p className="mt-3 text-[14px] leading-7 text-neutral-600">
                  Built for modern everyday fashion, gifting, office use, and
                  statement styling across multiple occasions.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[30px] border border-neutral-200 bg-[#111111] px-6 py-7 text-white shadow-[0_18px_50px_rgba(0,0,0,0.08)]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">
                Top Picks
              </p>
              <p className="mt-3 text-[44px] font-semibold tracking-[-0.05em]">
                {bestSellerProducts.length}
              </p>
              <p className="mt-2 text-[14px] leading-7 text-white/75">
                A focused selection of the strongest-performing products from
                your current collection.
              </p>
            </div>

            <div className="rounded-[30px] border border-neutral-200 bg-white px-6 py-7 shadow-[0_18px_50px_rgba(0,0,0,0.04)]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                Best Seller Traits
              </p>

              <div className="mt-5 space-y-4">
                <div className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-black" />
                  <p className="text-[14px] leading-7 text-neutral-600">
                    Elegant designs with strong visual impact
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-black" />
                  <p className="text-[14px] leading-7 text-neutral-600">
                    Balanced for style, comfort, and utility
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-black" />
                  <p className="text-[14px] leading-7 text-neutral-600">
                    Consistent customer interest and repeat appeal
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-[980px] px-4 pb-10 text-center sm:px-6 lg:px-10 lg:pb-14">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-500">
          Curated Bestseller Edit
        </p>

        <h2 className="mt-4 text-[28px] font-semibold tracking-[-0.04em] text-[#111111] sm:text-[34px] lg:text-[42px]">
          The collection customers choose first
        </h2>

        <p className="mx-auto mt-4 max-w-[760px] text-[14px] leading-7 text-neutral-600 sm:text-[15px]">
          This selection highlights the most commercially appealing and
          customer-favorite handbags — refined pieces that combine premium
          presentation with practical daily wearability.
        </p>
      </section>

      <section className="relative">
        <BestSellerSection products={bestSellerProducts} />
      </section>

      <section className="relative mx-auto max-w-[1280px] px-4 pt-8 pb-14 sm:px-6 sm:pt-10 sm:pb-16 lg:px-10 lg:pt-12 lg:pb-20">
        <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[28px] border border-neutral-200 bg-white px-6 py-8 shadow-[0_16px_40px_rgba(0,0,0,0.04)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
              Performance Insight
            </p>

            <h3 className="mt-3 text-[24px] font-semibold tracking-[-0.03em] text-[#111111]">
              Best sellers build trust faster
            </h3>

            <p className="mt-4 text-[14px] leading-7 text-neutral-600">
              High-performing products often act as the strongest entry point
              for new customers. They help establish confidence in your brand
              and create a premium first impression through styles that already
              resonate well.
            </p>

            <div className="mt-6 rounded-[22px] border border-neutral-200 bg-[#faf9f7] px-5 py-5">
              <p className="text-[12px] font-medium text-neutral-500">
                Showing {bestSellerProducts.length} handpicked bestseller
                product{bestSellerProducts.length !== 1 ? "s" : ""}.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[28px] border border-neutral-200 bg-white px-5 py-6 shadow-[0_12px_30px_rgba(0,0,0,0.03)] transition-transform duration-300 hover:-translate-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                Premium Appeal
              </p>
              <h4 className="mt-2 text-[20px] font-semibold tracking-[-0.03em] text-[#111111]">
                Strong visual identity
              </h4>
              <p className="mt-3 text-[14px] leading-7 text-neutral-600">
                Best sellers typically carry the clearest expression of your
                brand’s style language and quality perception.
              </p>
            </div>

            <div className="rounded-[28px] border border-neutral-200 bg-white px-5 py-6 shadow-[0_12px_30px_rgba(0,0,0,0.03)] transition-transform duration-300 hover:-translate-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                Versatile Use
              </p>
              <h4 className="mt-2 text-[20px] font-semibold tracking-[-0.03em] text-[#111111]">
                Easy to style
              </h4>
              <p className="mt-3 text-[14px] leading-7 text-neutral-600">
                These products often fit more wardrobes and occasions, making
                them easier for customers to choose with confidence.
              </p>
            </div>

            <div className="rounded-[28px] border border-neutral-200 bg-white px-5 py-6 shadow-[0_12px_30px_rgba(0,0,0,0.03)] transition-transform duration-300 hover:-translate-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                Commercial Strength
              </p>
              <h4 className="mt-2 text-[20px] font-semibold tracking-[-0.03em] text-[#111111]">
                Consistent interest
              </h4>
              <p className="mt-3 text-[14px] leading-7 text-neutral-600">
                Strong repeat demand makes these styles ideal for highlighting
                in campaigns, homepage blocks, and promotional storytelling.
              </p>
            </div>

            <div className="rounded-[28px] border border-neutral-200 bg-[#111111] px-5 py-6 text-white shadow-[0_12px_30px_rgba(0,0,0,0.06)] transition-transform duration-300 hover:-translate-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
                Trendz Firenze
              </p>
              <h4 className="mt-2 text-[20px] font-semibold tracking-[-0.03em]">
                Most loved edit
              </h4>
              <p className="mt-3 text-[14px] leading-7 text-white/75">
                A curated showcase of your strongest-performing handbags,
                presented with a cleaner and more editorial luxury layout.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

















