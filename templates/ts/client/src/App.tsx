import ThemeToggle from "./components/ThemeToggle";
import ApiMessage from "./components/ApiMessage";
import { useTheme } from "./context/ThemeContext";

export default function App() {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <div>
      <h1 className="text-3xl font-bold text-emerald-500 mb-4">
        MERN App Starter 🚀
      </h1>

      <ApiMessage />

      <ThemeToggle
        darkMode={darkMode}
        onToggle={toggleTheme}
      />
    </div>
  );
}
