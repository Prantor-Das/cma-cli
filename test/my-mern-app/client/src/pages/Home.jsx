import { useState } from "react";
import {
    ArrowUpRight,
    Heart,
    Server,
    Palette,
} from "lucide-react";
import ApiMessage from "../components/ApiMessage";
import Person from "../components/ui/Person";
import DocumentationCard from "../components/ui/DocumentationCard";

export default function Home() {
    const [openId, setOpenId] = useState(null);

    return (
        <div className="space-y-12 my-4">
            {/* Header */}
            <div className="space-y-4 max-w-5xl mx-auto flex items-center justify-between flex-col sm:flex-row ">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-zinc-100 mb-2">
                        MERN Stack Starter
                    </h1>
                    <p className="text-gray-600 dark:text-zinc-400 md:w-2/3">
                        Instantly scaffold a production-ready MERN stack app
                        with clean structure and dev tooling
                    </p>
                </div>
                <div className="pt-0 flex flex-col items-center space-y-2 w-48">
                    <a
                        href="https://github.com/prasoonk1204/cma-cli"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex justify-center items-center px-4 py-2 bg-gray-900 text-white dark:bg-zinc-100 dark:text-gray-900 rounded-md text-sm font-medium hover:opacity-90 transition w-full border border-zinc-900 dark:border-zinc-100"
                    >
                        View on GitHub <ArrowUpRight className="w-4 h-4 ml-1" />
                    </a>
                    <a
                        href="https://npmjs.com/package/cma-cli"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex justify-center items-center px-4 py-2 bg-zinc-100 text-zinc-950 border border-zinc-950 hover:bg-zinc-200/80 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 dark:text-gray-100 dark:border-zinc-700 rounded-md text-sm font-medium transition w-full"
                    >
                        View on&nbsp;<span className="text-red-500 dark:text-red-400">NPM</span>
                        <ArrowUpRight className="w-4 h-4 ml-1" />
                    </a>
                </div>
            </div>

            {/* API Endpoint and Status */}
            <div className="rounded-xl max-w-5xl mx-auto border bg-white border-zinc-200 dark:bg-zinc-900/80 dark:border-zinc-800">
                <div className="flex flex-col space-y-1.5 p-6">
                    <h3 className="text-2xl font-semibold leading-none tracking-tight dark:text-zinc-100">
                        Test API Endpoint & Status
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-zinc-400">
                        Check the connection and health of your backend API
                    </p>
                </div>
                <div className="p-6 pt-0 flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-zinc-800 rounded-lg w-full">
                        <div>
                            <span className="font-mono text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                                GET
                            </span>
                            <span className="ml-3 font-mono text-gray-900 dark:text-zinc-100">
                                /api
                            </span>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-zinc-400">
                            Health check
                        </span>
                    </div>
                    <ApiMessage />
                </div>
            </div>

            {/* Documentation Section */}
            <div className="space-y-6 max-w-5xl mx-auto">
                <div className="mb-6">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-zinc-100 mb-2">
                        Getting Started Guide
                    </h2>
                    <p className="text-gray-600 dark:text-zinc-400 text-lg">
                        Follow these steps to customize your MERN stack
                        application and make it your own
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DocumentationCard
                        icon={Palette}
                        title="Client Setup"
                        items={[
                            {
                                title: "Environment Variables",
                                code: "client/.env",
                                description:
                                    "Add your API URL, app name, and other client configuration",
                            },
                            {
                                title: "Remove Demo Content",
                                code: "client/src/pages/Home.jsx",
                                description:
                                    "Replace this homepage content with your own landing page",
                            },
                            {
                                title: "Clean Up Components",
                                code: "client/src/components/ApiMessage.jsx",
                                description:
                                    "Remove demo components like ApiMessage, Person cards after setup",
                            },
                            {
                                title: "Delete .gitkeep files",
                                code: "client/src/**/.gitkeep",
                                description:
                                    "Delete placeholder .gitkeep files from different directories in client/src",
                            },
                        ]}
                    />

                    <DocumentationCard
                        icon={Server}
                        title="Server Setup"
                        items={[
                            {
                                title: "Environment Variables",
                                code: "server/.env",
                                description:
                                    "Set your MongoDB URI, JWT secret, and other server configuration",
                            },
                            {
                                title: "Database Models",
                                code: "server/src/models/",
                                description:
                                    "Create or modify models for your data structure (remove User model if not needed)",
                            },
                            {
                                title: "Remove Demo Api Routes",
                                code: "server/src/routes/users.js",
                                description:
                                    "Delete or modify sample auth and user routes. Create routes specific to your app",
                            },
                            {
                                title: "Update Route Index",
                                code: "server/src/routes/index.js",
                                description:
                                    "Register your new routes and remove unused demo route imports",
                            },
                        ]}
                    />
                </div>
            </div>

            {/* Developer Info */}
            <div className="flex justify-center items-center gap-4 mt-14">
                <p className="text-gray-600 dark:text-zinc-400">
                    Built with{" "}
                    <Heart className="inline-block w-5 h-5 fill-red-500 animate-bounce text-red-500" />{" "}
                    by
                </p>
                <Person
                    id="prasoon"
                    image="https://ik.imagekit.io/kenma/cma-cli/kenmapfp.jpeg?updatedAt=1758917892139"
                    alt="Prasoon"
                    links={{
                        github: "https://github.com/prasoonk1204",
                        twitter: "https://x.com/kenma_dev",
                        linkedin: "https://linkedin.com/in/prasoonk1204",
                    }}
                    openId={openId}
                    setOpenId={setOpenId}
                />
                <Person
                    id="prantor"
                    image="https://ik.imagekit.io/kenma/cma-cli/akashipfp.jpg?updatedAt=1758917892027"
                    alt="Prantor"
                    links={{
                        github: "https://github.com/Prantor-Das",
                        twitter: "https://x.com/akashi_sde",
                        linkedin: "https://www.linkedin.com/in/prantor-das",
                    }}
                    openId={openId}
                    setOpenId={setOpenId}
                />
            </div>
        </div>
    );
}
