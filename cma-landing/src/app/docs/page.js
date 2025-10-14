import { InCodeBlock } from "../../components/CodeBlock";

export default function GettingStartedPage() {
    return (
        <>
            <section id="introduction" className="mb-12">
                <h2 className="text-3xl font-semibold mb-4">Introduction</h2>
                <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                    `cma-cli` is a command-line interface (CLI) tool that
                    dramatically speeds up the development of MERN stack
                    applications. It generates a clean, scalable, and
                    production-ready boilerplate with all the necessary
                    configurations, so you can focus on writing code that
                    matters.
                </p>
                <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                    This documentation will walk you through the features,
                    project structure, and customization options available in
                    the generated templates.
                </p>
                <p className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm text-blue-800 dark:text-blue-200">
                    <strong>New in v1.1.0:</strong> Choose your project
                    structure during initialization between client-only,
                    server-only, or full-stack. Support for bun, pnpm, yarn, and
                    npm package managers with intelligent detection.
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

                <h3 className="text-2xl font-semibold mb-2 mt-8">
                    Interactive Setup
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 mt-4">
                    The CLI will guide you through an interactive setup process
                    where you can choose:
                </p>
                <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400 mt-4 space-y-2">
                    <li>
                        <strong>Project Name:</strong> Enter your project name
                        or use "./" for current directory
                    </li>
                    <li>
                        <strong>Language:</strong> JavaScript or TypeScript
                        templates
                    </li>
                    <li>
                        <strong>Package Manager:</strong> Automatically detects
                        bun, pnpm, yarn, or npm
                    </li>
                    <li>
                        <strong>Initialize Parts:</strong> Client-only,
                        server-only, or full-stack
                    </li>
                    <li>
                        <strong>Concurrently:</strong> Run client and server
                        together (for full-stack)
                    </li>
                    <li>
                        <strong>Dependencies:</strong> Automatic installation
                        with your chosen package manager
                    </li>
                    <li>
                        <strong>Git Repository:</strong> Initialize Git with
                        optional GitHub integration
                    </li>
                </ul>
            </section>
        </>
    );
}
