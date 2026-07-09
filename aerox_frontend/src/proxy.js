

import { NextResponse } from "next/server";

export function proxy() {
  // 🔥 TEMP: disable all redirects
  return NextResponse.next();
}

export const config = {
  matcher: [],
};