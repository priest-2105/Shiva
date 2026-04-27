import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { buildFigmaAuthorizationUrl, createFigmaOAuthState, FIGMA_STATE_COOKIE, isFigmaConfigured } from "@/lib/figma";

export async function GET(request: NextRequest) {
    if (!isFigmaConfigured()) {
        return NextResponse.redirect(new URL("/chat/1?figma=missing-config", request.url));
    }

    const returnTo = request.nextUrl.searchParams.get("returnTo") || "/chat/1";
    const state = createFigmaOAuthState();
    const cookieStore = await cookies();

    cookieStore.set(
        FIGMA_STATE_COOKIE,
        JSON.stringify({ state, returnTo }),
        {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 10,
        }
    );

    return NextResponse.redirect(buildFigmaAuthorizationUrl(state));
}
