import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE_NAME = "token";
const PROTECTED_ROUTES = ["/dashboard"];
const AUTH_ROUTES = ["/login", "/signup"];

function isRouteMatch(pathname: string, routes: string[]) {
    return routes.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`)
    );
}

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const hasSession = Boolean(request.cookies.get(SESSION_COOKIE_NAME)?.value);

    if (isRouteMatch(pathname, PROTECTED_ROUTES) && !hasSession) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("next", pathname);

        return NextResponse.redirect(loginUrl);
    }

    if (isRouteMatch(pathname, AUTH_ROUTES) && hasSession) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/login", "/signup"],
};
