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
         * OJO: leaflet NO va acá. Forzarlo a un chunk nombrado hace que el
         * entry lo importe ESTATICAMENTE (Rollup iza la referencia), y Vite le
         * pone un <link rel="modulepreload"> en el HTML — o sea que los 150 KB
         * se bajan en toda pagina y el split no sirve para nada. Pasó, se vio
         * mirando el HTML de produccion. Sin esta entrada, Rollup lo deja como
         * chunk compartido de los tres imports dinamicos (mapa de ficha, mapa
         * de listado, LocationPicker) y se baja solo cuando alguno se monta.
         *
         * react / react-dom / router / react-query si van aparte: son
         * estaticos de verdad y casi no cambian, asi que sobreviven en cache
         * del visitante entre deploys.
         */
        manualChunks: {
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
