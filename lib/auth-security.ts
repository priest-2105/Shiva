import { z } from "zod";
import { createHash, randomBytes } from "crypto";

const attempts = new Map<string, number[]>();

export const passwordSchema = z
    .string()
    .min(10, "Password must be at least 10 characters.")
    .max(128, "Password is too long.")
    .regex(/[a-z]/, "Password must include a lowercase letter.")
    .regex(/[A-Z]/, "Password must include an uppercase letter.")
    .regex(/[0-9]/, "Password must include a number.");
export const loginPasswordSchema = z.string().min(1).max(128);

export const emailSchema = z.string().trim().email();
export const nameSchema = z.string().trim().min(2).max(80);

export function normalizeEmail(email: string) {
    return email.trim().toLowerCase();
}

export function getSafeCallbackPath(callbackUrl: string | null | undefined, fallback = "/chat/1") {
    if (!callbackUrl) {
        return fallback;
    }

    if (!callbackUrl.startsWith("/") || callbackUrl.startsWith("//")) {
        return fallback;
    }

    return callbackUrl;
}

export function recordRateLimitHit(key: string, limit: number, windowMs: number) {
    const now = Date.now();
    const windowStart = now - windowMs;
    const recent = (attempts.get(key) || []).filter((timestamp) => timestamp > windowStart);

    recent.push(now);
    attempts.set(key, recent);

    return recent.length > limit;
}

export function getRequestIp(headers: Headers) {
    const forwardedFor = headers.get("x-forwarded-for");

    if (forwardedFor) {
        return forwardedFor.split(",")[0]?.trim() || "unknown";
    }

    return headers.get("x-real-ip") || "unknown";
}

export function createPasswordResetToken() {
    const rawToken = randomBytes(32).toString("hex");
    const tokenHash = hashPasswordResetToken(rawToken);

    return { rawToken, tokenHash };
}

export function hashPasswordResetToken(token: string) {
    return createHash("sha256").update(token).digest("hex");
}
