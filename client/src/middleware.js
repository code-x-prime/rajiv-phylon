import { NextResponse } from "next/server";

/**
 * Chrome DevTools requests /.well-known/appspecific/com.chrome.devtools.json.
 * Handling it here avoids hitting the app router and prevents a known
 * Node/Next streaming error (controller[kState].transformAlgorithm).
 */
export function middleware(request) {
  if (request.nextUrl.pathname === "/.well-known/appspecific/com.chrome.devtools.json") {
    return new NextResponse(null, { status: 404 });
  }
  return NextResponse.next();
}
