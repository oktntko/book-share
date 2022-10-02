import vue from "@vitejs/plugin-vue2";
import * as path from "path";
import { defineConfig } from "vite";
import ViteFonts from "vite-plugin-fonts";
import Pages from "vite-plugin-pages";
import Layouts from "vite-plugin-vue-layouts";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src"),
    },
  },
  plugins: [
    vue(),
    // https://github.com/JohnCampionJr/vite-plugin-vue-layouts
    Layouts({
      layoutsDirs: "src/layouts",
    }),
    // https://github.com/hannoeru/vite-plugin-pages
    Pages({
      pagesDir: [{ dir: "src/pages", baseRoute: "" }],
      exclude: ["**/components/**.vue", "**/elements/**.vue", "src/pages/errors/**.vue"],
      extensions: ["vue"],
      syncIndex: false,
      nuxtStyle: true,
    }),
    ViteFonts({
      google: {
        families: ["Noto Sans JP", "Open Sans", "Roboto Mono"],
      },
    }),
  ],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      "/trpc": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});
