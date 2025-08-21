import React from "react";
import ThemeToggle from "./components/ThemeToggle";

export default function App() {
  return (
    <div className="flex h-screen items-center justify-center bg-white text-black dark:bg-gray-900 dark:text-white transition-colors">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-emerald-500 mb-4">
          MERN App Starter 🚀
        </h1>
        <ThemeToggle />
      </div>
    </div>
  );
}
