import { Moon, Sun } from "lucide-react";

interface ThemeToggleProps {
  darkMode: boolean;
  onToggle: () => void;
}

export default function ThemeToggle({ darkMode, onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-white hover:bg-emerald-600 transition"
    >
      {darkMode ? <Sun size={18} /> : <Moon size={18} />}
      {darkMode ? "Light" : "Dark"} Mode
    </button>
  );
}
