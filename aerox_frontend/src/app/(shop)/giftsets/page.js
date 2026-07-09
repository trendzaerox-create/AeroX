



import GiftSetBuilder from "@/components/giftset/GiftSetBuilder";

async function getProducts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/products`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();

    if (Array.isArray(data)) return data;
    if (Array.isArray(data.products)) return data.products;
    if (Array.isArray(data.content)) return data.content;

    return [];
  } catch (error) {
    console.error("Failed to fetch products", error);
    return [];
  }
}

export default async function GiftSetsPage() {
  const products = await getProducts();

  return <GiftSetBuilder products={products} />;
}