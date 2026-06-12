import axios from "axios";
import { apiBaseURL } from "@/lib/api-config";

// Shared Axios client used by all frontend service files.
export const api = axios.create({
    baseURL: apiBaseURL,
    withCredentials: true, // Required so the browser sends the HTTP-only auth cookie with requests.
    headers: { "Content-Type": "application/json" },
});

// Auth endpoints should handle their own 401 errors.
const AUTH_PATHS = ["/auth/login", "/auth/signup", "/auth/logout", "/auth/me"];

// Checks whether a failed request belongs to the auth module.
function isAuthRequest(url?: string) {
    return Boolean(url && AUTH_PATHS.some((path) => url.includes(path)));
}

// Global response handler for all requests made through `api`.
api.interceptors.response.use(
    // Successful responses pass through unchanged.
    (response) => response,

    // Failed responses are checked for expired/invalid sessions.
    async (error) => {
        // 401 means the backend rejected the current session/request.
        const isUnauthorized = error?.response?.status === 401;

        // Auth requests are excluded to avoid redirect loops or bad UX.
        const isAuthEndpoint = isAuthRequest(error.config?.url);

        // For any 401 errors that aren't from the auth module, clear the frontend session and redirect to login.
        if (isUnauthorized && !isAuthEndpoint) {
            // Lazy import avoids tightly coupling this API client to the auth store.
            const { useAuthStore } =
                await import("@/modules/auth/store/auth.store");

            // Clear stale frontend session state.
            useAuthStore.getState().clearSession();

            // Redirect only in the browser because `window` is not available on the server.
            const isBrowser = typeof window !== "undefined";

            // Avoid reloading login/signup if the user is already there.
            const isAlreadyOnAuthPage =
                isBrowser &&
                ["/login", "/signup"].includes(window.location.pathname);

            // Redirect to login if we're not already there.
            if (isBrowser && !isAlreadyOnAuthPage) {
                window.location.assign("/login");
            }
        }

        // Keep the original error available to the calling service/component.
        return Promise.reject(error);
    },
);
