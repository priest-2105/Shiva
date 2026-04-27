import { cookies } from "next/headers";

export const FIGMA_STATE_COOKIE = "figma_oauth_state";
export const FIGMA_TOKEN_COOKIE = "figma_oauth_token";

export type FigmaTokenPayload = {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresAt: number;
    userId: string;
    scope: string;
};

export type ParsedFigmaSelection = {
    fileKey: string;
    nodeId?: string;
};

const DEFAULT_SCOPE = "file_content:read";

function getRequiredEnv(name: "FIGMA_CLIENT_ID" | "FIGMA_CLIENT_SECRET" | "FIGMA_OAUTH_REDIRECT_URI") {
    const value = process.env[name];

    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }

    return value;
}

export function getFigmaConfig() {
    return {
        clientId: getRequiredEnv("FIGMA_CLIENT_ID"),
        clientSecret: getRequiredEnv("FIGMA_CLIENT_SECRET"),
        redirectUri: getRequiredEnv("FIGMA_OAUTH_REDIRECT_URI"),
        scope: process.env.FIGMA_OAUTH_SCOPES?.trim() || DEFAULT_SCOPE,
        authBaseUrl: process.env.FIGMA_AUTH_BASE_URL?.trim() || "https://www.figma.com",
        apiBaseUrl: process.env.FIGMA_API_BASE_URL?.trim() || "https://api.figma.com",
    };
}

export function isFigmaConfigured() {
    return Boolean(
        process.env.FIGMA_CLIENT_ID &&
        process.env.FIGMA_CLIENT_SECRET &&
        process.env.FIGMA_OAUTH_REDIRECT_URI
    );
}

export function createFigmaOAuthState() {
    return crypto.randomUUID();
}

export function buildFigmaAuthorizationUrl(state: string) {
    const { clientId, redirectUri, scope, authBaseUrl } = getFigmaConfig();
    const url = new URL("/oauth", authBaseUrl);

    url.searchParams.set("client_id", clientId);
    url.searchParams.set("redirect_uri", redirectUri);
    url.searchParams.set("scope", scope);
    url.searchParams.set("state", state);
    url.searchParams.set("response_type", "code");

    return url.toString();
}

function buildBasicAuthHeader(clientId: string, clientSecret: string) {
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    return `Basic ${credentials}`;
}

export async function exchangeCodeForToken(code: string) {
    const { clientId, clientSecret, redirectUri, scope, apiBaseUrl } = getFigmaConfig();

    const body = new URLSearchParams({
        redirect_uri: redirectUri,
        code,
        grant_type: "authorization_code",
    });

    const response = await fetch(new URL("/v1/oauth/token", apiBaseUrl), {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: buildBasicAuthHeader(clientId, clientSecret),
        },
        body: body.toString(),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        const message = typeof data?.message === "string" ? data.message : "Failed to exchange Figma OAuth code.";
        throw new Error(message);
    }

    return {
        accessToken: String(data.access_token),
        refreshToken: String(data.refresh_token ?? ""),
        tokenType: String(data.token_type ?? "bearer"),
        expiresAt: Date.now() + Number(data.expires_in ?? 0) * 1000,
        userId: String(data.user_id_string ?? data.user_id ?? ""),
        scope,
    } satisfies FigmaTokenPayload;
}

export async function refreshFigmaToken(refreshToken: string, currentScope: string) {
    const { clientId, clientSecret, apiBaseUrl } = getFigmaConfig();

    const body = new URLSearchParams({
        refresh_token: refreshToken,
    });

    const response = await fetch(new URL("/v1/oauth/refresh", apiBaseUrl), {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: buildBasicAuthHeader(clientId, clientSecret),
        },
        body: body.toString(),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        const message = typeof data?.message === "string" ? data.message : "Failed to refresh Figma token.";
        throw new Error(message);
    }

    return {
        accessToken: String(data.access_token),
        refreshToken,
        tokenType: String(data.token_type ?? "bearer"),
        expiresAt: Date.now() + Number(data.expires_in ?? 0) * 1000,
        userId: "",
        scope: currentScope,
    } satisfies FigmaTokenPayload;
}

export async function readStoredFigmaToken() {
    const cookieStore = await cookies();
    const raw = cookieStore.get(FIGMA_TOKEN_COOKIE)?.value;

    if (!raw) {
        return null;
    }

    try {
        return JSON.parse(raw) as FigmaTokenPayload;
    } catch {
        return null;
    }
}

export async function writeStoredFigmaToken(payload: FigmaTokenPayload) {
    const cookieStore = await cookies();

    cookieStore.set(FIGMA_TOKEN_COOKIE, JSON.stringify(payload), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        expires: new Date(payload.expiresAt),
    });
}

export async function clearStoredFigmaToken() {
    const cookieStore = await cookies();
    cookieStore.delete(FIGMA_TOKEN_COOKIE);
}

export async function getValidFigmaAccessToken() {
    const stored = await readStoredFigmaToken();

    if (!stored) {
        return null;
    }

    if (stored.expiresAt > Date.now() + 60_000) {
        return stored;
    }

    if (!stored.refreshToken) {
        await clearStoredFigmaToken();
        return null;
    }

    try {
        const refreshed = await refreshFigmaToken(stored.refreshToken, stored.scope);
        const merged = {
            ...stored,
            ...refreshed,
            userId: stored.userId,
        };

        await writeStoredFigmaToken(merged);
        return merged;
    } catch {
        await clearStoredFigmaToken();
        return null;
    }
}

export function parseFigmaSelectionInput(input: string) {
    const trimmed = input.trim();

    if (!trimmed) {
        throw new Error("Paste a Figma frame URL or enter a file key.");
    }

    if (/^https?:\/\//i.test(trimmed)) {
        return parseFigmaUrl(trimmed);
    }

    return parseFigmaReference(trimmed);
}

function parseFigmaReference(input: string): ParsedFigmaSelection {
    const [fileKeyPart, nodeIdPart] = input.split(",");
    const fileKey = fileKeyPart?.trim();
    const nodeId = nodeIdPart?.trim();

    if (!fileKey) {
        throw new Error("A Figma file key is required.");
    }

    return {
        fileKey,
        nodeId: nodeId || undefined,
    };
}

export function parseFigmaUrl(input: string): ParsedFigmaSelection {
    let url: URL;

    try {
        url = new URL(input);
    } catch {
        throw new Error("Invalid Figma URL.");
    }

    const segments = url.pathname.split("/").filter(Boolean);
    const fileIndex = segments.findIndex((segment) => segment === "file" || segment === "design");
    const fileKey = fileIndex >= 0 ? segments[fileIndex + 1] : "";
    const nodeId = url.searchParams.get("node-id")?.trim() || undefined;

    if (!fileKey) {
        throw new Error("Could not extract a Figma file key from that URL.");
    }

    return { fileKey, nodeId };
}

export async function figmaApiFetch(path: string, accessToken: string) {
    const { apiBaseUrl } = getFigmaConfig();
    const response = await fetch(new URL(path, apiBaseUrl), {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        const message =
            typeof data?.message === "string"
                ? data.message
                : typeof data?.err === "string"
                    ? data.err
                    : "Figma API request failed.";

        throw new Error(message);
    }

    return data;
}
