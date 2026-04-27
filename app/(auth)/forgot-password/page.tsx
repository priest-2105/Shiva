import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { authOptions } from "@/lib/auth";

export default async function ForgotPasswordPage() {
    const session = await getServerSession(authOptions);

    if (session) {
        redirect("/chat/1");
    }

    return <ForgotPasswordForm />;
}
