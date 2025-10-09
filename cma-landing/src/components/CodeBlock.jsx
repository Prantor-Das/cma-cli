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
        <div
            className="relative rounded-2xl p-6 jetbrains-font text-left sm:text-lg flex justify-between items-end pt-14
  bg-zinc-950 dark:bg-zinc-100
  transition-all duration-500 hover:scale-[1.02]
  before:absolute before:inset-0 before:rounded-2xl before:p-[2px]
  before:bg-[conic-gradient(from_0deg,red,orange,yellow,green,cyan,blue,violet,red)]
  before:opacity-0 hover:before:opacity-100 hover:before:blur-[8px]
  before:animate-[spin_4s_linear_infinite]
  before:transition-all before:duration-500
  after:absolute after:inset-[2px] after:rounded-2xl after:bg-zinc-950 dark:after:bg-zinc-100
  overflow-hidden z-0 hover:shadow-lg"
        >
            <div className="absolute top-6 left-6 flex space-x-1.5 z-10">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="text-green-400 dark:text-green-500 font-bold z-10">
                <span className="text-zinc-400 font-normal">$ </span>
                {code}
            </div>
            <button
                onClick={copyToClipboard}
                className="hover:cursor-pointer p-1 text-zinc-400 dark:text-zinc-500 hover:text-white dark:hover:text-zinc-800 transition-all duration-200 z-10"
            >
                {hasCopied ? (
                    <Check className="w-5 h-5 text-green-400 dark:text-green-500" />
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
        <div className="bg-white/90 dark:bg-zinc-800/50 rounded-2xl p-6 jetbrains-font font-semibold text-left relative text-sm sm:text-lg flex justify-between items-end pt-14 transition-all duration-300">
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
                className="hover:cursor-pointer p-1 text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-50 transition-all duration-200"
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
