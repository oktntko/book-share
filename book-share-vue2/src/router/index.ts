import { setupLayouts } from "virtual:generated-layouts";
import generatedRoutes from "virtual:generated-pages";
import Vue from "vue";
import VueRouter from "vue-router";
import NotFoundPage from "~/pages/errors/404.vue";

Vue.use(VueRouter);

const routes = setupLayouts(generatedRoutes);
routes.push({
  path: "*",
  name: "NotFoundPage",
  component: NotFoundPage,
});

const router = new VueRouter({
  mode: "history",
  base: import.meta.env.BASE_URL,
  routes,
  scrollBehavior: () => ({ x: 0, y: 0 }),
});

export default router;
