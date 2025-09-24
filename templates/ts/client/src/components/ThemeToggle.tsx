import { Moon, Sun } from "lucide-react";
import { cn } from "../utils/cn";

interface ThemeToggleProps {
  darkMode: boolean;
  onToggle: () => void;
  className?: string;
}

export default function ThemeToggle({ darkMode, onToggle, className }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        "bg-gray-100 text-gray-900 hover:bg-gray-200",
        "dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-blue-400 dark:focus:ring-offset-slate-800",
        className
      )}
      aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
    >
      {darkMode ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
      <span className="hidden sm:inline">
        {darkMode ? "Light" : "Dark"} Mode
      </span>
    </button>
  );
}
