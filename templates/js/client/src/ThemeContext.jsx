import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext({ 
  darkMode: false, 
  toggleTheme: () => {},
  setTheme: () => {}
});

function getInitialTheme() {
  if (typeof window === "undefined") return true; // Default to dark mode
  
  const stored = localStorage.getItem("theme");
  if (stored) return stored === "dark";
  
  // Default to dark mode instead of system preference
  return true;
}

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(getInitialTheme);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = (e) => {
      const stored = localStorage.getItem("theme");
      if (!stored) {
        setDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleTheme = () => {
    setDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  };

  const setTheme = (theme) => {
    const isDark = theme === "dark";
    setDarkMode(isDark);
    localStorage.setItem("theme", theme);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
