"use client";

import Link from "next/link";
import { Github, Package } from "lucide-react";
import ThemeToggle from "../ThemeToggle";
import { GITHUB_REPO_LINK, NPM_PACKAGE_LINK } from "@/context/constants";
import { usePathname } from "next/navigation";

const Header = () => {
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/50 backdrop-blur-md rounded-b-2xl">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex py-4 items-center justify-between">
                <div className="mr-4 flex items-center">
                    <Link
                        href="/"
                        className="sm:mr-10 md:mr-16 flex items-center space-x-2"
                    >
                        <span className="font-bold sm:text-lg jetbrains-font">
                            cma-cli
                        </span>
                    </Link>
                    <Link
                        href="/docs"
                        className={`text-zinc-600  hover:text-black dark:hover:text-zinc-50 hover:font-semibold transition-all duration-200 ml-4 md:ml-0 ${
                            pathname === "/docs"
                                ? "font-semibold text-black dark:text-white"
                                : "dark:text-zinc-300"
                        }`}
                    >
                        Docs
                    </Link>
                </div>
                <div className="flex items-center justify-between space-x-2 md:justify-end">
                    <nav className="flex items-center gap-2 sm:gap-4">
                        <a
                            href={GITHUB_REPO_LINK}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex bg-zinc-100/80 border border-zinc-300 dark:border-zinc-700 px-2 sm:px-4 py-2 rounded-xl items-center gap-1 text-sm  dark:bg-zinc-950 hover:bg-zinc-200/70 dark:hover:bg-zinc-800/70 transition-all duration-300"
                        >
                            <Github size={18} />
                            <span className="hidden sm:block ">GitHub</span>
                        </a>
                        <a
                            href={NPM_PACKAGE_LINK}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex bg-zinc-100/80 border border-zinc-300 dark:border-zinc-700 px-2 sm:px-4 py-2 rounded-xl items-center gap-1 text-sm dark:bg-zinc-950 hover:bg-zinc-200/70 dark:hover:bg-zinc-800/70 transition-all duration-300"
                        >
                            <Package
                                size={18}
                                className="text-red-500 dark:text-red-400"
                            />
                            <span className="hidden sm:block">NPM</span>
                        </a>
                        <ThemeToggle />
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;
