"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";

export function ForgotPasswordForm() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [devResetUrl, setDevResetUrl] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSubmitting(true);
        setError(null);
        setSuccess(null);
        setDevResetUrl(null);

        const response = await fetch("/api/auth/forgot-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            setError(typeof data?.error === "string" ? data.error : "Failed to start password reset.");
            setSubmitting(false);
            return;
        }

        setSuccess(typeof data?.message === "string" ? data.message : "If the account exists, a reset link has been prepared.");
        setDevResetUrl(typeof data?.resetUrl === "string" ? data.resetUrl : null);
        setSubmitting(false);
    }

    return (
        <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold tracking-tight">Reset your password</CardTitle>
                <CardDescription>
                    Enter your email and we&apos;ll prepare a reset link if your account supports password sign-in.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form className="grid gap-6 rounded-2xl border border-blue-200/40 bg-white/35 p-4 dark:border-blue-800/30 dark:bg-[rgba(4,16,45,0.28)]" onSubmit={handleSubmit}>
                    <div className="grid gap-2">
                        <label className="text-sm font-medium leading-none" htmlFor="email">
                            Email
                        </label>
                        <Input
                            id="email"
                            type="email"
                            inputMode="email"
                            autoComplete="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="name@example.com"
                            required
                        />
                    </div>
                    {error && (
                        <p className="rounded-lg border border-red-300/40 bg-red-50/60 px-3 py-2 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-200">
                            {error}
                        </p>
                    )}
                    {success && (
                        <div className="rounded-lg border border-blue-300/40 bg-blue-50/60 px-3 py-2 text-sm text-blue-800 dark:border-blue-900/40 dark:bg-blue-950/20 dark:text-blue-100">
                            <p>{success}</p>
                            {devResetUrl && (
                                <p className="mt-2 break-all font-mono text-xs">
                                    Dev reset URL:{" "}
                                    <Link href={devResetUrl} className="underline underline-offset-4">
                                        {devResetUrl}
                                    </Link>
                                </p>
                            )}
                        </div>
                    )}
                    <Button className="w-full" disabled={submitting}>
                        {submitting ? "Preparing reset..." : "Send reset link"}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
                <div className="text-sm text-center text-text-secondary">
                    Remembered it?{" "}
                    <Link href="/login" className="text-primary hover:text-primary-hover font-medium underline-offset-4 hover:underline">
                        Sign in
                    </Link>
                </div>
            </CardFooter>
        </Card>
    );
}
