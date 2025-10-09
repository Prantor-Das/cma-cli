export default function DeploymentPage() {
    return (
        <div>
            <header className="space-y-4 mb-12">
                <h1 className="text-4xl font-bold tracking-tight">
                    Deployment
                </h1>
                <p className="text-lg text-zinc-600 dark:text-zinc-400">
                    Here's a guide to deploying your MERN stack application.
                </p>
                <hr className="border-zinc-200 dark:border-zinc-800" />
            </header>

            <section id="client-deployment" className="mb-12">
                <h2 className="text-3xl font-semibold mb-4">
                    Client (Frontend)
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                    The client is a static site that can be deployed to any
                    static hosting service like Vercel, Netlify, or GitHub
                    Pages.
                </p>
                <ol className="list-decimal list-inside text-zinc-600 dark:text-zinc-400 space-y-2">
                    <li>
                        Build the client application by running `npm run build`
                        in the `client` directory.
                    </li>
                    <li>
                        Deploy the generated `dist` folder to your hosting
                        service.
                    </li>
                    <li>
                        Make sure to set the `VITE_API_URL` environment variable
                        to the URL of your deployed backend.
                    </li>
                </ol>
            </section>

            <section id="server-deployment" className="mb-12">
                <h2 className="text-3xl font-semibold mb-4">
                    Server (Backend)
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                    The server can be deployed to any service that supports
                    Node.js, such as Heroku, Render, or a VPS.
                </p>
                <ol className="list-decimal list-inside text-zinc-600 dark:text-ray-400 space-y-2">
                    <li>
                        Make sure your `package.json` has a `start` script that
                        runs `node src/server.js` (for JavaScript) or `node
                        dist/server.js` (for TypeScript).
                    </li>
                    <li>
                        Set the following environment variables on your
                        deployment platform:
                        <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400 ml-4">
                            <li>`NODE_ENV`: Set to `production`.</li>
                            <li>
                                `PORT`: The port your server should listen on
                                (your provider will usually set this
                                automatically).
                            </li>
                            <li>
                                `MONGODB_URI`: The connection string for your
                                production MongoDB database.
                            </li>
                            <li>
                                `CORS_ORIGIN`: The URL of your deployed client
                                application.
                            </li>
                            <li>
                                `JWT_SECRET`: A long, random, and secret string
                                for signing JWTs.
                            </li>
                        </ul>
                    </li>
                    <li>Deploy your code to the platform.</li>
                </ol>
            </section>
        </div>
    );
}
