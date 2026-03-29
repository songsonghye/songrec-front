import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,

    proxy: {
      "/api": {
        target: "http://3.34.189.161",
        changeOrigin: true,
      },
    },
  },
});
