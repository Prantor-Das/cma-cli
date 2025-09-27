import { Outlet } from "react-router";
import Navigation from "./components/Navigation";

export default function Layout() {
    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 text-black dark:text-white">
            <Navigation />
            <main className="max-w-7xl mx-auto p-4 md:p-8">
                <Outlet />
            </main>
        </div>
    );
}
