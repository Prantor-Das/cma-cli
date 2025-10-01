export default function ProjectStructurePage() {
    return (
        <div>
            <header className="space-y-4 mb-12">
                <h1 className="text-4xl font-bold tracking-tight">
                    Project Structure
                </h1>
                <p className="text-lg text-zinc-600 dark:text-zinc-400">
                    The generated project has a monorepo structure with two main
                    workspaces: `client` and `server`.
                </p>
                <hr className="border-zinc-200 dark:border-zinc-800" />
            </header>

            <section id="project-structure" className="mb-12">
                <div className="space-y-8">
                    <p className="text-zinc-600 dark:text-zinc-400">
                        The project is organized as a monorepo, which means it
                        contains both the frontend and backend code in a single
                        repository. This approach simplifies development and
                        deployment.
                    </p>
                    <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
                        <h3 className="text-2xl font-semibold mb-2">
                            Root Directory
                        </h3>
                        <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400">
                            <li>
                                <b>client/</b>: Contains the React frontend
                                application.
                            </li>
                            <li>
                                <b>server/</b>: Contains the Express backend
                                application.
                            </li>
                            <li>
                                <b>.gitignore</b>: Specifies which files and
                                folders to ignore in Git.
                            </li>
                            <li>
                                <b>package.json</b>: The root `package.json`
                                file, which defines the workspaces and scripts
                                for the entire project.
                            </li>
                            <li>
                                <b>README.md</b>: A markdown file with
                                instructions on how to run the project.
                            </li>
                        </ul>
                    </div>

                    <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
                        <h3 className="text-2xl font-semibold mb-2">
                            Client Directory
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
                                components.
                            </li>
                            <li>
                                <b>src/pages/</b>: Page components for different
                                routes.
                            </li>
                            <li>
                                <b>src/App.jsx / App.tsx</b>: The root component
                                where routing is handled.
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
                                <b>tailwind.config.js</b>: Tailwind CSS
                                configuration.
                            </li>
                        </ul>
                    </div>

                    <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
                        <h3 className="text-2xl font-semibold mb-2">
                            Server Directory
                        </h3>
                        <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400">
                            <li>
                                <b>src/</b>: Contains the source code of the
                                Express application.
                            </li>
                            <li>
                                <b>src/config/</b>: Contains configuration
                                files, like the database connection.
                            </li>
                            <li>
                                <b>src/controllers/</b>: (Optional) Logic for
                                handling requests and responses.
                            </li>
                            <li>
                                <b>src/middleware/</b>: Custom middleware for
                                authentication, error handling, etc.
                            </li>
                            <li>
                                <b>src/models/</b>: Mongoose schemas for your
                                database models.
                            </li>
                            <li>
                                <b>src/routes/</b>: API route definitions.
                            </li>
                            <li>
                                <b>src/server.js / server.ts</b>: The entry
                                point of the Express server.
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
}
