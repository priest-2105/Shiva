"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";

export function SignupForm() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSubmitting(true);
        setError(null);

        const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                email,
                password,
                confirmPassword,
            }),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            setError(typeof data?.error === "string" ? data.error : "Failed to create account.");
            setSubmitting(false);
            return;
        }

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
            callbackUrl: "/chat/1",
        });

        if (!result || result.error) {
            setSubmitting(false);
            router.push("/login");
            return;
        }

        router.push(result.url || "/chat/1");
        router.refresh();
    }

    return (
        <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold tracking-tight">Create an account</CardTitle>
                <CardDescription>
                    Choose how you want to create your account. Use Google for a faster start, or sign up with email and password.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="space-y-3 rounded-2xl border border-blue-200/40 bg-white/40 p-4 dark:border-blue-800/30 dark:bg-blue-950/20">
                    <div className="space-y-1">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-secondary">
                            Continue With Google
                        </p>
                        <p className="text-sm text-text-secondary">
                            Create your account with Google and skip password setup.
                        </p>
                    </div>
                    <Button variant="outline" className="w-full" onClick={() => signIn("google", { callbackUrl: "/chat/1" })}>
                        <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" viewBox="0 0 488 512">
                            <path
                                fill="currentColor"
                                d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                            />
                        </svg>
                        Continue with Google
                    </Button>
                </div>
                <div className="relative py-1">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border/80" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-3 text-text-secondary">Or sign up with email and password</span>
                    </div>
                </div>
                <form className="grid gap-6 rounded-2xl border border-blue-200/40 bg-white/35 p-4 dark:border-blue-800/30 dark:bg-[rgba(4,16,45,0.28)]" onSubmit={handleSubmit}>
                    <div className="grid gap-2">
                        <label className="text-sm font-medium leading-none" htmlFor="name">
                            Name
                        </label>
                        <Input id="name" type="text" placeholder="Shiva User" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} />
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm font-medium leading-none" htmlFor="email">
                            Email
                        </label>
                        <Input
                            id="email"
                            placeholder="name@example.com"
                            type="email"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            inputMode="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm font-medium leading-none" htmlFor="password">
                            Password
                        </label>
                        <Input id="password" type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm font-medium leading-none" htmlFor="confirm-password">
                            Confirm Password
                        </label>
                        <Input
                            id="confirm-password"
                            type="password"
                            autoComplete="new-password"
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                            required
                        />
                    </div>
                    {error && (
                        <p className="rounded-lg border border-red-300/40 bg-red-50/60 px-3 py-2 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-200">
                            {error}
                        </p>
                    )}
                    <Button className="w-full" disabled={submitting}>
                        {submitting ? "Creating account..." : "Create account"}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
                <div className="text-sm text-center text-text-secondary">
                    Already have an account?{" "}
                    <Link href="/login" className="text-primary hover:text-primary-hover font-medium underline-offset-4 hover:underline">
                        Sign in
                    </Link>
                </div>
            </CardFooter>
        </Card>
    );
}
