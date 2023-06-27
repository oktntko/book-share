import { setupLayouts } from "virtual:generated-layouts";
import generatedRoutes from "virtual:generated-pages";
import { createRouter, createWebHistory } from "vue-router";
import NotFound from "~/components/error-pages/404.vue";

const routes = setupLayouts(generatedRoutes);
routes.push({
  path: "/:pathMatch(.*)*",
  name: "not-found",
  component: NotFound,
});

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return {
      top: 0,
      left: 0,
    };
  },
});

export default router;
