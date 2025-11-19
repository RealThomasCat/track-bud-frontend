import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Publicly accessible pages
const PUBLIC_PATHS = ["/login", "/signup"];

/**
 * Global authentication proxy.
 *
 * This protects routes by asking the backend whether the user is authenticated.
 * We do NOT read cookies here because the auth cookie lives on the backend domain.
 * Instead, we call /auth/me, which validates the session using backend cookies.
 */
export async function proxy(req: NextRequest) {
    const path = req.nextUrl.pathname;

    // Skip API routes and static assets
    if (
        path.startsWith("/api") ||
        path.startsWith("/_next") ||
        path.startsWith("/favicon.ico")
    ) {
        return NextResponse.next();
    }

    // Allow browser → backend login/signup/logout requests
    if (path.startsWith("/auth")) {
        return NextResponse.next();
    }

    // Determine authentication by asking backend
    const authResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
        {
            method: "GET",
            credentials: "include",
            headers: {
                cookie: req.headers.get("cookie") || "",
            },
        }
    );

    const isLoggedIn = authResponse.status === 200;

    // Not logged in → trying to access protected route
    if (!isLoggedIn && !PUBLIC_PATHS.includes(path)) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // Already authenticated → trying to access /login or /signup
    if (isLoggedIn && PUBLIC_PATHS.includes(path)) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Allow request to proceed
    return NextResponse.next();
}

// Apply proxy to all pages except Next.js internals
export const config = {
    matcher: ["/((?!_next|api|favicon.ico).*)"],
};

/**
 * Note:
 * HttpOnly cookies issued by the backend cannot be read from the frontend domain.
 * Therefore, route protection cannot use req.cookies in proxy.
 *
 * We delegate authentication to the backend /auth/me endpoint,
 * which safely validates the user's session using backend-managed cookies.
 */
