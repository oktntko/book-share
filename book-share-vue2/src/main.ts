import Vue from "vue";
import App from "~/App.vue";
import "~/libs/iconify";
import "~/libs/vxe-table";
import "~/main.css";
import "~/plugins/filters";
import router from "~/plugins/router";

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
