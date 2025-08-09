import { setupLayouts } from 'virtual:generated-layouts';
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';
import { handleHotUpdate, routes } from 'vue-router/auto-routes';

const router = createRouter({
  history: import.meta.env.PROD
    ? createWebHashHistory(import.meta.env.BASE_URL) // for GitHub Pages
    : createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
});

if (import.meta.hot) {
  handleHotUpdate(router);
}

export default router;
