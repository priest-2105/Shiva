import { headers } from "next/headers";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { emailSchema, getRequestIp, nameSchema, normalizeEmail, passwordSchema, recordRateLimitHit } from "@/lib/auth-security";
import { prisma } from "@/lib/prisma";

const registerSchema = z
    .object({
        name: nameSchema.optional(),
        email: emailSchema,
        password: passwordSchema,
        confirmPassword: passwordSchema,
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "Passwords do not match.",
    });

export async function POST(request: Request) {
    try {
        const requestHeaders = await headers();
        const origin = requestHeaders.get("origin");
        const host = requestHeaders.get("x-forwarded-host") || requestHeaders.get("host");
        const protocol = requestHeaders.get("x-forwarded-proto") || "http";
        const secFetchSite = requestHeaders.get("sec-fetch-site");

        if (origin && host && origin !== `${protocol}://${host}`) {
            return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
        }

        if (secFetchSite === "cross-site") {
            return NextResponse.json({ error: "Cross-site signup requests are blocked." }, { status: 403 });
        }

        const json = await request.json();
        const parsed = registerSchema.safeParse(json);

        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error.issues[0]?.message ?? "Invalid signup payload." },
                { status: 400 }
            );
        }

        const email = normalizeEmail(parsed.data.email);
        const requestIp = getRequestIp(requestHeaders);
        const isRateLimited = recordRateLimitHit(`register:${requestIp}:${email}`, 5, 15 * 60 * 1000);

        if (isRateLimited) {
            return NextResponse.json(
                { error: "Too many signup attempts. Please try again later." },
                { status: 429 }
            );
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
            select: { id: true },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "Unable to create account with those details." },
                { status: 409 }
            );
        }

        const passwordHash = await hash(parsed.data.password, 12);

        const user = await prisma.user.create({
            data: {
                name: parsed.data.name?.trim() || null,
                email,
                passwordHash,
            },
            select: {
                id: true,
            },
        });

        return NextResponse.json(
            { user },
            {
                status: 201,
                headers: {
                    "Cache-Control": "no-store",
                },
            }
        );
    } catch {
        return NextResponse.json({ error: "Failed to create account." }, { status: 500 });
    }
}
