export default function TypescriptPage() {
    return (
        <div>
            <header className="space-y-4 mb-8">
                <h1 className="text-4xl font-bold tracking-tight">
                    TypeScript Template
                </h1>
                <p className="text-lg text-zinc-600 dark:text-zinc-400">
                    The TypeScript template provides a fully type-safe
                    development experience with strict type checking and modern
                    TypeScript features.
                </p>
                <hr className="border-zinc-200 dark:border-zinc-800" />
            </header>

            <section id="client" className="mb-12">
                <h2 className="text-3xl font-semibold mb-4">
                    Client (Frontend)
                </h2>
                <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
                    <h3 className="text-2xl font-semibold mb-2">
                        React + Vite + Tailwind CSS
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                        The client is a modern React application built with Vite
                        for a fast development experience and styled with
                        Tailwind CSS.
                    </p>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold mb-2">
                                Key Files & Directories
                            </h4>
                            <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400">
                                <li>
                                    <b>`src/main.tsx`</b>: The entry point of
                                    the React application.
                                </li>
                                <li>
                                    <b>`src/App.tsx`</b>: The root component
                                    where routing is handled.
                                </li>
                                <li>
                                    <b>`src/Layout.tsx`</b>: Layout wrapper
                                    component with navigation and theme support.
                                </li>
                                <li>
                                    <b>`src/pages/`</b>: Contains the page
                                    components (Demo.tsx, NotFound.tsx).
                                </li>
                                <li>
                                    <b>`src/components/`</b>: Reusable React
                                    components including Navigation.tsx.
                                </li>
                                <li>
                                    <b>`src/components/ui/`</b>: UI components
                                    like ThemeToggle.tsx.
                                </li>
                                <li>
                                    <b>`src/hooks/`</b>: Custom React hooks
                                    (useTheme.ts).
                                </li>
                                <li>
                                    <b>`src/config/`</b>: Configuration files
                                    (constants.ts).
                                </li>
                                <li>
                                    <b>`src/global.css`</b>: Global styles and
                                    Tailwind CSS imports.
                                </li>
                                <li>
                                    <b>`src/vite-env.d.ts`</b>: Vite environment
                                    type definitions.
                                </li>
                                <li>
                                    <b>`vite.config.ts`</b>: Vite configuration
                                    file with TypeScript.
                                </li>
                                <li>
                                    <b>`tsconfig.json`</b>: Main TypeScript
                                    configuration.
                                </li>
                                <li>
                                    <b>`tsconfig.app.json`</b>: App-specific
                                    TypeScript config.
                                </li>
                                <li>
                                    <b>`tsconfig.node.json`</b>: Node.js
                                    TypeScript config.
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">
                                Available Scripts
                            </h4>
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr>
                                        <th className="border-b-2 border-zinc-200 dark:border-zinc-800 p-2">
                                            Script
                                        </th>
                                        <th className="border-b-2 border-zinc-200 dark:border-zinc-800 p-2">
                                            Description
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border-b border-zinc-200 dark:border-zinc-800 p-2">
                                            `dev`
                                        </td>
                                        <td className="border-b border-zinc-200 dark:border-zinc-800 p-2">
                                            Starts the development server.
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border-b border-zinc-200 dark:border-zinc-800 p-2">
                                            `build`
                                        </td>
                                        <td className="border-b border-zinc-200 dark:border-zinc-800 p-2">
                                            Builds the application for
                                            production.
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border-b border-zinc-200 dark:border-zinc-800 p-2">
                                            `preview`
                                        </td>
                                        <td className="border-b border-zinc-200 dark:border-zinc-800 p-2">
                                            Previews the production build.
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border-b border-zinc-200 dark:border-zinc-800 p-2">
                                            `lint`
                                        </td>
                                        <td className="border-b border-zinc-200 dark:border-zinc-800 p-2">
                                            Lints the code using ESLint.
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border-b border-zinc-200 dark:border-zinc-800 p-2">
                                            `type-check`
                                        </td>
                                        <td className="border-b border-zinc-200 dark:border-zinc-800 p-2">
                                            Checks for TypeScript errors.
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">
                                Key Dependencies
                            </h4>
                            <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400">
                                <li>
                                    <b>axios</b>: For making HTTP requests to
                                    the backend API with full TypeScript support
                                    (full-stack only).
                                </li>
                                <li>
                                    <b>lucide-react</b>: A library of simply
                                    beautiful icons with TypeScript definitions.
                                </li>
                                <li>
                                    <b>react</b>: A JavaScript library for
                                    building user interfaces with TypeScript
                                    support (v18+).
                                </li>
                                <li>
                                    <b>react-dom</b>: Serves as the entry point
                                    to the DOM with TypeScript definitions.
                                </li>
                                <li>
                                    <b>react-router-dom</b>: For handling typed
                                    routing in the React application (v6).
                                </li>
                                <li>
                                    <b>tailwindcss</b>: A utility-first CSS
                                    framework v4 with TypeScript configuration.
                                </li>
                                <li>
                                    <b>vite</b>: Fast build tool with TypeScript
                                    support and HMR.
                                </li>
                                <li>
                                    <b>vitest</b>: Fast unit testing framework
                                    with TypeScript support.
                                </li>
                                <li>
                                    <b>@types/*</b>: Type definitions for React,
                                    Node.js, and other libraries.
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">
                                Environment Variables
                            </h4>
                            <p className="text-zinc-600 dark:text-zinc-400">
                                Create a `.env` file in the `client` directory
                                and add the following variables:
                            </p>
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr>
                                        <th className="border-b-2 border-zinc-200 dark:border-zinc-800 p-2">
                                            Variable
                                        </th>
                                        <th className="border-b-2 border-zinc-200 dark:border-zinc-800 p-2">
                                            Description
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border-b border-zinc-200 dark:border-zinc-800 p-2">
                                            `VITE_APP_NAME`
                                        </td>
                                        <td className="border-b border-zinc-200 dark:border-zinc-800 p-2">
                                            The name of your application.
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border-b border-zinc-200 dark:border-zinc-800 p-2">
                                            `VITE_API_URL`
                                        </td>
                                        <td className="border-b border-zinc-200 dark:border-zinc-800 p-2">
                                            The URL of the backend API.
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            <section id="server" className="mb-12">
                <h2 className="text-3xl font-semibold mb-4">
                    Server (Backend)
                </h2>
                <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
                    <h3 className="text-2xl font-semibold mb-2">
                        Express + Mongoose
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                        The server is a robust Express.js application with
                        Mongoose for MongoDB object modeling.
                    </p>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold mb-2">
                                Key Files & Directories
                            </h4>
                            <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400">
                                <li>
                                    <b>`src/server.ts`</b>: The entry point of
                                    the Express server.
                                </li>
                                <li>
                                    <b>`src/config/connectDB.ts`</b>: MongoDB
                                    connection logic with TypeScript.
                                </li>
                                <li>
                                    <b>`src/config/validateEnv.ts`</b>:
                                    Environment variable validation with types.
                                </li>
                                <li>
                                    <b>`src/models/`</b>: Mongoose schemas with
                                    TypeScript interfaces (.gitkeep).
                                </li>
                                <li>
                                    <b>`src/routes/`</b>: API route definitions
                                    (index.ts with typed routes).
                                </li>
                                <li>
                                    <b>`src/middleware/`</b>: Custom middleware
                                    with TypeScript (errorMiddleware.ts).
                                </li>
                                <li>
                                    <b>`src/controllers/`</b>: Request handlers
                                    with TypeScript (.gitkeep for future use).
                                </li>
                                <li>
                                    <b>`src/types/`</b>: TypeScript type
                                    definitions (index.ts).
                                </li>
                                <li>
                                    <b>`src/validation/`</b>: Input validation
                                    with TypeScript (empty for now).
                                </li>
                                <li>
                                    <b>`src/__tests__/`</b>: Server tests with
                                    TypeScript and setup configuration.
                                </li>
                                <li>
                                    <b>`src/utils/`</b>: Utility functions with
                                    TypeScript (.gitkeep for future use).
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">
                                Available Scripts
                            </h4>
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr>
                                        <th className="border-b-2 border-zinc-200 dark:border-zinc-800 p-2">
                                            Script
                                        </th>
                                        <th className="border-b-2 border-zinc-200 dark:border-zinc-800 p-2">
                                            Description
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border-b border-zinc-200 dark:border-zinc-800 p-2">
                                            `dev`
                                        </td>
                                        <td className="border-b border-zinc-200 dark:border-zinc-800 p-2">
                                            Starts the server in development
                                            mode with `tsx`.
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border-b border-zinc-200 dark:border-zinc-800 p-2">
                                            `build`
                                        </td>
                                        <td className="border-b border-zinc-200 dark:border-zinc-800 p-2">
                                            Builds the application for
                                            production.
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border-b border-zinc-200 dark:border-zinc-800 p-2">
                                            `start`
                                        </td>
                                        <td className="border-b border-zinc-200 dark:border-zinc-800 p-2">
                                            Starts the server in production
                                            mode.
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border-b border-zinc-200 dark:border-zinc-800 p-2">
                                            `test`
                                        </td>
                                        <td className="border-b border-zinc-200 dark:border-zinc-800 p-2">
                                            Runs tests with `vitest`.
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border-b border-zinc-200 dark:border-zinc-800 p-2">
                                            `lint`
                                        </td>
                                        <td className="border-b border-zinc-200 dark:border-zinc-800 p-2">
                                            Lints the code using ESLint.
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border-b border-zinc-200 dark:border-zinc-800 p-2">
                                            `type-check`
                                        </td>
                                        <td className="border-b border-zinc-200 dark:border-zinc-800 p-2">
                                            Checks for TypeScript errors.
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">
                                Key Dependencies
                            </h4>
                            <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400">
                                <li>
                                    <b>compression</b>: For compressing HTTP
                                    responses with typed middleware.
                                </li>
                                <li>
                                    <b>cors</b>: For enabling Cross-Origin
                                    Resource Sharing with TypeScript
                                    configuration.
                                </li>
                                <li>
                                    <b>dotenv</b>: For loading environment
                                    variables with type safety.
                                </li>
                                <li>
                                    <b>express</b>: A fast, unopinionated,
                                    minimalist web framework with full
                                    TypeScript support.
                                </li>
                                <li>
                                    <b>express-rate-limit</b>: For rate-limiting
                                    requests with typed configuration.
                                </li>
                                <li>
                                    <b>express-validator</b>: For validating
                                    incoming request data with TypeScript types.
                                </li>
                                <li>
                                    <b>helmet</b>: For securing Express apps
                                    with typed security headers.
                                </li>
                                <li>
                                    <b>mongoose</b>: An Object Data Modeling
                                    (ODM) library with comprehensive TypeScript
                                    schemas.
                                </li>
                                <li>
                                    <b>morgan</b>: For logging HTTP requests
                                    with typed middleware.
                                </li>
                                <li>
                                    <b>tsx</b>: A TypeScript execution and
                                    scripting tool for development.
                                </li>
                                <li>
                                    <b>typescript</b>: The TypeScript compiler
                                    with strict configuration.
                                </li>
                                <li>
                                    <b>vitest</b>: Fast testing framework with
                                    full TypeScript support.
                                </li>
                                <li>
                                    <b>@types/*</b>: Comprehensive type
                                    definitions for Node.js, Express, MongoDB,
                                    and other libraries.
                                </li>
                                <li>
                                    <b>@types/bun</b>: Automatically added when
                                    using bun package manager.
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">
                                Environment Variables
                            </h4>
                            <p className="text-zinc-600 dark:text-zinc-400">
                                Create a `.env` file in the `server` directory
                                and add the following variables:
                            </p>
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr>
                                        <th className="border-b-2 border-zinc-200 dark:border-zinc-800 p-2">
                                            Variable
                                        </th>
                                        <th className="border-b-2 border-zinc-200 dark:border-zinc-800 p-2">
                                            Description
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border-b border-zinc-200 dark:border-zinc-800 p-2">
                                            `PORT`
                                        </td>
                                        <td className="border-b border-zinc-200 dark:border-zinc-800 p-2">
                                            The port the server will run on.
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border-b border-zinc-200 dark:border-zinc-800 p-2">
                                            `NODE_ENV`
                                        </td>
                                        <td className="border-b border-zinc-200 dark:border-zinc-800 p-2">
                                            The environment (`development` or
                                            `production`).
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border-b border-zinc-200 dark:border-zinc-800 p-2">
                                            `MONGODB_URI`
                                        </td>
                                        <td className="border-b border-zinc-200 dark:border-zinc-800 p-2">
                                            The connection string for your
                                            MongoDB database.
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border-b border-zinc-200 dark:border-zinc-800 p-2">
                                            `CORS_ORIGIN`
                                        </td>
                                        <td className="border-b border-zinc-200 dark:border-zinc-800 p-2">
                                            The URL of the client application.
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
