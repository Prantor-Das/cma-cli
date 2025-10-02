import { Link } from "react-router-dom";
import { Home} from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="rounded-xl border shadow-sm hover:shadow-md transition-shadow bg-white border-gray-200 dark:bg-zinc-800/80 dark:border-zinc-700 dark:hover:shadow-lg w-full max-w-md text-center">
        <div className="flex flex-col space-y-1.5 p-6">
          <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-zinc-950 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-gray-900 dark:text-zinc-200">404</span>
          </div>
          <h3 className="text-2xl font-semibold leading-none tracking-tight dark:text-zinc-100">Page Not Found</h3>
          <p className="text-sm text-gray-600 dark:text-zinc-400">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>
        <div className="p-6 pt-0 space-y-4">
            <Link to="/">
              <button className="inline-flex items-center justify-center rounded-lg bg-zinc-950 text-white px-4 py-2 dark:bg-zinc-100 dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition cursor-pointer">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </button>
            </Link>
        </div>
      </div>
    </div>
  );
}