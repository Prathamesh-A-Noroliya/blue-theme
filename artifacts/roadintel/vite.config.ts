import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

const port = Number(process.env.PORT || 5173);
const basePath = process.env.BASE_PATH || "/";

export default defineConfig(async () => {
  const plugins = [react(), tailwindcss()];

  if (process.env.NODE_ENV !== "production") {
    try {
      const runtimeErrorOverlay = await import(
        "@replit/vite-plugin-runtime-error-modal"
      );
      plugins.push(runtimeErrorOverlay.default());
    } catch {
      // Replit overlay is optional. Never break Vercel/local builds.
    }

    if (process.env.REPL_ID !== undefined) {
      try {
        const cartographer = await import("@replit/vite-plugin-cartographer");
        plugins.push(
          cartographer.cartographer({
            root: path.resolve(import.meta.dirname, ".."),
          }),
        );
      } catch {
        // Optional Replit plugin.
      }

      try {
        const devBanner = await import("@replit/vite-plugin-dev-banner");
        plugins.push(devBanner.devBanner());
      } catch {
        // Optional Replit plugin.
      }
    }
  }

  return {
    base: basePath,
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "src"),
        "@assets": path.resolve(
          import.meta.dirname,
          "..",
          "..",
          "attached_assets",
        ),
      },
      dedupe: ["react", "react-dom"],
    },
    root: path.resolve(import.meta.dirname),
    build: {
      outDir: path.resolve(import.meta.dirname, "dist/public"),
      emptyOutDir: true,
    },
    server: {
      port,
      host: "0.0.0.0",
      allowedHosts: true,
      proxy: {
        "/api": {
          target: "http://localhost:8080",
          changeOrigin: true,
        },
      },
      fs: {
        strict: true,
        deny: ["**/.*"],
      },
    },
    preview: {
      port,
      host: "0.0.0.0",
      allowedHosts: true,
    },
  };
});