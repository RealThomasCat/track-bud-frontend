const DEFAULT_API_BASE_URL = "/api/v1";
const API_PREFIX = "/api/v1";

function trimTrailingSlash(value: string) {
    return value.replace(/\/+$/, "");
}

export function getVersionedApiBaseUrl(
    apiOrigin = process.env.NEXT_PUBLIC_API_URL
) {
    if (!apiOrigin) {
        return DEFAULT_API_BASE_URL;
    }

    const normalizedOrigin = trimTrailingSlash(apiOrigin);

    if (normalizedOrigin.endsWith(API_PREFIX)) {
        return normalizedOrigin;
    }

    return `${normalizedOrigin}${API_PREFIX}`;
}

export const apiBaseURL = getVersionedApiBaseUrl();
