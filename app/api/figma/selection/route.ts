import { NextRequest, NextResponse } from "next/server";
import { figmaApiFetch, getValidFigmaAccessToken, parseFigmaSelectionInput } from "@/lib/figma";

type FigmaNode = {
    id?: string;
    name?: string;
    type?: string;
    layoutMode?: string;
    absoluteBoundingBox?: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    absoluteRenderBounds?: {
        x: number;
        y: number;
        width: number;
        height: number;
    } | null;
    children?: unknown[];
    componentId?: string;
};

export async function POST(request: NextRequest) {
    const token = await getValidFigmaAccessToken();

    if (!token) {
        return NextResponse.json({ error: "Connect a Figma account first." }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const selectionInput = typeof body.selection === "string" ? body.selection : "";
    const depth = typeof body.depth === "number" && body.depth > 0 ? body.depth : 2;

    try {
        const { fileKey, nodeId } = parseFigmaSelectionInput(selectionInput);

        if (!nodeId) {
            return NextResponse.json(
                { error: "A selected frame URL with a node-id is required to fetch frame metadata." },
                { status: 400 }
            );
        }

        const params = new URLSearchParams({
            ids: nodeId,
            depth: String(depth),
        });

        const data = await figmaApiFetch(`/v1/files/${fileKey}/nodes?${params.toString()}`, token.accessToken);
        const nodeEntry = data?.nodes?.[nodeId];
        const document = nodeEntry?.document as FigmaNode | undefined;

        if (!document) {
            return NextResponse.json(
                { error: "Figma returned no node data for that selection. Check the file access and node id." },
                { status: 404 }
            );
        }

        return NextResponse.json({
            file: {
                key: fileKey,
                name: data?.name ?? null,
                lastModified: data?.lastModified ?? null,
                version: data?.version ?? null,
            },
            selection: {
                nodeId,
                name: document.name ?? null,
                type: document.type ?? null,
                layoutMode: document.layoutMode ?? null,
                childrenCount: Array.isArray(document.children) ? document.children.length : 0,
                componentId: document.componentId ?? null,
                absoluteBoundingBox: document.absoluteBoundingBox ?? null,
                absoluteRenderBounds: document.absoluteRenderBounds ?? null,
            },
            raw: nodeEntry,
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to fetch selected frame metadata.";
        return NextResponse.json({ error: message }, { status: 400 });
    }
}
