

import { NextResponse } from "next/server";

export const revalidate = 900;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit") || "12";

    const baseUrl = process.env.API_BASE_URL;

    if (!baseUrl) {
      return NextResponse.json(
        {
          error: "Missing API_BASE_URL",
          posts: [],
        },
        { status: 500 }
      );
    }

    const backendUrl = `${baseUrl.replace(
      /\/$/,
      ""
    )}/api/instagram?limit=${encodeURIComponent(limit)}`;

    const res = await fetch(backendUrl, {
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 900 },
    });

    const contentType = res.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      const text = await res.text();

      return NextResponse.json(
        {
          error: "Backend did not return JSON",
          status: res.status,
          backendUrl,
          preview: text.slice(0, 300),
          posts: [],
        },
        { status: res.status || 500 }
      );
    }

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        {
          error:
            data?.error ||
            data?.message ||
            "Failed to load Instagram posts",
          posts: [],
        },
        { status: res.status }
      );
    }

    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control":
          "public, s-maxage=900, stale-while-revalidate=3600",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error?.message || "Unexpected server error",
        posts: [],
      },
      { status: 500 }
    );
  }
}