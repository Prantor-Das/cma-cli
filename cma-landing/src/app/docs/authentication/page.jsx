export default function AuthenticationPage() {
    return (
        <div>
            <header className="space-y-4 mb-12">
                <h1 className="text-4xl font-bold tracking-tight">
                    Authentication
                </h1>
                <p className="text-lg text-zinc-600 dark:text-zinc-400">
                    The templates come with a complete authentication system out
                    of the box.
                </p>
                <hr className="border-zinc-200 dark:border-zinc-800" />
            </header>

            <section id="authentication-flow" className="mb-12">
                <h2 className="text-3xl font-semibold mb-4">
                    Authentication Flow
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                    The authentication is based on JSON Web Tokens (JWT). Here's
                    how it works:
                </p>
                <ol className="list-decimal list-inside text-zinc-600 dark:text-zinc-400 space-y-2">
                    <li>A user signs up or logs in with their credentials.</li>
                    <li>
                        The server validates the credentials and, if successful,
                        generates a JWT.
                    </li>
                    <li>
                        The JWT is sent back to the client and stored securely.
                    </li>
                    <li>
                        For subsequent requests to protected routes, the client
                        sends the JWT in the `Authorization` header.
                    </li>
                    <li>
                        The server verifies the JWT and grants access to the
                        protected resources.
                    </li>
                </ol>
            </section>

            <section id="user-model" className="mb-12">
                <h2 className="text-3xl font-semibold mb-4">User Model</h2>
                <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                    The `User` model has the following fields:
                </p>
                <ul className="list-disc list-inside text-zinc-600 dark:text-zinc-400">
                    <li>
                        <b>name</b>: The user's name (String, required).
                    </li>
                    <li>
                        <b>email</b>: The user's email (String, required,
                        unique).
                    </li>
                    <li>
                        <b>password</b>: The user's hashed password (String,
                        required).
                    </li>
                    <li>
                        <b>isAdmin</b>: A boolean indicating if the user is an
                        administrator (Boolean, default: false).
                    </li>
                </ul>
            </section>

            <section id="protected-routes" className="mb-12">
                <h2 className="text-3xl font-semibold mb-4">
                    Protected Routes
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                    The templates include middleware to protect routes. The
                    `protect` middleware checks for a valid JWT, while the
                    `admin` middleware checks if the user is an administrator.
                </p>
                <p className="text-zinc-600 dark:text-zinc-400">
                    You can apply these middlewares to your routes to restrict
                    access to authenticated users or administrators only.
                </p>
            </section>
        </div>
    );
}
