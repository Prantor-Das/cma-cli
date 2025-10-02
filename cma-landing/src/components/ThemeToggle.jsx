"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);
    if (!mounted) return null;

    const isDark = resolvedTheme === "dark";

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={`p-1 text-white dark:text-black bg-zinc-950 hover:bg-zinc-950/80 px-4 py-2 rounded-xl dark:bg-zinc-50 dark:hover:bg-zinc-50/80 flex items-center justify-center transition-all duration-200 hover:cursor-pointer border border-zinc-950 dark:border-zinc-50`}
            aria-label="Toggle theme"
        >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
    );
}
