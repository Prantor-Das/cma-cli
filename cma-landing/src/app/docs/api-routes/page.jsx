export default function ApiRoutesPage() {
    return (
        <div>
            <header className="space-y-4 mb-12">
                <h1 className="text-4xl font-bold tracking-tight">
                    API Routes
                </h1>
                <p className="text-lg text-zinc-600 dark:text-zinc-400">
                    The server provides a clean structure for building your API
                    routes, available in both full-stack and server-only setups.
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                        <strong>New in v1.1.0:</strong> API routes are available
                        in both full-stack and server-only projects. Enhanced
                        middleware and security features included by default.
                    </p>
                </div>
                <hr className="border-zinc-200 dark:border-zinc-800" />
            </header>

            <section id="health-route" className="mb-12">
                <h2 className="text-3xl font-semibold mb-4">
                    Health Check Route
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                    A basic health check endpoint is available at `/api/health`.
                </p>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr>
                            <th className="border-b-2 border-zinc-200 dark:border-zinc-800 p-2">
                                Route
                            </th>
                            <th className="border-b-2 border-zinc-200 dark:border-zinc-800 p-2">
                                Method
                            </th>
                            <th className="border-b-2 border-zinc-200 dark:border-zinc-800 p-2">
                                Description
                            </th>
                            <th className="border-b-2 border-zinc-200 dark:border-zinc-800 p-2">
                                Access
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border-b border-zinc-200 dark:border-zinc-800 p-2">
                                `/health`
                            </td>
                            <td className="border-b border-zinc-200 dark:border-zinc-800 p-2">
                                `GET`
                            </td>
                            <td className="border-b border-zinc-200 dark:border-zinc-800 p-2">
                                Check server health status.
                            </td>
                            <td className="border-b border-zinc-200 dark:border-zinc-800 p-2">
                                Public
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div className="mt-6 space-y-4">
                    <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2">
                            Creating Your Own Routes
                        </h3>
                        <p className="text-zinc-600 dark:text-zinc-400 mb-2">
                            The route directory structure depends on your
                            project setup:
                        </p>
                        <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400 space-y-1">
                            <li>
                                <strong>Full-Stack:</strong> Add routes in{" "}
                                <code className="bg-zinc-200 dark:bg-zinc-700 px-2 py-1 rounded">
                                    server/src/routes/
                                </code>
                            </li>
                            <li>
                                <strong>Server-Only:</strong> Add routes in{" "}
                                <code className="bg-zinc-200 dark:bg-zinc-700 px-2 py-1 rounded">
                                    src/routes/
                                </code>
                            </li>
                        </ul>
                        <p className="text-zinc-600 dark:text-zinc-400 mt-2">
                            Register new routes in the main routes file:{" "}
                            <code className="bg-zinc-200 dark:bg-zinc-700 px-2 py-1 rounded">
                                routes/index.js
                            </code>{" "}
                            or{" "}
                            <code className="bg-zinc-200 dark:bg-zinc-700 px-2 py-1 rounded">
                                routes/index.ts
                            </code>
                            .
                        </p>
                    </div>

                    <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2 text-green-800 dark:text-green-200">
                            Built-in Security Features
                        </h3>
                        <ul className="list-disc list-inside text-green-700 dark:text-green-300 space-y-1">
                            <li>Helmet for security headers</li>
                            <li>CORS configuration</li>
                            <li>Rate limiting middleware</li>
                            <li>Request compression</li>
                            <li>Query sanitization</li>
                            <li>Express validator integration</li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
}
