import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: "src/widget/index.tsx",
      name: "InsuranceForm",
      formats: ["iife"],
      fileName: () => "insurance-form.js",
    },
    outDir: "dist-widget",
    copyPublicDir: false,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        assetFileNames: "insurance-form.[ext]",
      },
    },
  },
});
