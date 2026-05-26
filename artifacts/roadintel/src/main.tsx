import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Always use dark mode — this is a dark-first app
document.documentElement.classList.add("dark");

createRoot(document.getElementById("root")!).render(<App />);
