"use client";

import { useState, type ReactNode } from "react";
import { Copy, Download, PanelLeftOpen, Check, LayoutTemplate, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Mock code for each generation ──────────────────────────────────────────

const GENERATION_CODE: Record<number, { files: Record<string, string>; activeFile: string }> = {
    0: {
        activeFile: "PricingTable.tsx",
        files: {
            "PricingTable.tsx": `import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card, CardContent, CardDescription,
  CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card"
import { plans } from "./pricing.config"

export default function PricingTable() {
  return (
    <div className="grid grid-cols-3 gap-6 w-full max-w-5xl mx-auto py-12">
      {plans.map((plan) => (
        <Card
          key={plan.name}
          className={plan.highlighted
            ? "ring-2 ring-primary shadow-lg shadow-primary/20 relative"
            : "relative"
          }
        >
          {plan.highlighted && (
            <div className="absolute -top-3 inset-x-0 flex justify-center">
              <span className="bg-primary text-white text-xs
                               font-medium px-3 py-1 rounded-full">
                Most Popular
              </span>
            </div>
          )}
          <CardHeader>
            <CardTitle>{plan.name}</CardTitle>
            <CardDescription>{plan.description}</CardDescription>
            <div className="text-3xl font-bold mt-2">
              {plan.price}
              <span className="text-sm font-normal text-muted-foreground">/mo</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary" />
                  {f}
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              variant={plan.highlighted ? "default" : "outline"}
            >
              {plan.cta}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}`,
            "pricing.config.ts": `export const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for side projects",
    features: [
      "5 projects",
      "10k generations / mo",
      "Community support",
    ],
    cta: "Get started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$29",
    description: "For professional developers",
    features: [
      "Unlimited projects",
      "100k generations / mo",
      "Priority support",
      "Custom design systems",
    ],
    cta: "Start free trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "$99",
    description: "For teams and organizations",
    features: [
      "Everything in Pro",
      "SSO & audit logs",
      "Dedicated support",
      "SLA guarantee",
    ],
    cta: "Contact sales",
    highlighted: false,
  },
]`,
        },
    },
    1: {
        activeFile: "PricingTable.tsx",
        files: {
            "PricingTable.tsx": `"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card, CardContent, CardDescription,
  CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card"
import { BillingToggle } from "./BillingToggle"
import { plans } from "./pricing.config"

export default function PricingTable() {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly")

  return (
    <div className="flex flex-col items-center gap-10 py-12">
      <BillingToggle value={billing} onChange={setBilling} />

      <div className="grid grid-cols-3 gap-6 w-full max-w-5xl">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={plan.highlighted
              ? "ring-2 ring-primary shadow-xl shadow-primary/30 relative"
              : "relative"
            }
          >
            {plan.highlighted && (
              <div className="absolute -top-3 inset-x-0 flex justify-center">
                <span className="bg-primary text-white text-xs
                                 font-medium px-3 py-1 rounded-full">
                  Most Popular
                </span>
              </div>
            )}
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="text-3xl font-bold mt-2">
                \${billing === "monthly"
                  ? plan.price.monthly
                  : plan.price.annual}
                <span className="text-sm font-normal text-muted-foreground">/mo</span>
              </div>
              {billing === "annual" && (
                <span className="text-xs text-primary font-medium">
                  Save {plan.annualSavings}% with annual billing
                </span>
              )}
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant={plan.highlighted ? "default" : "outline"}
              >
                {plan.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}`,
            "BillingToggle.tsx": `interface BillingToggleProps {
  value: "monthly" | "annual"
  onChange: (v: "monthly" | "annual") => void
}

export function BillingToggle({ value, onChange }: BillingToggleProps) {
  return (
    <div className="flex items-center gap-1 p-1 rounded-full
                    bg-muted border border-border text-sm">
      <button
        onClick={() => onChange("monthly")}
        className={value === "monthly"
          ? "px-4 py-1.5 rounded-full bg-background shadow-sm font-medium"
          : "px-4 py-1.5 rounded-full text-muted-foreground hover:text-foreground"
        }
      >
        Monthly
      </button>
      <button
        onClick={() => onChange("annual")}
        className={value === "annual"
          ? "px-4 py-1.5 rounded-full bg-background shadow-sm font-medium"
          : "px-4 py-1.5 rounded-full text-muted-foreground hover:text-foreground"
        }
      >
        Annual
        <span className="ml-1.5 text-xs text-primary font-medium">−20%</span>
      </button>
    </div>
  )
}`,
            "pricing.config.ts": `export const plans = [
  {
    name: "Free",
    price: { monthly: 0, annual: 0 },
    annualSavings: 0,
    description: "Perfect for side projects",
    features: [
      "5 projects",
      "10k generations / mo",
      "Community support",
    ],
    cta: "Get started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: { monthly: 29, annual: 23 },
    annualSavings: 20,
    description: "For professional developers",
    features: [
      "Unlimited projects",
      "100k generations / mo",
      "Priority support",
      "Custom design systems",
    ],
    cta: "Start free trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: { monthly: 99, annual: 79 },
    annualSavings: 20,
    description: "For teams and organizations",
    features: [
      "Everything in Pro",
      "SSO & audit logs",
      "Dedicated support",
      "SLA guarantee",
    ],
    cta: "Contact sales",
    highlighted: false,
  },
]`,
        },
    },
};

// ── Minimal syntax highlighter ──────────────────────────────────────────────

function highlight(code: string) {
    const lines = code.split("\n");
    return lines.map((line, i) => (
        <div key={i} className="table-row">
            <span className="table-cell select-none pr-5 text-right text-slate-600 dark:text-slate-600 w-8 shrink-0">
                {i + 1}
            </span>
            <span className="table-cell">
                <HighlightedLine line={line} />
            </span>
        </div>
    ));
}

function HighlightedLine({ line }: { line: string }) {
    // Very simple token pass — comment, string, keyword, component
    if (/^\s*\/\//.test(line)) {
        return <span className="text-slate-500 dark:text-slate-500">{line}</span>;
    }

    const parts: ReactNode[] = [];
    let key = 0;

    const push = (node: ReactNode) => parts.push(<span key={key++}>{node}</span>);

    // Process tokens one-by-one (strings first, then keywords, then rest)
    const tokenRe = /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\b(?:import|export|default|from|const|let|var|return|function|interface|type|class|extends|implements|as|if|else|for|while|of|in|new)\b)|(<\/?[A-Z][a-zA-Z]*)|(\b[A-Z][a-zA-Z]+\b)/g;

    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = tokenRe.exec(line)) !== null) {
        if (match.index > lastIndex) {
            push(<span className="text-slate-300 dark:text-slate-300">{line.slice(lastIndex, match.index)}</span>);
        }
        if (match[1]) {
            push(<span className="text-emerald-400 dark:text-emerald-400">{match[1]}</span>);
        } else if (match[2]) {
            push(<span className="text-blue-400 dark:text-blue-400">{match[2]}</span>);
        } else if (match[3]) {
            push(<span className="text-cyan-400 dark:text-cyan-400">{match[3]}</span>);
        } else if (match[4]) {
            push(<span className="text-cyan-300 dark:text-cyan-300">{match[4]}</span>);
        }
        lastIndex = match.index + match[0].length;
    }
    if (lastIndex < line.length) {
        push(<span className="text-slate-300 dark:text-slate-300">{line.slice(lastIndex)}</span>);
    }

    return <>{parts}</>;
}

// ── Preview component ────────────────────────────────────────────────────────

function PricingPreview({ withToggle }: { withToggle: boolean }) {
    const [billing, setBilling] = useState<"monthly" | "annual">("monthly");

    const plans = [
        {
            name: "Free",
            price: { monthly: "$0", annual: "$0" },
            desc: "Perfect for side projects",
            features: ["5 projects", "10k generations/mo", "Community support"],
            cta: "Get started",
            highlighted: false,
        },
        {
            name: "Pro",
            price: { monthly: "$29", annual: "$23" },
            desc: "For professional developers",
            features: ["Unlimited projects", "100k gen/mo", "Priority support", "Custom systems"],
            cta: "Start free trial",
            highlighted: true,
        },
        {
            name: "Enterprise",
            price: { monthly: "$99", annual: "$79" },
            desc: "For teams and organizations",
            features: ["Everything in Pro", "SSO & audit logs", "Dedicated support", "SLA guarantee"],
            cta: "Contact sales",
            highlighted: false,
        },
    ];

    return (
        <div className="flex flex-col items-center gap-8 py-10 px-6 w-full">
            {withToggle && (
                <div className="flex items-center gap-1 p-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm">
                    {(["monthly", "annual"] as const).map((b) => (
                        <button
                            key={b}
                            onClick={() => setBilling(b)}
                            className={cn(
                                "px-4 py-1.5 rounded-full transition-all text-sm capitalize",
                                billing === b
                                    ? "bg-white dark:bg-slate-700 shadow-sm font-medium text-foreground"
                                    : "text-text-secondary hover:text-foreground"
                            )}
                        >
                            {b}
                            {b === "annual" && (
                                <span className="ml-1.5 text-xs text-primary font-medium">−20%</span>
                            )}
                        </button>
                    ))}
                </div>
            )}

            <div className="grid grid-cols-3 gap-4 w-full max-w-3xl">
                {plans.map((plan) => (
                    <div
                        key={plan.name}
                        className={cn(
                            "relative flex flex-col rounded-xl p-5 border transition-all",
                            plan.highlighted
                                ? "border-primary/60 shadow-lg shadow-primary/20 bg-white dark:bg-slate-900"
                                : "border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60"
                        )}
                    >
                        {plan.highlighted && (
                            <div className="absolute -top-3 inset-x-0 flex justify-center">
                                <span className="bg-primary text-white text-[10px] font-semibold px-3 py-0.5 rounded-full">
                                    Most Popular
                                </span>
                            </div>
                        )}
                        <div className="mb-4">
                            <p className="font-semibold text-sm text-foreground">{plan.name}</p>
                            <p className="text-xs text-text-secondary mt-0.5">{plan.desc}</p>
                            <div className="mt-3 text-2xl font-bold text-foreground">
                                {plan.price[billing]}
                                <span className="text-xs font-normal text-text-secondary">/mo</span>
                            </div>
                            {withToggle && billing === "annual" && plan.highlighted && (
                                <p className="text-[10px] text-primary mt-0.5 font-medium">Save 20% annually</p>
                            )}
                        </div>
                        <ul className="space-y-1.5 flex-1 mb-4">
                            {plan.features.map((f) => (
                                <li key={f} className="flex items-center gap-1.5 text-xs text-text-secondary">
                                    <div className="w-3.5 h-3.5 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                                        <Check className="w-2 h-2 text-primary" />
                                    </div>
                                    {f}
                                </li>
                            ))}
                        </ul>
                        <button className={cn(
                            "w-full py-2 rounded-lg text-xs font-medium transition-colors",
                            plan.highlighted
                                ? "bg-primary text-white hover:bg-primary-hover"
                                : "border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-foreground"
                        )}>
                            {plan.cta}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── Main CodePanel ───────────────────────────────────────────────────────────

interface CodePanelProps {
    activeGenId: number;
    threadOpen: boolean;
    onOpenThread: () => void;
}

export function CodePanel({ activeGenId, threadOpen, onOpenThread }: CodePanelProps) {
    const [tab, setTab] = useState<"code" | "preview">("code");
    const [copied, setCopied] = useState(false);
    const gen = GENERATION_CODE[activeGenId];
    const [activeFile, setActiveFile] = useState(gen.activeFile);
    const files = Object.keys(gen.files);
    const code = gen.files[activeFile] ?? "";

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex-1 flex flex-col overflow-hidden min-w-0 bg-[#080E1E] dark:bg-[#05090F]">
            {/* Top bar */}
            <div className="h-12 flex items-center gap-2 px-4 shrink-0
                border-b border-white/8
                bg-[#0A1020] dark:bg-[#070C14]">

                {/* Re-open thread */}
                {!threadOpen && (
                    <button
                        onClick={onOpenThread}
                        className="p-1.5 rounded-md text-slate-500 hover:text-slate-300 hover:bg-white/8 transition-colors mr-1"
                        title="Open thread"
                    >
                        <PanelLeftOpen className="w-4 h-4" />
                    </button>
                )}

                {/* Code / Preview tabs */}
                <div className="flex items-center gap-1 p-0.5 rounded-lg bg-white/6 border border-white/8">
                    <button
                        onClick={() => setTab("code")}
                        className={cn(
                            "flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all",
                            tab === "code"
                                ? "bg-white/12 text-slate-100 shadow-sm"
                                : "text-slate-500 hover:text-slate-300"
                        )}
                    >
                        <Code2 className="w-3.5 h-3.5" />
                        Code
                    </button>
                    <button
                        onClick={() => setTab("preview")}
                        className={cn(
                            "flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all",
                            tab === "preview"
                                ? "bg-white/12 text-slate-100 shadow-sm"
                                : "text-slate-500 hover:text-slate-300"
                        )}
                    >
                        <LayoutTemplate className="w-3.5 h-3.5" />
                        Preview
                    </button>
                </div>

                {/* File tabs (only in code mode) */}
                {tab === "code" && (
                    <div className="flex items-center gap-0.5 ml-2 overflow-x-auto">
                        {files.map((f) => (
                            <button
                                key={f}
                                onClick={() => setActiveFile(f)}
                                className={cn(
                                    "px-3 py-1 rounded-md text-xs font-mono transition-colors whitespace-nowrap",
                                    activeFile === f
                                        ? "bg-white/12 text-slate-200"
                                        : "text-slate-500 hover:text-slate-300 hover:bg-white/6"
                                )}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                )}

                {/* Actions */}
                <div className="ml-auto flex items-center gap-1.5">
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs text-slate-400 hover:text-slate-200 hover:bg-white/8 transition-colors"
                    >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? "Copied" : "Copy"}
                    </button>
                    <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs text-slate-400 hover:text-slate-200 hover:bg-white/8 transition-colors">
                        <Download className="w-3.5 h-3.5" />
                        Export
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto">
                {tab === "code" ? (
                    <pre className="table w-full min-w-full p-5 text-[13px] leading-6 font-mono">
                        {highlight(code)}
                    </pre>
                ) : (
                    <div className="h-full overflow-auto bg-slate-50 dark:bg-[#0D1424]">
                        {/* Preview toolbar */}
                        <div className="sticky top-0 flex items-center justify-between px-4 py-2
                            bg-white/80 dark:bg-[#0A1020]/90 backdrop-blur-sm
                            border-b border-slate-200/60 dark:border-white/8 z-10">
                            <span className="text-xs text-slate-400 font-mono">PricingTable — Live Preview</span>
                            <div className="flex gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600" />
                                <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600" />
                                <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600" />
                            </div>
                        </div>
                        <PricingPreview withToggle={activeGenId === 1} />
                    </div>
                )}
            </div>
        </div>
    );
}
