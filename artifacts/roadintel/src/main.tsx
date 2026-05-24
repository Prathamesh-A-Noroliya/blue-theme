import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Apply saved theme before React hydrates to prevent flash
if (typeof window !== "undefined") {
  const savedTheme = localStorage.getItem("roadintel_theme");
  if (savedTheme === "light") document.documentElement.classList.remove("dark");
  else document.documentElement.classList.add("dark");
}

createRoot(document.getElementById("root")!).render(<App />);
