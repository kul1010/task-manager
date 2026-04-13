import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import yaml from "@rollup/plugin-yaml";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    yaml(), // enables importing .yaml/.yml files
  ],
});