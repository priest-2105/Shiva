"use client";

import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";
import { Settings, LogOut, User, ChevronDown, Sun, Moon, Monitor } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { useTheme } from "@/components/ThemeProvider";
import Link from "next/link";

const themeIcons = {
    light: <Sun className="w-4 h-4" />,
    dark: <Moon className="w-4 h-4" />,
    system: <Monitor className="w-4 h-4" />,
};

const themeOrder = ["system", "light", "dark"] as const;

type ChatHeaderProps = {
    user: {
        id: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
};

export function ChatHeader({ user }: ChatHeaderProps) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const { theme, resolvedTheme, setTheme } = useTheme();
    const initials = (user.name || user.email || "SU")
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const cycleTheme = () => {
        const idx = themeOrder.indexOf(theme);
        setTheme(themeOrder[(idx + 1) % themeOrder.length]);
    };

    return (
        <header className="h-14 flex items-center justify-end gap-2 px-6
            bg-white/40 dark:bg-[rgba(2,11,30,0.5)]
            backdrop-blur-xl
            border-b border-blue-200/30 dark:border-blue-900/30">

            {/* Theme toggle */}
            <button
                onClick={cycleTheme}
                title={`Theme: ${theme} (resolved: ${resolvedTheme})`}
                className="flex items-center justify-center h-8 w-8 rounded-full text-text-secondary
                    hover:bg-blue-100/60 dark:hover:bg-blue-950/50
                    hover:text-foreground transition-colors"
            >
                {themeIcons[theme]}
            </button>

            {/* User menu */}
            <div className="relative" ref={menuRef}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 hover:bg-blue-100/60 dark:hover:bg-blue-950/50 p-1.5 rounded-full transition-colors outline-none"
                >
                    <Avatar className="h-8 w-8">
                        {user.image ? <AvatarImage src={user.image} alt={user.name || user.email || "User avatar"} /> : null}
                        <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <ChevronDown className="w-4 h-4 text-text-secondary" />
                </button>

                {isOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 rounded-xl z-50
                        bg-white/70 dark:bg-[rgba(4,16,45,0.85)]
                        backdrop-blur-2xl
                        border border-blue-200/40 dark:border-blue-800/40
                        shadow-xl shadow-blue-900/10 dark:shadow-blue-950/40
                        py-1">
                        <div className="px-3 py-2 border-b border-blue-200/30 dark:border-blue-800/30 mb-1">
                            <p className="text-sm font-medium">{user.name || "Shiva User"}</p>
                            <p className="text-xs text-text-secondary truncate">{user.email || "No email available"}</p>
                        </div>

                        <Link href="/profile" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-blue-100/50 dark:hover:bg-blue-950/50 cursor-pointer transition-colors">
                            <User className="w-4 h-4" />
                            Profile
                        </Link>
                        <Link href="/settings" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-blue-100/50 dark:hover:bg-blue-950/50 cursor-pointer transition-colors">
                            <Settings className="w-4 h-4" />
                            Settings
                        </Link>

                        {/* Theme switcher inside menu too */}
                        <div className="border-t border-blue-200/30 dark:border-blue-800/30 my-1" />
                        <div className="px-3 py-1.5">
                            <p className="text-xs text-text-secondary mb-1.5">Appearance</p>
                            <div className="flex gap-1">
                                {themeOrder.map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => { setTheme(t); setIsOpen(false); }}
                                        title={t}
                                        className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-md text-xs transition-colors capitalize
                                            ${theme === t
                                                ? "bg-primary/15 text-primary border border-primary/30"
                                                : "hover:bg-blue-100/50 dark:hover:bg-blue-950/50 text-text-secondary"
                                            }`}
                                    >
                                        {themeIcons[t]}
                                        <span>{t}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="border-t border-blue-200/30 dark:border-blue-800/30 my-1" />
                        <button
                            onClick={() => signOut({ callbackUrl: "/login" })}
                            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-50/80 dark:hover:bg-red-950/30 cursor-pointer transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Log out
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}
