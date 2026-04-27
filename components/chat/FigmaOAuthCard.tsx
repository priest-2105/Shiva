"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { BadgeCheck, ExternalLink, Frame, Link2, Unplug, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

type FigmaStatus = {
    configured: boolean;
    connected: boolean;
    expiresAt: number | null;
    scope: string | null;
    userId: string | null;
};

type SelectionResult = {
    file: {
        key: string;
        name: string | null;
        lastModified: string | null;
        version: string | null;
    };
    selection: {
        nodeId: string;
        name: string | null;
        type: string | null;
        layoutMode: string | null;
        childrenCount: number;
        componentId: string | null;
        absoluteBoundingBox: {
            x: number;
            y: number;
            width: number;
            height: number;
        } | null;
        absoluteRenderBounds: {
            x: number;
            y: number;
            width: number;
            height: number;
        } | null;
    };
    raw: unknown;
};

const statusMessageMap: Record<string, string> = {
    connected: "Figma connected. You can now fetch selected frame metadata.",
    denied: "Figma authorization was denied.",
    "missing-config": "Figma OAuth env vars are missing.",
    "state-mismatch": "Figma OAuth state validation failed. Try connecting again.",
    "exchange-failed": "Figma code exchange failed. Re-run the OAuth flow.",
};

export function FigmaOAuthCard() {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<FigmaStatus | null>(null);
    const [loadingStatus, setLoadingStatus] = useState(true);
    const [selection, setSelection] = useState("");
    const [result, setResult] = useState<SelectionResult | null>(null);
    const [loadingSelection, setLoadingSelection] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const figmaStatusKey = searchParams.get("figma");
    const flashMessage = figmaStatusKey ? statusMessageMap[figmaStatusKey] : null;

    const connectHref = useMemo(() => {
        const params = new URLSearchParams({ returnTo: pathname || "/chat/1" });
        return `/api/figma/oauth/start?${params.toString()}`;
    }, [pathname]);

    useEffect(() => {
        let cancelled = false;

        async function loadStatus() {
            try {
                setLoadingStatus(true);
                const response = await fetch("/api/figma/status", { cache: "no-store" });
                const data = (await response.json()) as FigmaStatus;

                if (!cancelled) {
                    setStatus(data);
                }
            } finally {
                if (!cancelled) {
                    setLoadingStatus(false);
                }
            }
        }

        loadStatus();

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        if (!figmaStatusKey) {
            return;
        }

        const next = new URLSearchParams(searchParams.toString());
        next.delete("figma");
        const nextQuery = next.toString();
        router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname);
    }, [figmaStatusKey, pathname, router, searchParams]);

    async function refreshStatus() {
        setLoadingStatus(true);
        const response = await fetch("/api/figma/status", { cache: "no-store" });
        const data = (await response.json()) as FigmaStatus;
        setStatus(data);
        setLoadingStatus(false);
    }

    async function disconnect() {
        await fetch("/api/figma/disconnect", { method: "POST" });
        setResult(null);
        setError(null);
        await refreshStatus();
    }

    async function inspectSelection() {
        try {
            setLoadingSelection(true);
            setError(null);

            const response = await fetch("/api/figma/selection", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    selection,
                    depth: 2,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(typeof data?.error === "string" ? data.error : "Failed to fetch Figma metadata.");
            }

            setResult(data as SelectionResult);
        } catch (fetchError) {
            setResult(null);
            setError(fetchError instanceof Error ? fetchError.message : "Failed to fetch Figma metadata.");
        } finally {
            setLoadingSelection(false);
        }
    }

    return (
        <div className="border-b border-blue-200/25 dark:border-blue-900/25 bg-white/30 dark:bg-[rgba(2,10,28,0.35)] backdrop-blur-xl">
            <div className="mx-auto w-full max-w-[1600px] px-6 py-5">
                <Card className="border-blue-200/40 dark:border-blue-800/30 bg-white/55 dark:bg-[rgba(4,16,45,0.5)]">
                    <CardHeader className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                                <Frame className="h-5 w-5 text-primary" />
                                <CardTitle className="text-xl">Figma Selection Inspector</CardTitle>
                            </div>
                            <CardDescription>
                                Connect Figma with OAuth, paste a selected frame URL, and fetch node metadata from the Files API.
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="secondary" size="sm" onClick={refreshStatus} disabled={loadingStatus}>
                                <RefreshCcw className="mr-1.5 h-3.5 w-3.5" />
                                Refresh
                            </Button>
                            {status?.connected ? (
                                <Button variant="outline" size="sm" onClick={disconnect}>
                                    <Unplug className="mr-1.5 h-3.5 w-3.5" />
                                    Disconnect
                                </Button>
                            ) : (
                                <Button variant="primary" size="sm" onClick={() => window.location.assign(connectHref)}>
                                    <Link2 className="mr-1.5 h-3.5 w-3.5" />
                                    Connect Figma
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {flashMessage && (
                            <div className="rounded-xl border border-blue-200/50 bg-blue-50/70 px-4 py-3 text-sm text-foreground dark:border-blue-800/40 dark:bg-blue-950/30">
                                {flashMessage}
                            </div>
                        )}

                        <div className="grid gap-3 md:grid-cols-3">
                            <StatusTile
                                label="OAuth"
                                value={
                                    loadingStatus
                                        ? "Checking..."
                                        : !status?.configured
                                            ? "Missing env"
                                            : status.connected
                                                ? "Connected"
                                                : "Not connected"
                                }
                                accent={status?.connected ? "ok" : "neutral"}
                            />
                            <StatusTile
                                label="Scope"
                                value={status?.scope || "file_content:read"}
                            />
                            <StatusTile
                                label="Token expiry"
                                value={status?.expiresAt ? new Date(status.expiresAt).toLocaleString() : "Not available"}
                            />
                        </div>

                        {!status?.configured && !loadingStatus && (
                            <div className="rounded-xl border border-amber-300/50 bg-amber-50/70 px-4 py-3 text-sm text-slate-800 dark:border-amber-700/40 dark:bg-amber-950/20 dark:text-amber-100">
                                Add `FIGMA_CLIENT_ID`, `FIGMA_CLIENT_SECRET`, and `FIGMA_OAUTH_REDIRECT_URI` to enable the OAuth flow.
                            </div>
                        )}

                        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-foreground">
                                    Selected frame URL or `fileKey,nodeId`
                                </label>
                                <Input
                                    value={selection}
                                    onChange={(event) => setSelection(event.target.value)}
                                    placeholder="https://www.figma.com/design/FILE_KEY/Name?node-id=12-34"
                                />
                                <div className="flex flex-wrap items-center gap-2">
                                    <Button
                                        onClick={inspectSelection}
                                        disabled={!status?.connected || loadingSelection || !selection.trim()}
                                    >
                                        {loadingSelection ? "Fetching..." : "Fetch frame metadata"}
                                    </Button>
                                    <a
                                        href="https://developers.figma.com/docs/rest-api/file-endpoints/"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                                    >
                                        File API reference
                                        <ExternalLink className="h-3.5 w-3.5" />
                                    </a>
                                </div>
                                {error && (
                                    <div className="rounded-xl border border-red-300/50 bg-red-50/70 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-200">
                                        {error}
                                    </div>
                                )}
                            </div>

                            <div className="rounded-2xl border border-blue-200/40 bg-white/45 p-4 dark:border-blue-800/30 dark:bg-[rgba(4,16,45,0.42)]">
                                <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                                    <BadgeCheck className="h-4 w-4 text-primary" />
                                    What this expects
                                </div>
                                <ul className="space-y-2 text-sm leading-6 text-text-secondary">
                                    <li>OAuth scope: `file_content:read`</li>
                                    <li>Use a selected Figma frame URL that includes `node-id`</li>
                                    <li>The connected Figma user must have access to that file</li>
                                </ul>
                            </div>
                        </div>

                        {result && (
                            <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
                                <div className="rounded-2xl border border-blue-200/40 bg-white/45 p-4 dark:border-blue-800/30 dark:bg-[rgba(4,16,45,0.42)]">
                                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-text-secondary">
                                        Selection Summary
                                    </h3>
                                    <div className="space-y-2 text-sm">
                                        <MetadataRow label="File" value={result.file.name || result.file.key} />
                                        <MetadataRow label="File key" value={result.file.key} mono />
                                        <MetadataRow label="Node id" value={result.selection.nodeId} mono />
                                        <MetadataRow label="Node name" value={result.selection.name || "Unknown"} />
                                        <MetadataRow label="Type" value={result.selection.type || "Unknown"} />
                                        <MetadataRow label="Layout" value={result.selection.layoutMode || "None"} />
                                        <MetadataRow label="Children" value={String(result.selection.childrenCount)} />
                                        <MetadataRow
                                            label="Bounds"
                                            value={formatBounds(result.selection.absoluteBoundingBox)}
                                            mono
                                        />
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-blue-200/40 bg-[#08101f] p-4 dark:border-blue-800/30">
                                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                                        Raw API Payload
                                    </h3>
                                    <pre className="max-h-96 overflow-auto text-xs leading-6 text-slate-200">
                                        {JSON.stringify(result.raw, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function StatusTile({
    label,
    value,
    accent = "neutral",
}: {
    label: string;
    value: string;
    accent?: "neutral" | "ok";
}) {
    return (
        <div className="rounded-2xl border border-blue-200/40 bg-white/45 p-4 dark:border-blue-800/30 dark:bg-[rgba(4,16,45,0.42)]">
            <div className="mb-1 text-[11px] uppercase tracking-[0.18em] text-text-secondary">{label}</div>
            <div className={accent === "ok" ? "text-sm font-semibold text-primary" : "text-sm font-semibold text-foreground"}>
                {value}
            </div>
        </div>
    );
}

function MetadataRow({
    label,
    value,
    mono = false,
}: {
    label: string;
    value: string;
    mono?: boolean;
}) {
    return (
        <div className="flex items-start justify-between gap-3 border-b border-blue-200/30 py-2 last:border-b-0 dark:border-blue-800/25">
            <span className="text-text-secondary">{label}</span>
            <span className={mono ? "font-mono text-right text-xs text-foreground" : "text-right text-foreground"}>
                {value}
            </span>
        </div>
    );
}

function formatBounds(
    bounds: {
        x: number;
        y: number;
        width: number;
        height: number;
    } | null
) {
    if (!bounds) {
        return "Unavailable";
    }

    return `${Math.round(bounds.width)}x${Math.round(bounds.height)} @ ${Math.round(bounds.x)},${Math.round(bounds.y)}`;
}
