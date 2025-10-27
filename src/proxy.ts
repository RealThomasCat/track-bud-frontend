import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login", "/signup"];

export function proxy(req: NextRequest) {
    // Read jwt token from cookies
    const token = req.cookies.get("token")?.value;

    // Get the current url path
    const path = req.nextUrl.pathname;

    // If no token and trying to access a protected route → redirect to login
    if (!token && !PUBLIC_PATHS.includes(path)) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // If token exists and trying to access a public route → redirect to dashboard
    if (token && PUBLIC_PATHS.includes(path)) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Otherwise let the request pass through
    return NextResponse.next();
}

// This tells Next.js to run the middleware on all routes except for:
// Internal Next.js assets (/_next/...), API routes (/api/...), and favicon.ico
// Without this, the middleware could run on static assets and break them
export const config = {
    matcher: ["/((?!_next|api|favicon.ico).*)"],
};

// NOTE: This runs before rendering so users never see a flash of the wrong page.
