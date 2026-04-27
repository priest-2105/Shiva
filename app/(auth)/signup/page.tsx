import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { SignupForm } from "@/components/auth/SignupForm";
import { authOptions } from "@/lib/auth";

export default async function SignupPage() {
    const session = await getServerSession(authOptions);

    if (session) {
        redirect("/chat/1");
    }

    return <SignupForm />;
}
