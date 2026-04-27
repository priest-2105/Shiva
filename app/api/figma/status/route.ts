import { NextResponse } from "next/server";
import { getValidFigmaAccessToken, isFigmaConfigured } from "@/lib/figma";

export async function GET() {
    if (!isFigmaConfigured()) {
        return NextResponse.json({
            configured: false,
            connected: false,
        });
    }

    const token = await getValidFigmaAccessToken();

    return NextResponse.json({
        configured: true,
        connected: Boolean(token),
        expiresAt: token?.expiresAt ?? null,
        scope: token?.scope ?? null,
        userId: token?.userId ?? null,
    });
}
