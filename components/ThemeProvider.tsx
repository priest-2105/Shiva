"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextValue {
    theme: Theme;
    resolvedTheme: "light" | "dark";
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
    theme: "system",
    resolvedTheme: "light",
    setTheme: () => {},
});

export function useTheme() {
    return useContext(ThemeContext);
}

function getSystemTheme(): "light" | "dark" {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: Theme) {
    const resolved = theme === "system" ? getSystemTheme() : theme;
    document.documentElement.classList.toggle("dark", resolved === "dark");
    return resolved;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>(() => {
        if (typeof window === "undefined") {
            return "system";
        }

        const stored = localStorage.getItem("theme");
        return stored === "light" || stored === "dark" || stored === "system" ? stored : "system";
    });
    const [systemTheme, setSystemTheme] = useState<"light" | "dark">(() =>
        typeof window === "undefined" ? "light" : getSystemTheme()
    );
    const resolvedTheme = theme === "system" ? systemTheme : theme;

    useEffect(() => {
        applyTheme(theme);
    }, [theme]);

    // Listen to system changes when in system mode
    useEffect(() => {
        const mq = window.matchMedia("(prefers-color-scheme: dark)");
        const handler = (e: MediaQueryListEvent) => {
            setSystemTheme(e.matches ? "dark" : "light");
        };
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, []);

    useEffect(() => {
        if (theme === "system") {
            document.documentElement.classList.toggle("dark", systemTheme === "dark");
        }
    }, [systemTheme, theme]);

    const setTheme = (next: Theme) => {
        setThemeState(next);
        localStorage.setItem("theme", next);
    };

    return (
        <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}
