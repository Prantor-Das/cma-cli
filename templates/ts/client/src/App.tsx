import { useState } from "react";
import ThemeToggle from "./components/ThemeToggle";

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  return (
    <div className={darkMode ? "dark" : "light"}>
      <div className="flex h-screen items-center justify-center transition-colors">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-emerald-500 mb-4">
            MERN App Starter 🚀
          </h1>
          <ThemeToggle
            darkMode={darkMode}
            onToggle={() => setDarkMode((d) => !d)}
          />
        </div>
      </div>
    </div>
  );
}
