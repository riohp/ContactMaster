import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App.vue";
import router from "../routes/routes";

// plugin setup
Vue.use(VueRouter);


// configure router
const router = new VueRouter({
  router, // short for routes: routes
  linkActiveClass: "nav-item active",
  scrollBehavior: (to) => {
    if (to.hash) {
      return { selector: to.hash };
    } else {
      return { x: 0, y: 0 };
    }
  },
});

/* eslint-disable no-new */
new Vue({
  el: "#app",
  render: (h) => h(App),
  router,
}); 