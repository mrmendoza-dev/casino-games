import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler", // or "modern"
        silenceDeprecations: ["legacy-js-api"],
      },
    },
  },
  server: {
    host: true,
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/assets": path.resolve(__dirname, "src/assets"),
      "@/components": path.resolve(__dirname, "src/components"),
      "@/contexts": path.resolve(__dirname, "src/contexts"),
      "@/data": path.resolve(__dirname, "src/data"),
      "@/hooks": path.resolve(__dirname, "src/hooks"),
      "@/lib": path.resolve(__dirname, "src/lib"),
      "@/pages": path.resolve(__dirname, "src/pages"),
      "@/services": path.resolve(__dirname, "src/services"),
      "@/styles": path.resolve(__dirname, "src/styles"),
      "@/utils": path.resolve(__dirname, "src/utils"),
    },
  },
});
