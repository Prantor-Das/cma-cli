import { useState } from "react";
import {
    ArrowUpRight,
    Heart,
    FileText,
    Server,
    Palette,
    Info,
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
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-zinc-100">
                        MERN Stack Starter
                    </h1>
                    <p className="text-gray-600 dark:text-zinc-400 text-lg">
                        A modern, full-stack application template
                    </p>
                </div>
                <div className="pt-0 flex flex-col items-center space-y-2">
                    <a
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-gray-900 text-white dark:bg-zinc-100 dark:text-gray-900 rounded-md text-sm font-medium hover:opacity-90 transition w-full border border-zinc-900 dark:border-zinc-100"
                    >
                        View on GitHub <ArrowUpRight className="w-4 h-4 ml-1" />
                    </a>
                    <a
                        href="https://npmjs.com/package"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex justify-center items-center px-4 py-2 bg-zinc-100 text-zinc-950 border border-zinc-950 hover:bg-zinc-200/80 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 dark:text-gray-100 dark:border-zinc-700 rounded-md text-sm font-medium transition w-full"
                    >
                        View on NPM <ArrowUpRight className="w-4 h-4 ml-1" />
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

            {/* Modern Documentation Section */}
            <div className="space-y-6">
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-zinc-100 mb-2">
                        Getting Started Guide
                    </h2>
                    <p className="text-gray-600 dark:text-zinc-400 text-lg max-w-2xl mx-auto">
                        Follow these steps to customize your MERN stack
                        application and make it your own
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    <DocumentationCard
                        icon={FileText}
                        title="Clean Up Demo Components"
                        description="Remove demonstration components to start building your application"
                        items={[
                            {
                                title: "ApiMessage Component",
                                code: "client/src/components/ApiMessage.jsx",
                                description:
                                    "Tests API connection - can be removed after setup",
                            },
                            {
                                title: "Components",
                                code: "client/src/components/ui",
                                description:
                                    "Displays project authors - customize or remove",
                            },
                            {
                                title: "Home Page",
                                code: "client/src/pages/Home.jsx",
                                description:
                                    "Replace this content with your own homepage",
                            },
                        ]}
                    />

                    <DocumentationCard
                        icon={Server}
                        title="Customize the Server"
                        description="Set up your backend with custom models, routes, and configuration"
                        items={[
                            {
                                title: "Models",
                                code: "server/src/models/user.js",
                                description:
                                    "Sample User model - modify or create new models for your data structure",
                            },
                            {
                                title: "Routes",
                                code: "server/src/routes/users.js",
                                description:
                                    "CRUD operations for User model - create new routes and update index.js",
                            },
                            {
                                title: "Environment Variables",
                                code: "server/src/config/.env.example",
                                description:
                                    "Rename to .env and configure your project settings",
                            },
                        ]}
                    />

                    <DocumentationCard
                        icon={Palette}
                        title="Customize the Client"
                        description="Personalize your frontend with custom styling, components, and pages"
                        items={[
                            {
                                title: "Environment Variables",
                                code: "client/.env.example",
                                description:
                                    "Rename to .env and configure client settings",
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
                    id="me"
                    image="/your-image.jpg"
                    alt="Your Name"
                    links={{
                        github: "https://github.com/your-handle",
                        twitter: "https://twitter.com/your-handle",
                        linkedin: "https://linkedin.com/in/your-handle",
                    }}
                    openId={openId}
                    setOpenId={setOpenId}
                />
                <Person
                    id="friend"
                    image="/friend-image.jpg"
                    alt="Friend Name"
                    links={{
                        github: "https://github.com/friend-handle",
                        twitter: "https://twitter.com/friend-handle",
                        linkedin: "https://linkedin.com/in/friend-handle",
                    }}
                    openId={openId}
                    setOpenId={setOpenId}
                />
            </div>
        </div>
    );
}
