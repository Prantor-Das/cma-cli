import { Outlet } from "react-router";
import { ThemeProvider, useTheme } from "./ThemeContext";
import Navigation from "./components/Navigation";
import ErrorBoundary from "./components/ErrorBoundary";

function LayoutContent() {
  const { darkMode } = useTheme();

  return (
    <div className={darkMode ? "dark" : "light"}>
      <div className="min-h-screen transition-colors">
        <Navigation />
        <main className="max-w-6xl mx-auto p-4 md:p-8">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
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
