import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
    clearStoredFigmaToken,
    exchangeCodeForToken,
    FIGMA_STATE_COOKIE,
    isFigmaConfigured,
    writeStoredFigmaToken,
} from "@/lib/figma";

type StoredState = {
    state: string;
    returnTo: string;
};

export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const error = url.searchParams.get("error");
    const cookieStore = await cookies();
    const rawState = cookieStore.get(FIGMA_STATE_COOKIE)?.value;

    cookieStore.delete(FIGMA_STATE_COOKIE);

    let storedState: StoredState | null = null;

    if (rawState) {
        try {
            storedState = JSON.parse(rawState) as StoredState;
        } catch {
            storedState = null;
        }
    }
    const returnTo = storedState?.returnTo || "/chat/1";

    if (!isFigmaConfigured()) {
        return NextResponse.redirect(new URL(`${returnTo}?figma=missing-config`, request.url));
    }

    if (error) {
        return NextResponse.redirect(new URL(`${returnTo}?figma=denied`, request.url));
    }

    if (!code || !state || !storedState || state !== storedState.state) {
        await clearStoredFigmaToken();
        return NextResponse.redirect(new URL(`${returnTo}?figma=state-mismatch`, request.url));
    }

    try {
        const token = await exchangeCodeForToken(code);
        await writeStoredFigmaToken(token);
        return NextResponse.redirect(new URL(`${returnTo}?figma=connected`, request.url));
    } catch {
        await clearStoredFigmaToken();
        return NextResponse.redirect(new URL(`${returnTo}?figma=exchange-failed`, request.url));
    }
}
