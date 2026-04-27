import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { authOptions } from "@/lib/auth";

export default async function ChatLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/login?callbackUrl=/chat/1");
    }

    return (
        <div className="flex h-screen overflow-hidden bg-background relative">
            {/* Frozen ambient orbs */}
            <div className="pointer-events-none absolute -top-32 left-1/3 w-[500px] h-[500px] rounded-full bg-blue-400/10 dark:bg-blue-500/8 blur-[120px]" />
            <div className="pointer-events-none absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-cyan-400/10 dark:bg-cyan-400/6 blur-[100px]" />
            <div className="pointer-events-none absolute top-1/2 left-0 w-64 h-64 rounded-full bg-sky-300/8 dark:bg-sky-400/5 blur-[80px]" />

            {/* Sidebar */}
            <aside className="hidden md:flex relative z-10">
                <ChatSidebar />
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
                <ChatHeader user={session.user} />
                {children}
            </main>
        </div>
    );
}
