export default function ApiRoutesPage() {
    return (
        <div>
            <header className="space-y-4 mb-12">
                <h1 className="text-4xl font-bold tracking-tight">
                    API Routes
                </h1>
                <p className="text-lg text-zinc-600 dark:text-zinc-400">
                    The server provides a set of API routes for user management.
                </p>
                <hr className="border-zinc-200 dark:border-zinc-800" />
            </header>

            <section id="user-routes" className="mb-12">
                <h2 className="text-3xl font-semibold mb-4">User Routes</h2>
                <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                    All user-related routes are prefixed with `/api/users`.
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
                                `/`
                            </td>
                            <td className="border-b border-zinc-200 dark:border-zinc-800 p-2">
                                `GET`
                            </td>
                            <td className="border-b border-zinc-200 dark:border-zinc-800 p-2">
                                Get all users.
                            </td>
                            <td className="border-b border-zinc-200 dark:border-zinc-800 p-2">
                                Admin
                            </td>
                        </tr>
                        <tr>
                            <td className="border-b border-zinc-200 dark:border-zinc-800 p-2">
                                `/:id`
                            </td>
                            <td className="border-b border-zinc-200 dark:border-zinc-800 p-2">
                                `GET`
                            </td>
                            <td className="border-b border-zinc-200 dark:border-zinc-800 p-2">
                                Get a single user by ID.
                            </td>
                            <td className="border-b border-zinc-200 dark:border-zinc-800 p-2">
                                Admin
                            </td>
                        </tr>
                        <tr>
                            <td className="border-b border-zinc-200 dark:border-zinc-800 p-2">
                                `/`
                            </td>
                            <td className="border-b border-zinc-200 dark:border-zinc-800 p-2">
                                `POST`
                            </td>
                            <td className="border-b border-zinc-200 dark:border-zinc-800 p-2">
                                Create a new user.
                            </td>
                            <td className="border-b border-zinc-200 dark:.border-zinc-800 p-2">
                                Public
                            </td>
                        </tr>
                        <tr>
                            <td className="border-b border-zinc-200 dark:border-zinc-800 p-2">
                                `/login`
                            </td>
                            <td className="border-b border-zinc-200 dark:border-zinc-800 p-2">
                                `POST`
                            </td>
                            <td className="border-b border-zinc-200 dark:border-zinc-800 p-2">
                                Authenticate a user and get a token.
                            </td>
                            <td className="border-b border-zinc-200 dark:border-zinc-800 p-2">
                                Public
                            </td>
                        </tr>
                        <tr>
                            <td className="border-b border-zinc-200 dark:border-zinc-800 p-2">
                                `/:id`
                            </td>
                            <td className="border-b border-zinc-200 dark:border-zinc-800 p-2">
                                `PUT`
                            </td>
                            <td className="border-b border-zinc-200 dark:border-zinc-800 p-2">
                                Update a user.
                            </td>
                            <td className="border-b border-zinc-200 dark:border-zinc-800 p-2">
                                Admin
                            </td>
                        </tr>
                        <tr>
                            <td className="border-b border-zinc-200 dark:border-zinc-800 p-2">
                                `/:id`
                            </td>
                            <td className="border-b border-zinc-200 dark:border-zinc-800 p-2">
                                `DELETE`
                            </td>
                            <td className="border-b border-zinc-200 dark:border-zinc-800 p-2">
                                Delete a user.
                            </td>
                            <td className="border-b border-zinc-200 dark:border-zinc-800 p-2">
                                Admin
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </div>
    );
}
