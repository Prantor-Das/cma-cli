import { useState } from "react";
import ThemeToggle from "./components/ThemeToggle";
import ApiMessage from "./components/ApiMessage";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? "dark" : "light"}>
      <div className="flex h-screen items-center justify-center transition-colors">
        <div className="">
          <h1 className="text-3xl font-bold text-emerald-500 mb-4">
            MERN App Starter 🚀
          </h1>

          <ApiMessage />

          <ThemeToggle
            darkMode={darkMode}
            onToggle={() => setDarkMode((d) => !d)}
          />
        </div>
      </div>
    </div>
  );
}
