import { useEffect, useState } from "react";

type Theme = "light" | "dark";

interface UseThemeReturn {
    theme: Theme;
    toggleTheme: () => void;
}

export const useTheme = (): UseThemeReturn => {
    const [theme, setTheme] = useState<Theme>("light");

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") as Theme | null;
        const initialTheme: Theme = savedTheme === "dark" ? "dark" : "light";

        document.documentElement.classList.add(initialTheme);
        document.documentElement.classList.remove(
            initialTheme === "dark" ? "light" : "dark",
        );
        setTheme(initialTheme);
    }, []);

    const toggleTheme = (): void => {
        const isDark = theme === "dark";
        const newTheme: Theme = isDark ? "light" : "dark";

        document.documentElement.classList.remove(theme);
        document.documentElement.classList.add(newTheme);
        localStorage.setItem("theme", newTheme);
        setTheme(newTheme);
    };

    return { theme, toggleTheme };
};
