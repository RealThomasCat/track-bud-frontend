import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public routes that do not require authentication
const PUBLIC_PATHS = ["/login", "/signup"];

/**
 * Proxy responsible for route protection.
 *
 * This runs before the request reaches any page and ensures:
 *  - Authenticated users access protected pages normally.
 *  - Unauthenticated users are redirected to /login.
 *  - Logged-in users cannot access /login or /signup.
 *
 * It determines authentication by calling the backend's /auth/me endpoint,
 * which validates the user's session using HttpOnly cookies.
 */
export async function proxy(req: NextRequest) {
    const path = req.nextUrl.pathname;

    // Skip all /auth/* routes so the browser can handle cookies directly
    if (path.startsWith("/auth")) {
        return NextResponse.next();
    }

    // STEP 1 — Check authentication state via backend /auth/me
    // Since the backend handles all cookie/session validation,
    // we simply forward any cookies from this request to the backend.
    // If the session is valid, /auth/me returns 200.
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

    // STEP 2 — Block access to protected routes when not logged in
    if (!isLoggedIn && !PUBLIC_PATHS.includes(path)) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // STEP 3 — Prevent authenticated users from visiting public pages
    if (isLoggedIn && PUBLIC_PATHS.includes(path)) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // STEP 4 — Allow request to continue normally
    return NextResponse.next();
}

/**
 * Apply proxy to all routes except Next.js internals:
 *  - /_next (framework assets)
 *  - /api (API routes)
 *  - /favicon.ico
 *
 * This ensures only real user-facing pages go through auth checks.
 */
export const config = {
    matcher: ["/((?!_next|api|favicon.ico).*)"],
};

/**
 * Note:
 *
 * The previous implementation checked for the "token" cookie directly inside
 * Next.js proxy. This works when frontend and backend share the same domain
 * (like localhost), but fails in production when deployed on separate domains
 * (Vercel frontend + Render backend) because HttpOnly cookies are isolated per domain.
 *
 * The new approach delegates authentication to the backend via /auth/me,
 * ensuring consistent session validation across different domains.
 */
