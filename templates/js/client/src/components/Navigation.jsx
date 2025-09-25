import { Link } from "react-router";
import ThemeToggle from "./ui/ThemeToggle";

export default function Navigation() {

    return (
        <nav className="backdrop-blur-sm border-b border-gray-200 dark:border-zinc-800 sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    <Link to="/" className="flex items-center space-x-2">
                        <h1 className="font-mono font-semibold text-xl text-gray-900 dark:text-white">
                            create-mern-app
                        </h1>
                    </Link>

                    <ThemeToggle />
                </div>
            </div>
        </nav>
    );
}
