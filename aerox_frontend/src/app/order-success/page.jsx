import Link from "next/link";

export default async function OrderSuccessPage({ searchParams }) {
  const params = await searchParams;
  const orderNumber = params?.orderNumber || "";

  return (
    <main
      style={{
        minHeight: "70vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: 620,
          border: "1px solid #e5e7eb",
          borderRadius: 24,
          padding: 32,
          textAlign: "center",
          background: "#fff",
        }}
      >
        <div style={{ fontSize: 46, marginBottom: 12 }}>✓</div>
        <h1 style={{ margin: 0 }}>Payment successful</h1>
        <p style={{ color: "#4b5563", lineHeight: 1.6 }}>
          Your order has been confirmed. Save the order number below for your
          reference. No Trendz AeroX account was created.
        </p>

        {orderNumber && (
          <p style={{ fontSize: 20, fontWeight: 800 }}>
            Order: {orderNumber}
          </p>
        )}

        <Link href="/products">Continue Shopping</Link>
      </section>
    </main>
  );
}
