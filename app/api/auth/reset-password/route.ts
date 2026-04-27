import { headers } from "next/headers";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
    getRequestIp,
    hashPasswordResetToken,
    passwordSchema,
    recordRateLimitHit,
} from "@/lib/auth-security";

const resetSchema = z
    .object({
        token: z.string().min(32).max(256),
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
        const secFetchSite = requestHeaders.get("sec-fetch-site");
        const origin = requestHeaders.get("origin");
        const host = requestHeaders.get("x-forwarded-host") || requestHeaders.get("host");
        const protocol = requestHeaders.get("x-forwarded-proto") || "http";

        if (origin && host && origin !== `${protocol}://${host}`) {
            return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
        }

        if (secFetchSite === "cross-site") {
            return NextResponse.json({ error: "Cross-site reset requests are blocked." }, { status: 403 });
        }

        const json = await request.json().catch(() => ({}));
        const parsed = resetSchema.safeParse(json);

        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error.issues[0]?.message ?? "Invalid reset request." },
                { status: 400 }
            );
        }

        const requestIp = getRequestIp(requestHeaders);

        if (recordRateLimitHit(`reset:${requestIp}`, 10, 15 * 60 * 1000)) {
            return NextResponse.json(
                { error: "Too many reset attempts. Please try again later." },
                { status: 429 }
            );
        }

        const tokenHash = hashPasswordResetToken(parsed.data.token);
        const tokenRecord = await prisma.passwordResetToken.findUnique({
            where: { tokenHash },
            select: {
                id: true,
                userId: true,
                expiresAt: true,
            },
        });

        if (!tokenRecord || tokenRecord.expiresAt.getTime() < Date.now()) {
            if (tokenRecord) {
                await prisma.passwordResetToken.delete({
                    where: { id: tokenRecord.id },
                });
            }

            return NextResponse.json(
                { error: "This password reset link is invalid or has expired." },
                { status: 400 }
            );
        }

        const passwordHash = await hash(parsed.data.password, 12);

        await prisma.$transaction([
            prisma.user.update({
                where: { id: tokenRecord.userId },
                data: { passwordHash },
            }),
            prisma.session.deleteMany({
                where: { userId: tokenRecord.userId },
            }),
            prisma.passwordResetToken.deleteMany({
                where: { userId: tokenRecord.userId },
            }),
        ]);

        return NextResponse.json(
            { ok: true, message: "Password updated successfully." },
            {
                status: 200,
                headers: {
                    "Cache-Control": "no-store",
                },
            }
        );
    } catch {
        return NextResponse.json({ error: "Failed to reset password." }, { status: 500 });
    }
}
