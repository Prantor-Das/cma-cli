"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export const CodeBlock = ({ code }) => {
    const [hasCopied, setHasCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(code);
        setHasCopied(true);
        setTimeout(() => {
            setHasCopied(false);
        }, 2000);
    };

    return (
        <div className="bg-zinc-950 dark:bg-zinc-900/70 rounded-2xl p-6 font-mono text-left relative sm:text-lg flex justify-between items-end pt-14 hover:shadow-[0px_0px_20px_10px_rgba(0,_0,_0,_0.2)] dark:hover:shadow-[0px_0px_20px_5px_rgba(255,_255,_255,_0.05)] transition-all duration-300 border border-transparent hover:border-zinc-700/80">
            <div className="absolute top-6 left-6 flex space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="text-green-400 font-semibold">
                <span className="text-zinc-400 font-normal">$ </span>
                {code}
            </div>
            <button
                onClick={copyToClipboard}
                className="hover:cursor-pointer p-1 text-zinc-400 hover:text-white transition-colors duration-150"
            >
                {hasCopied ? (
                    <Check className="w-5 h-5 text-green-400" />
                ) : (
                    <Copy className="w-5 h-5 " />
                )}
            </button>
        </div>
    );
};

export const InCodeBlock = ({ code }) => {
    const [hasCopied, setHasCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(code);
        setHasCopied(true);
        setTimeout(() => {
            setHasCopied(false);
        }, 2000);
    };

    return (
        <div className="bg-white/90 dark:bg-zinc-800/50 rounded-2xl p-6 font-mono text-left relative text-sm sm:text-lg flex justify-between items-end pt-14 transition-all duration-300">
            <div className="absolute top-6 left-6 flex space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="text-green-500">
                <span className="text-zinc-400">$ </span>
                {code}
            </div>
            <button
                onClick={copyToClipboard}
                className="hover:cursor-pointer p-1 text-zinc-400 hover:text-zinc-800 transition-colors duration-150"
            >
                {hasCopied ? (
                    <Check className="w-5 h-5 text-green-400" />
                ) : (
                    <Copy className="w-5 h-5 " />
                )}
            </button>
        </div>
    );
};
