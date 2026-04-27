"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";

type ResetPasswordFormProps = {
    token: string;
};

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSubmitting(true);
        setError(null);
        setSuccess(null);

        const response = await fetch("/api/auth/reset-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token,
                password,
                confirmPassword,
            }),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            setError(typeof data?.error === "string" ? data.error : "Failed to reset password.");
            setSubmitting(false);
            return;
        }

        setSuccess("Password updated. Redirecting to sign in...");
        setSubmitting(false);
        setTimeout(() => {
            router.push("/login");
        }, 1200);
    }

    return (
        <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold tracking-tight">Choose a new password</CardTitle>
                <CardDescription>
                    Set a new password for your account. This will sign out other active password sessions.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form className="grid gap-6 rounded-2xl border border-blue-200/40 bg-white/35 p-4 dark:border-blue-800/30 dark:bg-[rgba(4,16,45,0.28)]" onSubmit={handleSubmit}>
                    <div className="grid gap-2">
                        <label className="text-sm font-medium leading-none" htmlFor="password">
                            New Password
                        </label>
                        <Input
                            id="password"
                            type="password"
                            autoComplete="new-password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm font-medium leading-none" htmlFor="confirmPassword">
                            Confirm Password
                        </label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            autoComplete="new-password"
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                            required
                        />
                    </div>
                    <p className="text-xs text-text-secondary">
                        Passwords must be at least 10 characters and include uppercase, lowercase, and a number.
                    </p>
                    {error && (
                        <p className="rounded-lg border border-red-300/40 bg-red-50/60 px-3 py-2 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-200">
                            {error}
                        </p>
                    )}
                    {success && (
                        <p className="rounded-lg border border-blue-300/40 bg-blue-50/60 px-3 py-2 text-sm text-blue-800 dark:border-blue-900/40 dark:bg-blue-950/20 dark:text-blue-100">
                            {success}
                        </p>
                    )}
                    <Button className="w-full" disabled={submitting}>
                        {submitting ? "Updating password..." : "Reset password"}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
                <div className="text-sm text-center text-text-secondary">
                    <Link href="/login" className="text-primary hover:text-primary-hover font-medium underline-offset-4 hover:underline">
                        Back to sign in
                    </Link>
                </div>
            </CardFooter>
        </Card>
    );
}
