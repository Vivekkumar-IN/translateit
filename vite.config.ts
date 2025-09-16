import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Get base path from environment variable, default to "/" for all environments
  const basePath = process.env.VITE_BASE_PATH || "/";

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [react()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    // Use base path from environment variable or default to "/"
    base: basePath,
  };
});
