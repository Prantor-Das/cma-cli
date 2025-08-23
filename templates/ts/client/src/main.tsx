import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom"; // ✅ should be react-router-dom
import App from "./App";
import { ThemeProvider } from "./ThemeContext";
import "./global.css";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
]);

const rootElement = document.getElementById("root");

if (rootElement) {
  ReactDOM.createRoot(rootElement as HTMLElement).render(
    <React.StrictMode>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </React.StrictMode>
  );
}
