"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function DocsLayout({ children }) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const linkClassName = (href) =>
        `text-lg font-medium text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200/30 hover:dark:bg-zinc-800/40 p-2 rounded-xl transition-all duration-300 ${
            pathname === href
                ? "bg-zinc-200/80 dark:bg-zinc-800/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),0_2px_2px_rgba(0,0,0,0.15)]"
                : ""
        }`;

    return (
        <div className="flex relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <aside
                className={`
          fixed right-0 top-17.25 h-full w-64 border-r border-zinc-200 dark:border-zinc-800
          transform transition-transform duration-300 ease-in-out z-50 md:z-0
          ${isOpen ? "translate-x-0" : "translate-x-100"}
          md:static md:translate-x-0 md:h-auto md:w-70  md:p-8 md:block
          backdrop-blur-lg bg-white/70 dark:bg-zinc-950/60 md:bg-transparent
        `}
            >
                <div className="flex justify-end items-center md:hidden p-4 px-8 border-b border-zinc-200 dark:border-zinc-800">
                    <button onClick={() => setIsOpen(false)}>
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="flex flex-col gap-3 p-6 md:p-0">
                    <Link
                        href="/docs"
                        className={linkClassName("/docs")}
                        onClick={() => setIsOpen(false)}
                    >
                        Getting Started
                    </Link>
                    <Link
                        href="/docs/project-structure"
                        className={linkClassName("/docs/project-structure")}
                        onClick={() => setIsOpen(false)}
                    >
                        Project Structure
                    </Link>
                    <Link
                        href="/docs/javascript"
                        className={linkClassName("/docs/javascript")}
                        onClick={() => setIsOpen(false)}
                    >
                        JavaScript
                    </Link>
                    <Link
                        href="/docs/typescript"
                        className={linkClassName("/docs/typescript")}
                        onClick={() => setIsOpen(false)}
                    >
                        TypeScript
                    </Link>

                    <Link
                        href="/docs/api-routes"
                        className={linkClassName("/docs/api-routes")}
                        onClick={() => setIsOpen(false)}
                    >
                        API Routes
                    </Link>
                    <Link
                        href="/docs/deployment"
                        className={linkClassName("/docs/deployment")}
                        onClick={() => setIsOpen(false)}
                    >
                        Deployment
                    </Link>
                </nav>
            </aside>

            {!isOpen && (
                <button
                    className="md:hidden fixed top-20 right-6 z-50 bg-white dark:bg-zinc-900 p-2 rounded-md shadow"
                    onClick={() => setIsOpen(true)}
                >
                    <Menu className="w-6 h-6" />
                </button>
            )}

            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/30 dark:bg-zinc-950/40 z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <main className="flex-1 pt-16 md:pt-8 md:pl-6">{children}</main>
        </div>
    );
}
