const DEFAULT_API_ORIGIN = "http://localhost:5000";
const API_PREFIX = "/api/v1";

function trimTrailingSlash(value: string) {
    return value.replace(/\/+$/, "");
}

export function getVersionedApiBaseUrl(
    apiOrigin = process.env.NEXT_PUBLIC_API_URL
) {
    const normalizedOrigin = trimTrailingSlash(
        apiOrigin || DEFAULT_API_ORIGIN
    );

    if (normalizedOrigin.endsWith(API_PREFIX)) {
        return normalizedOrigin;
    }

    return `${normalizedOrigin}${API_PREFIX}`;
}

export const apiBaseURL = getVersionedApiBaseUrl();
