import { InCodeBlock } from "../../components/CodeBlock";

export default function GettingStartedPage() {
    return (
        <>
            <section id="introduction" className="mb-12">
                <h2 className="text-3xl font-semibold mb-4">Introduction</h2>
                <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                    `create-mern-app` is a command-line interface (CLI) tool
                    that dramatically speeds up the development of MERN stack
                    applications. It generates a clean, scalable, and
                    production-ready boilerplate with all the necessary
                    configurations, so you can focus on writing code that
                    matters.
                </p>
                <p className="text-zinc-600 dark:text-zinc-400">
                    This documentation will walk you through the features,
                    project structure, and customization options available in
                    the generated templates.
                </p>
            </section>

            <section id="getting-started" className="mb-12">
                <h2 className="text-3xl font-semibold mb-4">Getting Started</h2>
                <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                    To create a new MERN stack application, you can use `npx` or
                    install the CLI globally.
                </p>

                <h3 className="text-2xl font-semibold mb-2">Using npx</h3>
                <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                    This is the recommended approach as it always uses the
                    latest version of the CLI.
                </p>
                <InCodeBlock language="bash" code={`npx cma-cli`} />

                <h3 className="text-2xl font-semibold mb-2 mt-8">
                    Global Installation
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                    You can also install the CLI globally to use it anywhere on
                    your system.
                </p>
                <InCodeBlock language="bash" code={`npm install -g cma-cli`} />
                <p className="text-zinc-600 dark:text-zinc-400 mt-4">
                    Once installed, you can create a new project by running:
                </p>
                <InCodeBlock language="bash" code={`cma-cli`} />

                <p className="text-zinc-600 dark:text-zinc-400 mt-4">
                    This will create a fresh MERN stack application. You can
                    choose between JavaScript and TypeScript templates during
                    the setup process.
                </p>
            </section>
        </>
    );
}
