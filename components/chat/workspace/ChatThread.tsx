"use client";

import { useRef, useEffect, useState } from "react";
import { PanelLeftClose, ArrowUp, Paperclip, FileCode, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Message } from "@/app/chat/[id]/page";

interface ChatThreadProps {
    messages: Message[];
    open: boolean;
    activeGenId: number;
    onToggle: () => void;
    onSelectGeneration: (id: number) => void;
}

export function ChatThread({ messages, open, activeGenId, onToggle, onSelectGeneration }: ChatThreadProps) {
    const bottomRef = useRef<HTMLDivElement>(null);
    const [input, setInput] = useState("");

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div
            className={cn(
                "flex flex-col h-full transition-all duration-300 ease-in-out overflow-hidden shrink-0",
                "border-r border-blue-200/30 dark:border-blue-900/30",
                "bg-white/40 dark:bg-[rgba(2,10,28,0.5)] backdrop-blur-xl",
                open ? "w-[380px]" : "w-0 border-r-0"
            )}
        >
            {/* Thread header */}
            <div className="h-12 flex items-center justify-between px-4 shrink-0 border-b border-blue-200/25 dark:border-blue-900/25">
                <span className="text-xs font-medium text-text-secondary uppercase tracking-widest">Thread</span>
                <button
                    onClick={onToggle}
                    className="p-1.5 rounded-md text-text-secondary hover:text-foreground hover:bg-blue-100/50 dark:hover:bg-blue-950/50 transition-colors"
                >
                    <PanelLeftClose className="w-4 h-4" />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4 min-w-[380px]">
                {messages.map((msg) =>
                    msg.type === "user" ? (
                        <UserBubble key={msg.id} message={msg} />
                    ) : (
                        <GenerationCard
                            key={msg.id}
                            message={msg}
                            isActive={msg.generationId === activeGenId}
                            onSelect={() => onSelectGeneration(msg.generationId)}
                        />
                    )
                )}
                <div ref={bottomRef} />
            </div>

            {/* Inline prompt input */}
            <div className="shrink-0 p-3 border-t border-blue-200/25 dark:border-blue-900/25">
                <div className={cn(
                    "flex items-end gap-2 rounded-xl px-3 py-2",
                    "bg-white/50 dark:bg-[rgba(4,16,45,0.55)]",
                    "backdrop-blur-sm",
                    "border border-blue-200/40 dark:border-blue-800/30",
                    "focus-within:border-blue-400/60 dark:focus-within:border-blue-600/40",
                    "transition-colors"
                )}>
                    <button className="p-1 text-text-secondary hover:text-foreground transition-colors shrink-0 mb-0.5">
                        <Paperclip className="w-4 h-4" />
                    </button>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Refine your component..."
                        rows={1}
                        className="flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-text-secondary/50 text-foreground max-h-32 py-1"
                        onInput={(e) => {
                            const el = e.currentTarget;
                            el.style.height = "auto";
                            el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
                        }}
                    />
                    <button
                        className={cn(
                            "shrink-0 w-7 h-7 rounded-full flex items-center justify-center mb-0.5 transition-all",
                            input.trim()
                                ? "bg-primary text-white shadow-sm shadow-blue-500/25"
                                : "bg-blue-100/60 dark:bg-blue-950/50 text-text-secondary cursor-not-allowed"
                        )}
                        disabled={!input.trim()}
                    >
                        <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </div>
    );
}

function UserBubble({ message }: { message: Extract<Message, { type: "user" }> }) {
    return (
        <div className="flex flex-col items-end gap-1.5">
            <div className={cn(
                "max-w-[85%] px-3.5 py-2.5 rounded-2xl rounded-tr-sm text-sm leading-relaxed",
                "bg-blue-100/70 dark:bg-blue-950/60",
                "border border-blue-200/50 dark:border-blue-800/40",
                "text-foreground"
            )}>
                {message.content}
            </div>
            <div className="flex items-center gap-1.5 px-1">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/30 dark:border-blue-800/25 text-text-secondary font-mono">
                    {message.framework}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/30 dark:border-blue-800/25 text-text-secondary font-mono">
                    {message.design}
                </span>
                <span className="text-[10px] text-text-secondary/50 ml-1">{message.time}</span>
            </div>
        </div>
    );
}

function GenerationCard({
    message,
    isActive,
    onSelect,
}: {
    message: Extract<Message, { type: "generation" }>;
    isActive: boolean;
    onSelect: () => void;
}) {
    return (
        <button
            onClick={onSelect}
            className={cn(
                "w-full text-left rounded-xl p-3.5 transition-all duration-150",
                "border",
                isActive
                    ? "bg-blue-50/80 dark:bg-blue-950/50 border-blue-300/60 dark:border-blue-700/50 shadow-sm shadow-blue-400/10"
                    : "bg-white/30 dark:bg-[rgba(4,16,45,0.35)] border-blue-200/30 dark:border-blue-900/25 hover:border-blue-300/50 dark:hover:border-blue-800/40 hover:bg-white/50 dark:hover:bg-[rgba(4,16,45,0.5)]"
            )}
        >
            <div className="flex items-start gap-3">
                <div className={cn(
                    "mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center shrink-0",
                    isActive
                        ? "bg-primary/15 border border-primary/30"
                        : "bg-blue-100/60 dark:bg-blue-950/50 border border-blue-200/30 dark:border-blue-800/25"
                )}>
                    <Cpu className={cn("w-3.5 h-3.5", isActive ? "text-primary" : "text-text-secondary")} />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-sm font-mono font-medium text-foreground truncate">
                            {message.componentName}
                        </span>
                        <span className="text-[10px] text-text-secondary/60 shrink-0">{message.time}</span>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed mb-2.5 line-clamp-2">
                        {message.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                        {message.files.map((f) => (
                            <span key={f} className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-md
                                bg-blue-50/70 dark:bg-blue-950/40
                                border border-blue-200/30 dark:border-blue-800/25
                                text-text-secondary">
                                <FileCode className="w-2.5 h-2.5" />
                                {f}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
            {isActive && (
                <div className="mt-2.5 pt-2.5 border-t border-blue-200/30 dark:border-blue-800/25 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <span className="text-[10px] text-primary font-medium">Viewing in panel</span>
                </div>
            )}
        </button>
    );
}
