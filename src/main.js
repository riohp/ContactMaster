import { createApp} from "vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
import routes from "../routes/routes";

// configure router
const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: "nav-item active",
  scrollBehavior: (to) => {
    if (to.hash) {
      return { el: to.hash };
    } else {
      return { top: 0 };
    }
  },
});

// create app
const app = createApp(App);

// use router
app.use(router);

// mount app
app.mount("#app");