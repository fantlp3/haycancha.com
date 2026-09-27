import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  build: {
    rollupOptions: {
      output: {
        /**
         * leaflet (~150 KB) lo comparten tres chunks diferidos: el mapa de la
         * ficha, el del listado y el LocationPicker de /agregar-cancha. Sin
         * esto Rollup lo sube al ancestro comun —el chunk de entrada— y lo
         * termina pagando cualquier visitante, incluso el que nunca ve un
         * mapa. En su propio chunk se baja recien cuando alguno de los tres
         * se monta.
         *
         * react / react-dom / router / react-query van aparte porque casi no
         * cambian: sobreviven en cache del visitante entre deploys.
         */
        manualChunks: {
          leaflet: ["leaflet"],
          "vendor-react": [
            "react",
            "react-dom",
            "react-router-dom",
            "@tanstack/react-query",
          ],
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
}));
