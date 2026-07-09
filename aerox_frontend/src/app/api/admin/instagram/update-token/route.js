



import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    const baseUrl = process.env.API_BASE_URL;
    const adminSecret = process.env.ADMIN_REFRESH_SECRET;

    if (!baseUrl) {
      return NextResponse.json(
        { error: "Missing API_BASE_URL" },
        { status: 500 }
      );
    }

    if (!adminSecret) {
      return NextResponse.json(
        { error: "Missing ADMIN_REFRESH_SECRET" },
        { status: 500 }
      );
    }

    const res = await fetch(`${baseUrl}/api/admin/instagram/update-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Admin-Refresh-Secret": adminSecret,
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const contentType = res.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await res.json()
      : { error: await res.text() };

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json(
      { error: error?.message || "Proxy failed" },
      { status: 500 }
    );
  }
}