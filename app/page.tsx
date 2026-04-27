import { LandingNav } from "@/components/LandingNav";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Zap, Layers, Code2, Sparkles } from "lucide-react";
import Link from "next/link";

const features = [
    {
        icon: <Zap className="w-5 h-5 text-primary" />,
        title: "Instant generation",
        description:
            "Describe a component or full page in plain English. Get clean, typed code in seconds — no boilerplate, no setup.",
    },
    {
        icon: <Layers className="w-5 h-5 text-primary" />,
        title: "Stack-aware output",
        description:
            "Choose Next.js, React, or HTML/JS. Pick your design system — Shadcn UI, Material UI, or none. Shiva respects your decisions.",
    },
    {
        icon: <Code2 className="w-5 h-5 text-primary" />,
        title: "Production-ready code",
        description:
            "No throwaway prototypes. Every output is structured, accessible, and follows the conventions of your chosen stack.",
    },
];

export default function Home() {
    return (
        <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden">
            {/* ── Ambient orbs ── */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -top-40 left-1/4 w-[700px] h-[700px] rounded-full bg-blue-400/10 dark:bg-blue-500/8 blur-[140px]" />
                <div className="absolute top-1/2 -right-32 w-[500px] h-[500px] rounded-full bg-cyan-400/10 dark:bg-cyan-400/6 blur-[120px]" />
                <div className="absolute -bottom-20 left-1/3 w-[400px] h-[400px] rounded-full bg-indigo-400/8 dark:bg-indigo-500/5 blur-[100px]" />
            </div>

            <LandingNav />

            {/* ── Hero ── */}
            <section className="relative flex flex-col items-center justify-center min-h-screen text-center px-6 pt-16">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full text-xs font-medium
                    bg-blue-100/70 dark:bg-blue-950/50
                    border border-blue-300/50 dark:border-blue-700/40
                    text-primary backdrop-blur-sm">
                    <Sparkles className="w-3.5 h-3.5" />
                    AI Frontend Compiler
                </div>

                <h1 className="font-heading font-bold tracking-tight text-5xl md:text-6xl lg:text-7xl max-w-4xl leading-[1.1] mb-6">
                    Build UI at the{" "}
                    <span className="bg-gradient-to-r from-blue-500 via-sky-400 to-cyan-400 dark:from-blue-400 dark:via-sky-300 dark:to-cyan-300 bg-clip-text text-transparent">
                        speed of thought
                    </span>
                </h1>

                <p className="text-lg md:text-xl text-text-secondary max-w-2xl leading-relaxed mb-10">
                    Describe any component or page. Choose your stack and design system.
                    Shiva generates clean, typed, production-ready frontend code — instantly.
                </p>

                <div className="flex items-center gap-3 flex-wrap justify-center">
                    <Link href="/chat">
                        <Button size="lg" variant="primary" className="gap-2 px-7 shadow-lg shadow-blue-500/20 hover:shadow-blue-400/30">
                            Start building free
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </Link>
                    <Link href="/login">
                        <Button size="lg" variant="outline" className="px-7">
                            Sign in
                        </Button>
                    </Link>
                </div>

                {/* Glass preview card */}
                <div className="relative mt-20 w-full max-w-3xl">
                    {/* Glow behind the card */}
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-400/15 dark:from-blue-500/10 to-transparent rounded-3xl blur-2xl scale-105 pointer-events-none" />

                    <div className="relative rounded-2xl overflow-hidden
                        bg-white/60 dark:bg-[rgba(4,16,45,0.6)]
                        backdrop-blur-2xl
                        border border-blue-200/40 dark:border-blue-800/30
                        shadow-2xl shadow-blue-900/10 dark:shadow-blue-950/50">

                        {/* Fake window chrome */}
                        <div className="flex items-center gap-2 px-4 py-3 border-b border-blue-200/30 dark:border-blue-800/25">
                            <div className="w-3 h-3 rounded-full bg-red-400/70" />
                            <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
                            <div className="w-3 h-3 rounded-full bg-green-400/70" />
                            <span className="ml-3 text-xs text-text-secondary font-mono">shiva.ai / chat</span>
                        </div>

                        {/* Fake chat UI */}
                        <div className="p-6 flex flex-col gap-4 text-left">
                            {/* Fake prompt */}
                            <div className="flex flex-col gap-2 p-4 rounded-xl
                                bg-blue-50/50 dark:bg-blue-950/30
                                border border-blue-200/30 dark:border-blue-800/25">
                                <p className="text-sm text-text-secondary">Describe your component...</p>
                                <p className="text-sm text-foreground font-medium">
                                    A pricing table with 3 tiers — Free, Pro, and Enterprise — using Shadcn UI cards with a highlighted &quot;Pro&quot; tier.
                                </p>
                                <div className="flex items-center justify-between mt-2">
                                    <div className="flex gap-2">
                                        <span className="px-2.5 py-1 rounded-md text-xs bg-blue-100/70 dark:bg-blue-900/40 text-primary border border-blue-200/40 dark:border-blue-800/30">Next.js</span>
                                        <span className="px-2.5 py-1 rounded-md text-xs bg-blue-100/70 dark:bg-blue-900/40 text-primary border border-blue-200/40 dark:border-blue-800/30">Shadcn UI</span>
                                    </div>
                                    <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shadow-md shadow-blue-500/25">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
                                    </div>
                                </div>
                            </div>

                            {/* Fake generated code preview */}
                            <div className="rounded-xl overflow-hidden border border-blue-200/25 dark:border-blue-800/20">
                                <div className="flex items-center justify-between px-4 py-2 bg-blue-50/60 dark:bg-[rgba(4,16,45,0.8)] border-b border-blue-200/20 dark:border-blue-800/20">
                                    <span className="text-xs font-mono text-text-secondary">PricingTable.tsx</span>
                                    <span className="text-xs text-primary">Generated</span>
                                </div>
                                <div className="px-4 py-3 font-mono text-xs leading-relaxed text-left bg-white/30 dark:bg-[rgba(2,10,30,0.5)] overflow-hidden max-h-28">
                                    <span className="text-blue-500 dark:text-blue-400">export default </span>
                                    <span className="text-foreground">{"function "}</span>
                                    <span className="text-cyan-600 dark:text-cyan-400">PricingTable</span>
                                    <span className="text-foreground">{"() {"}</span>
                                    <br />
                                    <span className="text-foreground pl-4">{"  return ("}</span>
                                    <br />
                                    <span className="text-foreground pl-8">{"    "}</span>
                                    <span className="text-blue-500 dark:text-blue-400">{"<"}</span>
                                    <span className="text-cyan-600 dark:text-cyan-400">{"div "}</span>
                                    <span className="text-sky-500 dark:text-sky-400">{"className"}</span>
                                    <span className="text-foreground">{"="}</span>
                                    <span className="text-green-600 dark:text-green-400">{'"grid grid-cols-3 gap-6"'}</span>
                                    <span className="text-blue-500 dark:text-blue-400">{">"}</span>
                                    <br />
                                    <span className="text-text-secondary pl-8 italic">{"      {/* Free, Pro, Enterprise tiers */}"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Features ── */}
            <section className="relative py-24 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-14">
                        <h2 className="font-heading font-bold text-3xl md:text-4xl tracking-tight mb-4">
                            Everything you need, nothing you don&apos;t
                        </h2>
                        <p className="text-text-secondary text-lg max-w-xl mx-auto">
                            Shiva is constrained by design — focused entirely on producing great frontend code.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {features.map((f) => (
                            <div key={f.title} className="flex flex-col gap-4 p-6 rounded-2xl
                                bg-white/50 dark:bg-[rgba(4,16,45,0.5)]
                                backdrop-blur-xl
                                border border-blue-200/40 dark:border-blue-800/30
                                shadow-sm shadow-blue-900/5 dark:shadow-blue-950/30
                                transition-all duration-200
                                hover:border-blue-300/60 dark:hover:border-blue-700/40
                                hover:shadow-md hover:shadow-blue-400/10 dark:hover:shadow-blue-500/10">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center
                                    bg-blue-100/70 dark:bg-blue-950/60
                                    border border-blue-200/40 dark:border-blue-800/30">
                                    {f.icon}
                                </div>
                                <div>
                                    <h3 className="font-heading font-semibold text-base mb-1.5">{f.title}</h3>
                                    <p className="text-sm text-text-secondary leading-relaxed">{f.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA banner ── */}
            <section className="relative py-24 px-6">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="relative p-10 md:p-14 rounded-3xl overflow-hidden
                        bg-white/50 dark:bg-[rgba(4,16,45,0.55)]
                        backdrop-blur-2xl
                        border border-blue-200/40 dark:border-blue-800/30
                        shadow-xl shadow-blue-900/8 dark:shadow-blue-950/40">
                        {/* Inner glow */}
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-400/8 via-transparent to-cyan-400/6 dark:from-blue-500/6 dark:to-cyan-400/4 rounded-3xl" />

                        <h2 className="relative font-heading font-bold text-3xl md:text-4xl tracking-tight mb-4">
                            Start building today
                        </h2>
                        <p className="relative text-text-secondary text-lg mb-8">
                            No setup, no configuration. Just describe what you want to build.
                        </p>
                        <Link href="/chat">
                            <Button size="lg" variant="primary" className="gap-2 px-8 shadow-lg shadow-blue-500/20 hover:shadow-blue-400/30">
                                Open Shiva
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="relative border-t border-blue-200/30 dark:border-blue-900/25 py-8 px-6">
                <div className="max-w-5xl mx-auto flex items-center justify-between text-sm text-text-secondary">
                    <span className="font-heading font-semibold text-foreground">Shiva</span>
                    <span>&copy; {new Date().getFullYear()} Shiva AI. All rights reserved.</span>
                </div>
            </footer>
        </div>
    );
}
