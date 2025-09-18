import { Outlet } from "react-router";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { ReactNode } from "react";

function LayoutContent() {
  const { darkMode } = useTheme();

  return (
    <div className={darkMode ? "dark" : "light"}>
      <div className="flex h-screen items-center justify-center transition-colors">
        <Outlet />
      </div>
    </div>
  );
}

export default function Layout() {
  return (
    <ThemeProvider>
      <LayoutContent />
    </ThemeProvider>
  );
}
