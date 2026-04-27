import { NextResponse } from "next/server";
import { clearStoredFigmaToken } from "@/lib/figma";

export async function POST() {
    await clearStoredFigmaToken();
    return NextResponse.json({ ok: true });
}
