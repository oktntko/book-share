/// <reference types="vite/client" />
/// <reference types="vite-plugin-pages/client" />
/// <reference types="vite-plugin-vue-layouts/client" />

declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}
