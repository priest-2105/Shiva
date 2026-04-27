import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { authOptions } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";

export default async function ResetPasswordPage({
    searchParams,
}: {
    searchParams: Promise<{ token?: string }>;
}) {
    const session = await getServerSession(authOptions);

    if (session) {
        redirect("/chat/1");
    }

    const params = await searchParams;
    const token = typeof params.token === "string" ? params.token : "";

    if (!token) {
        return (
            <Card className="border-none shadow-none bg-transparent">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold tracking-tight">Invalid reset link</CardTitle>
                    <CardDescription>
                        This password reset link is missing a token or was copied incorrectly.
                    </CardDescription>
                </CardHeader>
                <CardContent />
                <CardFooter>
                    <Link href="/forgot-password" className="text-primary hover:text-primary-hover font-medium underline-offset-4 hover:underline">
                        Request a new link
                    </Link>
                </CardFooter>
            </Card>
        );
    }

    return <ResetPasswordForm token={token} />;
}
