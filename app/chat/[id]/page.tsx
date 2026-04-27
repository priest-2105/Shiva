"use client";

import { useState } from "react";
import { ChatThread } from "@/components/chat/workspace/ChatThread";
import { CodePanel } from "@/components/chat/workspace/CodePanel";
import { FigmaOAuthCard } from "@/components/chat/FigmaOAuthCard";

export type UserMessage = {
    id: number;
    type: "user";
    content: string;
    framework: string;
    design: string;
    time: string;
};

export type GenerationMessage = {
    id: number;
    type: "generation";
    generationId: number;
    componentName: string;
    files: string[];
    description: string;
    time: string;
};

export type Message = UserMessage | GenerationMessage;

const MOCK_MESSAGES: Message[] = [
    {
        id: 1,
        type: "user",
        content: "Build a pricing table with 3 tiers — Free, Pro, and Enterprise. Highlight the Pro tier.",
        framework: "Next.js",
        design: "Shadcn UI",
        time: "2:34 PM",
    },
    {
        id: 2,
        type: "generation",
        generationId: 0,
        componentName: "PricingTable",
        files: ["PricingTable.tsx", "pricing.config.ts"],
        description: "3-column layout with Free, Pro (highlighted with ring), and Enterprise tiers. Includes a Most Popular badge.",
        time: "2:34 PM",
    },
    {
        id: 3,
        type: "user",
        content: "Add a monthly/annual billing toggle at the top and make the Pro tier glow more.",
        framework: "Next.js",
        design: "Shadcn UI",
        time: "2:36 PM",
    },
    {
        id: 4,
        type: "generation",
        generationId: 1,
        componentName: "PricingTable",
        files: ["PricingTable.tsx", "pricing.config.ts", "BillingToggle.tsx"],
        description: "Added billing period toggle with annual discount. Pro tier now has a shadow-primary/30 glow and animated ring.",
        time: "2:36 PM",
    },
];

export default function WorkspacePage() {
    const [threadOpen, setThreadOpen] = useState(true);
    const [activeGenId, setActiveGenId] = useState(1);

    return (
        <div className="flex flex-1 flex-col overflow-hidden">
            <FigmaOAuthCard />
            <div className="flex min-h-0 flex-1 overflow-hidden">
                <ChatThread
                    messages={MOCK_MESSAGES}
                    open={threadOpen}
                    activeGenId={activeGenId}
                    onToggle={() => setThreadOpen(!threadOpen)}
                    onSelectGeneration={setActiveGenId}
                />
                <CodePanel
                    activeGenId={activeGenId}
                    threadOpen={threadOpen}
                    onOpenThread={() => setThreadOpen(true)}
                />
            </div>
        </div>
    );
}
