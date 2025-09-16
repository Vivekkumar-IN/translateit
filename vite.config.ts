import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import obfuscator from "vite-plugin-bundle-obfuscator";
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Get base path from environment variable, default to "/" for all environments
  const basePath = process.env.VITE_BASE_PATH || "/";

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      mode === "development" && componentTagger(),
      mode === "production" &&
        obfuscator({
          log: false,
          enable: true,
          autoExcludeNodeModules: true,
          threadPool: true,
          options: {
            deadCodeInjection: true,
            deadCodeInjectionThreshold: 1,
            debugProtection: true,
            debugProtectionInterval: 4000,
            disableConsoleOutput: true,
            identifierNamesGenerator: "hexadecimal",
            numbersToExpressions: true,
            splitStrings: true,
            splitStringsChunkLength: 5,
            stringArrayEncoding: ["rc4"],
            stringArrayIndexShift: true,
            stringArrayRotate: true,
            stringArrayShuffle: true,
          },
        }),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    // Use base path from environment variable or default to "/"
    base: basePath,
  };
});
