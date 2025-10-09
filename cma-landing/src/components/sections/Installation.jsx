import { InCodeBlock } from "../CodeBlock";
import { AlertTriangle } from "lucide-react";

const Installation = () => {
    return (
        <section id="installation" className="py-20">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold space-font">
                    Installation Guide
                </h2>
                <p className="text-zinc-500 dark:text-zinc-400 mt-2">
                    Get started in just a few steps.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <div className="bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-3 sm:p-6">
                    <h3 className="text-xl font-bold mb-4">
                        Quick Install (Recommended)
                    </h3>
                    <p className="text-zinc-500 dark:text-zinc-400 mb-4">
                        The easiest way to get started is to use `npx`. This
                        ensures you are always using the latest version of the
                        CLI.
                    </p>
                    <InCodeBlock code="npx cma-cli" />
                </div>
                <div className="bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-3 sm:p-6">
                    <h3 className="text-xl font-bold mb-4">
                        Global Installation
                    </h3>
                    <p className="text-zinc-500 dark:text-zinc-400 mb-4">
                        You can also install the CLI globally on your system.
                    </p>
                    <InCodeBlock code="npm install -g cma-cli" />
                    <div className="h-4"></div>
                    <InCodeBlock code="cma-cli" />
                    <div className="mt-4 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800/50 text-yellow-800 dark:text-yellow-200 rounded-lg p-4 flex items-start space-x-3">
                        <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <p className="text-sm">
                            If you install globally, remember to update the
                            package periodically to get the latest features and
                            security patches.
                            <br />
                            <code className="bg-yellow-200 dark:bg-yellow-800/50 rounded px-1 text-xs">
                                npm update -g cma-cli
                            </code>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Installation;
