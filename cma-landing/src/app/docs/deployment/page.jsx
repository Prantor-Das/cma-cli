export default function DeploymentPage() {
    return (
        <div>
            <header className="space-y-4 mb-12">
                <h1 className="text-4xl font-bold tracking-tight">
                    Deployment
                </h1>
                <p className="text-lg text-zinc-600 dark:text-zinc-400">
                    Deployment strategies vary based on your project setup:
                    full-stack, client-only, or server-only.
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                        <strong>New in v1.1.0:</strong> Optimized deployment
                        configurations for different project types. Package
                        manager-specific build optimizations included.
                    </p>
                </div>
                <hr className="border-zinc-200 dark:border-zinc-800" />
            </header>

            <section id="client-deployment" className="mb-12">
                <h2 className="text-3xl font-semibold mb-4">
                    Client Deployment (Frontend)
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                    The client is a static site built with Vite that can be
                    deployed to any static hosting service like Vercel, Netlify,
                    or GitHub Pages.
                </p>

                <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold mb-2">
                        For Full-Stack Projects:
                    </h4>
                    <ol className="list-decimal list-inside text-zinc-600 dark:text-zinc-400 space-y-2">
                        <li>
                            Build the client: `npm run build --workspace client`
                            or `cd client && npm run build`
                        </li>
                        <li>
                            Deploy the `client/dist` folder to your hosting
                            service.
                        </li>
                        <li>
                            Set `VITE_API_URL` environment variable to your
                            deployed backend URL.
                        </li>
                    </ol>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold mb-2">
                        For Client-Only Projects:
                    </h4>
                    <ol className="list-decimal list-inside text-zinc-600 dark:text-zinc-400 space-y-2">
                        <li>
                            Build the application: `npm run build` (or with your
                            chosen package manager)
                        </li>
                        <li>
                            Deploy the generated `dist` folder to your hosting
                            service.
                        </li>
                        <li>
                            No backend configuration needed - it's a standalone
                            React app.
                        </li>
                    </ol>
                </div>

                <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">
                        Package Manager Specific Commands:
                    </h4>
                    <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400 space-y-1">
                        <li>
                            <strong>bun:</strong> `bun run build` (fastest
                            build)
                        </li>
                        <li>
                            <strong>pnpm:</strong> `pnpm build` (efficient
                            caching)
                        </li>
                        <li>
                            <strong>yarn:</strong> `yarn build` (reliable
                            builds)
                        </li>
                        <li>
                            <strong>npm:</strong> `npm run build` (standard)
                        </li>
                    </ul>
                </div>
            </section>

            <section id="server-deployment" className="mb-12">
                <h2 className="text-3xl font-semibold mb-4">
                    Server Deployment (Backend)
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                    The server can be deployed to any service that supports
                    Node.js, such as Heroku, Render, Railway, or a VPS.
                </p>

                <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold mb-2">
                        For Full-Stack Projects:
                    </h4>
                    <ol className="list-decimal list-inside text-zinc-600 dark:text-zinc-400 space-y-2">
                        <li>
                            Build the server (TypeScript only): `npm run build
                            --workspace server`
                        </li>
                        <li>
                            Deploy the `server/` directory to your hosting
                            platform.
                        </li>
                        <li>
                            Ensure your platform runs `npm start` from the
                            server directory.
                        </li>
                    </ol>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold mb-2">
                        For Server-Only Projects:
                    </h4>
                    <ol className="list-decimal list-inside text-zinc-600 dark:text-zinc-400 space-y-2">
                        <li>
                            Build the application (TypeScript): `npm run build`
                        </li>
                        <li>Deploy the entire project directory.</li>
                        <li>
                            Platform should run `npm start` from project root.
                        </li>
                    </ol>
                </div>

                <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold mb-2">
                        Required Environment Variables:
                    </h4>
                    <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400 space-y-1">
                        <li>
                            <strong>NODE_ENV:</strong> Set to `production`
                        </li>
                        <li>
                            <strong>PORT:</strong> Server port (usually auto-set
                            by platform)
                        </li>
                        <li>
                            <strong>MONGODB_URI:</strong> Production MongoDB
                            connection string
                        </li>
                        <li>
                            <strong>CORS_ORIGIN:</strong> Your deployed client
                            URL (full-stack only)
                        </li>
                        <li>
                            <strong>RATE_LIMIT_WINDOW_MS:</strong> Rate limiting
                            window (optional)
                        </li>
                        <li>
                            <strong>RATE_LIMIT_MAX_REQUESTS:</strong> Max
                            requests per window (optional)
                        </li>
                    </ul>
                </div>

                <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">
                        Package Manager Considerations:
                    </h4>
                    <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400 space-y-1">
                        <li>
                            <strong>bun:</strong> Ensure platform supports bun
                            runtime
                        </li>
                        <li>
                            <strong>pnpm:</strong> Include `pnpm-lock.yaml` and
                            set npm_config_production=false if needed
                        </li>
                        <li>
                            <strong>yarn:</strong> Include `yarn.lock` for
                            consistent installs
                        </li>
                        <li>
                            <strong>npm:</strong> Standard deployment, works
                            everywhere
                        </li>
                    </ul>
                </div>
            </section>

            <section id="full-stack-deployment" className="mb-12">
                <h2 className="text-3xl font-semibold mb-4">
                    Full-Stack Deployment Strategies
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                    For full-stack projects, you have several deployment
                    options:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
                        <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2">
                            Separate Deployment
                        </h4>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                            Deploy client and server independently:
                        </p>
                        <ul className="list-disc list-inside text-xs text-zinc-600 dark:text-zinc-400">
                            <li>Client: Vercel, Netlify, GitHub Pages</li>
                            <li>Server: Heroku, Render, Railway</li>
                            <li>Best for: Different scaling needs</li>
                        </ul>
                    </div>
                    <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">
                            Monorepo Deployment
                        </h4>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                            Deploy entire project to one platform:
                        </p>
                        <ul className="list-disc list-inside text-xs text-zinc-600 dark:text-zinc-400">
                            <li>Platforms: Render, Railway, DigitalOcean</li>
                            <li>Serve client as static files from server</li>
                            <li>Best for: Simpler deployment pipeline</li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
}
