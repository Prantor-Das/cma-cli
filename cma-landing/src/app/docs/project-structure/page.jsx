export default function ProjectStructurePage() {
    return (
        <div>
            <header className="space-y-4 mb-8">
                <h1 className="text-4xl font-bold tracking-tight">
                    Project Structure
                </h1>
                <p className="text-lg text-zinc-600 dark:text-zinc-400">
                    The generated project structure varies based on your
                    initialization choice: full-stack (both), client-only, or
                    server-only.
                </p>
                <hr className="border-zinc-200 dark:border-zinc-800" />
            </header>

            <section id="project-structure" className="mb-12">
                <div className="space-y-8">
                    <p className="text-zinc-600 dark:text-zinc-400">
                        The project structure depends on your initialization
                        choice. Full-stack projects use a monorepo structure
                        with separate client and server directories, while
                        single-part projects have a focused structure.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
                            <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2">
                                Full-Stack (Both)
                            </h4>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                Monorepo with client/ and server/ directories
                            </p>
                        </div>
                        <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
                            <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">
                                Client-Only
                            </h4>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                React app structure in project root
                            </p>
                        </div>
                        <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
                            <h4 className="font-semibold text-purple-600 dark:text-purple-400 mb-2">
                                Server-Only
                            </h4>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                Express API structure in project root
                            </p>
                        </div>
                    </div>
                    <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
                        <h3 className="text-2xl font-semibold mb-2">
                            Full-Stack Structure (Both Client & Server)
                        </h3>
                        <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                            When you choose "both" during initialization, you
                            get a monorepo structure:
                        </p>
                        <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400">
                            <li>
                                <b>client/</b>: Contains the React frontend
                                application with Vite and Tailwind CSS.
                            </li>
                            <li>
                                <b>server/</b>: Contains the Express backend
                                application with MongoDB integration.
                            </li>
                            <li>
                                <b>.gitignore</b>: Specifies which files and
                                folders to ignore in Git.
                            </li>
                            <li>
                                <b>package.json</b>: The root `package.json`
                                file with workspaces and concurrent scripts.
                            </li>
                            <li>
                                <b>pnpm-workspace.yaml</b>: Workspace
                                configuration (when using pnpm).
                            </li>
                            <li>
                                <b>README.md</b>: Comprehensive setup and usage
                                instructions.
                            </li>
                        </ul>
                    </div>

                    <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
                        <h3 className="text-2xl font-semibold mb-2">
                            Client-Only Structure
                        </h3>
                        <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                            When you choose "client only", you get a focused
                            React application:
                        </p>
                        <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400">
                            <li>
                                <b>src/</b>: React application source code in
                                project root.
                            </li>
                            <li>
                                <b>public/</b>: Static assets and index.html.
                            </li>
                            <li>
                                <b>src/components/</b>: Reusable React
                                components.
                            </li>
                            <li>
                                <b>src/pages/</b>: Page components (Demo content
                                removed).
                            </li>
                            <li>
                                <b>vite.config.js/ts</b>: Vite configuration.
                            </li>
                            <li>
                                <b>package.json</b>: Client-focused dependencies
                                and scripts.
                            </li>
                        </ul>
                    </div>

                    <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
                        <h3 className="text-2xl font-semibold mb-2">
                            Server-Only Structure
                        </h3>
                        <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                            When you choose "server only", you get a focused
                            Express API:
                        </p>
                        <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400">
                            <li>
                                <b>src/</b>: Express application source code in
                                project root.
                            </li>
                            <li>
                                <b>src/config/</b>: Database and configuration
                                files.
                            </li>
                            <li>
                                <b>src/models/</b>: Mongoose schemas and models.
                            </li>
                            <li>
                                <b>src/routes/</b>: API route definitions.
                            </li>
                            <li>
                                <b>src/middleware/</b>: Custom middleware
                                functions.
                            </li>
                            <li>
                                <b>package.json</b>: Server-focused dependencies
                                and scripts.
                            </li>
                        </ul>
                    </div>

                    <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
                        <h3 className="text-2xl font-semibold mb-2">
                            Client Directory Structure
                        </h3>
                        <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400">
                            <li>
                                <b>public/</b>: Contains static assets like
                                images and fonts.
                            </li>
                            <li>
                                <b>src/</b>: Contains the source code of the
                                React application.
                            </li>
                            <li>
                                <b>src/components/</b>: Reusable React
                                components (Navigation, etc.).
                            </li>
                            <li>
                                <b>src/components/ui/</b>: UI components like
                                ThemeToggle.
                            </li>
                            <li>
                                <b>src/pages/</b>: Page components (Demo,
                                NotFound).
                            </li>
                            <li>
                                <b>src/hooks/</b>: Custom React hooks
                                (useTheme).
                            </li>
                            <li>
                                <b>src/config/</b>: Configuration files
                                (constants).
                            </li>
                            <li>
                                <b>src/App.jsx / App.tsx</b>: The root component
                                with routing.
                            </li>
                            <li>
                                <b>src/Layout.jsx / Layout.tsx</b>: Layout
                                wrapper with navigation.
                            </li>
                            <li>
                                <b>src/main.jsx / main.tsx</b>: The entry point
                                of the React application.
                            </li>
                            <li>
                                <b>vite.config.js / vite.config.ts</b>: Vite
                                configuration file.
                            </li>
                            <li>
                                <b>eslint.config.js</b>: ESLint configuration
                                with modern flat config.
                            </li>
                        </ul>
                    </div>

                    <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
                        <h3 className="text-2xl font-semibold mb-2">
                            Server Directory Structure
                        </h3>
                        <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400">
                            <li>
                                <b>src/</b>: Contains the source code of the
                                Express application.
                            </li>
                            <li>
                                <b>src/config/</b>: Configuration files
                                (connectDB, validateEnv).
                            </li>
                            <li>
                                <b>src/controllers/</b>: Request handlers (ready
                                for your logic).
                            </li>
                            <li>
                                <b>src/middleware/</b>: Custom middleware
                                (errorMiddleware).
                            </li>
                            <li>
                                <b>src/models/</b>: Mongoose schemas for your
                                database models.
                            </li>
                            <li>
                                <b>src/routes/</b>: API route definitions
                                (includes health check).
                            </li>
                            <li>
                                <b>src/validation/</b>: Input validation
                                handlers (JS only).
                            </li>
                            <li>
                                <b>src/types/</b>: TypeScript type definitions
                                (TS only).
                            </li>
                            <li>
                                <b>src/__tests__/</b>: Server tests with setup
                                configuration.
                            </li>
                            <li>
                                <b>src/utils/</b>: Utility functions (ready for
                                your code).
                            </li>
                            <li>
                                <b>src/server.js / server.ts</b>: The entry
                                point of the Express server.
                            </li>
                            <li>
                                <b>jest.config.js</b>: Jest testing
                                configuration.
                            </li>
                            <li>
                                <b>eslint.config.js</b>: ESLint configuration.
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
}
