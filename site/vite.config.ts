import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readFileSync } from "node:fs";
const exports = [
  "css/tines.css",
  "css/tines-foundation.css",
  "dist/tines-palette.json",
  "dist/tines-foundation.json",
];
export default defineConfig({
  plugins: [
    react(),
    {
      name: "canonical-downloads",
      generateBundle() {
        for (const path of exports)
          this.emitFile({
            type: "asset",
            fileName: `downloads/${path.split("/").pop()}`,
            source: readFileSync(new URL(`../${path}`, import.meta.url)),
          });
      },
      configureServer(server) {
        server.middlewares.use("/downloads/", (req, res, next) => {
          const path = exports.find(
            (p) => p.split("/").pop() === req.url?.split("?")[0].replace(/^\//, ""),
          );
          if (!path) return next();
          res.setHeader(
            "Content-Type",
            path.endsWith(".css") ? "text/css" : "application/json",
          );
          res.end(readFileSync(new URL(`../${path}`, import.meta.url)));
        });
      },
    },
  ],
  build: { outDir: "dist", emptyOutDir: true },
  server: { fs: { allow: [".."] } },
});
